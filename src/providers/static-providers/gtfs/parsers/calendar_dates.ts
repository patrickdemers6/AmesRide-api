import StaticGTFS from "../index.d";
import GtfsFromCsv from "../csvTypes";
import { Parser } from "./parser.d";

class CalendarDates
  implements Parser<GtfsFromCsv.CalendarDates, StaticGTFS.CalendarDates>
{
  parseRow(data: GtfsFromCsv.CalendarDates): StaticGTFS.CalendarDates {
    return data;
  }
}

export default CalendarDates;
