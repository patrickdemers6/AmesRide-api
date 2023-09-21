const config = {
  providers: [
    {
      type: "vehicle-position",
      source: "gtfs",
      emitName: "vehicles-on-route",
      subscribePath: "subscribe-route",
      unsubscribePath: "unsubscribe-route",
      loggingEventName: "route",
      options: {
        url: "https://mycyride.com/gtfs-rt/vehiclepositions",
        frequency: 5,
      },
    },
    {
      type: "arrivals",
      source: "gtfs",
      emitName: "arrivals",
      subscribePath: "subscribe-arrivals",
      unsubscribePath: "unsubscribe-arrivals",
      loggingEventName: "arrivals",
      options: {
        url: "https://mycyride.com/gtfs-rt/tripupdates",
        frequency: 15,
      },
    },
  ],
  static: {
    url: "https://mycyride.com/gtfs",
  },
};

export default config;
