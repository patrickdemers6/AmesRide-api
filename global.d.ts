import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import Time from "./src/gtfs/time";
import EventEmitter from "events";

declare global {
  type UserSocket = Socket<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap
  >;

  type RealtimeProvider<T> = EventEmitter;

  type RouteId = string;
  type StopId = string;

  interface ArrivalsByStopID {
    [key: StopId]: {
      arrival_time: Time;
      trip_id: string;
    }[];
  }
}
