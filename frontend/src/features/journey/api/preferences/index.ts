// src/features/journey/api/preferences/index.ts

// -----------------------------------------------------------------------------
// sisiMove — Journey Preferences API
// -----------------------------------------------------------------------------
//
// Barrel exports for Journey preferences mutations.
// -----------------------------------------------------------------------------

export {
  attachJourneyPreferences,
} from "./attach-journey-preferences";

export type {
  AttachJourneyPreferencesRequest,
} from "./attach-journey-preferences";

export {
  removeJourneyPreferences,
} from "./remove-journey-preferences";