// -----------------------------------------------------------------------------
// Session — Refresh Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for refreshing an existing Session.
//
// Aggregate:
//
// SessionAggregate
// └── SessionEntity
//
// This DTO contains transport-level primitive values only.
//
// The DTO intentionally does NOT import:
//
// - SessionPublicId;
// - SessionRefreshTokenHash;
// - SessionLastActivityAt;
// - RefreshSessionCommand;
// - SessionAggregate;
// - SessionEntity.
//
// DTO-to-domain conversion belongs at the presentation/application
// mapping boundary.
//
// -----------------------------------------------------------------------------
//
// SECURITY BOUNDARY
//
// The client supplies the CURRENT raw refresh token:
//
//     rawRefreshToken
//            │
//            ▼
//     Authentication Workflow
//            │
//            ├── locate Session
//            │
//            ├── verify(rawRefreshToken,
//            │           persistedSession.refreshTokenHash)
//            │
//            ├── generate NEW raw refresh token
//            │
//            ├── hash(newRawRefreshToken)
//            │
//            ▼
//     RefreshSessionCommand
//
// The command receives:
//
//     refreshTokenHash
//
// which is the hash of the NEW refresh token.
//
// The incoming raw refresh token MUST NEVER be converted directly into
// SessionRefreshTokenHash for the command.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT
//
// This DTO's `refreshToken` represents the RAW CURRENT refresh token supplied
// by the client.
//
// It is:
//
// - transient;
// - never persisted;
// - never logged;
// - never included in domain events;
// - never passed to SessionRepository;
// - never stored on SessionEntity.
//
// After successful verification, the surrounding authentication workflow
// generates and hashes the replacement token.
//
// The raw replacement token remains outside the Session domain when it must be
// returned to the client.
//
// -----------------------------------------------------------------------------
//
// APPLICATION MAPPING
//
// Transport primitives:
//
//     sessionPublicId → string
//     refreshToken    → string
//     lastActivityAt  → string
//     correlationId   → string
//     causationId     → string | undefined
//
// Application/domain mapping:
//
//     sessionPublicId → SessionPublicId
//     refreshToken    → verification input only
//     new token       → TokenService.generateRefreshToken()
//     new token       → HashingService.hash()
//     new hash        → SessionRefreshTokenHash
//     lastActivityAt  → SessionLastActivityAt
//
// Result:
//
//     RefreshSessionCommand
//
// -----------------------------------------------------------------------------
//
// This DTO does NOT:
//
// - verify the refresh token;
// - hash the refresh token;
// - generate a replacement refresh token;
// - rotate the refresh token;
// - modify Session;
// - revoke Sessions;
// - validate Identity domain state;
// - validate Device domain state;
// - create tokens;
// - access Prisma;
// - perform persistence;
// - publish domain events;
// - send notifications.
//
// Those responsibilities belong to the authentication workflow, security
// infrastructure, application handler, aggregate, and repository boundaries.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "sessionPublicId": "SES-01K3R8Y7Q2",
//       "refreshToken": "opaque-current-refresh-token",
//       "lastActivityAt": "2026-08-31T17:30:00.000Z",
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

const MIN_REFRESH_TOKEN_LENGTH = 1;
const MAX_REFRESH_TOKEN_LENGTH = 4096;

const MIN_CORRELATION_ID_LENGTH = 1;
const MAX_CORRELATION_ID_LENGTH = 128;

const MIN_CAUSATION_ID_LENGTH = 1;
const MAX_CAUSATION_ID_LENGTH = 128;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for refreshing an existing Session.
 *
 * Required transport input:
 *
 * - sessionPublicId;
 * - refreshToken;
 * - lastActivityAt;
 * - correlationId.
 *
 * Optional transport input:
 *
 * - causationId.
 *
 * All properties are primitive transport values.
 *
 * The raw refresh token is accepted only at the REST/security boundary.
 * It must be verified before the replacement refresh token is generated and
 * hashed for RefreshSessionCommand.
 */
export class RefreshSessionRequestDto {
  // ===========================================================================
  // Session Public ID
  // ===========================================================================

  /**
   * Public identifier of the Session being refreshed.
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
    description: 'Public identifier of the Session being refreshed.',
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
  // Current Refresh Token
  // ===========================================================================

  /**
   * Current raw refresh token supplied by the client.
   *
   * This is transient security-sensitive input.
   *
   * IMPORTANT:
   *
   * Do NOT trim this value.
   *
   * The refresh token must be treated as an opaque credential and preserved
   * exactly as supplied.
   *
   * The authentication workflow is responsible for verifying this token
   * against the persisted Session refresh-token hash.
   *
   * After successful verification, a NEW refresh token is generated and
   * hashed before RefreshSessionCommand is created.
   */
  @ApiProperty({
    example: 'opaque-current-refresh-token',
    description:
      'Current raw refresh token supplied by the client. It is verified by the authentication workflow and never enters RefreshSessionCommand.',
    minLength: MIN_REFRESH_TOKEN_LENGTH,
    maxLength: MAX_REFRESH_TOKEN_LENGTH,
    writeOnly: true,
  })
  @IsString({
    message: 'refreshToken must be a string.',
  })
  @MinLength(MIN_REFRESH_TOKEN_LENGTH, {
    message: 'refreshToken must not be empty.',
  })
  @MaxLength(MAX_REFRESH_TOKEN_LENGTH, {
    message: `refreshToken must not exceed ${MAX_REFRESH_TOKEN_LENGTH} characters.`,
  })
  refreshToken!: string;

  // ===========================================================================
  // Last Activity At
  // ===========================================================================

  /**
   * Timestamp representing the latest Session activity.
   *
   * Transport representation:
   *
   * - ISO-8601 date-time string
   *
   * Application mapping:
   *
   *     string → SessionLastActivityAt
   *
   * The aggregate remains responsible for enforcing lifecycle invariants
   * concerning this timestamp.
   */
  @ApiProperty({
    example: '2026-08-31T17:30:00.000Z',
    description: 'ISO-8601 timestamp representing the latest Session activity.',
    format: 'date-time',
  })
  @IsString({
    message: 'lastActivityAt must be a string.',
  })
  @IsDateString(
    {},
    {
      message: 'lastActivityAt must be a valid ISO-8601 date-time.',
    },
  )
  lastActivityAt!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the Session-refresh operation.
   *
   * This identifies the complete business operation and is propagated to
   * resulting domain events.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the Session-refresh operation and resulting domain events.',
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
   * this Session-refresh operation.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, domain event, or workflow that caused this Session-refresh operation.',
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
  MIN_REFRESH_TOKEN_LENGTH as SESSION_REFRESH_TOKEN_MIN_LENGTH,
  MAX_REFRESH_TOKEN_LENGTH as SESSION_REFRESH_TOKEN_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as SESSION_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as SESSION_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as SESSION_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as SESSION_CAUSATION_ID_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RefreshSessionRequestDto;
