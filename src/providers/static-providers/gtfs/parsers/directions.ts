import StaticGTFS from "../index.d";
import GtfsFromCsv from "../csvTypes";
import { Parser } from "./parser.d";

class Directions
  implements Parser<GtfsFromCsv.Directions, StaticGTFS.Directions>
{
  parseRow(data: GtfsFromCsv.Directions): StaticGTFS.Directions {
    return data;
  }
}

export default Directions;
