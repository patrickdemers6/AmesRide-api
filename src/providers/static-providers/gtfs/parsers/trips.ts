import StaticGTFS from "../index.d";
import GtfsFromCsv from "../csvTypes";
import { Parser } from "./parser.d";

class Trips implements Parser<GtfsFromCsv.Trips, StaticGTFS.Trips> {
  parseRow(data: GtfsFromCsv.Trips): StaticGTFS.Trips {
    return data;
  }
}

export default Trips;
