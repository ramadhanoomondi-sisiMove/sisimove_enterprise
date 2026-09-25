// -----------------------------------------------------------------------------
// sisiMove — Journey Capacity API Barrel
// -----------------------------------------------------------------------------
//
// Public barrel export for Journey capacity API adapters.
//
// Capacity capabilities exposed by the frozen Journey controller:
//
//   GET    /journeys/:journeyPublicId/capacity
//   POST   /journeys/:journeyPublicId/capacity
//   DELETE /journeys/:journeyPublicId/capacity
//
// IMPORTANT:
//
// The Journey controller does NOT create capacity details.
//
// The POST operation only attaches an existing capacity configuration using:
//
//   {
//     capacityPublicId: string
//   }
//
// Capacity creation and management therefore remain outside this Journey API
// surface.
//
// All adapters use the authenticated API client because these are protected
// Journey management operations.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Get capacity
// -----------------------------------------------------------------------------

export {
  getJourneyCapacity,
} from './get-journey-capacity.api';

// -----------------------------------------------------------------------------
// Attach capacity
// -----------------------------------------------------------------------------

export {
  attachJourneyCapacity,
  type AttachJourneyCapacityRequest,
} from './attach-journey-capacity.api';

// -----------------------------------------------------------------------------
// Remove capacity
// -----------------------------------------------------------------------------

export {
  removeJourneyCapacity,
} from './remove-journey-capacity.api';