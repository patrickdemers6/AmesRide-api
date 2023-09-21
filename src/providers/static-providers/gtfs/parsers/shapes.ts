import StaticGTFS from "../index.d";
import GtfsFromCsv from "../csvTypes";
import { Parser } from "./parser.d";

class Shapes implements Parser<GtfsFromCsv.Shapes, StaticGTFS.Shapes> {
  parseRow(data: GtfsFromCsv.Shapes): StaticGTFS.Shapes {
    const {
      shape_dist_traveled,
      shape_id,
      shape_pt_lat,
      shape_pt_lon,
      shape_pt_sequence,
    } = data;
    return {
      shape_id,
      shape_dist_traveled: Number.parseFloat(shape_dist_traveled),
      latitude: Number.parseFloat(shape_pt_lat),
      longitude: Number.parseFloat(shape_pt_lon),
      shape_pt_sequence: Number.parseFloat(shape_pt_sequence),
    };
  }
}

export default Shapes;
