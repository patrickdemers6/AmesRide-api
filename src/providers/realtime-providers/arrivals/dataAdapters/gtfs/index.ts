import {
  RealtimeDataAdapter,
  RealtimeDataAdapterOptions,
} from "../realtimeDataAdapter";
import EventEmitter from "events";
import { log } from "../../../../../monitoring";
import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import { RealtimeUpdate } from "../../realtimeUpdate";
import Time from "../../../../time";
import Long from "long";
import Interval from "../../../../interval";

const component = "providers/arrivals/gtfs";

class GTFSRealtimeDataAdapter
  extends EventEmitter
  implements RealtimeDataAdapter
{
  isIgnoreDataSuggested: boolean;
  #options: RealtimeDataAdapterOptions;
  constructor(options: RealtimeDataAdapterOptions) {
    super();
    this.#options = options;

    new Interval(this.#options.frequency, this.get.bind(this)).start();
  }

  async get() {
    log.debug({
      component,
      message: `fetching trip updates`,
    });

    const upcomingArrivals = await this.#getUpcomingArrivals();

    const realtimeUpdates = this.#convertToRealtimeUpdate(upcomingArrivals);

    this.emit("data", realtimeUpdates);
  }

  async #getUpcomingArrivals() {
    const tripUpdateResponse = await fetch(this.#options.url, {
      cache: "no-cache",
      ...(this.#options.fetchOptions ?? {}),
    });

    const tripUpdateBuffer = await tripUpdateResponse.arrayBuffer();
    // the buffer is sometimes empty due to provider issues
    // suggest keeping last good data so users are not disrupted
    this.isIgnoreDataSuggested = tripUpdateBuffer.byteLength === 15;

    log.debug({
      component,
      message: "received trip updates buffer",
      size: tripUpdateBuffer.byteLength,
    });

    if (this.#options.archiveManager) {
      this.#archiveData(tripUpdateBuffer);
    }

    return GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      new Uint8Array(tripUpdateBuffer)
    );
  }

  #convertToRealtimeUpdate(
    feedMessage: GtfsRealtimeBindings.transit_realtime.FeedMessage
  ): RealtimeUpdate[] {
    const updates = [];
    feedMessage.entity.forEach((trip) => {
      const tripId = trip.tripUpdate.trip.tripId;
      trip.tripUpdate.stopTimeUpdate.forEach((stopTimeUpdate) => {
        const stopSequence = stopTimeUpdate.stopSequence;
        const stop = stopTimeUpdate.stopId;
        const update: RealtimeUpdate = {
          arrival: Time.fromSeconds(
            this.#toNumber(stopTimeUpdate.arrival.time)
          ),
          departure: Time.fromSeconds(
            this.#toNumber(stopTimeUpdate.departure.time)
          ),
          trip: tripId,
          route: trip.tripUpdate.trip.routeId,
          stopSequence: stopSequence,
          stop,
        };
        updates.push(update);
      });
    });
    return updates;
  }

  #toNumber(n: number | Long) {
    if (typeof n === "number") return n;
    return n.toInt();
  }

  #archiveData(data: ArrayBuffer) {
    this.#options.archiveManager.archive(data, "trip updates");
  }
}

export default GTFSRealtimeDataAdapter;
