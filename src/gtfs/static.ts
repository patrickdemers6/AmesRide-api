import csvParser from "csv-parser";
import { Readable } from "stream";
import AdmZip from "adm-zip";
import { getDay } from "date-fns";
import { log } from "../monitoring";
import hash from "object-hash";
import Time from "./time";

const component = "StaticGTFS";

/**
 * Provides data from a static GTFS feed
 * This file is in desprate need of an overhaul.
 */
class StaticGTFS {
  static url = "https://mycyride.com/gtfs";

  static #data: StaticGTFS.GtfsData;
  static publicData: string;
  static hash: string;
  static #tripDetails: { [key: string]: StaticGTFS.TripDetails };

  static async updateGTFS(): Promise<void> {
    const gtfsResponse = await fetch(StaticGTFS.url, {
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

    const result: StaticGTFS.GtfsData = {
      "agency.txt": [],
      "stops.txt": [],
      "routes.txt": [],
      "trips.txt": [],
      "stop_times.txt": [],
      "calendar.txt": [],
      "shapes.txt": [],
      "calendar_dates.txt": [],
      "calendar_attributes.txt": [],
      "realtime_routes.txt": [],
      "directions.txt": [],
      "feed_info.txt": [],
    };

    const filesInGtfsZip = new AdmZip(
      Buffer.from(await gtfsResponse.arrayBuffer())
    ).getEntries();

    // create a readable stream from the file content
    const createReadableStream = (contents) => {
      const r = new Readable();
      r._read = () => {
        r.push(contents.toString("utf-8"));
        r.push(null);
      };
      return r;
    };

    // process the given file using the helper function processData
    const processFile = (file, processData) => {
      return new Promise(async (resolve, reject) => {
        const contents = file.getData();
        const r = createReadableStream(contents);

        r.pipe(csvParser())
          .on("data", (data) => {
            result[file.name].push(processData(data));
          })
          .on("end", resolve)
          .on("error", reject);
      });
    };

    // Main code
    const fileProcessingMap = {
      "stop_times.txt": processStopTimes,
      "calendar.txt": processCalendar,
      "shapes.txt": processShapes,
      "stops.txt": processStops,
    };

    const promises = filesInGtfsZip.map((file) => {
      const dataProcessingFn = fileProcessingMap[file.name] || processDefault;

      return processFile(file, dataProcessingFn);
    });

    await Promise.all(promises);

    StaticGTFS.#data = result;

    const stopsByTrip = this.#indexArray(this.getStopTimes(), "trip_id");
    Object.keys(stopsByTrip).map((key) => {
      stopsByTrip[key] = stopsByTrip[key].map((stop) => stop.stop_id);
    });
    const trips = this.getTripsIndexed();
    Object.keys(trips).forEach((key) => {
      trips[key] = { ...trips[key], stops: stopsByTrip[key] };
    });

    // store data consumed by frontend
    const publicData = {
      routes: StaticGTFS.getRoutesIndexed(),
      stops: StaticGTFS.getStopsIndexed(),
      trips: trips,
      shapes: StaticGTFS.getShapesIndexed(),
    };

    const publicDataStringified = publicData;
    StaticGTFS.hash = hash(publicDataStringified);
    StaticGTFS.publicData = JSON.stringify({
      hash: StaticGTFS.hash,
      data: publicDataStringified,
    });

    const tripDetails: { [key: string]: StaticGTFS.TripDetails } = {};
    result["trips.txt"].forEach((trip) => {
      tripDetails[trip.trip_id] = {
        route: trip.route_id,
        direction: trip.shape_id,
        serviceId: trip.service_id,
      };
    });

    StaticGTFS.#tripDetails = tripDetails;
  }

  static getStops(): StaticGTFS.Stops[] {
    return StaticGTFS.#data["stops.txt"];
  }

  static getStopsIndexed() {
    return StaticGTFS.#index(StaticGTFS.getStops(), "stop_id");
  }

  static getStopTimes(): StaticGTFS.StopTimes[] {
    return StaticGTFS.#data["stop_times.txt"];
  }

  getStopTimesFiltered_2() {
    return StaticGTFS.getStopTimesFiltered();
  }

  /**
   * Returns stop times that were 30 minutes ago to 90 minutes in the future.
   */
  static getStopTimesFiltered(): StaticGTFS.StopTimes[] {
    const routeStops = [];

    StaticGTFS.getStopTimes().forEach((data) => {
      // filter arrivals that are not within 30 minutes in the past or 90 minutes in the future.
      // TODO: handle around midnight properly. When -30 takes to previous day.

      const isArrivalTooFarInPast =
        data.arrival_time.toInteger() < Time.now().addMinutes(-30).toInteger();

      const isArrivalTooFarInFuture =
        data.arrival_time.toInteger() > Time.now().addMinutes(90).toInteger();

      const isTripScheduledToday = StaticGTFS.isServiceRunningToday(
        data.trip_id
      );

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
  static isServiceRunningToday(tripId: string) {
    const { serviceId } = this.getTripDetails(tripId);

    return this.getCalendar()[serviceId].days[getDay(Date.now())];
  }

  static getShapes() {
    return StaticGTFS.#data["shapes.txt"];
  }

  static getShapesIndexed() {
    return this.#indexArray(StaticGTFS.#data["shapes.txt"], "shape_id");
  }

  static getRoutes() {
    return StaticGTFS.#data["routes.txt"];
  }

  static #getTripsIndexedByRoute() {
    return this.#indexArray(this.getTrips(), "route_id");
  }

  static getRoutesIndexed() {
    const routesIndexed = this.#index(this.getRoutes(), "route_id");
    const tripsByRoute = this.#getTripsIndexedByRoute();
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

  static getRealtimeRoutes() {
    const enabled = new Set<string>();
    const disabled = new Set<string>();

    StaticGTFS.#data["realtime_routes.txt"].forEach((row) => {
      if (row.realtime_enabled === "1") enabled.add(row.route_id);
      else disabled.add(row.route_id);
    });

    return { enabled, disabled };
  }

  static getFeedInfo() {
    return StaticGTFS.#data["feed_info.txt"];
  }

  static getDirections() {
    return StaticGTFS.#data["directions.txt"];
  }

  static getCalendar(): { [key: string]: StaticGTFS.Calendar } {
    const mapping = {};
    StaticGTFS.#data["calendar.txt"].forEach(
      (row) => (mapping[row.service_id] = row)
    );
    return mapping;
  }

  static #indexArray = (arr, key) => {
    const index = {};

    arr.forEach((item) => {
      if (!index[item[key]]) index[item[key]] = [];
      index[item[key]].push(item);
    });
    return index;
  };

  static #index = (arr, key) => {
    const index = {};

    arr.forEach((item) => {
      index[item[key]] = item;
    });
    return index;
  };

  static getCalendarDates() {
    return StaticGTFS.#data["calendar_dates.txt"];
  }

  static getCalendarAttributes() {
    return StaticGTFS.#data["calendar_attributes.txt"];
  }

  static getAgency() {
    return StaticGTFS.#data["agency.txt"];
  }

  static getTrips() {
    return StaticGTFS.#data["trips.txt"];
  }

  static getTripsIndexed() {
    return this.#index(this.getTrips(), "trip_id");
  }

  getTripsIndexed_2() {
    return StaticGTFS.getTripsIndexed();
  }

  static getTripDetails(trip: string) {
    return this.#tripDetails[trip];
  }
}

const processStopTimes = (data) => {
  data.arrival_time = Time.fromShortTimeString(data.arrival_time);
  return data;
};

const processCalendar = (data) => {
  const calendarRow = data;
  return {
    service_id: calendarRow.service_id,
    start_date: calendarRow.start_date,
    end_date: calendarRow.end_date,
    days: [
      calendarRow.sunday === "1" ? 1 : 0,
      calendarRow.monday === "1" ? 1 : 0,
      calendarRow.tuesday === "1" ? 1 : 0,
      calendarRow.wednesday === "1" ? 1 : 0,
      calendarRow.thursday === "1" ? 1 : 0,
      calendarRow.friday === "1" ? 1 : 0,
      calendarRow.saturday === "1" ? 1 : 0,
    ],
  };
};

const processShapes = (data) => {
  const shape = data;
  return {
    shape_id: shape.shape_id,
    shape_dist_traveled: Number.parseFloat(shape.shape_dist_traveled),
    latitude: Number.parseFloat(shape.shape_pt_lat),
    longitude: Number.parseFloat(shape.shape_pt_lon),
    shape_pt_sequence: Number.parseFloat(shape.shape_pt_sequence),
  };
};

const processStops = (data) => {
  data.latitude = Number.parseFloat(data.stop_lat);
  data.longitude = Number.parseFloat(data.stop_lon);
  return data;
};

const processDefault = (data) => data;

declare namespace StaticGTFS {
  export interface Trips {
    trip_id: string;
    route_id: string;
    service_id: string;
    trip_headsign: string;
    trip_short_name: string;
    direction_id: string;
    block_id: string;
    shape_id: string;
    wheelchair_accessible: string;
  }
  export interface Stops {
    stop_id: string;
    stop_code: string;
    stop_name: string;
    stop_desc: string;
    stop_lat: number;
    stop_lon: number;
    zone_id: string;
    stop_url: string;
    location_type: string;
    parent_station: string;
    stop_timezone: string;
    wheelchair_boarding: string;
    level_id: string;
    platform_code: string;
  }

  export interface _CSVStops {
    stop_id: string;
    stop_code: string;
    stop_name: string;
    stop_desc: string;
    stop_lat: string;
    stop_lon: string;
    zone_id: string;
    stop_url: string;
    location_type: string;
    parent_station: string;
    stop_timezone: string;
    wheelchair_boarding: string;
    level_id: string;
    platform_code: string;
  }
  export interface Shapes {
    shape_id: string;
    shape_pt_lat: number;
    shape_pt_lon: number;
    shape_pt_sequence: number;
    shape_dist_traveled: number;
  }

  export interface _CSVShapes {
    shape_id: string;
    shape_pt_lat: string;
    shape_pt_lon: string;
    shape_pt_sequence: string;
    shape_dist_traveled: string;
  }
  export interface Routes {
    route_id: string;
    agency_id: string;
    route_short_name: string;
    route_long_name: string;
    route_desc: string;
    route_type: string;
    route_url: string;
    route_color: string;
    route_text_color: string;
  }
  export interface RealtimeRoutes {
    route_id: string;
    realtime_enabled: string;
  }
  export interface FeedInfo {
    feed_publisher_name: string;
    feed_publisher_url: string;
    feed_lang: string;
    default_lang: string;
    feed_start_date: string;
    feed_end_date: string;
    feed_version: string;
    feed_contact_email: string;
    feed_contact_url: string;
  }
  export interface Directions {
    route_id: string;
    direction_id: string;
    direction: string;
  }
  export interface CalendarDates {
    service_id: string;
    date: string;
    exception_type: string;
  }
  export interface _CSVCalendar {
    service_id: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
    start_date: string;
    end_date: string;
  }

  export interface Calendar {
    service_id: string;
    days: number[];
    start_date: string;
    end_date: string;
  }

  export interface CalendarAttributes {
    service_id: string;
    service_description: string;
  }
  export interface Agency {
    agency_id: string;
    agency_name: string;
    agency_url: string;
    agency_timezone: string;
    agency_lang: string;
    agency_phone: string;
    agency_fare_url: string;
    agency_email: string;
  }
  export interface StopTimes {
    trip_id: string;
    arrival_time: Time;
    departure_time: string;
    stop_id: string;
    stop_sequence: string;
    stop_headsign: string;
    pickup_type: string;
    drop_off_type: string;
    shape_dist_traveled: string;
    timepoint: string;
  }
  export interface Directions {
    route_id: string;
    direction_id: string;
    direction: string;
  }
  export interface FeedInfo {
    feed_publisher_name: string;
    feed_publisher_url: string;
    feed_lang: string;
    default_lang: string;
    feed_start_date: string;
    feed_end_date: string;
    feed_version: string;
    feed_contact_email: string;
    feed_contact_url: string;
  }
  export interface GtfsData {
    "agency.txt": StaticGTFS.Agency[];
    "stops.txt": StaticGTFS.Stops[];
    "routes.txt": StaticGTFS.Routes[];
    "trips.txt": StaticGTFS.Trips[];
    "stop_times.txt": StaticGTFS.StopTimes[];
    "calendar.txt": StaticGTFS.Calendar[];
    "shapes.txt": StaticGTFS.Shapes[];
    "calendar_dates.txt": StaticGTFS.CalendarDates[];
    "calendar_attributes.txt": StaticGTFS.CalendarAttributes[];
    "realtime_routes.txt": StaticGTFS.RealtimeRoutes[];
    "directions.txt": StaticGTFS.Directions[];
    "feed_info.txt": StaticGTFS.FeedInfo[];
  }

  export interface TripDetails {
    route: string;
    direction: string;
    serviceId: string;
  }
}

export default StaticGTFS;
