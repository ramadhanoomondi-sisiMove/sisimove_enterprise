// -----------------------------------------------------------------------------
// Session — Revoke Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for revoking a Session.
//
// Aggregate:
//
// SessionAggregate
// └── SessionEntity
//
// This DTO contains transport-level primitive values only.
//
// The DTO intentionally does NOT import or depend on:
//
// - SessionPublicId;
// - SessionRevokedAt;
// - SessionRevocationReason;
// - RevokeSessionCommand;
// - SessionAggregate;
// - SessionEntity.
//
// DTO-to-command/domain conversion belongs at the presentation/application
// mapping boundary.
//
// The application mapper is responsible for converting:
//
//     sessionPublicId → SessionPublicId
//     revokedAt       → SessionRevokedAt
//     reason          → SessionRevocationReason
//
// The lifecycle transition:
//
//     ACTIVE → REVOKED
//
// is owned by SessionAggregate.revoke().
//
// This DTO does NOT:
//
// - revoke the Session;
// - validate Session lifecycle state;
// - revoke other Sessions;
// - revoke a token family;
// - validate Identity state;
// - validate Device state;
// - generate or compare refresh tokens;
// - detect token reuse;
// - persist data;
// - access Prisma;
// - publish domain events;
// - send notifications;
// - perform external side effects.
//
// Those responsibilities belong to the application workflow, aggregate,
// repository, security infrastructure, and other appropriate boundaries.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "sessionPublicId": "SES-01K3R8Y7Q2",
//       "revokedAt": "2026-08-31T17:30:00.000Z",
//       "reason": "USER_REQUESTED",
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

const MIN_PUBLIC_ID_LENGTH = 1;
const MAX_PUBLIC_ID_LENGTH = 128;

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
 * REST request for revoking a Session.
 *
 * Represents the transport-level intent to revoke an existing Session.
 *
 * Required transport input:
 *
 * - sessionPublicId;
 * - revokedAt;
 * - reason;
 * - correlationId.
 *
 * Optional transport input:
 *
 * - causationId.
 *
 * All properties are primitive transport values.
 *
 * Domain value objects are created only after this DTO crosses the
 * presentation/application mapping boundary.
 */
export class RevokeSessionRequestDto {
  // ===========================================================================
  // Session Public ID
  // ===========================================================================

  /**
   * Public identifier of the Session aggregate to revoke.
   *
   * Transport representation:
   *
   * - string
   *
   * Application mapping:
   *
   *     string → SessionPublicId
   *
   * Example:
   *
   * - SES-01K3R8Y7Q2
   */
  @ApiProperty({
    example: 'SES-01K3R8Y7Q2',
    description: 'Public identifier of the Session aggregate to revoke.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'sessionPublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'sessionPublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `sessionPublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  sessionPublicId!: string;

  // ===========================================================================
  // Revoked At
  // ===========================================================================

  /**
   * Timestamp at which the Session is revoked.
   *
   * Transport representation:
   *
   * - ISO-8601 date-time string
   *
   * Application mapping:
   *
   *     string → SessionRevokedAt
   */
  @ApiProperty({
    example: '2026-08-31T17:30:00.000Z',
    description: 'ISO-8601 timestamp at which the Session is revoked.',
    format: 'date-time',
  })
  @IsString({
    message: 'revokedAt must be a string.',
  })
  @IsDateString(
    {},
    {
      message: 'revokedAt must be a valid ISO-8601 date-time.',
    },
  )
  revokedAt!: string;

  // ===========================================================================
  // Revocation Reason
  // ===========================================================================

  /**
   * Reason explaining why the Session is being revoked.
   *
   * Transport representation:
   *
   * - string
   *
   * Application mapping:
   *
   *     string → SessionRevocationReason
   *
   * The concrete set of allowed reason values is intentionally enforced by
   * the SessionRevocationReason value object rather than duplicated in this
   * transport DTO.
   *
   * Example:
   *
   * - USER_REQUESTED
   */
  @ApiProperty({
    example: 'USER_REQUESTED',
    description:
      'Reason explaining why the Session is being revoked. The application mapping boundary converts this value into SessionRevocationReason.',
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
   * Correlation identifier for the Session-revocation operation.
   *
   * This identifies the complete business operation and is propagated to the
   * resulting domain event.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the Session-revocation operation and resulting domain events.',
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
   * Optional identifier of the command, domain event, or workflow that caused
   * this Session-revocation operation.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, domain event, or workflow that caused this Session-revocation operation.',
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
  MIN_PUBLIC_ID_LENGTH as SESSION_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as SESSION_PUBLIC_ID_MAX_LENGTH,
  MIN_REASON_LENGTH as SESSION_REVOCATION_REASON_MIN_LENGTH,
  MAX_REASON_LENGTH as SESSION_REVOCATION_REASON_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as SESSION_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as SESSION_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as SESSION_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as SESSION_CAUSATION_ID_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RevokeSessionRequestDto;
