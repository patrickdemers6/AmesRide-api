import { createLogger, transports, format, Logger } from "winston";
import LokiTransport from "winston-loki";
import { IS_PROD, IS_TEST, LOKI_LOGS_AUTH, LOKI_LOGS_HOST } from "../config";

let logger: Logger;

const initializeLogger = () => {
  if (logger) {
    return;
  }

  logger = createLogger({
    transports: IS_TEST
      ? []
      : [
          new LokiTransport({
            host: LOKI_LOGS_HOST,
            labels: { app: "amesride-api", env: IS_PROD ? "prod" : "dev" },
            json: true,
            format: format.json(),
            replaceTimestamp: true,
            onConnectionError: (err) => console.error(err),
            timeout: 5000,
            basicAuth: LOKI_LOGS_AUTH,
            level: "debug",
          }),
          new transports.Console({
            format: format.combine(format.simple(), format.colorize()),
          }),
        ],
    exitOnError: true,
    silent: IS_TEST,
  });
};

export const getLogger = () => {
  initializeLogger();
  return logger;
};
