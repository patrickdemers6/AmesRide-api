import StaticGTFS from "../index.d";
import GtfsFromCsv from "../csvTypes";
import { Parser } from "./parser.d";

class Agency implements Parser<GtfsFromCsv.Agency, StaticGTFS.Agency> {
  parseRow(data: GtfsFromCsv.Agency): StaticGTFS.Agency {
    const {
      agency_id,
      agency_name,
      agency_timezone,
      agency_url,
      agency_email,
      agency_fare_url,
      agency_lang,
      agency_phone,
    } = data;

    return {
      id: agency_id,
      name: agency_name,
      timezone: agency_timezone,
      url: agency_url,
      email: agency_email,
      fare_url: agency_fare_url,
      lang: agency_lang,
      phone: agency_phone,
    };
  }
}

export default Agency;
