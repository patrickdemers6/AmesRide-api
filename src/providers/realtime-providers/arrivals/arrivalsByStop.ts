import type StaticGTFS from "../../static-providers/gtfs/index.d";

class ArrivalsByStop {
  #arrivals: ArrivalsByStopID;
  constructor(arrivals: StaticGTFS.StopTimes[]) {
    this.#arrivals = this.#groupArrivalsByStopID(arrivals);
  }

  /**
   * Groups arrivals by stop ID.
   * @param arrivals - An array of StopTimes to be organized by stop ID.
   * @returns An object containing an array of scheduled arrivals for each stop ID.
   */
  #groupArrivalsByStopID(arrivals: StaticGTFS.StopTimes[]) {
    const arrivalsByStopID: ArrivalsByStopID = {};

    arrivals.forEach((arrival) => {
      this.#addArrival(arrival, arrivalsByStopID);
    });

    return arrivalsByStopID;
  }

  /**
   * Adds the given arrival to the arrivalsByStop object based on the arrival's stop ID.
   * @param arrival The bus arrival to add to arrivalsByStop.
   * @param arrivalsByStop An object mapping from stop ID to upcoming arrivals at that stop.
   */
  #addArrival(arrival: StaticGTFS.StopTimes, arrivalsByStop: ArrivalsByStopID) {
    const stopId = arrival.stop_id;

    arrivalsByStop[stopId] = arrivalsByStop[stopId] ?? [];

    arrivalsByStop[stopId].push({
      arrival_time: arrival.arrival_time,
      trip_id: arrival.trip_id,
    });
  }

  /**
   * Sort arrivals chronologically (soonest to furthest in future)
   */
  sort() {
    Object.keys(this.#arrivals).forEach((key) => {
      this.#arrivals[key].sort(
        (a, b) => a.arrival_time.toInteger() - b.arrival_time.toInteger()
      );
    });
    return this;
  }

  getArrivals() {
    return this.#arrivals;
  }
}

export default ArrivalsByStop;
