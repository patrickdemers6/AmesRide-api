declare namespace GtfsFromCsv {
  export interface Agency {
    agency_id: string;
    agency_name: string;
    agency_url: string;
    agency_timezone: string;
    agency_lang?: string;
    agency_phone?: string;
    agency_fare_url?: string;
    agency_email?: string;
  }

  export interface CalendarAttributes {
    service_id: string;
    service_description: string;
  }

  export interface CalendarDates {
    service_id: string;
    date: string;
    exception_type: string;
  }

  export interface Calendar {
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

  export interface Shapes {
    shape_id: string;
    shape_pt_lat: string;
    shape_pt_lon: string;
    shape_pt_sequence: string;
    shape_dist_traveled: string;
  }

  export interface StopTimes {
    trip_id: string;
    arrival_time: string;
    departure_time: string;
    stop_id: string;
    stop_sequence: string;
    stop_headsign: string;
    pickup_type: string;
    drop_off_type: string;
    shape_dist_traveled: string;
    timepoint: string;
  }

  export interface Stops {
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
}

export default GtfsFromCsv;
