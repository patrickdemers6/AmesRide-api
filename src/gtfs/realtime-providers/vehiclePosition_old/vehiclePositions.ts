// import GtfsRealtimeBindings from "gtfs-realtime-bindings";
// import {
//   isStoreVehiclePositionEnabled,
//   VEHICLE_POSITIONS_ARCHIVE,
// } from "../../../config";
// import { log } from "../../../monitoring";
// import DataArchiver from "../../dataArchiver";

// const component = "gtfs/arrivals/vehiclePositions";

// class VehiclePositionFetcher {
//   isIgnoreDataSuggested;
//   #vehiclePositions;

//   #getVehiclePositions: () => Promise<ArrayBuffer>;
//   constructor(getVehiclePositions: () => Promise<ArrayBuffer>) {
//     this.#getVehiclePositions = getVehiclePositions;
//   }

//   async updateVehiclePositions() {
//     const vehiclePositionBuffer = await this.#getVehiclePositions();

//     log.debug({
//       component,
//       message: "received vehicle locations buffer",
//       size: vehiclePositionBuffer.byteLength,
//     });

//     if (isStoreVehiclePositionEnabled()) {
//       this.#archiveData(vehiclePositionBuffer);
//     }

//     this.#vehiclePositions =
//       GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
//         new Uint8Array(vehiclePositionBuffer)
//       );
//     this.isIgnoreDataSuggested = vehiclePositionBuffer.byteLength === 15;
//   }

//   getVehiclePositions() {
//     return this.#vehiclePositions;
//   }

//   #archiveData(data: ArrayBuffer) {
//     DataArchiver.toLocalFs(VEHICLE_POSITIONS_ARCHIVE, data, "vehicle position");
//   }
// }

// export default VehiclePositionFetcher;
