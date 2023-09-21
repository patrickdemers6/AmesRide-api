import { RealtimeUpdate } from "./realtimeUpdate";

/**
 * Group an array of vehicles by their route.
 * @returns object with route id mapped to an array of vehicles on that route
 */
const groupArrivals = (arrivals: RealtimeUpdate[]) => {
  const arrivalsGroupedByStop = {};
  arrivals.forEach((arrival) => {
    arrivalsGroupedByStop[arrival.stop] =
      arrivalsGroupedByStop[arrival.stop] ?? [];

    arrivalsGroupedByStop[arrival.stop].push(arrival);
  });
  return arrivalsGroupedByStop;
};

export default groupArrivals;
