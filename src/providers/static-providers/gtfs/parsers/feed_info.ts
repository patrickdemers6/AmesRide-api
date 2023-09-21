import StaticGTFS from "../index.d";
import GtfsFromCsv from "../csvTypes";
import { Parser } from "./parser.d";

class FeedInfo implements Parser<GtfsFromCsv.FeedInfo, StaticGTFS.FeedInfo> {
  parseRow(data: GtfsFromCsv.FeedInfo): StaticGTFS.FeedInfo {
    return data;
  }
}

export default FeedInfo;
