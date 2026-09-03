// -----------------------------------------------------------------------------
// Authentication — Disable Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for disabling an Authentication.
//
// Aggregate:
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// Lifecycle/security transition:
//
//     PENDING / ACTIVE / LOCKED → DISABLED
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
//     reason                → AuthenticationFailureReason
//
// before constructing DisableAuthenticationCommand.
//
// The decision to disable an Authentication may originate from an application
// workflow, administrative operation, security policy, or another authorized
// process.
//
// Authorization does NOT belong to this DTO.
//
// This DTO does NOT:
//
// - set AuthenticationStatus;
// - determine whether disabling is permitted;
// - modify the Authentication aggregate;
// - validate credentials;
// - hash or compare passwords;
// - determine authentication lock thresholds;
// - lock Authentication;
// - unlock Authentication;
// - create a Session;
// - revoke Sessions;
// - create a Device;
// - validate OTPs;
// - perform Identity domain validation;
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
//       "reason": "ACCOUNT_DISABLED",
//       "correlationId": "COR-01K3R8Y7Q2",
//       "causationId": "CMD-01K3R8Y6M4"
//     }
//
// Without a reason:
//
//     {
//       "authenticationPublicId": "ATH-01K3R8Y7Q2",
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
 * REST request for disabling an Authentication.
 *
 * Represents the transport-level intent to transition an Authentication
 * aggregate into the DISABLED state.
 *
 * Required transport input:
 *
 * - authenticationPublicId;
 * - correlationId.
 *
 * Optional transport input:
 *
 * - reason;
 * - causationId.
 *
 * All properties are transport primitives.
 *
 * Domain value objects are created only after this DTO crosses the
 * presentation/application mapping boundary.
 */
export class DisableAuthenticationRequestDto {
  // ===========================================================================
  // Authentication Public ID
  // ===========================================================================

  /**
   * Public identifier of the Authentication aggregate to disable.
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
      'Public identifier of the Authentication aggregate to disable.',
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
  // Disable Reason
  // ===========================================================================

  /**
   * Optional reason explaining why the Authentication was disabled.
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
   * the actual failure/disable reason.
   *
   * Examples:
   *
   * - ACCOUNT_DISABLED
   * - SECURITY_POLICY
   * - ADMINISTRATIVE_ACTION
   */
  @ApiPropertyOptional({
    example: 'ACCOUNT_DISABLED',
    description:
      'Optional reason explaining why the Authentication was disabled.',
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
   * Correlation identifier for the complete Authentication disable operation.
   *
   * Transport representation:
   *
   * - string
   *
   * This value is propagated to AuthenticationDisabledEvent through the
   * application command.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the Authentication disable operation and resulting domain events.',
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
   * caused this Authentication disable request.
   *
   * Transport representation:
   *
   * - string
   *
   * This value is propagated to AuthenticationDisabledEvent through the
   * application command when supplied.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, domain event, or operation that caused this Authentication disable request.',
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
  MIN_REASON_LENGTH as AUTHENTICATION_DISABLE_REASON_MIN_LENGTH,
  MAX_REASON_LENGTH as AUTHENTICATION_DISABLE_REASON_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as AUTHENTICATION_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as AUTHENTICATION_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as AUTHENTICATION_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as AUTHENTICATION_CAUSATION_ID_MAX_LENGTH,
};
