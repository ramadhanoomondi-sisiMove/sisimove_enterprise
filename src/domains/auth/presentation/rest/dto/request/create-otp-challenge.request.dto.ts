// -----------------------------------------------------------------------------
// OTP Challenge — Create Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for creating an OTP Challenge.
//
// Aggregate:
//
// OtpChallengeAggregate
// └── OtpChallengeEntity
//
// This DTO contains transport-level primitive values only.
//
// Domain Value Objects MUST NOT be used in this DTO.
//
// DTO-to-domain conversion belongs at the presentation/application boundary.
//
// OTP generation and hashing belong to the application/security workflow.
//
// The raw OTP must never enter this DTO, command, domain entity, aggregate,
// persistence model, or domain events.
//
// -----------------------------------------------------------------------------
//
// Required:
//
// - identityPublicId;
// - purpose;
// - destination;
// - maxAttempts;
// - expiresAt;
// - correlationId.
//
// Optional:
//
// - causationId.
//
// -----------------------------------------------------------------------------
//
// This DTO does NOT:
//
// - generate OTPs;
// - hash OTPs;
// - contain a raw OTP;
// - contain an OTP hash;
// - generate OtpChallengePublicId;
// - specify initial status;
// - specify attempts;
// - specify createdAt;
// - specify updatedAt;
// - specify verifiedAt;
// - validate Identity state;
// - send OTPs;
// - send notifications;
// - access Prisma.
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

const MIN_IDENTITY_PUBLIC_ID_LENGTH = 1;
const MAX_IDENTITY_PUBLIC_ID_LENGTH = 128;

const MIN_PURPOSE_LENGTH = 1;
const MAX_PURPOSE_LENGTH = 64;

const MIN_DESTINATION_LENGTH = 1;
const MAX_DESTINATION_LENGTH = 254;

const MIN_MAX_ATTEMPTS = 1;
const MAX_MAX_ATTEMPTS = 20;

const MIN_CORRELATION_ID_LENGTH = 1;
const MAX_CORRELATION_ID_LENGTH = 128;

const MIN_CAUSATION_ID_LENGTH = 1;
const MAX_CAUSATION_ID_LENGTH = 128;

// =============================================================================
// DTO
// =============================================================================

/**
 * REST request DTO for creating an OTP Challenge.
 *
 * All properties remain transport-level primitives.
 *
 * Domain Value Objects are constructed only after transport validation,
 * at the presentation/application boundary.
 */
export class CreateOtpChallengeRequestDto {
  // ===========================================================================
  // Identity Public ID
  // ===========================================================================

  /**
   * Opaque public identifier of the Identity associated with the challenge.
   *
   * Transport type: string.
   */
  @ApiProperty({
    example: 'IDN-01K3R8Y7Q2',
    description:
      'Opaque public identifier of the Identity associated with the OTP Challenge.',
    minLength: MIN_IDENTITY_PUBLIC_ID_LENGTH,
    maxLength: MAX_IDENTITY_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'identityPublicId must be a string.',
  })
  @MinLength(MIN_IDENTITY_PUBLIC_ID_LENGTH, {
    message: 'identityPublicId must not be empty.',
  })
  @MaxLength(MAX_IDENTITY_PUBLIC_ID_LENGTH, {
    message: `identityPublicId must not exceed ${MAX_IDENTITY_PUBLIC_ID_LENGTH} characters.`,
  })
  identityPublicId!: string;

  // ===========================================================================
  // Purpose
  // ===========================================================================

  /**
   * Business purpose of the OTP Challenge.
   *
   * Transport type: string.
   *
   * The domain value object validates and converts this primitive value.
   */
  @ApiProperty({
    example: 'LOGIN',
    description:
      'Business purpose of the OTP Challenge. The transport string is converted to OtpChallengePurpose at the application boundary.',
    minLength: MIN_PURPOSE_LENGTH,
    maxLength: MAX_PURPOSE_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'purpose must be a string.',
  })
  @MinLength(MIN_PURPOSE_LENGTH, {
    message: 'purpose must not be empty.',
  })
  @MaxLength(MAX_PURPOSE_LENGTH, {
    message: `purpose must not exceed ${MAX_PURPOSE_LENGTH} characters.`,
  })
  purpose!: string;

  // ===========================================================================
  // Destination
  // ===========================================================================

  /**
   * Destination associated with the OTP Challenge.
   *
   * Examples:
   *
   * - +254712345678
   * - user@example.com
   *
   * Transport type: string.
   */
  @ApiProperty({
    example: '+254712345678',
    description:
      'Destination associated with the OTP Challenge. The transport string is converted to OtpChallengeDestination at the application boundary.',
    minLength: MIN_DESTINATION_LENGTH,
    maxLength: MAX_DESTINATION_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'destination must be a string.',
  })
  @MinLength(MIN_DESTINATION_LENGTH, {
    message: 'destination must not be empty.',
  })
  @MaxLength(MAX_DESTINATION_LENGTH, {
    message: `destination must not exceed ${MAX_DESTINATION_LENGTH} characters.`,
  })
  destination!: string;

  // ===========================================================================
  // Maximum Attempts
  // ===========================================================================

  /**
   * Maximum number of verification attempts permitted.
   *
   * Transport type: number.
   */
  @ApiProperty({
    example: 5,
    description:
      'Maximum number of verification attempts allowed for the OTP Challenge.',
    minimum: MIN_MAX_ATTEMPTS,
    maximum: MAX_MAX_ATTEMPTS,
  })
  @IsInt({
    message: 'maxAttempts must be an integer.',
  })
  @Min(MIN_MAX_ATTEMPTS, {
    message: `maxAttempts must be at least ${MIN_MAX_ATTEMPTS}.`,
  })
  @Max(MAX_MAX_ATTEMPTS, {
    message: `maxAttempts must not exceed ${MAX_MAX_ATTEMPTS}.`,
  })
  maxAttempts!: number;

  // ===========================================================================
  // Expires At
  // ===========================================================================

  /**
   * Timestamp at which the OTP Challenge expires.
   *
   * Transport type: ISO 8601 string.
   */
  @ApiProperty({
    example: '2026-09-01T12:30:00.000Z',
    description: 'ISO 8601 timestamp at which the OTP Challenge expires.',
    format: 'date-time',
  })
  @Transform(trimString)
  @IsString({
    message: 'expiresAt must be a string.',
  })
  @IsDateString(
    {},
    {
      message: 'expiresAt must be a valid ISO 8601 date-time.',
    },
  )
  expiresAt!: string;

  // ===========================================================================
  // Correlation ID
  // ===========================================================================

  /**
   * Correlation identifier for the creation operation.
   *
   * Transport type: string.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the OTP Challenge creation operation and resulting domain events.',
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
   * Optional identifier of the command, event, or operation that caused
   * this OTP Challenge creation request.
   *
   * Transport type: string.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, event, or operation that caused this OTP Challenge creation request.',
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
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_IDENTITY_PUBLIC_ID_LENGTH as OTP_CHALLENGE_IDENTITY_PUBLIC_ID_MIN_LENGTH,
  MAX_IDENTITY_PUBLIC_ID_LENGTH as OTP_CHALLENGE_IDENTITY_PUBLIC_ID_MAX_LENGTH,
  MIN_PURPOSE_LENGTH as OTP_CHALLENGE_PURPOSE_MIN_LENGTH,
  MAX_PURPOSE_LENGTH as OTP_CHALLENGE_PURPOSE_MAX_LENGTH,
  MIN_DESTINATION_LENGTH as OTP_CHALLENGE_DESTINATION_MIN_LENGTH,
  MAX_DESTINATION_LENGTH as OTP_CHALLENGE_DESTINATION_MAX_LENGTH,
  MIN_MAX_ATTEMPTS as OTP_CHALLENGE_MAX_ATTEMPTS_MIN,
  MAX_MAX_ATTEMPTS as OTP_CHALLENGE_MAX_ATTEMPTS_MAX,
  MIN_CORRELATION_ID_LENGTH as OTP_CHALLENGE_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as OTP_CHALLENGE_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as OTP_CHALLENGE_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as OTP_CHALLENGE_CAUSATION_ID_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateOtpChallengeRequestDto;
