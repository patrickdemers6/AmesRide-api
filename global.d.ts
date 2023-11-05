import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import Time from "./src/providers/time";
import EventEmitter from "events";

declare global {
  type UserSocket = Socket<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap
  >;

  type RealtimeProvider<T> = EventEmitter & {
    shutdown();
  };

  type RouteId = string;
  type StopId = string;

  type StopArrival = {
    arrival_time: Time;
    trip_id: string;
  };

  interface ArrivalsByStopID {
    [key: StopId]: StopArrival[];
  }
}
