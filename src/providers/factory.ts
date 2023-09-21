import { staticGtfs } from "..";
import ArrivalsProvider from "./realtime-providers/arrivals";
import VehiclePositionProvider from "./realtime-providers/vehiclePosition";

export type ProviderTypes = "vehicle-position" | "arrivals";

const getRealtimeFactory = (providerDetails): RealtimeProvider<unknown> => {
  switch (providerDetails.type) {
    case "arrivals":
      providerDetails.options.staticData = staticGtfs;
      return new ArrivalsProvider(
        providerDetails.source,
        providerDetails.options
      );
    case "vehicle-position":
      return new VehiclePositionProvider(
        providerDetails.source,
        providerDetails.options
      );
    default:
      throw new TypeError(
        `Unknown realtime provider type: ${providerDetails.type}`
      );
  }
};

export default getRealtimeFactory;
