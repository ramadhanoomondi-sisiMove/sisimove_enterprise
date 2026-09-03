// -----------------------------------------------------------------------------
// Session — Expire Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for expiring a Session.
//
// Aggregate:
//
// SessionAggregate
// └── SessionEntity
//
// This DTO contains transport-level primitive values only.
//
// The DTO intentionally does NOT import or depend on Session domain value
// objects, aggregates, or application commands.
//
// DTO-to-command/domain conversion belongs at the presentation/application
// mapping boundary.
//
// -----------------------------------------------------------------------------
//
// HTTP endpoint:
//
//     PATCH /sessions/:sessionPublicId/expire
//
// Route parameter:
//
//     sessionPublicId
//
// Request body:
//
//     {
//       "referenceDate": "2026-09-01T08:00:00.000Z",
//       "correlationId": "COR-01K3R8Y7Q2",
//       "causationId": "CMD-01K3R8Y6M4"
//     }
//
// -----------------------------------------------------------------------------
//
// Command mapping:
//
//     sessionPublicId
//          │
//          ▼
//     SessionPublicId
//
//     referenceDate
//          │
//          ▼
//     Date
//
//     correlationId
//          │
//          ▼
//     string
//
//     causationId?
//          │
//          ▼
//     string | undefined
//
// Result:
//
//     ExpireSessionCommand
//
// -----------------------------------------------------------------------------
//
// Expiration semantics:
//
// The referenceDate represents the current point in time supplied to the
// Session application workflow.
//
// The controller does NOT determine whether the Session has expired.
//
// The SessionAggregate remains responsible for evaluating:
//
//     referenceDate >= expiresAt
//
// and enforcing the corresponding Session lifecycle invariant:
//
//     ACTIVE → EXPIRED
//
// The DTO therefore does not contain:
//
// - expiration policy;
// - expiration duration;
// - expiresAt;
// - Session status;
// - revocation reason;
// - token information;
// - Identity state;
// - Device state.
//
// -----------------------------------------------------------------------------
//
// This DTO does NOT:
//
// - access Prisma;
// - load the Session;
// - determine whether the Session has expired;
// - modify Session state;
// - construct SessionEntity;
// - construct SessionAggregate;
// - create domain events;
// - persist the Session;
// - revoke the Session;
// - revoke other Sessions;
// - revoke a token family;
// - validate Identity state;
// - validate Device state;
// - perform external side effects.
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

const MIN_CORRELATION_ID_LENGTH = 1;
const MAX_CORRELATION_ID_LENGTH = 128;

const MIN_CAUSATION_ID_LENGTH = 1;
const MAX_CAUSATION_ID_LENGTH = 128;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for expiring a Session.
 *
 * The Session public identifier is supplied as a route parameter:
 *
 *     PATCH /sessions/:sessionPublicId/expire
 *
 * Request body contains:
 *
 * - referenceDate;
 * - correlationId;
 * - causationId?.
 *
 * All properties are transport primitives.
 *
 * Domain/application conversion occurs at the controller boundary.
 */
export class ExpireSessionRequestDto {
  // ===========================================================================
  // Reference Date
  // ===========================================================================

  /**
   * Current reference timestamp used by the Session aggregate to determine
   * whether the Session has reached its expiration time.
   *
   * Transport representation:
   *
   * - ISO-8601 date-time string
   *
   * Application mapping:
   *
   *     string → Date
   *
   * IMPORTANT:
   *
   * The controller does not determine whether the Session has expired.
   *
   * The SessionAggregate evaluates the expiration invariant using this
   * reference date.
   */
  @ApiProperty({
    example: '2026-09-01T08:00:00.000Z',
    description:
      'ISO-8601 reference timestamp used by the Session aggregate to determine whether the Session has expired.',
    format: 'date-time',
  })
  @IsString({
    message: 'referenceDate must be a string.',
  })
  @IsDateString(
    {},
    {
      message: 'referenceDate must be a valid ISO-8601 date-time.',
    },
  )
  referenceDate!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the Session-expiration operation.
   *
   * This identifier may also be propagated to resulting domain events and
   * downstream application operations.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the Session-expiration operation and resulting domain events.',
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
   * Optional identifier of the command, domain event, or application
   * operation that caused this Session-expiration request.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, domain event, or application operation that caused this Session-expiration request.',
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
  MIN_CORRELATION_ID_LENGTH as SESSION_EXPIRE_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as SESSION_EXPIRE_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as SESSION_EXPIRE_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as SESSION_EXPIRE_CAUSATION_ID_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ExpireSessionRequestDto;
