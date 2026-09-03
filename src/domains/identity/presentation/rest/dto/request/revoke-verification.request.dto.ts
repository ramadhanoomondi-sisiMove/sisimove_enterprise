// -----------------------------------------------------------------------------
// Verification — Revoke Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for revoking a Verification aggregate.
//
// Aggregate:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity[]
//
// This DTO represents the transport-level intent to transition a Verification
// into the terminal REVOKED lifecycle state.
//
// The application handler resolves the VerificationAggregate and invokes:
//
//     verificationAggregate.revoke(...)
//
// The aggregate is responsible for:
//
// - validating the revoking Identity;
// - validating the revocation reason;
// - validating the revocation timestamp;
// - enforcing Verification lifecycle rules;
// - transitioning the Verification to REVOKED;
// - recording VerificationRevokedEvent.
//
// This DTO does NOT:
//
// - mutate VerificationEntity directly;
// - mutate VerificationRequestEntity directly;
// - construct entities;
// - reject or expire VerificationRequests;
// - modify Identity state;
// - modify Identity roles;
// - revoke authentication credentials;
// - terminate sessions;
// - send notifications;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// Expected lifecycle:
//
// VERIFIED ───────► REVOKED
//
// REVOKED is terminal.
//
// The aggregate determines whether the current Verification state is eligible
// for revocation.
//
// -----------------------------------------------------------------------------
//
// Reviewer / Revoker:
//
// `revokedByPublicId` identifies the Identity that performed the revocation.
//
// This is an opaque public identifier. The request does not resolve or mutate
// the referenced Identity aggregate.
//
// -----------------------------------------------------------------------------
//
// Revocation reason:
//
// `reason` describes why the Verification was revoked.
//
// The aggregate validates and normalizes this value before applying the
// lifecycle transition.
//
// -----------------------------------------------------------------------------
//
// Correlation:
//
// `correlationId` identifies the revocation operation.
//
// `causationId`, when supplied, identifies the command, event, or operation
// that caused this revocation request.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "identityPublicId": "IDN-01K3R8Y7Q2",
//       "revokedByPublicId": "IDN-01K3R8Y9P6",
//       "reason": "Verification evidence is no longer valid.",
//       "correlationId": "COR-01K3R8Z1M4",
//       "causationId": "CMD-01K3R8Y6M4",
//       "revokedAt": "2026-08-28T13:30:00.000Z"
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

import { Transform, Type, type TransformFnParams } from 'class-transformer';

// -----------------------------------------------------------------------------
// Class Validator
// -----------------------------------------------------------------------------

import {
  IsDate,
  IsISO8601,
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

const MIN_PUBLIC_ID_LENGTH = 1;
const MAX_PUBLIC_ID_LENGTH = 128;

const MIN_REASON_LENGTH = 1;
const MAX_REASON_LENGTH = 1000;

const MIN_CORRELATION_ID_LENGTH = 1;
const MAX_CORRELATION_ID_LENGTH = 128;

const MIN_CAUSATION_ID_LENGTH = 1;
const MAX_CAUSATION_ID_LENGTH = 128;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for revoking a Verification aggregate.
 *
 * Represents the application-level intent to transition an eligible
 * Verification into the terminal REVOKED lifecycle state.
 *
 * Required transport input:
 *
 * - identityPublicId;
 * - revokedByPublicId;
 * - reason;
 * - correlationId.
 *
 * Optional transport input:
 *
 * - causationId;
 * - revokedAt.
 *
 * The following values are intentionally NOT supplied:
 *
 * - Verification status;
 * - Verification level;
 * - VerificationRequest state;
 * - VerificationRequest evidence;
 * - domain events;
 * - persistence/internal identifiers.
 *
 * Those values are determined and validated by the application and domain
 * boundaries.
 */
export class RevokeVerificationRequestDto {
  // ===========================================================================
  // Identity Public ID
  // ===========================================================================

  /**
   * Public identifier of the Identity that owns the Verification aggregate.
   *
   * This is an opaque cross-aggregate public identifier and not a
   * persistence/internal database identifier.
   */
  @ApiProperty({
    example: 'IDN-01K3R8Y7Q2',
    description:
      'Opaque public identifier of the Identity that owns the Verification aggregate.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'identityPublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'identityPublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `identityPublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  identityPublicId!: string;

  // ===========================================================================
  // Revoked By Public ID
  // ===========================================================================

  /**
   * Public identifier of the Identity that performed the revocation.
   *
   * This is an opaque public identifier for the actor responsible for the
   * verification revocation.
   */
  @ApiProperty({
    example: 'IDN-01K3R8Y9P6',
    description:
      'Opaque public identifier of the Identity that performed the verification revocation.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'revokedByPublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'revokedByPublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `revokedByPublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  revokedByPublicId!: string;

  // ===========================================================================
  // Reason
  // ===========================================================================

  /**
   * Business reason for revoking the Verification.
   *
   * The aggregate remains responsible for applying any additional domain
   * normalization or business validation.
   */
  @ApiProperty({
    example: 'Verification evidence is no longer valid.',
    description:
      'Business reason for revoking the Verification. The aggregate performs final domain validation and normalization.',
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
   * Correlation identifier for the revocation operation.
   *
   * This identifies the application-level operation and is propagated to
   * resulting domain events.
   */
  @ApiProperty({
    example: 'COR-01K3R8Z1M4',
    description:
      'Correlation identifier for the revocation operation and resulting domain event.',
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
   * revocation request.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, event, or operation that caused this revocation request.',
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

  // ===========================================================================
  // Revoked At
  // ===========================================================================

  /**
   * Optional timestamp at which the Verification revocation is applied.
   *
   * When omitted, the application handler/aggregate uses the current time.
   *
   * The transport representation is an ISO 8601 date-time string and is
   * converted to a Date at the DTO transformation boundary.
   */
  @ApiPropertyOptional({
    example: '2026-08-28T13:30:00.000Z',
    description:
      'Optional ISO 8601 timestamp at which the Verification revocation is applied. When omitted, the current time is used.',
    format: 'date-time',
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsISO8601(
    {},
    {
      message: 'revokedAt must be a valid ISO 8601 date-time.',
    },
  )
  @Type(() => Date)
  @IsDate({
    message: 'revokedAt must be a valid date.',
  })
  revokedAt?: Date;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_PUBLIC_ID_LENGTH as VERIFICATION_REVOKE_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as VERIFICATION_REVOKE_PUBLIC_ID_MAX_LENGTH,
  MIN_REASON_LENGTH as VERIFICATION_REVOKE_REASON_MIN_LENGTH,
  MAX_REASON_LENGTH as VERIFICATION_REVOKE_REASON_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as VERIFICATION_REVOKE_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as VERIFICATION_REVOKE_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as VERIFICATION_REVOKE_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as VERIFICATION_REVOKE_CAUSATION_ID_MAX_LENGTH,
};
