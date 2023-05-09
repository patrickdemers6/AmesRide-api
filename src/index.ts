import express from "express";
import http from "http";
import { Server } from "socket.io";
import StaticGTFS from "./gtfs/static";
import Manager from "./ws-managers/manager";
import setupWebsockets from "./websockets";
import setupMonitoring, { log } from "./monitoring";
import config from "./config_new";
import getRealtimeFactory from "./gtfs/factory";

const app = express();
const httpsServer = http.createServer(app);

setupMonitoring();

export const staticGtfs = new StaticGTFS();

StaticGTFS.updateGTFS().then(() => {
  const io = new Server(httpsServer);

  const providers = [];
  config.providers.forEach((provider) => {
    const realtimeProvider = getRealtimeFactory(provider);
    const manager = new Manager<unknown>(
      provider.emitName,
      realtimeProvider,
      provider.loggingEventName
    );

    providers.push({
      manager,
      options: provider,
    });
  });

  setupWebsockets(providers, io);
  httpsServer.listen(3000);
  log.info({ component: "startup", message: "listening on port 3000" });
});

app.get("/data", (req, res) => {
  if (req.query?.hash === StaticGTFS.hash) {
    res.sendStatus(204);
    return;
  }
  res.send(StaticGTFS.publicData);
});

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

setInterval(StaticGTFS.updateGTFS, TWENTY_FOUR_HOURS);
