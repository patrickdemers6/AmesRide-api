import { Server } from "socket.io";
import {
  connectedUserCountGuage,
  log,
  websocketOpenedConnectionCount,
} from "./monitoring";

const setupWebsockets = (providers, io: Server) => {
  log.debug("setting up websockets");

  // when websockets are first created, there are no users connected
  // metric of connected user count must be updated to reflect this
  connectedUserCountGuage.set(0);

  io.on("connection", (socket) => {
    log.debug({
      component: "websocket",
      type: "connect",
      sessionId: socket.id,
    });

    // update metrics to indicate one new connection
    connectedUserCountGuage.inc(1);
    websocketOpenedConnectionCount.inc(1);

    // each provider defines a websocket manager ready to serve data
    // and the subscribe/unsubscribe events used
    providers.forEach((provider) => {
      // when a user subscribes to data, send the socket details and desired data key to the manager
      // so the manager can begin serving data
      socket.on(provider.options.subscribePath, (key: unknown) => {
        provider.manager.addSubscriber(socket, key);

        log.debug({
          component: "websocket",
          type: provider.options.subscribePath,
          key,
          sessionId: socket.id,
        });
      });

      // when a user unsubscribes to data, send the socket details to the manager
      // so that the manager can stop serving data
      socket.on(provider.options.unsubscribePath, () => {
        const userUnsubscribed = provider.manager.removeSubscriber(socket);

        if (userUnsubscribed) {
          log.debug({
            component: "websocket",
            type: provider.unsubscribePath,
            sessionId: socket.id,
          });
        }
      });

      // when the user disconnects, data should no longer be sent to them
      socket.on("disconnect", () => provider.manager.removeSubscriber(socket));
    });

    // updated metrics and log the end of the user's session
    socket.on("disconnect", () => {
      connectedUserCountGuage.dec(1);

      const timeEnd = Date.now();
      const timeStart = new Date(socket.handshake.time).getTime();
      const sessionDurationSeconds = Math.floor((timeEnd - timeStart) / 1000);

      log.debug({
        component: "websocket",
        type: "disconnect",
        sessionId: socket.id,
        sessionDurationSeconds,
      });
    });
  });
};

export default setupWebsockets;
