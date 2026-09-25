// -----------------------------------------------------------------------------
// sisiMove — Journey Vehicle API Barrel
// -----------------------------------------------------------------------------
//
// Public barrel export for Journey vehicle API adapters.
//
// Vehicle capabilities exposed by the frozen Journey controller:
//
//   GET    /journeys/:journeyPublicId/vehicle
//   POST   /journeys/:journeyPublicId/vehicle
//   DELETE /journeys/:journeyPublicId/vehicle
//
// IMPORTANT:
//
// The Journey controller does NOT create vehicle details.
//
// The POST operation only attaches an existing vehicle using:
//
//   {
//     vehiclePublicId: string
//   }
//
// Vehicle creation and management therefore remain outside this Journey API
// surface.
//
// All adapters use the authenticated API client because these are protected
// Journey management operations.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Get vehicle
// -----------------------------------------------------------------------------

export {
  getJourneyVehicle,
} from './get-journey-vehicle.api';

// -----------------------------------------------------------------------------
// Attach vehicle
// -----------------------------------------------------------------------------

export {
  attachJourneyVehicle,
  type AttachJourneyVehicleRequest,
} from './attach-journey-vehicle.api';

// -----------------------------------------------------------------------------
// Remove vehicle
// -----------------------------------------------------------------------------

export {
  removeJourneyVehicle,
} from './remove-journey-vehicle.api';