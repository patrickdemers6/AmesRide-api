import { expect } from "chai";
import getArchiveManager from "../../archivers";
import LocalFsArchiver from "../../archivers/localFs";

describe("archive factory", () => {
  it("returns local fs archiver", () => {
    const archiver = getArchiveManager("local", { directory: "" });
    expect(archiver).to.be.an.instanceOf(LocalFsArchiver);
  });

  it("should throw a TypeError for unknown archiver type", () => {
    const factoryFunction = () =>
      getArchiveManager("something-random" as never, { directory: "" });

    expect(factoryFunction).to.throw(
      TypeError,
      "Unknown archive manager type: something-random"
    );
  });
});
