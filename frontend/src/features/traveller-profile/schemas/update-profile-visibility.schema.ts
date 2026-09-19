// -----------------------------------------------------------------------------
// sisiMove — Update Profile Visibility Schema
// -----------------------------------------------------------------------------
//
// Validation schema for authenticated Traveller Profile visibility updates.
//
// Responsibilities:
// - Validate the requested profile visibility.
// - Define the frontend write contract for profile visibility.
//
// Non-responsibilities:
// - Loading the current profile.
// - Updating profile details.
// - Updating travel preferences.
// - Managing verification.
// - Deciding whether a visibility change is authorized.
//
// The backend remains authoritative for authorization and persistence.
//
// -----------------------------------------------------------------------------

import { z } from "zod";

// -----------------------------------------------------------------------------
// Supported visibility values
// -----------------------------------------------------------------------------

const travellerProfileVisibilityValues = [
  "PUBLIC",
  "LIMITED",
  "PRIVATE",
] as const;

// -----------------------------------------------------------------------------
// Schema
// -----------------------------------------------------------------------------

export const updateProfileVisibilitySchema = z.object({
  /**
   * Requested Traveller Profile visibility.
   */
  visibility: z.enum(travellerProfileVisibilityValues),
});

// -----------------------------------------------------------------------------
// Inferred Type
// -----------------------------------------------------------------------------

export type UpdateProfileVisibilityInput = z.infer<
  typeof updateProfileVisibilitySchema
>;