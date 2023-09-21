import EventEmitter from "events";
import { log } from "../../../monitoring";
import {
  getVehiclePositionDataAdapter,
  VehicleDataAdapter,
  VehicleDataAdapterOptions,
  VehiclePositionAdapterType,
} from "./dataAdapters";
import groupVehicles from "./groupVehicles";
import { RouteToVehiclePosition, Vehicle } from "./vehicle";

const component = "providers/realtime-providers/VehiclePositionProvider";

/**
 * Provides information about active vehicle locations. The returned mapping shows the vehicles for each routeId.
 */
class VehiclePositionProvider
  extends EventEmitter
  implements RealtimeProvider<RouteToVehiclePosition>
{
  #dataAdapter: VehicleDataAdapter;
  constructor(
    dataAdapterType: VehiclePositionAdapterType,
    dataAdapterConfig: VehicleDataAdapterOptions
  ) {
    super();
    this.#dataAdapter = getVehiclePositionDataAdapter(
      dataAdapterType,
      dataAdapterConfig
    );

    this.#dataAdapter.on("data", this.#handleData.bind(this));
  }

  async #handleData(data: [Vehicle[], boolean]) {
    const [vehicleData, isIgnoreSuggested] = data;

    const vehicleDataGrouped = groupVehicles(vehicleData);

    this.#logResults(vehicleDataGrouped);

    this.emit("data", [vehicleDataGrouped, isIgnoreSuggested]);
  }

  #logResults(vehicleData: RouteToVehiclePosition) {
    const routeCount = Object.keys(vehicleData).length;
    log.info({
      component,
      type: "update-vehicles",
      message: `updated vehicles: found data for ${routeCount} routes`,
      count: routeCount,
    });
  }
}

export default VehiclePositionProvider;
