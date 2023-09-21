import AdmZip from "adm-zip";
import { log } from "../../../../monitoring";
import Agency from "./agency";
import csv from "csv-parser";
import { Readable } from "stream";
import CalendarAttributes from "./calendar_attributes";
import CalendarDates from "./calendar_dates";
import Calendar from "./calendar";
import Directions from "./directions";
import FeedInfo from "./feed_info";
import Routes from "./routes";
import Shapes from "./shapes";
import StopTimes from "./stop_times";
import Stops from "./stops";
import Trips from "./trips";

const fileParsers = {
  "agency.txt": new Agency(),
  "calendar_attributes.txt": new CalendarAttributes(),
  "calendar_dates.txt": new CalendarDates(),
  "calendar.txt": new Calendar(),
  "directions.txt": new Directions(),
  "feed_info.txt": new FeedInfo(),
  "routes.txt": new Routes(),
  "shapes.txt": new Shapes(),
  "stop_times.txt": new StopTimes(),
  "stops.txt": new Stops(),
  "trips.txt": new Trips(),
};

class GtfsStaticParser {
  async parse(content: Buffer) {
    const result = {
      agency: [],
      calendar_attributes: [],
      calendar_dates: [],
      calendar: [],
      directions: [],
      feed_info: [],
      routes: [],
      shapes: [],
      stop_times: [],
      stops: [],
      trips: [],
    };

    const folderContents = new AdmZip(content).getEntries();
    const files = await Promise.all(folderContents.map(this.#parseFile));
    Object.entries(Object.assign({}, ...files)).forEach(([name, content]) => {
      result[name] = content;
    });

    return result;
  }

  #parseFile(file: AdmZip.IZipEntry): Promise<{ [key: string]: unknown[] }> {
    if (file.isDirectory) {
      log.warn(`gtfs_zip_contains_directory: ${file.name}`);
      return;
    }
    if (!fileParsers[file.name]) {
      log.debug(`gtfs_zip_contains_unknown_file: ${file.name}`);
      return;
    }

    const fileContent = file.getData().toString("utf-8");
    const readableStream = new Readable();
    readableStream.push(fileContent);
    readableStream.push(null);

    return new Promise((resolve, reject) => {
      const rows = [];
      readableStream
        .pipe(csv())
        .on("data", (data) => rows.push(fileParsers[file.name].parseRow(data)))
        .on("end", () => resolve({ [file.name.replace(/\.txt$/, "")]: rows }))
        .on("error", reject);
    });
  }
}

export default GtfsStaticParser;
