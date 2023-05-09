import { Counter, Gauge } from "prom-client";
import http from "http";
import express from "express";
import { getLogger } from "./monitoring/logs";

import { collectDefaultMetrics, register } from "prom-client";

collectDefaultMetrics();

export const connectedUserCountGuage = new Gauge({
  name: "amesride_connections_total",
  help: "Ames Ride total connections gauge",
});

export const subscribedUserCountGuage = new Gauge({
  name: "amesride_subscriptions_total",
  labelNames: ["type"],
  help: "Ames Ride total subscribers by subscription type",
});

export const websocketOpenedConnectionCount = new Counter({
  name: "amesride_socket_connections_count",
  help: "Ames Ride socket connections opened",
});

export const managerSubscribeCount = new Counter({
  name: "amesride_subscribe_msg_count",
  labelNames: ["type", "key"],
  help: "Ames Ride total messages received subscribing to message type",
});

const setupMonitoring = () => {
  const app = express();
  const server = http.createServer(app);

  app.get("/metrics", async (_req, res) => {
    try {
      res.set("Content-Type", register.contentType);
      res.end(await register.metrics());
    } catch (err) {
      res.status(500).end(err);
    }
  });

  server.listen(9092);
};

export const log = getLogger();

export default setupMonitoring;
