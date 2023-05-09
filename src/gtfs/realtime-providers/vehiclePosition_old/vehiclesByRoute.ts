// import GtfsRealtimeBindings from "gtfs-realtime-bindings";
// import StaticGTFS from "../../static";
// import { RouteToVehiclePosition } from "../vehiclePosition/vehicle";

// class VehiclesByRoute {
//   vehiclesByRoute: RouteToVehiclePosition;

//   constructor(
//     vehicleLocations: GtfsRealtimeBindings.transit_realtime.FeedMessage
//   ) {
//     const vehiclesByRoute: RouteToVehiclePosition = {};

//     vehicleLocations.entity.forEach((bus) => {
//       // busses not in operation but showing on map do not have a trip. hide them
//       if (!bus.vehicle.trip) return;

//       const route = StaticGTFS.getTripDetails(bus.vehicle.trip.tripId);

//       vehiclesByRoute[route.route] = vehiclesByRoute[route.route] ?? [];

//       vehiclesByRoute[route.route].push({
//         ...(bus.vehicle as GtfsRealtimeBindings.transit_realtime.VehiclePosition),
//         direction: route.direction,
//       });
//     });

//     this.vehiclesByRoute = vehiclesByRoute;
//   }

//   get() {
//     return this.vehiclesByRoute;
//   }
// }
// export default VehiclesByRoute;
