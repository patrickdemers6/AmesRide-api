export const agency = {
  content: `agency_id,agency_name,agency_url,agency_timezone,agency_lang,agency_phone,agency_fare_url
CYRIDE,CyRide,http://www.cyride.com,America/Chicago,en,515-292-1100, `,
  output: [
    {
      id: "CYRIDE",
      name: "CyRide",
      timezone: "America/Chicago",
      url: "http://www.cyride.com",
      email: undefined,
      fare_url: " ",
      lang: "en",
      phone: "515-292-1100",
    },
  ],
};

export const calendar_attributes = {
  content: `service_id,service_description
1,"Weekdays"`,
  output: [{ service_id: "1", service_description: "Weekdays" }],
};

export const calendar_dates = {
  content: `service_id,date,exception_type
WDF_ISU,20230814,2`,
  output: [
    {
      service_id: "WDF_ISU",
      date: "20230814",
      exception_type: "2",
    },
  ],
};

export const calendar = {
  content: `service_id,monday,tuesday,wednesday,thursday,friday,saturday,sunday,start_date,end_date
WD,1,1,1,1,1,0,0,20230814,20240510
WDF,1,1,1,1,0,0,0,20230814,20240510`,
  output: [
    {
      service_id: "WD",
      start_date: "20230814",
      end_date: "20240510",
      days: [0, 1, 1, 1, 1, 1, 0],
    },
    {
      service_id: "WDF",
      start_date: "20230814",
      end_date: "20240510",
      days: [0, 1, 1, 1, 1, 0, 0],
    },
  ],
};

export const directions = {
  content: `route_id,direction_id,direction
4532,0,Campus`,
  output: [
    {
      route_id: "4532",
      direction_id: "0",
      direction: "Campus",
    },
  ],
};

export const feed_info = {
  content: `feed_publisher_name,feed_publisher_url,feed_lang,feed_start_date,feed_end_date,feed_version
CyRide,http://www.cyride.com,en,20230814,20240510,School Year`,
  output: [
    {
      feed_publisher_name: "CyRide",
      feed_publisher_url: "http://www.cyride.com",
      feed_lang: "en",
      feed_start_date: "20230814",
      feed_end_date: "20240510",
      feed_version: "School Year",
    },
  ],
};

export const routes = {
  content: `route_id,agency_id,route_short_name,route_long_name,route_desc,route_type,route_url,route_color,route_text_color
811,CYRIDE,1,Red West, ,3, ,da1f3d,ffffff`,
  output: [
    {
      route_id: "811",
      agency_id: "CYRIDE",
      route_short_name: "1",
      route_long_name: "Red West",
      route_desc: " ",
      route_type: "3",
      route_url: " ",
      route_color: "da1f3d",
      route_text_color: "ffffff",
    },
  ],
};

export const shapes = {
  content: `shape_id,shape_pt_lat,shape_pt_lon,shape_pt_sequence,shape_dist_traveled
SH1W,42.049611,-93.62178,1,100`,
  output: [
    {
      shape_id: "SH1W",
      latitude: 42.049611,
      longitude: -93.62178,
      shape_pt_sequence: 1,
      shape_dist_traveled: 100,
    },
  ],
};

export const stop_times = {
  content: `trip_id,arrival_time,departure_time,stop_id,stop_sequence,stop_headsign,pickup_type,drop_off_type,shape_dist_traveled,timepoint
1001,06:33:00,06:34:00,5102268,1, , , , ,1`,
  output: [
    {
      trip_id: "1001",
      arrival_time: { hours: 6, minutes: 33 },
      departure_time: { hours: 6, minutes: 34 },
      stop_id: "5102268",
      stop_sequence: "1",
      stop_headsign: " ",
      pickup_type: " ",
      drop_off_type: " ",
      shape_dist_traveled: " ",
      timepoint: "1",
    },
  ],
};

export const stops = {
  content: `stop_id,stop_code,stop_name,stop_desc,stop_lat,stop_lon
5102268,5001,North Grand Mall,,42.049629,-93.621859`,
  output: [
    {
      stop_id: "5102268",
      stop_code: "5001",
      stop_name: "North Grand Mall",
      stop_desc: "",
      latitude: 42.049629,
      longitude: -93.621859,
    },
  ],
};

export const trips = {
  content: `route_id,service_id,trip_id,trip_headsign,direction_id,block_id,shape_id,wheelchair_accessible,bikes_allowed,run_id
811,WD,1001,Ames Middle School,1,1004,SH1W,1,1,3.1`,
  output: [
    {
      route_id: "811",
      service_id: "WD",
      trip_id: "1001",
      trip_headsign: "Ames Middle School",
      direction_id: "1",
      block_id: "1004",
      shape_id: "SH1W",
      wheelchair_accessible: "1",
      bikes_allowed: "1",
      run_id: "3.1",
    },
  ],
};
