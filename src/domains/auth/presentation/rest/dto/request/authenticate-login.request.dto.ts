// -----------------------------------------------------------------------------
// Authentication — Authenticate Login Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for the complete SisiMove user login workflow.
//
// User-facing login contract:
//
//     emailOrPhoneNumber + password
//
// Example:
//
//     {
//       "emailOrPhoneNumber": "ramah@example.com",
//       "password": "correct-horse-battery-staple"
//     }
//
// -----------------------------------------------------------------------------
//
// Client input:
//
// - emailOrPhoneNumber;
// - password.
//
// The client provides only the information required to authenticate.
//
// Device and session metadata are technical request context. They should be
// obtained by the application/presentation layer rather than requiring the
// user to manually enter them.
//
// The application workflow internally resolves:
//
// - Identity;
// - Authentication;
// - Device;
// - Session;
// - refresh token;
// - access token.
//
// The client does NOT provide:
//
// - identityPublicId;
// - authenticationPublicId;
// - devicePublicId;
// - sessionPublicId;
// - tokenFamilyPublicId;
// - refreshToken;
// - refreshTokenHash;
// - accessToken;
// - correlationId;
// - causationId.
//
// -----------------------------------------------------------------------------
//
// Architecture:
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
// - persistence models.
//
// The controller/application layer is responsible for translating these
// primitive values into the appropriate application command and value objects.
//
// -----------------------------------------------------------------------------
//
// Security:
//
// The password is transient credential input.
//
// It MUST NOT:
//
// - be logged;
// - be persisted;
// - be included in domain events;
// - be included in exception messages;
// - be stored on AuthenticationEntity.
//
// The password is intentionally NOT transformed.
//
// In particular, surrounding whitespace is preserved because whitespace may
// legitimately be part of a password.
//
// The login identifier IS trimmed because accidental surrounding whitespace
// should not cause a valid identifier to fail authentication.
//
// -----------------------------------------------------------------------------
//
// Validation:
//
// This DTO validates transport-level requirements only:
//
// - emailOrPhoneNumber must be a non-empty string;
// - emailOrPhoneNumber must not exceed the transport limit;
// - password must be a non-empty string;
// - password must not exceed the transport limit.
//
// Authentication credential policy belongs to the authentication
// application/security layer.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Swagger
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Class Transformer
// -----------------------------------------------------------------------------

import { Transform, type TransformFnParams } from 'class-transformer';

// -----------------------------------------------------------------------------
// Class Validator
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
 * Trims surrounding whitespace from the login identifier.
 *
 * The password is intentionally not transformed.
 */
const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_EMAIL_OR_PHONE_NUMBER_LENGTH = 1;
const MAX_EMAIL_OR_PHONE_NUMBER_LENGTH = 254;

const MIN_PASSWORD_LENGTH = 1;
const MAX_PASSWORD_LENGTH = 128;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for authenticating a SisiMove user.
 *
 * The user provides only:
 *
 * - emailOrPhoneNumber;
 * - password.
 *
 * Technical device and session information is intentionally excluded from the
 * public login contract.
 */
export class AuthenticateLoginRequestDto {
  // ===========================================================================
  // Email / Phone Number
  // ===========================================================================

  /**
   * Email address or phone number used to identify the user.
   *
   * Examples:
   *
   *     ramah@example.com
   *
   *     +254706439548
   */
  @ApiProperty({
    example: 'ramah@example.com',
    description: 'Your email address or phone number.',
    minLength: MIN_EMAIL_OR_PHONE_NUMBER_LENGTH,
    maxLength: MAX_EMAIL_OR_PHONE_NUMBER_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'emailOrPhoneNumber must be a string.',
  })
  @IsNotEmpty({
    message: 'emailOrPhoneNumber must not be empty.',
  })
  @MinLength(MIN_EMAIL_OR_PHONE_NUMBER_LENGTH, {
    message: 'emailOrPhoneNumber must not be empty.',
  })
  @MaxLength(MAX_EMAIL_OR_PHONE_NUMBER_LENGTH, {
    message: `emailOrPhoneNumber must not exceed ${MAX_EMAIL_OR_PHONE_NUMBER_LENGTH} characters.`,
  })
  emailOrPhoneNumber!: string;

  // ===========================================================================
  // Password
  // ===========================================================================

  /**
   * Password used to authenticate the user.
   *
   * This value is transient credential input.
   *
   * It must never be persisted, logged, published, or exposed through
   * exceptions or domain events.
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
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_EMAIL_OR_PHONE_NUMBER_LENGTH as AUTHENTICATION_LOGIN_EMAIL_OR_PHONE_MIN_LENGTH,
  MAX_EMAIL_OR_PHONE_NUMBER_LENGTH as AUTHENTICATION_LOGIN_EMAIL_OR_PHONE_MAX_LENGTH,
  MIN_PASSWORD_LENGTH as AUTHENTICATION_LOGIN_PASSWORD_MIN_LENGTH,
  MAX_PASSWORD_LENGTH as AUTHENTICATION_LOGIN_PASSWORD_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AuthenticateLoginRequestDto;
