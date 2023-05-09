import { ArchiveManager } from "../../../../archivers";
import StaticGTFS from "../../../static";
import type { DataAdapter } from "../../dataAdapter";
import { RealtimeUpdate } from "../realtimeUpdate";
import GTFSRealtimeDataAdapter from "./gtfs";

export type RealtimeDataAdapter = DataAdapter<RealtimeUpdate>;

export interface RealtimeDataAdapterOptions {
  /**
   * The url to use when making a web request.
   */
  url: string;
  /**
   * If set, the adapter will use this path to archive obtained data.
   */
  archiveManager?: ArchiveManager;
  /**
   * Custom options to use when making any web requests, such as authorization tokens.
   */
  fetchOptions?: object;
  /**
   * A mapping from trip ID to route ID. Used depending on the OverwriteMode specified.
   * Default: {}
   */
  tripToRoute?: { [key: string]: string };
  // /**
  //  * When should the route provided by api be overridden using tripToRoute data?
  //  * Default: `ON_MISSING`.
  //  */
  // tripToRouteOverrideMode?: OverwriteMode;

  frequency: number;

  staticData: StaticGTFS;
}

export type UpcomingArrivalAdapterType = "gtfs";

/**
 * Creates and returns a new Vehicle Position adapter of the specified type.
 * @param type the type of adapter to create
 * @param options configuration informaiton for the newly created adapter
 * @returns adapter of type `type` setup using `options`.
 */
const getUpcomingArrivalDataAdapter = (
  type: UpcomingArrivalAdapterType,
  options?: RealtimeDataAdapterOptions
): RealtimeDataAdapter => {
  switch (type) {
    case "gtfs":
      return new GTFSRealtimeDataAdapter(options);
    default:
      throw new TypeError(`Unknown vehicle position adapter: ${type}`);
  }
};

export default getUpcomingArrivalDataAdapter;
