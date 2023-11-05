import fs from "fs";
import { log } from "../monitoring";
import { ArchiveManager, ArchiveManagerOptions } from ".";
import path from "path";

const component = "dataArchiver/localFs";

/**
 * Archive data needed for future reference.
 */
class LocalFsArchiver implements ArchiveManager {
  #directory: string;

  constructor(options: ArchiveManagerOptions) {
    this.#directory = options.directory;
  }

  archive(data: ArrayBuffer, description: string) {
    const fileName = new Date().toISOString();
    const filePath = path.join(this.#directory, fileName);

    if (!fs.existsSync(this.#directory)) {
      fs.mkdirSync(this.#directory, { recursive: true });
    }

    fs.appendFile(filePath, Buffer.from(data), (err) => {
      if (err) {
        log.warn({
          component,
          message: `failed to store ${description} archive buffer`,
          error: { message: err.message, stack: err.stack },
        });
      } else {
        log.info({
          component,
          message: `stored ${description} archive buffer: '${fileName}'`,
        });
      }
    });
  }
}

export default LocalFsArchiver;
