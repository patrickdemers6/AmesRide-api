import StaticGTFS from "../index.d";
import GtfsFromCsv from "../csvTypes";
import { Parser } from "./parser.d";

class Stops implements Parser<GtfsFromCsv.Stops, StaticGTFS.Stops> {
  parseRow(data: GtfsFromCsv.Stops): StaticGTFS.Stops {
    const { stop_lat, stop_lon, ...other } = data;
    return {
      ...other,
      latitude: Number.parseFloat(stop_lat),
      longitude: Number.parseFloat(stop_lon),
    };
  }
}

export default Stops;
