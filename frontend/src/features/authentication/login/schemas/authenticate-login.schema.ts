// -----------------------------------------------------------------------------
// sisiMove — Authenticate Login Schema
// -----------------------------------------------------------------------------
//
// Frontend validation schema for the login form.
//
// Login requires only:
//
// - emailOrPhoneNumber
// - password
//
// Technical device metadata is intentionally NOT represented here.
//
// Device metadata is supplied separately by the authentication API boundary:
//
//     x-device-fingerprint
//     x-device-type
//     x-device-name
//     x-device-platform
//     x-device-operating-system
//     x-device-operating-system-version
//     x-device-browser
//     x-device-browser-version
//     x-country-code
//     x-city
//
// This schema therefore validates the user-facing login form only.
//
// -----------------------------------------------------------------------------

import { z } from 'zod';

// =============================================================================
// Login Schema
// =============================================================================

export const authenticateLoginSchema = z.object({
  // ---------------------------------------------------------------------------
  // Email / Phone Number
  // ---------------------------------------------------------------------------

  emailOrPhoneNumber: z
    .string()
    .trim()
    .min(1, 'Enter your email or phone number.'),

  // ---------------------------------------------------------------------------
  // Password
  // ---------------------------------------------------------------------------

  password: z
    .string()
    .min(1, 'Enter your password.'),
});

// =============================================================================
// Login Form Model
// =============================================================================

/**
 * Complete client-side login form model.
 *
 * This is inferred directly from the validation schema and corresponds to the
 * user-facing login form.
 */
export type AuthenticateLoginFormValues = z.infer<
  typeof authenticateLoginSchema
>;

