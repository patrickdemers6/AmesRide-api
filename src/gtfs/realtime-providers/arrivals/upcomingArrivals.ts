// import {
//   isStoreTripUpdateEnabled,
//   TRIP_UPDATES_ARCHIVE,
// } from "../../../config";
// import { log } from "../../../monitoring";
// import StaticGTFS from "../../static";
// import GtfsRealtimeBindings from "gtfs-realtime-bindings";
// import DataArchiver from "../../dataArchiver";
// import staticRealtimeCombiner from "./staticRealtimeCombiner";
// import Time from "../../time";

// const component = "gtfs/arrivals/upcomingArrivals";

// /**
//  * Gets and stores upcoming arrivals.
//  */
// class UpcomingArrivalsProvider {
//   isIgnoreDataSuggested: boolean;
//   realtimeArrivals: GtfsRealtimeBindings.transit_realtime.FeedMessage;
//   #getUpcomingArrivals: () => Promise<ArrayBuffer>;
//   staticScheduleProvider: () => StaticGTFS.StopTimes[];
//   constructor(
//     getUpcomingArrivals: () => Promise<ArrayBuffer>,
//     getStaticSchedule: () => StaticGTFS.StopTimes[]
//   ) {
//     this.#getUpcomingArrivals = getUpcomingArrivals;
//     this.staticScheduleProvider = getStaticSchedule;
//   }

//   /**
//    * Fetch trip updates from a GTFS feed and parse them.
//    */
//   async updateArrivalData() {
//     log.debug({
//       component,
//       message: `fetching trip updates`,
//     });

//     const tripUpdateBuffer = await this.#getUpcomingArrivals();

//     // the buffer is sometimes empty due to provider issues
//     // suggest keeping last good data so users are not disrupted
//     this.isIgnoreDataSuggested = tripUpdateBuffer.byteLength === 15;

//     log.debug({
//       component,
//       message: "received trip updates buffer",
//       size: tripUpdateBuffer.byteLength,
//     });

//     if (isStoreTripUpdateEnabled()) {
//       DataArchiver.toLocalFs(
//         TRIP_UPDATES_ARCHIVE,
//         tripUpdateBuffer,
//         "trip updates"
//       );
//     }

//     this.realtimeArrivals =
//       GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
//         new Uint8Array(tripUpdateBuffer)
//       );
//   }

//   /**
//    * Get upcoming arrivals based on the latest realtime data and static schedule.
//    */
//   getUpcomingArrivals() {
//     const staticData = this.staticScheduleProvider();
//     const combined = staticRealtimeCombiner(staticData, this.realtimeArrivals);
//     const upcomingArrivals = this.#filterArrivals(combined);
//     return upcomingArrivals;
//   }

//   /**
//    * Filter arrivals to only contain those that will still happen today.
//    * @param arrivals the arrivals to be filtered
//    * @returns arrivals that could still happen today
//    */
//   #filterArrivals(arrivals: StaticGTFS.StopTimes[]) {
//     return arrivals.filter(this.#shouldArrivalBeShown);
//   }

//   /**
//    * Is the arrival currently relevant to users?
//    */
//   #shouldArrivalBeShown(arrival: StaticGTFS.StopTimes) {
//     // arrivals one minute in the past to anytime in the future should be shown
//     // this ensures arrivals don't disappear as the bus is arriving
//     const isArrivalInFuture =
//       arrival.arrival_time.toInteger() - Time.now().toInteger() > -1;

//     return isArrivalInFuture;
//   }
// }

// export default UpcomingArrivalsProvider;
