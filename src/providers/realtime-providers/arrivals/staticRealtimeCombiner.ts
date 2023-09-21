import StaticGTFS from "../../static-providers/gtfs/index.d";
import { RealtimeUpdate } from "./realtimeUpdate";

/**
 * Combine static arrival data and realtime arrival data to produce latest arrival information.
 */
const staticRealtimeCombiner = (
  staticData: StaticGTFS.StopTimes[],
  realtimeData: RealtimeUpdate[]
) => {
  const staticDataByTripAndStop = groupStaticData(staticData);

  const updatedScheduled = updateScheduledArrivals(
    staticDataByTripAndStop,
    realtimeData
  );

  // this maps from a key to each arrival
  // updatedScheduled will take precedence over statically scheduled
  // this means updated times are in this object
  const timeCorrectedArrivals = {
    ...staticDataByTripAndStop,
    ...updatedScheduled,
  };

  // the key is no longer needed since an array of arrivals is returned. these arrivals have updated times
  // filter out any arrivals set to undefined since this indicates the arrival was in the past
  // this makes past arrivals drop off
  // but arrivals in the future (from static data, but beyond what has realtime info) will persist
  return Object.values(timeCorrectedArrivals).filter((a) => a);
};

const groupStaticData = (
  staticData: StaticGTFS.StopTimes[]
): StopTimesByKey => {
  const grouped = {};
  staticData.forEach((stopTime) => {
    const key = `${stopTime.trip_id}-${stopTime.stop_sequence}`;
    grouped[key] = stopTime;
  });
  return grouped;
};

/**
 * Updates scheduled arrival times using real-time data.
 * @param scheduledArrivals - An object containing scheduled stop times keyed by trip ID and stop sequence.
 * @param realtimeUpdates - A real-time feed message containing updates to the scheduled stop times.
 * @returns An updated object of scheduled stop times.
 */

const updateScheduledArrivals = (
  scheduledArrivals: StopTimesByKey,
  stopTimeUpdates: RealtimeUpdate[]
): StopTimesByKey => {
  let updatedScheduled: StopTimesByKey = {};
  const realtimeUpdatesByTrip: { [key: string]: RealtimeUpdate[] } = {};
  stopTimeUpdates.forEach((update) => {
    const key = `${update.trip}`;
    realtimeUpdatesByTrip[key] = realtimeUpdatesByTrip[key] ?? [];
    realtimeUpdatesByTrip[key].push(update);
  });

  Object.keys(realtimeUpdatesByTrip).forEach((trip) => {
    removePastArrivals(
      trip,
      realtimeUpdatesByTrip[trip][0].stopSequence,
      updatedScheduled
    );

    realtimeUpdatesByTrip[trip].forEach((arrival) => {
      const key = `${arrival.trip}-${arrival.stopSequence}`;
      if (key in scheduledArrivals) {
        updatedScheduled = updateStopTime(
          key,
          scheduledArrivals,
          arrival,
          updatedScheduled
        );
      }
    });
  });
  return updatedScheduled;
};

const removePastArrivals = (
  tripId,
  startingStopSequence,
  stopTimesToUpdate
) => {
  for (
    let currentStopSequence = 0;
    currentStopSequence < startingStopSequence;
    ++currentStopSequence
  ) {
    stopTimesToUpdate[`${tripId}-${currentStopSequence}`] = undefined;
  }
};

const updateStopTime = (
  key: string,
  scheduledArrivals: StopTimesByKey,
  stopTimeUpdate: RealtimeUpdate,
  stopTimesToUpdate
): StopTimesByKey => {
  const stopTimes = scheduledArrivals[key];
  const updatedArrivalTime = stopTimeUpdate.arrival;

  return {
    ...stopTimesToUpdate,
    [key]: {
      ...stopTimes,
      arrival_time: updatedArrivalTime,
    },
  };
};

export default staticRealtimeCombiner;

interface StopTimesByKey {
  [key: string]: StaticGTFS.StopTimes;
}
