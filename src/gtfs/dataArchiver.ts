import fs from "fs";
import { log } from "../monitoring";

const component = "gtfs/dataArchiver";

/**
 * Archive data needed for future reference.
 */
class DataArchiver {
  toLocalFs(directory: string, data: ArrayBuffer, description: string) {
    const fileName = new Date().toISOString();
    const filePath = `${directory}${fileName}`;

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

export default DataArchiver;
