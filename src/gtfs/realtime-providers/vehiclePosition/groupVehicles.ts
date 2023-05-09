import { RouteToVehiclePosition, Vehicle } from "./vehicle";

/**
 * Group an array of vehicles by their route.
 * @returns object with route id mapped to an array of vehicles on that route
 */
const groupVehicles = (vehicles: Vehicle[]): RouteToVehiclePosition => {
  const vehiclesGroupedByRoute: RouteToVehiclePosition = {};
  vehicles.forEach((vehicle) => {
    vehiclesGroupedByRoute[vehicle.route] =
      vehiclesGroupedByRoute[vehicle.route] ?? [];

    vehiclesGroupedByRoute[vehicle.route].push(vehicle);
  });
  return vehiclesGroupedByRoute;
};

export default groupVehicles;
