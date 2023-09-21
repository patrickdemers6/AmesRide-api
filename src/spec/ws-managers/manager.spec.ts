import MockedSocket from "socket.io-mock";
import Manager, { EmittedData } from "../../ws-managers/manager";
import Time from "../../providers/time";
import sinon from "sinon";
import { expect } from "chai";
import MockProvider from "../mocks/provider";

describe("websocket connection manager", () => {
  let stopId: string;
  let stopData: StopArrival[];
  let emittedData: [ArrivalsByStopID, boolean];
  let socket: MockedSocket;
  let provider: RealtimeProvider<unknown>;
  let manager: Manager<unknown>;
  beforeEach(() => {
    stopId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString();
    stopData = [{ arrival_time: Time.fromDate(new Date()), trip_id: "1" }];
    emittedData = [{ [stopId]: stopData }, false];

    socket = new MockedSocket();
    provider = new MockProvider();
    manager = new Manager("event-name", provider);
  });

  afterEach(() => {
    sinon.restore();
    sinon.reset();
  });

  describe("connection management", () => {
    it("adds and removes subscribers", () => {
      manager.addSubscriber(socket, stopId);
      expect(manager.subscriberCount()).to.equal(1);

      manager.removeSubscriber(socket);
      expect(manager.subscriberCount()).to.equal(0);
    });

    it("doesn't add same websocket twice", () => {
      manager.addSubscriber(socket, stopId);
      expect(manager.subscriberCount()).to.equal(1);

      manager.addSubscriber(socket, stopId);
      expect(manager.subscriberCount()).to.equal(1);
    });

    it("handles disconnect of non-subscribed socket", () => {
      manager.removeSubscriber(socket);
      expect(manager.subscriberCount()).to.equal(0);
    });
  });

  describe("data emitting", () => {
    context("provider hasn't emitted data", () => {
      it("emits on publish", (done) => {
        socket.on("event-name", (data: EmittedData<ArrivalsByStopID>) => {
          try {
            expect(data.data).to.deep.equal(emittedData[0][stopId]);
            expect(data.k).to.equal(stopId);
            done();
          } catch (e) {
            done(e);
          }
        });

        manager.addSubscriber(socket.socketClient, stopId);
        provider.emit("data", emittedData);
      });
    });

    context("provider already emitted data", () => {
      beforeEach((done) => {
        provider.emit("data", emittedData);
        setTimeout(done, 100);
      });

      it("emits data on connect", (done) => {
        socket.on("event-name", (data: EmittedData<ArrivalsByStopID>) => {
          try {
            expect(data.data).to.deep.equal(emittedData[0][stopId]);
            expect(data.k).to.equal(stopId);
            done();
          } catch (e) {
            done(e);
          }
        });

        manager.addSubscriber(socket.socketClient, stopId);
      });
    });
  });
});
