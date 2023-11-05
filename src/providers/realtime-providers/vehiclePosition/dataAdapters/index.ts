import { ArchiveManager } from "../../../../archivers";
import { indexObjectArray } from "../../../../utils/indexObjectArray";
import StaticGTFS from "../../../static-providers/gtfs";
import type { DataAdapter } from "../../dataAdapter";
import { Vehicle } from "../vehicle";
import GTFSVehiclePositionDataAdapter from "./gtfs";

export type VehicleDataAdapter = DataAdapter<Vehicle>;

export enum OverwriteMode {
  /**
   * Always overwrite, even if provided data is already valid.
   */
  ALWAYS,
  /**
   * Only ovewrite when the returned value is falsy.
   */
  ON_MISSING,
  /**
   * ALways use the data returned.
   */
  NEVER,
}

export interface VehicleDataAdapterOptions {
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
  /**
   * When should the route provided by api be overridden using tripToRoute data?
   * Default: `ON_MISSING`.
   */
  tripToRouteOverrideMode?: OverwriteMode;

  frequency: number;

  staticData: StaticGTFS;
}

/**
 * Creates and returns a new Vehicle Position adapter of the specified type.
 * @param type the type of adapter to create
 * @param options configuration informaiton for the newly created adapter
 * @returns adapter of type `type` setup using `options`.
 */
export const getVehiclePositionDataAdapter = (
  type: VehiclePositionAdapterType,
  options?: VehicleDataAdapterOptions
): VehicleDataAdapter => {
  const tripToRoute = {};
  const trips = indexObjectArray(options.staticData.trips, "trip_id");
  Object.keys(trips).forEach((trip) => {
    tripToRoute[trip] = trips[trip].route_id;
  });

  options.tripToRoute = tripToRoute;

  switch (type) {
    case "gtfs":
      return new GTFSVehiclePositionDataAdapter(options);
    default:
      throw new TypeError(`Unknown vehicle position adapter: ${type}`);
  }
};

export type VehiclePositionAdapterType = "gtfs";
