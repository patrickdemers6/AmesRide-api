import EventEmitter from "events";
import { log } from "../../../monitoring";
import { RealtimeUpdate } from "./realtimeUpdate";
import getUpcomingArrivalDataAdapter, {
  RealtimeDataAdapter,
  RealtimeDataAdapterOptions,
  UpcomingArrivalAdapterType,
} from "./dataAdapters/realtimeDataAdapter";
import staticRealtimeCombiner from "./staticRealtimeCombiner";
import ArrivalsByStop from "./arrivalsByStop";
import StaticGTFS from "../../static";
import Time from "../../time";

const component = "gtfs/realtime-providers/VehiclePositionProvider";

/**
 * Provides information about active vehicle locations. The returned mapping shows the vehicles for each routeId.
 */
class ArrivalsProvider
  extends EventEmitter
  implements RealtimeProvider<ArrivalsByStopID>
{
  #dataAdapter: RealtimeDataAdapter;
  #options: RealtimeDataAdapterOptions;
  constructor(
    dataAdapterType: UpcomingArrivalAdapterType,
    options: RealtimeDataAdapterOptions
  ) {
    super();
    this.#options = options;

    this.#dataAdapter = getUpcomingArrivalDataAdapter(dataAdapterType, options);

    this.#dataAdapter.on("data", this.#handleData.bind(this));
  }

  async #handleData(data: RealtimeUpdate[]) {
    const realtimeUpdates = data;

    // get static schedule
    const scheduledStopTimes =
      this.#options.staticData.getStopTimesFiltered_2();

    // combine realtime updates and static schedule
    const combined = staticRealtimeCombiner(
      scheduledStopTimes,
      realtimeUpdates
    );

    const upcomingArrivals = this.#filterArrivals(combined);

    const upcomingArrivalsGroupedAndSorted = new ArrivalsByStop(
      upcomingArrivals
    )
      .sort()
      .getArrivals();

    this.#logResults(upcomingArrivalsGroupedAndSorted);
    this.emit("data", [upcomingArrivalsGroupedAndSorted, false]);
  }

  /**
   * Filter arrivals to only contain those that will still happen today.
   * @param arrivals the arrivals to be filtered
   * @returns arrivals that could still happen today
   */
  #filterArrivals(arrivals: StaticGTFS.StopTimes[]) {
    return arrivals.filter(this.#shouldArrivalBeShown);
  }

  /**
   * Is the arrival currently relevant to users?
   */
  #shouldArrivalBeShown(arrival: StaticGTFS.StopTimes) {
    // arrivals one minute in the past to anytime in the future should be shown
    // this ensures arrivals don't disappear as the bus is arriving
    const isArrivalInFuture =
      arrival.arrival_time.toInteger() - Time.now().toInteger() > -1;

    return isArrivalInFuture;
  }

  #logResults(vehicleData: ArrivalsByStopID) {
    const routeCount = Object.keys(vehicleData).length;
    log.info({
      component,
      type: "update-vehicles",
      message: `updated vehicles: found data for ${routeCount} routes`,
      count: routeCount,
    });
  }
}

export default ArrivalsProvider;
