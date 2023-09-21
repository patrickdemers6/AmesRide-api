import Time from "../../../time";
import StaticGTFS from "../index.d";
import GtfsFromCsv from "../csvTypes";
import { Parser } from "./parser.d";

class StopTimes implements Parser<GtfsFromCsv.StopTimes, StaticGTFS.StopTimes> {
  parseRow(data: GtfsFromCsv.StopTimes): StaticGTFS.StopTimes {
    const { arrival_time, departure_time } = data;
    return {
      ...data,
      arrival_time: Time.fromShortTimeString(arrival_time),
      departure_time: Time.fromShortTimeString(departure_time),
    };
  }
}

export default StopTimes;
