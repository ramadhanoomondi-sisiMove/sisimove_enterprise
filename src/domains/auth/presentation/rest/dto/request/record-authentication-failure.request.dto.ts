// -----------------------------------------------------------------------------
// Authentication — Record Authentication Failure Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for recording a failed authentication attempt.
//
// Aggregate:
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// This DTO represents the transport-level intent to record the outcome of a
// failed authentication attempt.
//
// Credential verification must already have occurred before this request is
// mapped to RecordAuthenticationFailureCommand.
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
//     count                  → AuthenticationFailureCount
//     failedAt               → AuthenticationLastFailedAt
//     reason                 → AuthenticationFailureReason
//
// before constructing RecordAuthenticationFailureCommand.
//
// Failure-count and lock-threshold policy belong to the authentication
// application/security workflow.
//
// Recording a failure and locking Authentication are separate operations.
//
// If the authentication policy determines that the failure threshold has been
// reached, the application workflow should subsequently execute:
//
//     LockAuthenticationCommand
//
// This DTO does NOT:
//
// - verify credentials;
// - hash passwords;
// - compare passwords;
// - determine whether credentials are valid;
// - determine authentication lock thresholds;
// - perform the lock transition;
// - unlock Authentication;
// - modify AuthenticationStatus;
// - create Sessions;
// - revoke Sessions;
// - create Devices;
// - create Recovery records;
// - create OtpChallenges;
// - validate Identity domain state;
// - send notifications;
// - access Prisma;
// - perform external side effects.
//
// Those responsibilities belong to their respective application workflows,
// security policies, infrastructure services, and aggregate boundaries.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "authenticationPublicId": "ATH-01K3R8Y7Q2",
//       "count": 3,
//       "failedAt": "2026-08-31T17:30:00.000Z",
//       "reason": "INVALID_PASSWORD",
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
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
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

const MIN_FAILURE_COUNT = 1;
const MAX_FAILURE_COUNT = Number.MAX_SAFE_INTEGER;

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
 * REST request for recording a failed authentication attempt.
 *
 * Represents the transport-level outcome of an authentication failure.
 *
 * Required transport input:
 *
 * - authenticationPublicId;
 * - count;
 * - failedAt;
 * - reason;
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
export class RecordAuthenticationFailureRequestDto {
  // ===========================================================================
  // Authentication Public ID
  // ===========================================================================

  /**
   * Public identifier of the Authentication aggregate on which the failed
   * authentication attempt occurred.
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
      'Public identifier of the Authentication aggregate on which the failed authentication attempt occurred.',
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
  // Failure Count
  // ===========================================================================

  /**
   * Failure count after the failed authentication attempt.
   *
   * Transport representation:
   *
   * - integer
   *
   * Application mapping:
   *
   *     number → AuthenticationFailureCount
   *
   * The value is supplied by the application authentication workflow.
   *
   * Example:
   *
   * - 3
   */
  @ApiProperty({
    example: 3,
    description:
      'Authentication failure count after the failed authentication attempt.',
    minimum: MIN_FAILURE_COUNT,
    maximum: MAX_FAILURE_COUNT,
  })
  @IsInt({
    message: 'count must be an integer.',
  })
  @Min(MIN_FAILURE_COUNT, {
    message: `count must be at least ${MIN_FAILURE_COUNT}.`,
  })
  @Max(MAX_FAILURE_COUNT, {
    message: `count must not exceed ${MAX_FAILURE_COUNT}.`,
  })
  count!: number;

  // ===========================================================================
  // Failed At
  // ===========================================================================

  /**
   * Timestamp at which the authentication attempt failed.
   *
   * Transport representation:
   *
   * - ISO-8601 date-time string
   *
   * Application mapping:
   *
   *     string → AuthenticationLastFailedAt
   *
   * Example:
   *
   * - 2026-08-31T17:30:00.000Z
   */
  @ApiProperty({
    example: '2026-08-31T17:30:00.000Z',
    description:
      'ISO-8601 timestamp at which the authentication attempt failed.',
    format: 'date-time',
  })
  @IsString({
    message: 'failedAt must be a string.',
  })
  @IsDateString(
    {},
    {
      message: 'failedAt must be a valid ISO-8601 date-time.',
    },
  )
  failedAt!: string;

  // ===========================================================================
  // Failure Reason
  // ===========================================================================

  /**
   * Reason explaining why authentication failed.
   *
   * Transport representation:
   *
   * - string
   *
   * Application mapping:
   *
   *     string → AuthenticationFailureReason
   *
   * The domain value object remains responsible for validating and representing
   * the supported failure reason.
   *
   * Example:
   *
   * - INVALID_PASSWORD
   */
  @ApiProperty({
    example: 'INVALID_PASSWORD',
    description: 'Reason explaining why the authentication attempt failed.',
    minLength: MIN_REASON_LENGTH,
    maxLength: MAX_REASON_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'reason must be a string.',
  })
  @MinLength(MIN_REASON_LENGTH, {
    message: 'reason must not be empty.',
  })
  @MaxLength(MAX_REASON_LENGTH, {
    message: `reason must not exceed ${MAX_REASON_LENGTH} characters.`,
  })
  reason!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the complete authentication operation.
   *
   * Transport representation:
   *
   * - string
   *
   * This value is propagated to AuthenticationFailedEvent through the
   * application command.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the authentication operation and resulting AuthenticationFailedEvent.',
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
   * caused this authentication failure recording request.
   *
   * Transport representation:
   *
   * - string
   *
   * This value is propagated to AuthenticationFailedEvent through the
   * application command when supplied.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, domain event, or operation that caused this authentication failure recording request.',
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
  MIN_FAILURE_COUNT as AUTHENTICATION_FAILURE_COUNT_MIN,
  MAX_FAILURE_COUNT as AUTHENTICATION_FAILURE_COUNT_MAX,
  MIN_REASON_LENGTH as AUTHENTICATION_FAILURE_REASON_MIN_LENGTH,
  MAX_REASON_LENGTH as AUTHENTICATION_FAILURE_REASON_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as AUTHENTICATION_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as AUTHENTICATION_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as AUTHENTICATION_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as AUTHENTICATION_CAUSATION_ID_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RecordAuthenticationFailureRequestDto;
