import StaticGTFS from "../index.d";
import GtfsFromCsv from "../csvTypes";
import { Parser } from "./parser.d";

class Routes implements Parser<GtfsFromCsv.Routes, StaticGTFS.Routes> {
  parseRow(data: GtfsFromCsv.Routes): StaticGTFS.Routes {
    return data;
  }
}

export default Routes;
