// -----------------------------------------------------------------------------
// Authentication — Lock Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for locking an Authentication.
//
// Aggregate:
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// Lifecycle/security transition:
//
//     ACTIVE → LOCKED
//
// This DTO contains transport-level primitive values only.
//
// The DTO intentionally does NOT import or depend on Authentication domain
// value objects.
//
// DTO-to-domain conversion belongs at the presentation/application mapping
// boundary.
//
// The application mapper is responsible for converting:
//
//     authenticationPublicId → AuthenticationPublicId
//     lockedAt               → AuthenticationLockedAt
//     lockedUntil            → AuthenticationLockedUntil
//     reason                 → AuthenticationFailureReason
//
// The command handler/application workflow then supplies those domain-ready
// values to LockAuthenticationCommand.
//
// Lock policy remains outside this DTO. The application/policy layer determines:
//
// - whether the Authentication should be locked;
// - whether the lock is temporary or indefinite;
// - the appropriate lock duration;
// - the appropriate lock reason.
//
// This DTO does NOT:
//
// - set AuthenticationStatus;
// - calculate failed-authentication thresholds;
// - increment failed authentication counts;
// - determine whether locking is permitted;
// - unlock Authentication;
// - verify credentials;
// - compare passwords;
// - create a Session;
// - revoke Sessions;
// - create a Device;
// - validate Identity domain state;
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
//       "lockedAt": "2026-08-31T17:30:00.000Z",
//       "lockedUntil": "2026-08-31T18:30:00.000Z",
//       "reason": "TOO_MANY_ATTEMPTS",
//       "correlationId": "COR-01K3R8Y7Q2",
//       "causationId": "CMD-01K3R8Y6M4"
//     }
//
// Indefinite lock:
//
//     {
//       "authenticationPublicId": "ATH-01K3R8Y7Q2",
//       "lockedAt": "2026-08-31T17:30:00.000Z",
//       "reason": "ACCOUNT_LOCKED",
//       "correlationId": "COR-01K3R8Y7Q2"
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

const MIN_REASON_LENGTH = 1;
const MAX_REASON_LENGTH = 128;

const MIN_CORRELATION_ID_LENGTH = 1;
const MAX_CORRELATION_ID_LENGTH = 128;

const MIN_CAUSATION_ID_LENGTH = 1;
const MAX_CAUSATION_ID_LENGTH = 128;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for locking an Authentication.
 *
 * Represents the transport-level intent to lock an Authentication aggregate.
 *
 * Required transport input:
 *
 * - authenticationPublicId;
 * - lockedAt;
 * - correlationId.
 *
 * Optional transport input:
 *
 * - lockedUntil;
 * - reason;
 * - causationId.
 *
 * All properties are transport primitives.
 *
 * Domain value objects are created only after this DTO crosses the
 * presentation/application mapping boundary.
 */
export class LockAuthenticationRequestDto {
  // ===========================================================================
  // Authentication Public ID
  // ===========================================================================

  /**
   * Public identifier of the Authentication aggregate to lock.
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
    description: 'Public identifier of the Authentication aggregate to lock.',
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
  // Locked At
  // ===========================================================================

  /**
   * Timestamp at which the Authentication is locked.
   *
   * Transport representation:
   *
   * - ISO-8601 date-time string
   *
   * Application mapping:
   *
   *     string → AuthenticationLockedAt
   *
   * Example:
   *
   * - 2026-08-31T17:30:00.000Z
   */
  @ApiProperty({
    example: '2026-08-31T17:30:00.000Z',
    description: 'ISO-8601 timestamp at which the Authentication is locked.',
    format: 'date-time',
  })
  @IsString({
    message: 'lockedAt must be a string.',
  })
  @IsDateString(
    {},
    {
      message: 'lockedAt must be a valid ISO-8601 date-time.',
    },
  )
  lockedAt!: string;

  // ===========================================================================
  // Locked Until
  // ===========================================================================

  /**
   * Optional timestamp until which the Authentication remains locked.
   *
   * Transport representation:
   *
   * - ISO-8601 date-time string
   *
   * Application mapping:
   *
   *     string → AuthenticationLockedUntil
   *
   * When omitted, the lock may be indefinite until explicitly unlocked.
   *
   * Example:
   *
   * - 2026-08-31T18:30:00.000Z
   */
  @ApiPropertyOptional({
    example: '2026-08-31T18:30:00.000Z',
    description:
      'Optional ISO-8601 timestamp until which the Authentication remains locked. When omitted, the lock may be indefinite until explicitly unlocked.',
    format: 'date-time',
    nullable: true,
  })
  @IsOptional()
  @IsString({
    message: 'lockedUntil must be a string.',
  })
  @IsDateString(
    {},
    {
      message: 'lockedUntil must be a valid ISO-8601 date-time.',
    },
  )
  lockedUntil?: string;

  // ===========================================================================
  // Reason
  // ===========================================================================

  /**
   * Optional reason explaining why the Authentication was locked.
   *
   * Transport representation:
   *
   * - string
   *
   * Application mapping:
   *
   *     string → AuthenticationFailureReason
   *
   * The actual set of supported reasons is enforced by the domain value
   * object/application policy rather than by importing domain types into the
   * REST DTO.
   *
   * Examples:
   *
   * - TOO_MANY_ATTEMPTS
   * - ACCOUNT_LOCKED
   * - RATE_LIMITED
   */
  @ApiPropertyOptional({
    example: 'TOO_MANY_ATTEMPTS',
    description:
      'Optional string describing why the Authentication was locked.',
    minLength: MIN_REASON_LENGTH,
    maxLength: MAX_REASON_LENGTH,
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString({
    message: 'reason must be a string.',
  })
  @MinLength(MIN_REASON_LENGTH, {
    message: 'reason must not be empty.',
  })
  @MaxLength(MAX_REASON_LENGTH, {
    message: `reason must not exceed ${MAX_REASON_LENGTH} characters.`,
  })
  reason?: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the complete Authentication lock operation.
   *
   * Transport representation:
   *
   * - string
   *
   * This value is propagated to AuthenticationLockedEvent through the
   * application command.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the Authentication lock operation and resulting domain events.',
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
   * caused this Authentication lock request.
   *
   * Transport representation:
   *
   * - string
   *
   * This value is propagated to AuthenticationLockedEvent through the
   * application command when supplied.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, domain event, or operation that caused this Authentication lock request.',
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
  MIN_REASON_LENGTH as AUTHENTICATION_LOCK_REASON_MIN_LENGTH,
  MAX_REASON_LENGTH as AUTHENTICATION_LOCK_REASON_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as AUTHENTICATION_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as AUTHENTICATION_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as AUTHENTICATION_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as AUTHENTICATION_CAUSATION_ID_MAX_LENGTH,
};
