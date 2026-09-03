// -----------------------------------------------------------------------------
// Verification — Expire Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for expiring a Verification aggregate.
//
// Aggregate:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity[]
//
// This DTO represents the transport-level intent to transition a VERIFIED
// Verification into the EXPIRED lifecycle state.
//
// The application handler resolves the VerificationAggregate and invokes:
//
//     verificationAggregate.expire(...)
//
// The aggregate is responsible for:
//
// - validating the supplied timestamp;
// - validating that the Verification is currently VERIFIED;
// - validating that an expiration timestamp exists;
// - transitioning the Verification lifecycle to EXPIRED;
// - recording VerificationExpiredEvent.
//
// This DTO does NOT:
//
// - mutate VerificationEntity directly;
// - mutate VerificationRequestEntity directly;
// - construct entities;
// - modify verification evidence;
// - reject or cancel verification requests;
// - revoke authentication sessions;
// - modify Identity;
// - send notifications;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// Expected lifecycle:
//
// VERIFIED ───────► EXPIRED
//
// EXPIRED is not directly terminal.
//
// An EXPIRED Verification may subsequently be renewed:
//
// EXPIRED ────────► PENDING
//
// through:
//
//     verificationAggregate.renew(...)
//
// -----------------------------------------------------------------------------
//
// Expiration semantics:
//
// `expiresAt` is the expiration timestamp previously established by the
// Verification aggregate.
//
// `expiredAt` is the timestamp at which the expiration transition is applied.
//
// This request does not calculate or modify `expiresAt`.
//
// -----------------------------------------------------------------------------
//
// Correlation:
//
// `correlationId` identifies the command execution.
//
// `causationId`, when supplied, identifies the command, event, or operation
// that caused this expiration request.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "identityPublicId": "IDN-01K3R8Y7Q2",
//       "correlationId": "COR-01K3R8Y9P6",
//       "causationId": "CMD-01K3R8Y6M4",
//       "expiredAt": "2026-08-28T13:30:00.000Z"
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

const MIN_CORRELATION_ID_LENGTH = 1;
const MAX_CORRELATION_ID_LENGTH = 128;

const MIN_CAUSATION_ID_LENGTH = 1;
const MAX_CAUSATION_ID_LENGTH = 128;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for expiring a Verification aggregate.
 *
 * Represents the application-level intent to transition a VERIFIED
 * Verification into EXPIRED.
 *
 * Required transport input:
 *
 * - identityPublicId;
 * - correlationId.
 *
 * Optional transport input:
 *
 * - causationId;
 * - expiredAt.
 *
 * The following values are intentionally NOT supplied:
 *
 * - Verification status;
 * - expiresAt;
 * - verification level;
 * - VerificationRequest state;
 * - domain events;
 * - persistence/internal identifiers.
 *
 * Those values are established and validated by the application and domain
 * boundaries.
 */
export class ExpireVerificationRequestDto {
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
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the expiration operation.
   *
   * This identifies the application-level operation and is propagated to
   * the resulting domain event.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y9P6',
    description:
      'Correlation identifier for the expiration operation and resulting domain event.',
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
   * expiration request.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, event, or operation that caused this expiration request.',
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
  // Expired At
  // ===========================================================================

  /**
   * Optional timestamp at which the Verification expiration is applied.
   *
   * When omitted, the application handler/aggregate uses the current time.
   *
   * This value represents the actual expiration transition timestamp. It does
   * not replace or modify the Verification's existing `expiresAt` value.
   *
   * The transport representation is an ISO 8601 date-time string and is
   * converted to a Date at the DTO transformation boundary.
   */
  @ApiPropertyOptional({
    example: '2026-08-28T13:30:00.000Z',
    description:
      'Optional ISO 8601 timestamp at which the Verification expiration is applied. This does not modify the existing expiresAt value.',
    format: 'date-time',
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsISO8601(
    {},
    {
      message: 'expiredAt must be a valid ISO 8601 date-time.',
    },
  )
  @Type(() => Date)
  @IsDate({
    message: 'expiredAt must be a valid date.',
  })
  expiredAt?: Date;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_PUBLIC_ID_LENGTH as VERIFICATION_EXPIRE_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as VERIFICATION_EXPIRE_PUBLIC_ID_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as VERIFICATION_EXPIRE_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as VERIFICATION_EXPIRE_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as VERIFICATION_EXPIRE_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as VERIFICATION_EXPIRE_CAUSATION_ID_MAX_LENGTH,
};
