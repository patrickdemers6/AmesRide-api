import GtfsRealtimeBindings from "gtfs-realtime-bindings";

import {
  OverwriteMode,
  VehicleDataAdapter,
  VehicleDataAdapterOptions,
} from "..";
import { log } from "../../../../../monitoring";
import { Vehicle } from "../../vehicle";
import EventEmitter from "events";
import Interval from "../../../../interval";

const component = "gtfs/vehiclePosition/gtfs";

class GTFSVehiclePositionDataAdapter
  extends EventEmitter
  implements VehicleDataAdapter
{
  /**
   * It is suggested to ignore data when suspicious data is returned from GTFS feed.
   * This happens when an empty buffer is returned by the network.
   */
  #isIgnoreSuggested: boolean;

  /**
   * Externally provided configuration options to control behavior.
   */
  #options: VehicleDataAdapterOptions;

  constructor(options: VehicleDataAdapterOptions) {
    super();

    // data should always be ignored before first time data is fetched
    this.#isIgnoreSuggested = true;

    const defaultOptions: Partial<VehicleDataAdapterOptions> = {
      tripToRouteOverrideMode: OverwriteMode.ON_MISSING,
      tripToRoute: {},
    };
    this.#options = { ...defaultOptions, ...options };

    new Interval(options.frequency, this.get.bind(this)).start();
  }

  /**
   * Fetch vehicle location data from a GTFS endpoint.
   * @returns an array of Vehicles
   */
  async get() {
    log.info({
      component,
      message: "getting data from GTFS vehicle position adapter",
    });

    const gtfsVehiclePositions = await this.#getVehiclePositions();

    const gtfsConvertedToVehicles =
      this.#convertToVehicles(gtfsVehiclePositions);

    this.emit("data", [gtfsConvertedToVehicles, this.#isIgnoreSuggested]);
  }

  /**
   * Get vehicle positions from the GTFS feed and decode them.
   */
  async #getVehiclePositions(): Promise<GtfsRealtimeBindings.transit_realtime.FeedMessage> {
    const vehiclePositionResponse = await fetch(this.#options.url, {
      cache: "no-cache",
      ...(this.#options.fetchOptions ?? {}),
    });

    const vehiclePositionBuffer = await vehiclePositionResponse.arrayBuffer();

    log.debug({
      component,
      message: "received vehicle locations buffer",
      size: vehiclePositionBuffer.byteLength,
    });

    if (this.#options.archiveManager) {
      this.#archiveData(vehiclePositionBuffer);
    }

    this.#isIgnoreSuggested = vehiclePositionBuffer.byteLength === 15;

    return GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      new Uint8Array(vehiclePositionBuffer)
    );
  }

  /**
   * Take the provided GTFS data and extract necessary attributes to create an array of Vehicles.
   * This converts the data to standardized data-source-independent logic needed for core application logic.
   */
  #convertToVehicles(
    gtfsData: GtfsRealtimeBindings.transit_realtime.FeedMessage
  ): Vehicle[] {
    const vehicles: Vehicle[] = [];
    gtfsData.entity.forEach((vehicleUpdate) => {
      if (!this.#isValidVehicle(vehicleUpdate)) return;

      const { tripId, routeId } = vehicleUpdate.vehicle.trip;

      const route: string = this.#getRoute(tripId, routeId);
      vehicles.push({
        trip: tripId,
        route,
        id: vehicleUpdate.vehicle.vehicle.id,
        position: {
          latitude: vehicleUpdate.vehicle.position.latitude,
          longitude: vehicleUpdate.vehicle.position.longitude,
          bearing: vehicleUpdate.vehicle.position.bearing,
          speed: vehicleUpdate.vehicle.position.speed,
        },
      });
    });
    return vehicles;
  }

  /**
   * Does the included vehicle have all attributes necessary for a valid vehicle?
   */
  #isValidVehicle(vehicle: GtfsRealtimeBindings.transit_realtime.IFeedEntity) {
    return (
      vehicle.vehicle.position?.latitude &&
      vehicle.vehicle.position?.longitude &&
      vehicle.vehicle.vehicle.id
    );
  }

  /**
   * Get the route of provided trip using the strategy specified in class options.
   */
  #getRoute(trip: string | undefined, route: string | undefined) {
    const { tripToRouteOverrideMode: overwiteMode, tripToRoute } =
      this.#options;

    if (overwiteMode === OverwriteMode.NEVER) {
      return route;
    } else if (overwiteMode === OverwriteMode.ALWAYS) {
      return tripToRoute[trip];
    } else if (overwiteMode === OverwriteMode.ON_MISSING) {
      return route || tripToRoute[trip];
    }
  }

  isIgnoreSuggested() {
    return this.#isIgnoreSuggested;
  }

  #archiveData(data: ArrayBuffer) {
    this.#options.archiveManager.archive(data, "vehicle position");
  }
}

export default GTFSVehiclePositionDataAdapter;
