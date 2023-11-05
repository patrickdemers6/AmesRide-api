import { getDay } from "date-fns";
import { log } from "../../../monitoring";
import StaticGTFS, { Config } from "./index.d";
import hash from "object-hash";
import Time from "../../time";
import GtfsStaticParser from "./parsers/parser";
import {
  indexObjectArray,
  indexObjectArrayMultiple,
} from "../../../utils/indexObjectArray";

const component = "StaticGTFS";

/**
 * Provides data from a static GTFS feed
 */
class StaticGTFS {
  config: Config;
  #data: StaticGTFS.GtfsData;
  publicData: string;
  hash: string;
  cache;

  constructor(config: Config) {
    this.config = config;
  }

  async updateGTFS(): Promise<void> {
    const gtfsResponse = await fetch(this.config.url, {
      cache: "no-cache",
    });

    if (!gtfsResponse.ok) {
      log.warn(
        "Error fetching Static GTFS data:",
        gtfsResponse.status,
        gtfsResponse.statusText
      );

      // retry updating GTFS
      return this.updateGTFS();
    }

    const gtfsBuffer = Buffer.from(await gtfsResponse.arrayBuffer());
    const parser = new GtfsStaticParser();
    this.#data = await parser.parse(gtfsBuffer);

    const stopsByTrip = indexObjectArrayMultiple(this.stopTimes, "trip_id");
    Object.keys(stopsByTrip).map((key) => {
      stopsByTrip[key] = stopsByTrip[key].map((stop) => stop.stop_id);
    });
    const tripsWithStopId = indexObjectArray(this.trips, "trip_id");
    Object.keys(tripsWithStopId).forEach((key) => {
      tripsWithStopId[key] = {
        ...tripsWithStopId[key],
        stops: stopsByTrip[key],
      };
    });

    const publicData = {
      routes: this.getRoutesIndexed(),
      stops: indexObjectArray(this.#data.stops, "stop_id"),
      trips: tripsWithStopId,
      shapes: this.indexedShapes,
    };

    this.cache = {};
    this.hash = hash(publicData);
    this.publicData = JSON.stringify({
      hash: this.hash,
      data: publicData,
    });
  }

  get stops(): StaticGTFS.Stops[] {
    return this.#data["stops.txt"];
  }

  get stopsIndexed() {
    return indexObjectArray(this.stops, "stop_id");
  }

  get stopTimes(): StaticGTFS.StopTimes[] {
    return this.#data.stop_times;
  }

  /**
   * Returns stop times that were 30 minutes ago to 90 minutes in the future.
   */
  getStopTimesFiltered(): StaticGTFS.StopTimes[] {
    const routeStops = [];

    this.stopTimes.forEach((data) => {
      // TODO: handle around midnight properly. When -30 takes to previous day.
      const isArrivalTooFarInPast =
        data.arrival_time.toInteger() < Time.now().addMinutes(-30).toInteger();

      const isArrivalTooFarInFuture =
        data.arrival_time.toInteger() > Time.now().addMinutes(90).toInteger();

      const isTripScheduledToday = this.isServiceRunningToday(data.trip_id);

      if (
        !isArrivalTooFarInFuture &&
        !isArrivalTooFarInPast &&
        isTripScheduledToday
      ) {
        routeStops.push(data);
      }
    });

    log.debug({
      component,
      method: "getStopTimesFiltered",
      message: "filtered stop times",
      count: routeStops.length,
    });

    return routeStops;
  }

  /**
   * Is the given tripId running today?
   * @param tripId The tripId to check if running.
   * @returns If the given tripId is running today.
   */
  isServiceRunningToday(tripId: string) {
    const { service_id } = this.indexedTrips[tripId];

    return this.calendar[service_id].days[getDay(Date.now())];
  }

  get shapes() {
    if (!this.#data) return [];
    return this.#data.shapes;
  }

  get indexedShapes() {
    if (!this.#data) return {};
    return indexObjectArrayMultiple(this.#data.shapes, "shape_id");
  }

  get routes() {
    if (!this.#data) return [];
    return this.#data.routes;
  }

  getRoutesIndexed() {
    const routesIndexed = indexObjectArray(this.routes, "route_id");
    const tripsByRoute = indexObjectArrayMultiple(this.trips, "route_id");

    Object.keys(routesIndexed).forEach((key) => {
      const route = routesIndexed[key];
      if (tripsByRoute[key] === undefined) return;
      routesIndexed[key] = {
        ...route,
        trips: tripsByRoute[key].map((trip) => trip.trip_id),
      };
    });

    return routesIndexed;
  }

  get getFeedInfo() {
    if (!this.#data) return [];
    return this.#data.feed_info;
  }

  get getDirections() {
    if (!this.#data) return [];
    return this.#data.directions;
  }

  get calendar() {
    if (!this.cache.calendar) {
      this.cache.calendar = indexObjectArray(this.#data.calendar, "service_id");
    }
    return this.cache.calendar;
  }

  get calendarDates() {
    if (!this.#data) return [];
    return this.#data.calendar_dates;
  }

  get calendarAttributes() {
    if (!this.#data) return [];
    return this.#data.calendar_attributes;
  }

  get agency() {
    if (!this.#data) return [];
    return this.#data.agency;
  }

  get trips() {
    if (!this.#data) return [];
    return this.#data.trips;
  }

  get indexedTrips() {
    if (!this.cache.trips) {
      this.cache.trips = indexObjectArray(this.trips, "trip_id");
    }
    return this.cache.trips;
  }
}

export default StaticGTFS;
