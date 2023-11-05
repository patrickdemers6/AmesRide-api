import mockFs from "mock-fs";
import { describe, it } from "mocha";
import sinon from "sinon";
import LocalFsArchiver from "../../archivers/localFs";
import fs from "fs";
import { expect } from "chai";
describe("archive toLocalFs", () => {
  let clock: sinon.SinonFakeTimers;
  beforeEach(() => {
    clock = sinon.useFakeTimers();
    mockFs();
  });
  afterEach(() => {
    clock.restore();
    mockFs.restore();
  });

  it("creates directory if not exists", () => {
    const archiver = new LocalFsArchiver({
      directory: "./output/directory/here",
    });
    const data = new Uint16Array([1, 2, 3]);

    archiver.archive(data, "");
    expect(fs.readdirSync("./output/directory/here")).to.include(
      "1970-01-01T00:00:00.000Z"
    );
  });

  it("writes using current time", () => {
    const archiver = new LocalFsArchiver({ directory: "./" });
    const data = new Uint16Array([1, 2, 3]);

    archiver.archive(data, "");
    expect(fs.readdirSync("./")).to.include("1970-01-01T00:00:00.000Z");

    clock.tick(1000);
    archiver.archive(data, "");
    expect(fs.readdirSync("./")).to.include("1970-01-01T00:00:01.000Z");
  });

  it("stores proper data", () => {
    const archiver = new LocalFsArchiver({ directory: "./" });
    const data = new Uint16Array([1, 2, 3]);

    archiver.archive(data, "");

    expect(fs.readFileSync("./1970-01-01T00:00:00.000Z")).to.deep.equal(
      Buffer.from(data)
    );
  });
});
