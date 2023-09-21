import StaticGTFS from "../index.d";
import GtfsFromCsv from "../csvTypes";
import { Parser } from "./parser.d";

class CalendarAttributes
  implements
    Parser<GtfsFromCsv.CalendarAttributes, StaticGTFS.CalendarAttributes>
{
  parseRow(
    data: GtfsFromCsv.CalendarAttributes
  ): StaticGTFS.CalendarAttributes {
    return data;
  }
}

export default CalendarAttributes;
