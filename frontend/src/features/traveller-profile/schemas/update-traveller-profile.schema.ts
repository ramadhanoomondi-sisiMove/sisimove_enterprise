// -----------------------------------------------------------------------------
// sisiMove — Update Traveller Profile Schema
// -----------------------------------------------------------------------------
//
// Validation schema for authenticated Traveller Profile updates.
//
// Responsibilities:
// - Validate user-editable Traveller Profile fields.
// - Define the frontend write contract for profile details.
// - Keep server-owned fields out of the mutation payload.
//
// Non-responsibilities:
// - Loading the current profile.
// - Updating profile visibility.
// - Updating travel preferences.
// - Managing verification.
// - Managing travel corridors.
//
// -----------------------------------------------------------------------------

import { z } from "zod";

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const TRAVELLER_HANDLE_MIN_LENGTH = 3;
const TRAVELLER_HANDLE_MAX_LENGTH = 30;

const BIO_MAX_LENGTH = 500;

const COUNTRY_CODE_LENGTH = 2;

// -----------------------------------------------------------------------------
// Schema
// -----------------------------------------------------------------------------

export const updateTravellerProfileSchema = z.object({
  /**
   * Public traveller handle.
   *
   * The handle is user-editable but must remain suitable for use as a
   * public identifier.
   *
   * Examples:
   * - john_doe
   * - mary.wanjiku
   * - traveller_254
   */
  handle: z
    .string()
    .trim()
    .min(
      TRAVELLER_HANDLE_MIN_LENGTH,
      `Handle must be at least ${TRAVELLER_HANDLE_MIN_LENGTH} characters.`,
    )
    .max(
      TRAVELLER_HANDLE_MAX_LENGTH,
      `Handle must not exceed ${TRAVELLER_HANDLE_MAX_LENGTH} characters.`,
    )
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      "Handle may contain only letters, numbers, dots, underscores, and hyphens.",
    ),

  /**
   * Optional traveller biography.
   *
   * Empty input is normalized to null so the API receives an explicit
   * representation of "no biography".
   */
  bio: z
    .string()
    .trim()
    .max(
      BIO_MAX_LENGTH,
      `Bio must not exceed ${BIO_MAX_LENGTH} characters.`,
    )
    .transform((value) => (value.length > 0 ? value : null))
    .nullable(),

  /**
   * ISO 3166-1 alpha-2 country code.
   *
   * Example:
   *   KE
   *
   * The backend remains authoritative for whether the supplied country code
   * is actually supported.
   */
  countryCode: z
    .string()
    .trim()
    .length(
      COUNTRY_CODE_LENGTH,
      `Country code must be ${COUNTRY_CODE_LENGTH} characters.`,
    )
    .regex(
      /^[A-Za-z]{2}$/,
      "Country code must be a valid two-letter country code.",
    )
    .transform((value) => value.toUpperCase()),
});

// -----------------------------------------------------------------------------
// Inferred Type
// -----------------------------------------------------------------------------

export type UpdateTravellerProfileInput = z.infer<
  typeof updateTravellerProfileSchema
>;