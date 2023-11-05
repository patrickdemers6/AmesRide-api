import fs from "fs";
import { log } from "../monitoring";
import { ArchiveManager, ArchiveManagerOptions } from ".";
import path from "path";

const component = "dataArchiver/localFs";

/**
 * Archive data to the local file system.
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

    try {
      fs.writeFileSync(filePath, Buffer.from(data));
      log.info({
        component,
        message: `stored ${description} archive buffer: '${fileName}'`,
      });
    } catch (err) {
      log.warn({
        component,
        message: `failed to store ${description} archive buffer`,
        error: { message: err.message, stack: err.stack },
      });
    }
  }
}

export default LocalFsArchiver;
