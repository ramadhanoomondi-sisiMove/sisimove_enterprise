
import { z } from 'zod';

// -----------------------------------------------------------------------------
// sisiMove — Update Traveller Profile Schema
// -----------------------------------------------------------------------------
//
// Validates partial updates to user-editable Traveller Profile fields.
//
// Only supplied fields are validated and included in the mutation input.
// Omitted fields remain unchanged.
// -----------------------------------------------------------------------------

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
   * Omit this field when the handle has not changed.
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
      'Handle may contain only letters, numbers, dots, underscores, and hyphens.',
    )
    .optional(),

  /**
   * Optional traveller biography.
   *
   * An empty string is normalized to null.
   * Omit the field entirely when the biography has not changed.
   */
  bio: z
    .string()
    .trim()
    .max(
      BIO_MAX_LENGTH,
      `Bio must not exceed ${BIO_MAX_LENGTH} characters.`,
    )
    .transform((value) => (value.length > 0 ? value : null))
    .nullable()
    .optional(),

  /**
   * ISO 3166-1 alpha-2 country code.
   *
   * Example: KE
   *
   * Omit this field when the country has not changed.
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
      'Country code must be a valid two-letter country code.',
    )
    .transform((value) => value.toUpperCase())
    .optional(),
});

// -----------------------------------------------------------------------------
// Inferred Type
// -----------------------------------------------------------------------------

export type UpdateTravellerProfileInput = z.infer<
  typeof updateTravellerProfileSchema
>;
