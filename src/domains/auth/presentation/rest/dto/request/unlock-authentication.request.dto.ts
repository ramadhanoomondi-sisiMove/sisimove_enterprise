// -----------------------------------------------------------------------------
// Authentication — Unlock Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for unlocking an Authentication.
//
// Aggregate:
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// Lifecycle/security transition:
//
//     LOCKED → ACTIVE
//
// This DTO contains transport-level primitive values only.
//
// The DTO intentionally does NOT import or depend on Authentication domain
// value objects, enums, aggregates, or application commands.
//
// DTO-to-command/domain conversion belongs at the presentation/application
// mapping boundary.
//
// The application mapper is responsible for converting:
//
//     authenticationPublicId → AuthenticationPublicId
//
// before constructing UnlockAuthenticationCommand.
//
// The Authentication aggregate remains responsible for:
//
// - validating that the Authentication is currently locked;
// - transitioning AuthenticationStatus from LOCKED to ACTIVE;
// - clearing the lock state;
// - enforcing domain invariants;
// - recording AuthenticationUnlockedEvent.
//
// This DTO does NOT:
//
// - supply AuthenticationStatus;
// - supply lockedAt;
// - supply lockedUntil;
// - supply lockReason;
// - modify lock state;
// - determine whether unlocking is permitted;
// - validate credentials;
// - hash or compare passwords;
// - determine lock thresholds;
// - determine lock duration;
// - create a Session;
// - create a Device;
// - validate OTPs;
// - perform Identity domain validation;
// - create Recovery records;
// - send notifications;
// - perform external side effects.
//
// Those responsibilities belong to their respective application workflows,
// domain policies, infrastructure services, and aggregate boundaries.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "authenticationPublicId": "ATH-01K3R8Y7Q2",
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

import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

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

const MIN_CORRELATION_ID_LENGTH = 1;
const MAX_CORRELATION_ID_LENGTH = 128;

const MIN_CAUSATION_ID_LENGTH = 1;
const MAX_CAUSATION_ID_LENGTH = 128;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for unlocking an Authentication.
 *
 * Represents the transport-level intent to transition an Authentication
 * aggregate from LOCKED to ACTIVE.
 *
 * Required transport input:
 *
 * - authenticationPublicId;
 * - correlationId.
 *
 * Optional transport input:
 *
 * - causationId.
 *
 * All properties are transport primitives.
 *
 * Domain value objects are created only after this DTO crosses the
 * presentation/application mapping boundary.
 */
export class UnlockAuthenticationRequestDto {
  // ===========================================================================
  // Authentication Public ID
  // ===========================================================================

  /**
   * Public identifier of the Authentication aggregate to unlock.
   *
   * Transport representation:
   *
   * - string
   *
   * Application mapping:
   *
   *     string → AuthenticationPublicId
   *
   * The resulting AuthenticationPublicId is supplied to
   * UnlockAuthenticationCommand.
   *
   * Example:
   *
   * - ATH-01K3R8Y7Q2
   */
  @ApiProperty({
    example: 'ATH-01K3R8Y7Q2',
    description: 'Public identifier of the Authentication aggregate to unlock.',
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
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the complete Authentication unlock operation.
   *
   * Transport representation:
   *
   * - string
   *
   * This value is propagated to AuthenticationUnlockedEvent through the
   * application command.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the Authentication unlock operation and resulting domain events.',
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
   * Optional identifier of the command, domain event, or operation that
   * caused this Authentication unlock request.
   *
   * Transport representation:
   *
   * - string
   *
   * This value is propagated to AuthenticationUnlockedEvent through the
   * application command when supplied.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, domain event, or operation that caused this Authentication unlock request.',
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
  MIN_CORRELATION_ID_LENGTH as AUTHENTICATION_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as AUTHENTICATION_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as AUTHENTICATION_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as AUTHENTICATION_CAUSATION_ID_MAX_LENGTH,
};
