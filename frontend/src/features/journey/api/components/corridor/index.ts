// -----------------------------------------------------------------------------
// sisiMove — Journey Corridor API Barrel
// -----------------------------------------------------------------------------
//
// Public barrel export for Journey corridor API adapters.
//
// Corridor capabilities exposed by the frozen Journey controller:
//
//   GET    /journeys/:journeyPublicId/corridor
//   POST   /journeys/:journeyPublicId/corridor
//   DELETE /journeys/:journeyPublicId/corridor
//
// The POST operation attaches an existing corridor by public identifier. It
// does not create corridor details.
//
// These adapters use the authenticated API client because all corridor
// management operations are protected by Journey permissions.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Get corridor
// -----------------------------------------------------------------------------

export {
  getJourneyCorridor,
} from './get-journey-corridor.api';

// -----------------------------------------------------------------------------
// Attach corridor
// -----------------------------------------------------------------------------

export {
  attachJourneyCorridor,
  type AttachJourneyCorridorRequest,
} from './attach-journey-corridor.api';

// -----------------------------------------------------------------------------
// Remove corridor
// -----------------------------------------------------------------------------

export {
  removeJourneyCorridor,
} from './remove-journey-corridor.api';