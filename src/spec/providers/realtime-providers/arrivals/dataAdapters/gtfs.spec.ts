import { describe } from "mocha";
import getUpcomingArrivalDataAdapter, {
  RealtimeDataAdapter,
} from "../../../../../providers/realtime-providers/arrivals/dataAdapters/realtimeDataAdapter";
import sinon from "sinon";
import fs from "fs";
import { expect } from "chai";

const FETCH_FREQUENCY = 1;
const FETCH_URL = "https://example.com";

const SUCCESSFUL_FILE_BUFFER = fs.readFileSync(
  `${__dirname}/sampleData/valid-arrivals`
).buffer;

const simpleProvider = () =>
  getUpcomingArrivalDataAdapter("gtfs", {
    url: FETCH_URL,
    frequency: FETCH_FREQUENCY,
  });

const stubSuccessfulFetch = () => {
  return sinon.stub(global, "fetch").callsFake(() => {
    return Promise.resolve(new Response(SUCCESSFUL_FILE_BUFFER));
  });
};

describe("gtfs arrivals provider", () => {
  let provider: RealtimeDataAdapter;
  let clock: sinon.SinonFakeTimers;
  beforeEach(() => {
    clock = sinon.useFakeTimers({
      toFake: ["setInterval"],
    });
  });

  afterEach(() => {
    if (provider) provider.shutdown();
  });

  describe("interval", () => {
    it("get data based on specified frequency", async () => {
      stubSuccessfulFetch();
      provider = simpleProvider();

      const onData = sinon.spy();
      provider.on("data", onData);

      clock.tick(1000);
      clock.tick(1000);
      await new Promise((resolve) => setImmediate(resolve));
      expect(onData.callCount).to.equal(3);
    });

    it("stops getting data after shutdown", async () => {
      stubSuccessfulFetch();
      provider = simpleProvider();

      const onData = sinon.spy();
      provider.on("data", onData);

      clock.tick(1000);
      clock.tick(1000);
      await new Promise((resolve) => setImmediate(resolve));
      expect(onData.callCount).to.equal(3);

      provider.shutdown();
      await new Promise((resolve) => setImmediate(resolve));
      expect(onData.callCount).to.equal(3);
    });

    it("gets data immediately on creation", async () => {
      stubSuccessfulFetch();
      provider = simpleProvider();

      const onData = sinon.spy();
      provider.on("data", onData);

      await new Promise((resolve) => setImmediate(resolve));
      expect(onData.callCount).to.equal(1);
    });
  });

  it("emits proper data", async () => {
    stubSuccessfulFetch();
    provider = simpleProvider();

    const onData = sinon.spy();
    provider.on("data", onData);

    await new Promise((resolve) => setImmediate(resolve));
    const emittedData = onData.firstCall.args[0];

    expect(emittedData.length).to.equal(407);
    expect(emittedData[0]).to.deep.equal({
      arrival: { hours: 22, minutes: 48 },
      departure: { hours: 22, minutes: 48 },
      trip: "6729",
      route: "",
      stopSequence: 0,
      stop: "5102268",
    });
  });

  it("archives data", async () => {
    stubSuccessfulFetch();
    const archiveManager = {
      archive: sinon.stub(),
    };
    provider = getUpcomingArrivalDataAdapter("gtfs", {
      url: FETCH_URL,
      frequency: FETCH_FREQUENCY,
      archiveManager,
    });

    await new Promise((resolve) => setImmediate(resolve));
    expect(archiveManager.archive.callCount).to.equal(1);
    expect(
      new Uint8Array(archiveManager.archive.firstCall.args[0])
    ).to.deep.equal(new Uint8Array(SUCCESSFUL_FILE_BUFFER));
    expect(archiveManager.archive.firstCall.args[1]).to.deep.equal(
      "trip updates"
    );
  });

  describe("data fetching", () => {
    it("fetches data from specified url", () => {
      const stub = sinon.stub(global, "fetch");
      provider = simpleProvider();
      expect(stub.firstCall.args[0]).to.equal(FETCH_URL);
    });

    it("uses custom fetch options", () => {
      const stub = sinon.stub(global, "fetch");

      const fetchOptions = {
        headers: {
          Authorization: "Bearer xyz",
        },
      };
      provider = getUpcomingArrivalDataAdapter("gtfs", {
        url: FETCH_URL,
        frequency: FETCH_FREQUENCY,
        fetchOptions,
      });
      expect(stub.firstCall.args[1]).to.deep.equal({
        cache: "no-cache",
        ...fetchOptions,
      });
    });
  });
});
