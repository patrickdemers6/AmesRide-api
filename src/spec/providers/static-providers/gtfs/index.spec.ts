import AdmZip from "adm-zip";
import GtfsStaticParser from "../../../../providers/static-providers/gtfs/parsers/parser";
import { expect } from "chai";
import * as files from "./data";
import each from "mocha-each";

describe("static gtfs data parser", () => {
  let parser: GtfsStaticParser;
  beforeEach(() => {
    parser = new GtfsStaticParser();
  });

  it("returns empty arrays if files not in zip", async () => {
    const emptyZip = new AdmZip();
    const result = await parser.parse(emptyZip.toBuffer());
    expect(result).to.deep.equal({
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
    });
  });

  it("handles unrecognized file in zip", async () => {
    const zip = new AdmZip();
    zip.addFile("unknown_file.txt", Buffer.from("content"));
    const result = await parser.parse(zip.toBuffer());
    expect(result).to.deep.equal({
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
    });
  });

  each([
    ["agency", files.agency],
    ["calendar_attributes", files.calendar_attributes],
    ["calendar_dates", files.calendar_dates],
    ["calendar", files.calendar],
    ["directions", files.directions],
    ["feed_info", files.directions],
    ["routes", files.routes],
    ["shapes", files.shapes],
    ["stop_times", files.stop_times],
    ["stops", files.stops],
    ["trips", files.trips],
  ]).it("parses %s.txt", async (file: string, { content, output }) => {
    const zip = new AdmZip();
    zip.addFile(`${file}.txt`, Buffer.from(content));

    const result = await parser.parse(zip.toBuffer());
    expect(result[file]).to.deep.equal(output);
  });
});
