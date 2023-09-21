import Time from "../../time";

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
    latitude: number;
    longitude: number;
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
    latitude: number;
    longitude: number;
    shape_pt_sequence: number;
    shape_dist_traveled: number;
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
    id: string;
    name: string;
    url: string;
    timezone: string;
    lang?: string;
    phone?: string;
    fare_url?: string;
    email?: string;
  }

  export interface StopTimes {
    trip_id: string;
    arrival_time: Time;
    departure_time: Time;
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
    feed_start_date: string;
    feed_end_date: string;
    feed_version: string;
    feed_contact_email: string;
    feed_contact_url: string;
  }

  export interface GtfsData {
    agency: StaticGTFS.Agency[];
    stops: StaticGTFS.Stops[];
    routes: StaticGTFS.Routes[];
    trips: StaticGTFS.Trips[];
    stop_times: StaticGTFS.StopTimes[];
    calendar: StaticGTFS.Calendar[];
    shapes: StaticGTFS.Shapes[];
    calendar_dates: StaticGTFS.CalendarDates[];
    calendar_attributes: StaticGTFS.CalendarAttributes[];
    directions: StaticGTFS.Directions[];
    feed_info: StaticGTFS.FeedInfo[];
  }

  export interface TripDetails {
    route: string;
    direction: string;
    serviceId: string;
  }
}

export interface Config {
  url: string;
}

export default StaticGTFS;
