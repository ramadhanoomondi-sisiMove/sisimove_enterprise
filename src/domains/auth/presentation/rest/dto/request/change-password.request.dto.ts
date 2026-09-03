// -----------------------------------------------------------------------------
// Authentication — Change Password Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for changing an Authentication password.
//
// Aggregate:
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// This DTO contains transport-level primitive values only.
//
// The request accepts the new plaintext password because password hashing is
// an application/infrastructure concern.
//
// The application workflow is responsible for:
//
//     plaintext password
//             │
//             ▼
//        PasswordHasher
//             │
//             ▼
//     AuthenticationPasswordHash
//             │
//             ▼
//     ChangePasswordCommand
//
// The DTO intentionally does NOT import or depend on Authentication domain
// value objects, aggregates, or application commands.
//
// DTO-to-command/domain conversion belongs at the presentation/application
// mapping boundary.
//
// The application mapper/workflow is responsible for:
//
//     authenticationPublicId → AuthenticationPublicId
//     newPassword            → PasswordHasher
//     hashed password        → AuthenticationPasswordHash
//     changedAt              → AuthenticationPasswordChangedAt
//
// Password version is intentionally NOT supplied by the REST request.
// The application handler derives the next password version from the
// Authentication aggregate.
//
// IMPORTANT:
//
// - plaintext passwords MUST NOT be logged;
// - plaintext passwords MUST NOT be persisted;
// - plaintext passwords MUST NOT be included in domain events;
// - plaintext passwords MUST NOT be stored on AuthenticationEntity;
// - password hashing MUST occur before ChangePasswordCommand is constructed.
//
// This DTO does NOT:
//
// - hash passwords;
// - compare passwords;
// - modify Authentication;
// - determine password version;
// - create Sessions;
// - create Devices;
// - validate Identity domain state;
// - send notifications;
// - perform external side effects.
//
// Those responsibilities belong to the appropriate application workflow,
// security infrastructure, policies, and aggregate boundaries.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "authenticationPublicId": "ATH-01K3R8Y7Q2",
//       "password": "new-secure-password",
//       "changedAt": "2026-08-31T17:30:00.000Z",
//       "correlationId": "COR-01K3R8Y7Q2",
//       "causationId": "CMD-01K3R8Y6M4"
//     }
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
  IsDateString,
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

const MIN_AUTHENTICATION_PUBLIC_ID_LENGTH = 1;
const MAX_AUTHENTICATION_PUBLIC_ID_LENGTH = 128;

const MIN_PASSWORD_LENGTH = 1;
const MAX_PASSWORD_LENGTH = 128;

const MIN_CORRELATION_ID_LENGTH = 1;
const MAX_CORRELATION_ID_LENGTH = 128;

const MIN_CAUSATION_ID_LENGTH = 1;
const MAX_CAUSATION_ID_LENGTH = 128;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for changing an Authentication password.
 *
 * Represents the transport-level intent to replace the current password
 * credential.
 *
 * Required transport input:
 *
 * - authenticationPublicId;
 * - password;
 * - changedAt;
 * - correlationId.
 *
 * Optional transport input:
 *
 * - causationId.
 *
 * All properties are transport primitives.
 *
 * The supplied password remains plaintext only within the transient
 * application workflow and is hashed before ChangePasswordCommand is created.
 */
export class ChangePasswordRequestDto {
  // ===========================================================================
  // Authentication Public ID
  // ===========================================================================

  /**
   * Public identifier of the Authentication aggregate whose password is being
   * changed.
   *
   * Transport representation:
   *
   * - string
   *
   * Application mapping:
   *
   *     string → AuthenticationPublicId
   *
   * Example:
   *
   * - ATH-01K3R8Y7Q2
   */
  @ApiProperty({
    example: 'ATH-01K3R8Y7Q2',
    description:
      'Public identifier of the Authentication aggregate whose password is being changed.',
    minLength: MIN_AUTHENTICATION_PUBLIC_ID_LENGTH,
    maxLength: MAX_AUTHENTICATION_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'authenticationPublicId must be a string.',
  })
  @MinLength(MIN_AUTHENTICATION_PUBLIC_ID_LENGTH, {
    message: 'authenticationPublicId must not be empty.',
  })
  @MaxLength(MAX_AUTHENTICATION_PUBLIC_ID_LENGTH, {
    message: `authenticationPublicId must not exceed ${MAX_AUTHENTICATION_PUBLIC_ID_LENGTH} characters.`,
  })
  authenticationPublicId!: string;

  // ===========================================================================
  // New Password
  // ===========================================================================

  /**
   * New plaintext password supplied by the caller.
   *
   * Transport representation:
   *
   * - string
   *
   * The password is intentionally accepted as plaintext at the REST boundary
   * because it must be hashed by PasswordHasher infrastructure before the
   * ChangePasswordCommand is constructed.
   *
   * IMPORTANT:
   *
   * This value must never be:
   *
   * - logged;
   * - persisted;
   * - included in a domain event;
   * - stored on AuthenticationEntity.
   *
   * Do not trim the password. Whitespace may legitimately be part of a
   * password and must be preserved exactly as supplied.
   *
   * Example:
   *
   * - NewSecurePassword123!
   */
  @ApiProperty({
    example: 'NewSecurePassword123!',
    description:
      'New plaintext password. It is hashed by PasswordHasher infrastructure before the ChangePasswordCommand is created.',
    minLength: MIN_PASSWORD_LENGTH,
    maxLength: MAX_PASSWORD_LENGTH,
    writeOnly: true,
  })
  @IsString({
    message: 'password must be a string.',
  })
  @MinLength(MIN_PASSWORD_LENGTH, {
    message: 'password must not be empty.',
  })
  @MaxLength(MAX_PASSWORD_LENGTH, {
    message: `password must not exceed ${MAX_PASSWORD_LENGTH} characters.`,
  })
  password!: string;

  // ===========================================================================
  // Changed At
  // ===========================================================================

  /**
   * Timestamp at which the password change becomes effective.
   *
   * Transport representation:
   *
   * - ISO-8601 date-time string
   *
   * Application mapping:
   *
   *     string → AuthenticationPasswordChangedAt
   *
   * Example:
   *
   * - 2026-08-31T17:30:00.000Z
   */
  @ApiProperty({
    example: '2026-08-31T17:30:00.000Z',
    description:
      'ISO-8601 timestamp at which the password change becomes effective.',
    format: 'date-time',
  })
  @IsString({
    message: 'changedAt must be a string.',
  })
  @IsDateString(
    {},
    {
      message: 'changedAt must be a valid ISO-8601 date-time.',
    },
  )
  changedAt!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the complete password-change operation.
   *
   * Transport representation:
   *
   * - string
   *
   * This value is propagated to the resulting password-change domain event
   * through ChangePasswordCommand.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the password-change operation and resulting domain events.',
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
   * Optional identifier of the command, domain event, or operation that caused
   * this password-change request.
   *
   * Transport representation:
   *
   * - string
   *
   * This value is propagated to the resulting domain event through the
   * application command when supplied.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, domain event, or operation that caused this password-change request.',
    minLength: MIN_CAUSATION_ID_LENGTH,
    maxLength: MAX_CAUSATION_ID_LENGTH,
    nullable: true,
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
  MIN_AUTHENTICATION_PUBLIC_ID_LENGTH as AUTHENTICATION_PUBLIC_ID_MIN_LENGTH,
  MAX_AUTHENTICATION_PUBLIC_ID_LENGTH as AUTHENTICATION_PUBLIC_ID_MAX_LENGTH,
  MIN_PASSWORD_LENGTH as AUTHENTICATION_PASSWORD_MIN_LENGTH,
  MAX_PASSWORD_LENGTH as AUTHENTICATION_PASSWORD_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as AUTHENTICATION_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as AUTHENTICATION_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as AUTHENTICATION_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as AUTHENTICATION_CAUSATION_ID_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ChangePasswordRequestDto;
