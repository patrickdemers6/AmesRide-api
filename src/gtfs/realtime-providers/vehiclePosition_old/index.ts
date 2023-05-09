// import {
//   isIgnoreEmptyBufferEnabled,
//   VEHICLE_POSITIONS_URL,
// } from "../../../config";
// import { log } from "../../../monitoring";
// import VehiclesByRoute from "./vehiclesByRoute";
// import VehiclePositionFetcher from "./vehiclePositions";
// import { RouteToVehiclePosition } from "../vehiclePosition/vehicle";

// const component = "gtfs/realtime-providers/VehiclePositionProvider";

// /**
//  * Provides information about active vehicle locations. The returned mapping shows the vehicles for each routeId.
//  */
// class VehiclePositionProvider
//   implements RealtimeProvider<RouteToVehiclePosition>
// {
//   async data(): Promise<[RouteToVehiclePosition, boolean]> {
//     try {
//       log.debug({
//         component,
//         type: "update-vehicles",
//         message: "starting to update vehicles",
//       });

//       const getVehiclePositions = async () => {
//         const vehiclePositionResponse = await fetch(VEHICLE_POSITIONS_URL, {
//           cache: "no-cache",
//         });

//         const vehiclePositionBuffer =
//           await vehiclePositionResponse.arrayBuffer();

//         return vehiclePositionBuffer;
//       };

//       const vehiclePositionProvider = new VehiclePositionFetcher(
//         getVehiclePositions
//       );
//       vehiclePositionProvider.updateVehiclePositions();

//       const isIgnoreSuggested = this.#shouldIgnoreData(
//         vehiclePositionProvider.isIgnoreDataSuggested
//       );

//       const vehiclesByRoute: RouteToVehiclePosition = new VehiclesByRoute(
//         vehiclePositionProvider.getVehiclePositions()
//       ).get();

//       const routeCount = Object.keys(vehiclesByRoute).length;
//       log.info({
//         component,
//         type: "update-vehicles",
//         message: `updated vehicles: found data for ${routeCount} routes`,
//         count: routeCount,
//       });

//       return [vehiclesByRoute, isIgnoreSuggested];
//     } catch (e) {
//       log.error({
//         component,
//         type: "update-vehicles",
//         message: "something went wrong updating vehicle locations",
//         error: { message: e.message, stack: e.stack },
//       });
//       return [null, true];
//     }
//   }

//   /**
//    * Determine if the data should be ignored.
//    * @param isEmpty whether the received buffer is empty.
//    * @returns if the data should be ignored.
//    */
//   #shouldIgnoreData(isEmpty: boolean) {
//     return isEmpty && isIgnoreEmptyBufferEnabled();
//   }
// }

// export default VehiclePositionProvider;
