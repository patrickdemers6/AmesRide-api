import { expect } from "chai";
import getRealtimeFactory from "../../providers/realtime-providers/factory";
import ArrivalsProvider from "../../providers/realtime-providers/arrivals";
import VehiclePositionProvider from "../../providers/realtime-providers/vehiclePosition";
import StaticGTFS from "../../providers/static-providers/gtfs";

const staticGtfs = new StaticGTFS({ url: "" });

describe("getRealtimeFactory", () => {
  let result: RealtimeProvider<unknown>;
  afterEach(() => {
    if (result) result.shutdown();
  });

  it('should return an ArrivalsProvider instance for "arrivals" type', () => {
    const providerDetails = {
      type: "arrivals",
      source: "gtfs",
      options: {},
    };

    result = getRealtimeFactory(providerDetails, staticGtfs);
    expect(result).to.be.an.instanceOf(ArrivalsProvider);
  });

  it('should return a VehiclePositionProvider instance for "vehicle-position" type', () => {
    const providerDetails = {
      type: "vehicle-position",
      source: "gtfs",
      options: {},
    };

    result = getRealtimeFactory(providerDetails, staticGtfs);
    expect(result).to.be.an.instanceOf(VehiclePositionProvider);
  });

  it("should throw a TypeError for unknown provider type", () => {
    const providerDetails = {
      type: "unknown-type",
      source: "some-source",
      options: {},
    };

    const factoryFunction = () =>
      getRealtimeFactory(providerDetails, staticGtfs);

    expect(factoryFunction).to.throw(
      TypeError,
      "Unknown realtime provider type: unknown-type"
    );
  });
});
