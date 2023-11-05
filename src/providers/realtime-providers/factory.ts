import getArchiveManager from "../../archivers";
import StaticGTFS from "../static-providers/gtfs";
import ArrivalsProvider from "./arrivals";
import VehiclePositionProvider from "./vehiclePosition";

export type ProviderTypes = "vehicle-position" | "arrivals";

const getRealtimeFactory = (
  providerDetails,
  staticGtfs: StaticGTFS
): RealtimeProvider<unknown> => {
  providerDetails.options.staticData = staticGtfs;
  if (providerDetails.archive) {
    const { provider, options } = providerDetails.archive;
    providerDetails.options.archiveManager = getArchiveManager(
      provider,
      options
    );
  }
  switch (providerDetails.type) {
    case "arrivals":
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
