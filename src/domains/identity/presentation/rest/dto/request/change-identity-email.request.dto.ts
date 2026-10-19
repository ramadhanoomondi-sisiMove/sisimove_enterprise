// -----------------------------------------------------------------------------
// Identity — Change Email Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for changing the email address of an Identity.
//
// Aggregate:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity[]
//
// TRANSPORT BOUNDARY
//
// Route:
//
//     PATCH /identities/:identityPublicId/email
//
// Request body:
//
//     {
//       "email": "new.email@example.com"
//     }
//
// The application layer establishes:
//
// - identityPublicId from the validated route parameter;
// - correlationId from the established request-correlation context;
// - causationId from the existing command/event context, when available.
//
// These application-owned values are not required in the HTTP request body.
//
// The application handler converts the transport email string into
// IdentityEmail, loads the IdentityAggregate, invokes:
//
//     identityAggregate.changeEmail(email, correlationId)
//
// and persists the aggregate.
//
// The aggregate remains responsible for:
//
// - validating the Identity lifecycle state;
// - validating the email through IdentityEmail;
// - determining whether the email actually changed;
// - determining the email-change timestamp;
// - changing the Identity email;
// - recording IdentityEmailChangedEvent.
//
// Email verification, authentication consequences, notifications, and other
// downstream behavior remain outside this aggregate.
//
// This DTO does NOT:
//
// - construct or mutate IdentityEntity;
// - construct IdentityEmail;
// - identify the aggregate independently of the route;
// - generate correlation or causation identifiers;
// - supply domain timestamps;
// - perform email verification;
// - create or revoke authentication credentials;
// - create or revoke sessions;
// - send email or notifications;
// - emit domain events directly;
// - perform external side effects.
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

import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

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

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for changing an Identity's email address.
 *
 * Required transport input:
 *
 * - email.
 *
 * The Identity is identified by the route parameter:
 *
 *     :identityPublicId
 *
 * The following values are intentionally NOT supplied by the HTTP client:
 *
 * - identityPublicId;
 * - correlationId;
 * - causationId;
 * - email-change timestamp;
 * - Identity status;
 * - email verification state;
 * - authentication credentials;
 * - sessions;
 * - aggregate state;
 * - domain events.
 *
 * The controller/application boundary obtains the route identifier and
 * established request metadata, then constructs the application command.
 *
 * IdentityAggregate remains authoritative for lifecycle rules and the
 * actual email-change transition.
 */
export class ChangeIdentityEmailRequestDto {
  // ===========================================================================
  // Email
  // ===========================================================================

  /**
   * New email address for the Identity.
   *
   * The transport string is converted to the IdentityEmail value object
   * at the presentation/application mapping boundary.
   *
   * Example:
   *
   *     new.email@example.com
   */
  @ApiProperty({
    example: 'new.email@example.com',
    description:
      'New email address for the Identity. The Identity is identified by the route parameter; correlation metadata is established by the application.',
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
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_EMAIL_LENGTH as IDENTITY_CHANGE_EMAIL_MIN_LENGTH,
  MAX_EMAIL_LENGTH as IDENTITY_CHANGE_EMAIL_MAX_LENGTH,
};
