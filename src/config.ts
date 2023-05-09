import fs from "fs";
import dotenv from "dotenv";
import { initialize, Unleash } from "unleash-client";

const NODE_ENV = process.env.NODE_ENV ?? "development";

const getSecret = (secretName: string) => {
  if (IS_TEST) return;
  return fs.readFileSync(`/run/secrets/${secretName}`, "utf8").trim();
};

// in development load a local config file
if (NODE_ENV === "development") {
  dotenv.config();
} else if (NODE_ENV !== "test") {
  // otherwise load it from docker config
  const envFileContent = fs.readFileSync("/amesride-api-config", "utf8");
  process.env = {
    ...process.env,
    ...dotenv.parse(envFileContent),
  };
}

export const IS_PROD = process.env.NODE_ENV === "production";
export const IS_TEST = process.env.NODE_ENV === "test";

/**
 * GTFS URLs to fetch data from.
 */
export const VEHICLE_POSITIONS_URL = process.env.VEHICLE_POSITIONS_URL;
export const TRIP_UPDATES_URL = process.env.TRIP_UPDATES_URL;

/**
 * Directories to archive trip updates and vehicle location buffers to.
 */
export const TRIP_UPDATES_ARCHIVE = process.env.TRIP_UPDATES_ARCHIVE;
export const VEHICLE_POSITIONS_ARCHIVE = process.env.VEHICLE_POSITIONS_ARCHIVE;

/**
 * Loki sends logs to Grafana.
 */
export const LOKI_LOGS_AUTH =
  process.env.LOKI_LOGS_AUTH ?? getSecret("LOKI_LOGS_AUTH");
export const LOKI_LOGS_HOST = process.env.LOKI_LOGS_HOST;

/**
 * Unleash provides realtime dynamic configuration.
 */
let unleash: Unleash;
if (process.env.UNLEASH_URL) {
  unleash = initialize({
    url: process.env.UNLEASH_URL,
    appName: process.env.UNLEASH_APP_NAME,
    customHeaders: {
      Authorization:
        process.env.UNLEASH_API_TOKEN ?? getSecret("UNLEASH_API_TOKEN"),
    },
  });
}

export const isStoreTripUpdateEnabled = (defaultValue = false) =>
  unleash
    ? unleash.isEnabled("StoreTripUpdateBuffers", undefined, () => defaultValue)
    : defaultValue;

export const isStoreVehiclePositionEnabled = (defaultValue = false) =>
  unleash
    ? unleash.isEnabled(
        "StoreVehiclePositionBuffers",
        undefined,
        () => defaultValue
      )
    : defaultValue;

export const isIgnoreEmptyBufferEnabled = (defaultValue = true) =>
  unleash
    ? unleash.isEnabled("IgnoreEmptyBuffer", undefined, () => defaultValue)
    : defaultValue;
