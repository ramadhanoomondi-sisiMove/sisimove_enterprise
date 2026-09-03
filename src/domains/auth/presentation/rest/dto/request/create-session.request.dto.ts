// -----------------------------------------------------------------------------
// Session — Create Request DTO
// -----------------------------------------------------------------------------
//
// REST transport DTO for explicitly creating a Session.
//
// Aggregate:
//
// SessionAggregate
// └── SessionEntity
//
// -----------------------------------------------------------------------------
//
// IMPORTANT ARCHITECTURAL NOTE
// -----------------------------------------------------------------------------
//
// This DTO is NOT the normal login request.
//
// A successful authentication workflow should create a Session internally:
//
//     AuthenticateRequestDto
//              │
//              ▼
//     AuthenticateHandler
//              │
//              ├── resolve Identity
//              ├── verify password
//              ├── record successful Authentication
//              ├── generate refresh token
//              ├── hash refresh token
//              ├── establish token family
//              └── create Session
//
// Therefore, a normal public login endpoint should NOT expose:
//
// - identityPublicId;
// - tokenFamilyPublicId;
// - authenticatedAt;
// - lastActivityAt;
// - expiresAt;
// - correlationId;
// - causationId;
// - raw refreshToken.
//
// Those values belong to the application/security workflow.
//
// -----------------------------------------------------------------------------
//
// PURPOSE OF THIS DTO
// -----------------------------------------------------------------------------
//
// This DTO may be retained for an explicit Session-management endpoint when
// the application intentionally allows an already-generated refresh token and
// Session context to be supplied through HTTP.
//
// It is therefore a transport DTO only.
//
// It does NOT:
//
// - create domain value objects;
// - create SessionEntity;
// - create SessionAggregate;
// - hash refresh tokens;
// - persist refresh tokens;
// - generate token families;
// - determine Session lifecycle state.
//
// -----------------------------------------------------------------------------
//
// DTO → APPLICATION BOUNDARY
// -----------------------------------------------------------------------------
//
// Transport primitives are converted before constructing CreateSessionCommand:
//
//     identityPublicId
//          ↓
//     SessionIdentityPublicId
//
//     devicePublicId
//          ↓
//     SessionDevicePublicId
//
//     refreshToken
//          ↓
//     security hashing boundary
//          ↓
//     SessionRefreshTokenHash
//
//     tokenFamilyPublicId
//          ↓
//     SessionTokenFamilyPublicId
//
//     authenticatedAt
//          ↓
//     SessionAuthenticatedAt
//
//     lastActivityAt
//          ↓
//     SessionLastActivityAt
//
//     expiresAt
//          ↓
//     SessionExpiresAt
//
// -----------------------------------------------------------------------------
//
// SECURITY RULE
// -----------------------------------------------------------------------------
//
// The raw refresh token is transient.
//
// It MUST:
//
// - never be persisted;
// - never be converted into a domain value object;
// - never enter CreateSessionCommand;
// - never enter SessionEntity;
// - never enter SessionAggregate;
// - never enter SessionCreatedEvent;
// - never enter SessionRepository;
// - never be logged;
// - never be included in application/domain events.
//
// Security workflow:
//
//     refreshToken
//          │
//          ▼
//     HashingService
//          │
//          ▼
//     SessionRefreshTokenHash
//          │
//          ▼
//     CreateSessionCommand
//
// -----------------------------------------------------------------------------
//
// Domain boundary
// -----------------------------------------------------------------------------
//
// This DTO intentionally has no imports from:
//
// - Session domain entities;
// - Session aggregates;
// - Session value objects;
// - Session repositories.
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
  IsIP,
  IsISO31661Alpha2,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// =============================================================================
// Helpers
// =============================================================================

/**
 * Trims transport strings before validation/mapping.
 *
 * Passwords and other secret values are deliberately not transformed.
 */
const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

/**
 * Normalizes ISO 3166-1 alpha-2 country codes.
 */
const normalizeCountryCode = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim().toUpperCase() : value;

// =============================================================================
// Validation Constants
// =============================================================================

const MIN_PUBLIC_ID_LENGTH = 1;
const MAX_PUBLIC_ID_LENGTH = 128;

const MIN_REFRESH_TOKEN_LENGTH = 1;
const MAX_REFRESH_TOKEN_LENGTH = 4096;

const MIN_TOKEN_FAMILY_PUBLIC_ID_LENGTH = 1;
const MAX_TOKEN_FAMILY_PUBLIC_ID_LENGTH = 128;

const MAX_IP_ADDRESS_LENGTH = 45;

const MIN_USER_AGENT_LENGTH = 1;
const MAX_USER_AGENT_LENGTH = 1024;

const MIN_CITY_LENGTH = 1;
const MAX_CITY_LENGTH = 128;

const COUNTRY_CODE_LENGTH = 2;

const MIN_CORRELATION_ID_LENGTH = 1;
const MAX_CORRELATION_ID_LENGTH = 128;

const MIN_CAUSATION_ID_LENGTH = 1;
const MAX_CAUSATION_ID_LENGTH = 128;

// =============================================================================
// DTO
// =============================================================================

/**
 * REST request for explicitly creating a Session.
 *
 * This DTO is a transport contract only.
 *
 * It does not represent the normal authentication/login request.
 *
 * The application layer must convert the primitive transport values into
 * domain value objects before constructing CreateSessionCommand.
 */
export class CreateSessionRequestDto {
  // ===========================================================================
  // Identity Public ID
  // ===========================================================================

  /**
   * Public identifier of the Identity associated with the Session.
   *
   * This is supplied only when an explicit Session-creation endpoint is being
   * used.
   */
  @ApiProperty({
    example: 'IDN-01K3R8Y7Q2',
    description:
      'Public identifier of the Identity associated with this Session.',
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
  // Device Public ID
  // ===========================================================================

  /**
   * Optional public identifier of the Device associated with the Session.
   */
  @ApiPropertyOptional({
    example: 'DEV-01K3R8Y8M4',
    description:
      'Optional public identifier of the Device associated with this Session.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString({
    message: 'devicePublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'devicePublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `devicePublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  devicePublicId?: string;

  // ===========================================================================
  // Raw Refresh Token
  // ===========================================================================

  /**
   * Raw refresh token.
   *
   * SECURITY:
   *
   * This value exists only at the transport/application boundary.
   *
   * It MUST be hashed before CreateSessionCommand is constructed.
   *
   * The resulting command contains SessionRefreshTokenHash only.
   */
  @ApiProperty({
    example: 'opaque-refresh-token',
    description:
      'Transient raw refresh token. It must be hashed before CreateSessionCommand is constructed and must never be persisted or published.',
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
  // Token Family Public ID
  // ===========================================================================

  /**
   * Public identifier of the refresh-token family.
   *
   * This is an opaque identifier.
   *
   * It is not a token secret.
   */
  @ApiProperty({
    example: 'TF-01K3R8Y9P6',
    description:
      'Public identifier of the refresh-token family associated with this Session.',
    minLength: MIN_TOKEN_FAMILY_PUBLIC_ID_LENGTH,
    maxLength: MAX_TOKEN_FAMILY_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'tokenFamilyPublicId must be a string.',
  })
  @MinLength(MIN_TOKEN_FAMILY_PUBLIC_ID_LENGTH, {
    message: 'tokenFamilyPublicId must not be empty.',
  })
  @MaxLength(MAX_TOKEN_FAMILY_PUBLIC_ID_LENGTH, {
    message: `tokenFamilyPublicId must not exceed ${MAX_TOKEN_FAMILY_PUBLIC_ID_LENGTH} characters.`,
  })
  tokenFamilyPublicId!: string;

  // ===========================================================================
  // IP Address
  // ===========================================================================

  /**
   * Optional client IP address observed during authentication.
   */
  @ApiPropertyOptional({
    example: '192.168.1.10',
    description: 'Optional client IP address observed during authentication.',
    maxLength: MAX_IP_ADDRESS_LENGTH,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString({
    message: 'ipAddress must be a string.',
  })
  @IsIP(undefined, {
    message: 'ipAddress must be a valid IPv4 or IPv6 address.',
  })
  @MaxLength(MAX_IP_ADDRESS_LENGTH, {
    message: `ipAddress must not exceed ${MAX_IP_ADDRESS_LENGTH} characters.`,
  })
  ipAddress?: string;

  // ===========================================================================
  // User Agent
  // ===========================================================================

  /**
   * Optional client user-agent observed during authentication.
   */
  @ApiPropertyOptional({
    example: 'Mozilla/5.0',
    description: 'Optional client user-agent observed during authentication.',
    minLength: MIN_USER_AGENT_LENGTH,
    maxLength: MAX_USER_AGENT_LENGTH,
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString({
    message: 'userAgent must be a string.',
  })
  @MinLength(MIN_USER_AGENT_LENGTH, {
    message: 'userAgent must not be empty.',
  })
  @MaxLength(MAX_USER_AGENT_LENGTH, {
    message: `userAgent must not exceed ${MAX_USER_AGENT_LENGTH} characters.`,
  })
  userAgent?: string;

  // ===========================================================================
  // Country Code
  // ===========================================================================

  /**
   * Optional ISO 3166-1 alpha-2 country code.
   */
  @ApiPropertyOptional({
    example: 'KE',
    description:
      'Optional ISO 3166-1 alpha-2 country code associated with the Session.',
    minLength: COUNTRY_CODE_LENGTH,
    maxLength: COUNTRY_CODE_LENGTH,
    nullable: true,
  })
  @Transform(normalizeCountryCode)
  @IsOptional()
  @IsString({
    message: 'countryCode must be a string.',
  })
  @IsISO31661Alpha2({
    message: 'countryCode must be a valid ISO 3166-1 alpha-2 country code.',
  })
  @MaxLength(COUNTRY_CODE_LENGTH, {
    message: `countryCode must not exceed ${COUNTRY_CODE_LENGTH} characters.`,
  })
  countryCode?: string;

  // ===========================================================================
  // City
  // ===========================================================================

  /**
   * Optional client city associated with the Session.
   */
  @ApiPropertyOptional({
    example: 'Nairobi',
    description: 'Optional client city associated with the Session.',
    minLength: MIN_CITY_LENGTH,
    maxLength: MAX_CITY_LENGTH,
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString({
    message: 'city must be a string.',
  })
  @MinLength(MIN_CITY_LENGTH, {
    message: 'city must not be empty.',
  })
  @MaxLength(MAX_CITY_LENGTH, {
    message: `city must not exceed ${MAX_CITY_LENGTH} characters.`,
  })
  city?: string;

  // ===========================================================================
  // Authenticated At
  // ===========================================================================

  /**
   * Timestamp at which authentication succeeded.
   *
   * Transport format:
   *
   *     ISO-8601 date-time string
   *
   * The application boundary converts this into SessionAuthenticatedAt.
   */
  @ApiProperty({
    example: '2026-08-31T17:30:00.000Z',
    description: 'ISO-8601 timestamp at which authentication succeeded.',
    format: 'date-time',
  })
  @IsString({
    message: 'authenticatedAt must be a string.',
  })
  @IsDateString(
    {},
    {
      message: 'authenticatedAt must be a valid ISO-8601 date-time.',
    },
  )
  authenticatedAt!: string;

  // ===========================================================================
  // Last Activity At
  // ===========================================================================

  /**
   * Timestamp of the initial Session activity.
   */
  @ApiProperty({
    example: '2026-08-31T17:30:00.000Z',
    description: 'ISO-8601 timestamp of the initial Session activity.',
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
  // Expires At
  // ===========================================================================

  /**
   * Timestamp at which the Session expires.
   */
  @ApiProperty({
    example: '2026-09-30T17:30:00.000Z',
    description: 'ISO-8601 timestamp at which the Session expires.',
    format: 'date-time',
  })
  @IsString({
    message: 'expiresAt must be a string.',
  })
  @IsDateString(
    {},
    {
      message: 'expiresAt must be a valid ISO-8601 date-time.',
    },
  )
  expiresAt!: string;

  // ===========================================================================
  // Correlation ID
  // ===========================================================================

  /**
   * Correlation identifier for this operation.
   *
   * For direct HTTP operations, the controller/application boundary should
   * normally generate this value rather than trusting arbitrary client input.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description: 'Correlation identifier for the Session-creation operation.',
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
  // Causation ID
  // ===========================================================================

  /**
   * Optional causation identifier.
   *
   * This identifies the command/event/operation that caused this operation.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, domain event, or operation that caused this Session-creation operation.',
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

// =============================================================================
// Exported Validation Constants
// =============================================================================

export {
  MIN_PUBLIC_ID_LENGTH as SESSION_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as SESSION_PUBLIC_ID_MAX_LENGTH,
  MIN_REFRESH_TOKEN_LENGTH as SESSION_REFRESH_TOKEN_MIN_LENGTH,
  MAX_REFRESH_TOKEN_LENGTH as SESSION_REFRESH_TOKEN_MAX_LENGTH,
  MIN_TOKEN_FAMILY_PUBLIC_ID_LENGTH as SESSION_TOKEN_FAMILY_PUBLIC_ID_MIN_LENGTH,
  MAX_TOKEN_FAMILY_PUBLIC_ID_LENGTH as SESSION_TOKEN_FAMILY_PUBLIC_ID_MAX_LENGTH,
  MAX_IP_ADDRESS_LENGTH as SESSION_IP_ADDRESS_MAX_LENGTH,
  MIN_USER_AGENT_LENGTH as SESSION_USER_AGENT_MIN_LENGTH,
  MAX_USER_AGENT_LENGTH as SESSION_USER_AGENT_MAX_LENGTH,
  COUNTRY_CODE_LENGTH as SESSION_COUNTRY_CODE_LENGTH,
  MIN_CITY_LENGTH as SESSION_CITY_MIN_LENGTH,
  MAX_CITY_LENGTH as SESSION_CITY_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as SESSION_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as SESSION_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as SESSION_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as SESSION_CAUSATION_ID_MAX_LENGTH,
};

// =============================================================================
// Default Export
// =============================================================================

export default CreateSessionRequestDto;
