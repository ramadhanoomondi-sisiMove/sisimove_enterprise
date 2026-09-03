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
// This DTO contains transport-level primitive values only.
//
// DTO-to-domain conversion belongs at the presentation/application mapping
// boundary.
//
// The request identifies the Identity aggregate and provides the new email
// address together with the correlation metadata required for the operation.
//
// The application handler loads the IdentityAggregate, converts the transport
// email string into IdentityEmail, invokes:
//
//     identityAggregate.changeEmail(...)
//
// and persists the aggregate.
//
// The aggregate is responsible for:
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
// - supply the email-change timestamp;
// - mutate IdentityEntity directly;
// - construct IdentityEntity;
// - perform email verification;
// - create or revoke authentication credentials;
// - create or revoke sessions;
// - send email;
// - perform notification or integration side effects;
// - emit IdentityEmailChangedEvent directly.
//
// The email-change timestamp is a domain fact determined by IdentityAggregate
// when the email change actually occurs.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "identityPublicId": "IDN-01K3R8Y7Q2",
//       "email": "new.email@example.com",
//       "correlationId": "COR-01K3R8Y7Q2",
//       "causationId": "CMD-01K3R8Y6M4"
//     }
//
// -----------------------------------------------------------------------------
//
// Timestamp ownership:
//
// HTTP DTO
//     │
//     ├── identityPublicId
//     ├── email
//     ├── correlationId
//     └── causationId
//              │
//              ▼
// ChangeIdentityEmailCommand
//              │
//              ▼
// ChangeIdentityEmailHandler
//              │
//              ▼
// IdentityAggregate.changeEmail(email, correlationId)
//              │
//              ├── determines changedAt
//              ├── mutates IdentityEntity
//              └── records IdentityEmailChangedEvent
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Swagger
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Class Transformer
// -----------------------------------------------------------------------------

import { Transform, type TransformFnParams } from 'class-transformer';

// -----------------------------------------------------------------------------
// Class Validator
// -----------------------------------------------------------------------------

import {
  IsEmail,
  IsOptional,
  IsString,
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

const MIN_IDENTITY_PUBLIC_ID_LENGTH = 1;
const MAX_IDENTITY_PUBLIC_ID_LENGTH = 128;

const MIN_EMAIL_LENGTH = 3;
const MAX_EMAIL_LENGTH = 254;

const MIN_CORRELATION_ID_LENGTH = 1;
const MAX_CORRELATION_ID_LENGTH = 128;

const MIN_CAUSATION_ID_LENGTH = 1;
const MAX_CAUSATION_ID_LENGTH = 128;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for changing an Identity's email address.
 *
 * Represents the application-level intent to replace the current email
 * address of an existing Identity aggregate.
 *
 * Required transport input:
 *
 * - identityPublicId;
 * - email;
 * - correlationId.
 *
 * Optional transport input:
 *
 * - causationId.
 *
 * The email-change timestamp is intentionally NOT supplied by the caller.
 * IdentityAggregate determines changedAt when the email change occurs.
 *
 * The following values are intentionally NOT supplied:
 *
 * - IdentityEmail value object;
 * - identity status;
 * - email verification state;
 * - authentication credentials;
 * - sessions;
 * - mutation timestamp;
 * - domain events.
 *
 * Those concerns are handled by the appropriate domain and application
 * boundaries.
 */
export class ChangeIdentityEmailRequestDto {
  // ===========================================================================
  // Identity Public ID
  // ===========================================================================

  /**
   * Public identifier of the Identity aggregate whose email is being changed.
   *
   * This is an opaque public identifier and not a persistence/internal
   * identifier.
   */
  @ApiProperty({
    example: 'IDN-01K3R8Y7Q2',
    description:
      'Opaque public identifier of the Identity aggregate whose email address is being changed.',
    minLength: MIN_IDENTITY_PUBLIC_ID_LENGTH,
    maxLength: MAX_IDENTITY_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'identityPublicId must be a string.',
  })
  @MinLength(MIN_IDENTITY_PUBLIC_ID_LENGTH, {
    message: 'identityPublicId must not be empty.',
  })
  @MaxLength(MAX_IDENTITY_PUBLIC_ID_LENGTH, {
    message: `identityPublicId must not exceed ${MAX_IDENTITY_PUBLIC_ID_LENGTH} characters.`,
  })
  identityPublicId!: string;

  // ===========================================================================
  // Email
  // ===========================================================================

  /**
   * New email address for the Identity.
   *
   * The transport string is converted to the IdentityEmail value object at
   * the presentation/application mapping boundary.
   *
   * Example:
   *
   * - new.email@example.com
   */
  @ApiProperty({
    example: 'new.email@example.com',
    description:
      'New email address for the Identity. The transport string is converted to the IdentityEmail value object at the application boundary.',
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
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the email-change operation.
   *
   * This identifies the end-to-end business operation and is propagated to
   * the resulting IdentityEmailChangedEvent.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the email-change operation and resulting domain event.',
    minLength: MIN_CORRELATION_ID_LENGTH,
    maxLength: MAX_CORRELATION_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'correlationId must be a string.',
  })
  @MinLength(MIN_CORRELATION_ID_LENGTH, {
    message: 'correlationId must not be empty.',
  })
  @MaxLength(MAX_CORRELATION_ID_LENGTH, {
    message: `correlationId must not exceed ${MAX_CORRELATION_ID_LENGTH} characters.`,
  })
  correlationId!: string;

  // ===========================================================================
  // Causation
  // ===========================================================================

  /**
   * Optional identifier of the command, event, or operation that caused this
   * email-change request.
   *
   * When supplied, this value is propagated through the application workflow
   * and associated with the resulting domain event.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, event, or operation that caused this email-change request.',
    nullable: true,
    minLength: MIN_CAUSATION_ID_LENGTH,
    maxLength: MAX_CAUSATION_ID_LENGTH,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString({
    message: 'causationId must be a string.',
  })
  @MinLength(MIN_CAUSATION_ID_LENGTH, {
    message: 'causationId must not be empty.',
  })
  @MaxLength(MAX_CAUSATION_ID_LENGTH, {
    message: `causationId must not exceed ${MAX_CAUSATION_ID_LENGTH} characters.`,
  })
  causationId?: string;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_IDENTITY_PUBLIC_ID_LENGTH as IDENTITY_CHANGE_EMAIL_PUBLIC_ID_MIN_LENGTH,
  MAX_IDENTITY_PUBLIC_ID_LENGTH as IDENTITY_CHANGE_EMAIL_PUBLIC_ID_MAX_LENGTH,
  MIN_EMAIL_LENGTH as IDENTITY_CHANGE_EMAIL_MIN_LENGTH,
  MAX_EMAIL_LENGTH as IDENTITY_CHANGE_EMAIL_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as IDENTITY_CHANGE_EMAIL_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as IDENTITY_CHANGE_EMAIL_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as IDENTITY_CHANGE_EMAIL_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as IDENTITY_CHANGE_EMAIL_CAUSATION_ID_MAX_LENGTH,
};
