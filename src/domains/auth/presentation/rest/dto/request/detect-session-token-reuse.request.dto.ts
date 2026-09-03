// -----------------------------------------------------------------------------
// Session — Detect Token Reuse Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for recording detected refresh-token reuse against a
// Session.
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
// - DetectSessionTokenReuseCommand;
// - SessionAggregate;
// - SessionEntity.
//
// DTO-to-command/domain conversion belongs at the presentation/application
// mapping boundary.
//
// The application mapper is responsible for converting:
//
//     sessionPublicId → SessionPublicId
//     detectedAt      → Date
//
// The security boundary is responsible for determining that refresh-token
// reuse has actually occurred before this request reaches the application
// command workflow.
//
// This DTO does NOT:
//
// - receive the raw refresh token;
// - compare refresh tokens;
// - hash refresh tokens;
// - determine whether a token is valid;
// - detect token reuse itself;
// - revoke the Session directly;
// - revoke other Sessions;
// - revoke a token family;
// - validate Identity state;
// - validate Device state;
// - persist data;
// - access Prisma;
// - publish domain events;
// - send notifications;
// - perform external side effects.
//
// Those responsibilities belong to the security infrastructure, application
// workflow, aggregate, repository, and other appropriate boundaries.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "sessionPublicId": "SES-01K3R8Y7Q2",
//       "detectedAt": "2026-09-01T09:30:00.000Z",
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

const MIN_CORRELATION_ID_LENGTH = 1;
const MAX_CORRELATION_ID_LENGTH = 128;

const MIN_CAUSATION_ID_LENGTH = 1;
const MAX_CAUSATION_ID_LENGTH = 128;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**

* REST request for recording detected refresh-token reuse against a Session.
*
* Represents the transport-level intent:
*
* ```
  Detect Session Token Reuse
  ```
*
* Required transport input:
*
* * sessionPublicId;
* * detectedAt;
* * correlationId.
*
* Optional transport input:
*
* * causationId.
*
* All properties are primitive transport values.
*
* Domain value objects are created only after this DTO crosses the
* presentation/application mapping boundary.
*
* Token comparison and reuse detection occur outside this DTO and outside
* the controller. This request represents the already-established security
* observation that reuse was detected.
  */
export class DetectSessionTokenReuseRequestDto {
  // ===========================================================================
  // Session Public ID
  // ===========================================================================

  /**

* Public identifier of the Session associated with the detected refresh-token
* reuse.
*
* Transport representation:
*
* * string
*
* Application mapping:
*
* ```
  string → SessionPublicId
  ```
*
* Example:
*
* * SES-01K3R8Y7Q2
    */
  @ApiProperty({
    example: 'SES-01K3R8Y7Q2',
    description:
      'Public identifier of the Session associated with the detected refresh-token reuse.',
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
  // Detected At
  // ===========================================================================

  /**

* Timestamp at which refresh-token reuse was detected.
*
* Transport representation:
*
* * ISO-8601 date-time string
*
* Application mapping:
*
* ```
  string → Date
  ```
*
* Example:
*
* * 2026-09-01T09:30:00.000Z
    */
  @ApiProperty({
    example: '2026-09-01T09:30:00.000Z',
    description:
      'ISO-8601 timestamp at which refresh-token reuse was detected.',
    format: 'date-time',
  })
  @IsString({
    message: 'detectedAt must be a string.',
  })
  @IsDateString(
    {},
    {
      message: 'detectedAt must be a valid ISO-8601 date-time.',
    },
  )
  detectedAt!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**

* Correlation identifier for the Session token-reuse detection operation.
*
* This identifies the complete business operation and is propagated through
* the application workflow and resulting domain events.
  */
  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the Session token-reuse detection operation and resulting domain events.',
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

* Optional identifier of the command, domain event, security operation, or
* workflow that caused this Session token-reuse detection operation.
  */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, domain event, security operation, or workflow that caused this Session token-reuse detection operation.',
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
  MIN_CORRELATION_ID_LENGTH as SESSION_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as SESSION_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as SESSION_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as SESSION_CAUSATION_ID_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default DetectSessionTokenReuseRequestDto;
