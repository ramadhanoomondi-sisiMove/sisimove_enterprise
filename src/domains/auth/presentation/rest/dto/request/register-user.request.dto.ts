// -----------------------------------------------------------------------------
// Authentication — Register User Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for registering a new sisiMove user account.
//
// User-facing registration contract:
//
//     travellerName
//     countryCode
//     email
//     phoneNumber
//     password
//     termsAccepted
//
// Example:
//
//     {
//       "travellerName": "Ramadhan Omondi",
//       "countryCode": "KE",
//       "email": "ramah@example.com",
//       "phoneNumber": "+254706439548",
//       "password": "correct-horse-battery-staple",
//       "termsAccepted": true
//     }
//
// -----------------------------------------------------------------------------
//
// Client input:
//
// - travellerName;
// - countryCode;
// - email;
// - phoneNumber;
// - password;
// - termsAccepted.
//
// The client does NOT provide:
//
// - identityPublicId;
// - authenticationPublicId;
// - verificationPublicId;
// - travellerProfilePublicId;
// - trustProfilePublicId;
// - roleId;
// - verificationLevel;
// - passwordHash;
// - sessionPublicId;
// - devicePublicId;
// - accessToken;
// - refreshToken;
// - correlationId;
// - causationId.
//
// Those values belong to application/domain/infrastructure workflows and are
// not registration input.
//
// -----------------------------------------------------------------------------
//
// REGISTRATION SEMANTICS
//
// Registration establishes:
//
//     Identity
//         └── ACTIVE
//
//     Authentication
//         └── ACTIVE
//
//     Verification
//         └── PENDING / NONE
//
//     TravellerProfile
//         └── ACTIVE / PUBLIC
//
//     TravellerProfilePreferences
//         └── defaults
//
//     TrustProfile
//         └── ACTIVE / NONE
//
// Registration does NOT:
//
// - assign an IdentityRole;
// - establish MEMBER verification;
// - establish DRIVER verification;
// - create a VerificationRequest;
// - authenticate the user;
// - create a Session;
// - create a Device;
// - issue tokens.
//
// After successful registration, the user proceeds to Sign In.
//
// -----------------------------------------------------------------------------
//
// ARCHITECTURE
//
// This DTO belongs exclusively to the REST/presentation layer.
//
// It contains transport-level primitive values only.
//
// It does NOT depend on:
//
// - domain value objects;
// - aggregates;
// - application commands;
// - domain events;
// - Prisma models.
//
// The controller/application boundary translates this DTO into:
//
//     RegisterUserCommand
//
// The RegisterUserHandler then performs the cross-domain registration
// orchestration.
//
// -----------------------------------------------------------------------------
//
// PASSWORD SECURITY
//
// password is transient credential input.
//
// It MUST NOT:
//
// - be logged;
// - be persisted;
// - be included in domain events;
// - be included in exception messages;
// - be returned in the registration response.
//
// The password is intentionally NOT transformed.
//
// In particular, surrounding whitespace is preserved because whitespace may
// legitimately be part of a password.
//
// -----------------------------------------------------------------------------
//
// TERMS
//
// termsAccepted represents explicit acceptance of the applicable Terms and
// Privacy Policy.
//
// The value must be an actual boolean.
//
// Registration must reject:
//
//     false
//
// and must not silently interpret arbitrary values as acceptance.
//
// -----------------------------------------------------------------------------
//
// VALIDATION
//
// This DTO validates transport-level requirements.
//
// Domain-specific validation remains owned by the appropriate value objects
// and application/security boundaries.
//
// Examples:
//
// - email format/domain semantics → IdentityEmail;
// - phone semantics → IdentityPhoneNumber;
// - password hashing/security policy → PasswordHasher;
// - traveller handle validity → TravellerHandle;
// - country-code domain semantics → CountryCode.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Swagger
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Class Validator
// -----------------------------------------------------------------------------

import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// =============================================================================
// Constants
// =============================================================================

// -----------------------------------------------------------------------------
// Traveller Name
// -----------------------------------------------------------------------------

const MIN_TRAVELLER_NAME_LENGTH = 1;
const MAX_TRAVELLER_NAME_LENGTH = 120;

// -----------------------------------------------------------------------------
// Country Code
// -----------------------------------------------------------------------------

const MIN_COUNTRY_CODE_LENGTH = 2;
const MAX_COUNTRY_CODE_LENGTH = 2;

// -----------------------------------------------------------------------------
// Email
// -----------------------------------------------------------------------------

const MIN_EMAIL_LENGTH = 3;
const MAX_EMAIL_LENGTH = 254;

// -----------------------------------------------------------------------------
// Phone Number
// -----------------------------------------------------------------------------
//
// Transport validation intentionally remains broad.
//
// IdentityPhoneNumber owns the domain-specific phone-number semantics.
//

const MIN_PHONE_NUMBER_LENGTH = 1;
const MAX_PHONE_NUMBER_LENGTH = 32;

// -----------------------------------------------------------------------------
// Password
// -----------------------------------------------------------------------------

const MIN_PASSWORD_LENGTH = 1;
const MAX_PASSWORD_LENGTH = 128;

// =============================================================================
// DTO
// =============================================================================

/**
 * REST request for registering a new sisiMove user account.
 *
 * The DTO contains only client-supplied registration information.
 *
 * It deliberately contains no:
 *
 * - public entity IDs;
 * - role information;
 * - verification information;
 * - password hash;
 * - session information;
 * - authentication tokens;
 * - application correlation metadata.
 */
export class RegisterUserRequestDto {
  // ===========================================================================
  // Traveller Name
  // ===========================================================================

  /**
   * Name used to establish the user's initial TravellerProfile identity.
   *
   * The registration application layer derives the initial persisted
   * TravellerHandle from this value.
   *
   * Example:
   *
   *     Ramadhan Omondi
   *
   * becomes:
   *
   *     ramadhan_omondi
   *
   * The TravellerHandle value object performs final domain validation.
   */
  @ApiProperty({
    example: 'Ramadhan Omondi',
    description: 'Your name.',
    minLength: MIN_TRAVELLER_NAME_LENGTH,
    maxLength: MAX_TRAVELLER_NAME_LENGTH,
  })
  @IsString({
    message: 'travellerName must be a string.',
  })
  @IsNotEmpty({
    message: 'travellerName must not be empty.',
  })
  @MinLength(MIN_TRAVELLER_NAME_LENGTH, {
    message: 'travellerName must not be empty.',
  })
  @MaxLength(MAX_TRAVELLER_NAME_LENGTH, {
    message: `travellerName must not exceed ${MAX_TRAVELLER_NAME_LENGTH} characters.`,
  })
  travellerName!: string;

  // ===========================================================================
  // Country Code
  // ===========================================================================

  /**
   * ISO-style two-character country code associated with the traveller
   * profile.
   *
   * Example:
   *
   *     KE
   *
   * The value is passed to the TravellerProfile application boundary, where
   * the CountryCode value object performs domain validation.
   */
  @ApiProperty({
    example: 'KE',
    description: 'Your two-letter country code.',
    minLength: MIN_COUNTRY_CODE_LENGTH,
    maxLength: MAX_COUNTRY_CODE_LENGTH,
  })
  @IsString({
    message: 'countryCode must be a string.',
  })
  @IsNotEmpty({
    message: 'countryCode must not be empty.',
  })
  @MinLength(MIN_COUNTRY_CODE_LENGTH, {
    message: `countryCode must be ${MIN_COUNTRY_CODE_LENGTH} characters.`,
  })
  @MaxLength(MAX_COUNTRY_CODE_LENGTH, {
    message: `countryCode must be ${MAX_COUNTRY_CODE_LENGTH} characters.`,
  })
  countryCode!: string;

  // ===========================================================================
  // Email
  // ===========================================================================

  /**
   * Email address used to establish the Identity.
   *
   * IdentityEmail remains responsible for domain-level email semantics.
   */
  @ApiProperty({
    example: 'ramah@example.com',
    description: 'Your email address.',
    minLength: MIN_EMAIL_LENGTH,
    maxLength: MAX_EMAIL_LENGTH,
  })
  @IsString({
    message: 'email must be a string.',
  })
  @IsNotEmpty({
    message: 'email must not be empty.',
  })
  @IsEmail(
    {},
    {
      message: 'email must be a valid email address.',
    },
  )
  @MinLength(MIN_EMAIL_LENGTH, {
    message: `email must not be shorter than ${MIN_EMAIL_LENGTH} characters.`,
  })
  @MaxLength(MAX_EMAIL_LENGTH, {
    message: `email must not exceed ${MAX_EMAIL_LENGTH} characters.`,
  })
  email!: string;

  // ===========================================================================
  // Phone Number
  // ===========================================================================

  /**
   * Phone number used to establish the Identity.
   *
   * Transport validation intentionally does not attempt to reproduce the
   * IdentityPhoneNumber domain rules.
   */
  @ApiProperty({
    example: '+254706439548',
    description: 'Your phone number.',
    minLength: MIN_PHONE_NUMBER_LENGTH,
    maxLength: MAX_PHONE_NUMBER_LENGTH,
  })
  @IsString({
    message: 'phoneNumber must be a string.',
  })
  @IsNotEmpty({
    message: 'phoneNumber must not be empty.',
  })
  @MinLength(MIN_PHONE_NUMBER_LENGTH, {
    message: 'phoneNumber must not be empty.',
  })
  @MaxLength(MAX_PHONE_NUMBER_LENGTH, {
    message: `phoneNumber must not exceed ${MAX_PHONE_NUMBER_LENGTH} characters.`,
  })
  phoneNumber!: string;

  // ===========================================================================
  // Password
  // ===========================================================================

  /**
   * Password used to provision Authentication credentials.
   *
   * This value is transient credential input.
   *
   * It must never be persisted, logged, published, returned, or placed into
   * domain events.
   *
   * The value is intentionally not trimmed or otherwise transformed.
   */
  @ApiProperty({
    example: 'correct-horse-battery-staple',
    description: 'Your password.',
    minLength: MIN_PASSWORD_LENGTH,
    maxLength: MAX_PASSWORD_LENGTH,
    writeOnly: true,
  })
  @IsString({
    message: 'password must be a string.',
  })
  @IsNotEmpty({
    message: 'password must not be empty.',
  })
  @MinLength(MIN_PASSWORD_LENGTH, {
    message: 'password must not be empty.',
  })
  @MaxLength(MAX_PASSWORD_LENGTH, {
    message: `password must not exceed ${MAX_PASSWORD_LENGTH} characters.`,
  })
  password!: string;

  // ===========================================================================
  // Terms Acceptance
  // ===========================================================================

  /**
   * Indicates that the user explicitly accepted the applicable Terms and
   * Privacy Policy.
   *
   * Registration requires this value to be true.
   *
   * The RegisterUserHandler performs the application-level prerequisite
   * check.
   */
  @ApiProperty({
    example: true,
    description: 'Whether you accept the sisiMove Terms and Privacy Policy.',
  })
  @IsBoolean({
    message: 'termsAccepted must be a boolean.',
  })
  termsAccepted!: boolean;
}

// =============================================================================
// Exported Constants
// =============================================================================

export {
  MIN_TRAVELLER_NAME_LENGTH as REGISTER_USER_TRAVELLER_NAME_MIN_LENGTH,
  MAX_TRAVELLER_NAME_LENGTH as REGISTER_USER_TRAVELLER_NAME_MAX_LENGTH,
  MIN_COUNTRY_CODE_LENGTH as REGISTER_USER_COUNTRY_CODE_MIN_LENGTH,
  MAX_COUNTRY_CODE_LENGTH as REGISTER_USER_COUNTRY_CODE_MAX_LENGTH,
  MIN_EMAIL_LENGTH as REGISTER_USER_EMAIL_MIN_LENGTH,
  MAX_EMAIL_LENGTH as REGISTER_USER_EMAIL_MAX_LENGTH,
  MIN_PHONE_NUMBER_LENGTH as REGISTER_USER_PHONE_NUMBER_MIN_LENGTH,
  MAX_PHONE_NUMBER_LENGTH as REGISTER_USER_PHONE_NUMBER_MAX_LENGTH,
  MIN_PASSWORD_LENGTH as REGISTER_USER_PASSWORD_MIN_LENGTH,
  MAX_PASSWORD_LENGTH as REGISTER_USER_PASSWORD_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RegisterUserRequestDto;
