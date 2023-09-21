import StaticGTFS from "../index.d";
import GtfsFromCsv from "../csvTypes";
import { Parser } from "./parser.d";

class Calendar implements Parser<GtfsFromCsv.Calendar, StaticGTFS.Calendar> {
  parseRow(data: GtfsFromCsv.Calendar): StaticGTFS.Calendar {
    const {
      sunday,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      ...other
    } = data;

    const days = [
      sunday,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
    ].map((runsOnDay) => (runsOnDay === "1" ? 1 : 0));

    return {
      ...other,
      days,
    };
  }
}

export default Calendar;
