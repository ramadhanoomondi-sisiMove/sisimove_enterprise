// -----------------------------------------------------------------------------
// sisiMove — Journey Preferences API Barrel
// -----------------------------------------------------------------------------
//
// Public barrel export for Journey preferences API adapters.
//
// Preferences capabilities exposed by the frozen Journey controller:
//
//   GET    /journeys/:journeyPublicId/preferences
//   POST   /journeys/:journeyPublicId/preferences
//   DELETE /journeys/:journeyPublicId/preferences
//
// IMPORTANT:
//
// The Journey controller does NOT create preference details.
//
// The POST operation only attaches an existing preferences configuration using:
//
//   {
//     preferencesPublicId: string
//   }
//
// Preferences creation and management therefore remain outside this Journey
// API surface.
//
// All adapters use the authenticated API client because these are protected
// Journey management operations.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Get preferences
// -----------------------------------------------------------------------------

export {
  getJourneyPreferences,
} from './get-journey-preferences.api';

// -----------------------------------------------------------------------------
// Attach preferences
// -----------------------------------------------------------------------------

export {
  attachJourneyPreferences,
  type AttachJourneyPreferencesRequest,
} from './attach-journey-preferences.api';

// -----------------------------------------------------------------------------
// Remove preferences
// -----------------------------------------------------------------------------

export {
  removeJourneyPreferences,
} from './remove-journey-preferences.api';