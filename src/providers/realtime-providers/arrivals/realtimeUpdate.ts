import Time from "../../time";

export interface RealtimeUpdate {
  trip: string;
  stop: string;
  stopSequence: number;
  route: string;
  arrival: Time;
  departure: Time;
}
