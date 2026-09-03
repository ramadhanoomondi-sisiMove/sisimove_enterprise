// -----------------------------------------------------------------------------
// OTP Challenge — Cancel Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for cancelling an existing OTP Challenge.
//
// Aggregate:
//
// OtpChallengeAggregate
// └── OtpChallengeEntity
//
// This DTO contains transport-level primitive values only.
//
// DTO-to-domain conversion belongs at the presentation/application mapping
// boundary.
//
// The request identifies the OTP Challenge to cancel and carries the
// application correlation metadata.
//
// The cancellation lifecycle transition is owned by the
// OtpChallengeAggregate.
//
// This DTO does NOT:
//
// - contain OtpChallengePublicId as a domain Value Object;
// - contain OtpChallenge status;
// - generate OTPs;
// - hash OTPs;
// - compare OTPs;
// - validate OTPs;
// - modify Authentication;
// - modify Recovery;
// - create Sessions;
// - access Prisma;
// - perform persistence;
// - construct domain events;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "otpChallengePublicId": "OTP-01K3R8Y7Q2",
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

import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_OTP_CHALLENGE_PUBLIC_ID_LENGTH = 1;
const MAX_OTP_CHALLENGE_PUBLIC_ID_LENGTH = 128;

const MIN_CORRELATION_ID_LENGTH = 1;
const MAX_CORRELATION_ID_LENGTH = 128;

const MIN_CAUSATION_ID_LENGTH = 1;
const MAX_CAUSATION_ID_LENGTH = 128;

// =============================================================================
// DTO
// =============================================================================

/**
 * REST request for cancelling an existing OTP Challenge.
 *
 * Represents the application-level intent to cancel an OTP Challenge.
 *
 * Required transport input:
 *
 * - otpChallengePublicId;
 * - correlationId.
 *
 * Optional transport input:
 *
 * - causationId.
 *
 * All properties are primitive transport values.
 *
 * The application mapper is responsible for converting:
 *
 *     otpChallengePublicId
 *         ↓
 *     OtpChallengePublicId.create(value)
 *
 * The DTO intentionally does not construct or import domain Value Objects.
 */
export class CancelOtpChallengeRequestDto {
  // ===========================================================================
  // OTP Challenge Public ID
  // ===========================================================================

  /**
   * Public identifier of the OTP Challenge to cancel.
   *
   * This remains a primitive string at the REST boundary.
   *
   * The presentation/application mapper converts it into the
   * OtpChallengePublicId value object.
   */
  @ApiProperty({
    example: 'OTP-01K3R8Y7Q2',
    description:
      'Public identifier of the OTP Challenge to cancel. The transport string is converted to the OtpChallengePublicId value object at the application boundary.',
    minLength: MIN_OTP_CHALLENGE_PUBLIC_ID_LENGTH,
    maxLength: MAX_OTP_CHALLENGE_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'otpChallengePublicId must be a string.',
  })
  @MinLength(MIN_OTP_CHALLENGE_PUBLIC_ID_LENGTH, {
    message: 'otpChallengePublicId must not be empty.',
  })
  @MaxLength(MAX_OTP_CHALLENGE_PUBLIC_ID_LENGTH, {
    message: `otpChallengePublicId must not exceed ${MAX_OTP_CHALLENGE_PUBLIC_ID_LENGTH} characters.`,
  })
  otpChallengePublicId!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the OTP Challenge cancellation operation.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the OTP Challenge cancellation operation and resulting domain event.',
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
   * OTP Challenge cancellation request.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, event, or operation that caused this OTP Challenge cancellation request.',
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
  MIN_OTP_CHALLENGE_PUBLIC_ID_LENGTH,
  MAX_OTP_CHALLENGE_PUBLIC_ID_LENGTH,
  MIN_CORRELATION_ID_LENGTH as OTP_CHALLENGE_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as OTP_CHALLENGE_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as OTP_CHALLENGE_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as OTP_CHALLENGE_CAUSATION_ID_MAX_LENGTH,
};
