// -----------------------------------------------------------------------------
// Identity — Create Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for creating an Identity.
//
// Aggregate:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity[]
//
// Identity represents a user.
//
// This DTO contains transport-level primitive values only.
//
// A newly created Identity:
//
// - starts in PENDING status;
// - has no assigned roles;
// - receives its IdentityPublicId from the domain;
// - receives its lifecycle timestamps from the domain.
//
// The request does NOT supply:
//
// - IdentityPublicId;
// - persistence/internal ID;
// - status;
// - roles;
// - lifecycle timestamps;
// - IdentityType;
// - correlationId;
// - causationId.
//
// Correlation and causation metadata belong to the application/message
// execution context and must not be supplied by the public registration
// payload.
//
// This DTO does NOT:
//
// - create authentication credentials;
// - create a session;
// - create a verification;
// - assign roles;
// - create OTP challenges;
// - send notifications;
// - perform external side effects.
//
// Those concerns belong to their respective application workflows and
// aggregate boundaries.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "email": "user@example.com",
//       "phoneNumber": "+254712345678"
//     }
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

import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_EMAIL_LENGTH = 3;
const MAX_EMAIL_LENGTH = 254;

const MIN_PHONE_NUMBER_LENGTH = 7;
const MAX_PHONE_NUMBER_LENGTH = 20;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for creating an Identity.
 *
 * Represents the public application intent to create a new user Identity.
 *
 * Required transport input:
 *
 * - email;
 * - phoneNumber.
 *
 * The following values are intentionally NOT supplied by the client:
 *
 * - identity public ID;
 * - persistence/internal ID;
 * - identity status;
 * - roles;
 * - lifecycle timestamps;
 * - identity type;
 * - correlation ID;
 * - causation ID.
 *
 * Those values are established by the domain or application execution
 * context.
 */
export class CreateIdentityRequestDto {
  // ===========================================================================
  // Email
  // ===========================================================================

  /**
   * Email address associated with the user Identity.
   *
   * The transport string is converted to the IdentityEmail value object at
   * the presentation/application mapping boundary.
   *
   * Example:
   *
   * - user@example.com
   */
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address associated with the user Identity.',
    minLength: MIN_EMAIL_LENGTH,
    maxLength: MAX_EMAIL_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'email must be a string.',
  })
  @MinLength(MIN_EMAIL_LENGTH, {
    message: `email must be at least ${MIN_EMAIL_LENGTH} characters.`,
  })
  @MaxLength(MAX_EMAIL_LENGTH, {
    message: `email must not exceed ${MAX_EMAIL_LENGTH} characters.`,
  })
  @IsEmail(
    {},
    {
      message: 'email must be a valid email address.',
    },
  )
  email!: string;

  // ===========================================================================
  // Phone Number
  // ===========================================================================

  /**
   * Phone number associated with the user Identity.
   *
   * The transport string is converted to the IdentityPhoneNumber value object
   * at the presentation/application mapping boundary.
   *
   * The expected representation is an international E.164 phone number.
   *
   * Example:
   *
   * - +254712345678
   */
  @ApiProperty({
    example: '+254712345678',
    description:
      'International phone number associated with the user Identity.',
    minLength: MIN_PHONE_NUMBER_LENGTH,
    maxLength: MAX_PHONE_NUMBER_LENGTH,
    pattern: '^\\+[1-9]\\d{6,19}$',
  })
  @Transform(trimString)
  @IsString({
    message: 'phoneNumber must be a string.',
  })
  @MinLength(MIN_PHONE_NUMBER_LENGTH, {
    message: `phoneNumber must be at least ${MIN_PHONE_NUMBER_LENGTH} characters.`,
  })
  @MaxLength(MAX_PHONE_NUMBER_LENGTH, {
    message: `phoneNumber must not exceed ${MAX_PHONE_NUMBER_LENGTH} characters.`,
  })
  @Matches(/^\+[1-9]\d{6,19}$/, {
    message:
      'phoneNumber must be a valid international phone number in E.164 format.',
  })
  phoneNumber!: string;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_EMAIL_LENGTH as IDENTITY_EMAIL_MIN_LENGTH,
  MAX_EMAIL_LENGTH as IDENTITY_EMAIL_MAX_LENGTH,
  MIN_PHONE_NUMBER_LENGTH as IDENTITY_PHONE_NUMBER_MIN_LENGTH,
  MAX_PHONE_NUMBER_LENGTH as IDENTITY_PHONE_NUMBER_MAX_LENGTH,
};
