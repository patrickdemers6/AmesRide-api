export interface Vehicle {
  trip: string;
  route: string;
  licensePlate?: string;
  id: string;
  description?: string;
  timestamp?: string;
  position: {
    latitude: number;
    longitude: number;
    bearing?: number;
    speed?: number;
  };
  occupancyPercentage?: number | null;
}

export interface RouteToVehiclePosition {
  [key: RouteId]: Vehicle[];
}
