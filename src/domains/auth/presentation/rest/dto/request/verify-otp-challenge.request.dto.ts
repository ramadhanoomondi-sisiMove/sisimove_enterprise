// -----------------------------------------------------------------------------
// OTP Challenge — Verify Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for verifying an OTP Challenge.
//
// This DTO contains transport-level primitive values only.
//
// Domain Value Objects MUST NOT be used in this DTO.
//
// DTO-to-domain conversion belongs at the presentation/application mapping
// boundary.
//
// The raw OTP is intentionally NOT part of this DTO.
//
// OTP verification belongs to the application/security workflow. That
// workflow is responsible for receiving and securely comparing the raw OTP
// against the persisted OTP hash before dispatching VerifyOtpChallengeCommand.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "otpChallengePublicId": "OTP-01K3R8Y7Q2",
//       "verifiedAt": "2026-08-31T12:25:00.000Z",
//       "correlationId": "COR-01K3R8Y7Q2",
//       "causationId": "CMD-01K3R8Y6M4"
//     }
//
// -----------------------------------------------------------------------------
//
// Required:
//
// - otpChallengePublicId;
// - verifiedAt;
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
// - contain the raw OTP;
// - compare OTPs;
// - hash OTPs;
// - generate OTPs;
// - validate OTP hashes;
// - determine verification eligibility;
// - modify Authentication;
// - create Sessions;
// - modify Recovery;
// - access Prisma;
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
 * REST request for verifying an OTP Challenge.
 *
 * All properties are transport-level primitives.
 *
 * Domain conversion is performed by the presentation/application mapper.
 */
export class VerifyOtpChallengeRequestDto {
  // ===========================================================================
  // OTP Challenge Public ID
  // ===========================================================================

  /**
   * Public identifier of the OTP Challenge being verified.
   *
   * Transport type: string.
   */
  @ApiProperty({
    example: 'OTP-01K3R8Y7Q2',
    description:
      'Opaque public identifier of the OTP Challenge being verified.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'otpChallengePublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'otpChallengePublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `otpChallengePublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  otpChallengePublicId!: string;

  // ===========================================================================
  // Verified At
  // ===========================================================================

  /**
   * Timestamp at which successful OTP verification occurred.
   *
   * Transport type: string.
   *
   * Expected representation: ISO 8601 date-time.
   */
  @ApiProperty({
    example: '2026-08-31T12:25:00.000Z',
    description:
      'ISO 8601 timestamp at which successful OTP verification occurred.',
    format: 'date-time',
  })
  @Transform(trimString)
  @IsString({
    message: 'verifiedAt must be a string.',
  })
  @IsDateString(
    {},
    {
      message: 'verifiedAt must be a valid ISO 8601 date-time.',
    },
  )
  verifiedAt!: string;

  // ===========================================================================
  // Correlation ID
  // ===========================================================================

  /**
   * Correlation identifier for the OTP Challenge verification operation.
   *
   * Transport type: string.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the OTP Challenge verification operation and resulting domain events.',
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
   * Optional identifier of the command, event, or operation that caused this
   * OTP Challenge verification request.
   *
   * Transport type: string.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, event, or operation that caused this OTP Challenge verification request.',
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
  MIN_PUBLIC_ID_LENGTH as OTP_CHALLENGE_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as OTP_CHALLENGE_PUBLIC_ID_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as OTP_CHALLENGE_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as OTP_CHALLENGE_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as OTP_CHALLENGE_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as OTP_CHALLENGE_CAUSATION_ID_MAX_LENGTH,
};
