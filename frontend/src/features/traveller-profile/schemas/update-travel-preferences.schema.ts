// -----------------------------------------------------------------------------
// sisiMove — Update Travel Preferences Schema
// -----------------------------------------------------------------------------
//
// Validation schema for authenticated Traveller Profile travel-preference
// updates.
//
// Responsibilities:
// - Validate user-editable travel preference values.
// - Define the frontend write contract for Traveller Profile preferences.
//
// Non-responsibilities:
// - Loading the current preferences.
// - Updating the Traveller Profile itself.
// - Managing verification.
// - Deciding whether a preference change is authorized.
// - Persisting preference changes.
//
// The backend remains authoritative for authorization and persistence.
//
// -----------------------------------------------------------------------------

import { z } from "zod";

// -----------------------------------------------------------------------------
// Schema
// -----------------------------------------------------------------------------

export const updateTravelPreferencesSchema = z.object({
  /**
   * Controls whether the traveller's journey history may be displayed.
   */
  showJourneyHistory: z.boolean(),

  /**
   * Controls whether the traveller's journey statistics may be displayed.
   */
  showJourneyStatistics: z.boolean(),

  /**
   * Controls whether the traveller may receive journey invitations.
   */
  allowJourneyInvites: z.boolean(),
});

// -----------------------------------------------------------------------------
// Inferred Type
// -----------------------------------------------------------------------------

export type UpdateTravelPreferencesInput = z.infer<
  typeof updateTravelPreferencesSchema
>;