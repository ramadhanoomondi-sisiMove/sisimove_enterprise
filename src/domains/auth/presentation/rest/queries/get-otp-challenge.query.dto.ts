// -----------------------------------------------------------------------------
// OTP Challenge — Get OTP Challenge Query DTO
// -----------------------------------------------------------------------------
//
// REST query DTO for retrieving a specific OTP Challenge aggregate by its
// public identifier.
//
// Query:
//
//     Get OTP Challenge
//
// Transport:
//
//     publicId: string
//
// Application:
//
//     publicId
//         ↓
//     OtpChallengePublicId
//         ↓
//     GetOtpChallengeQuery
//
// This DTO contains transport-level primitive values only.
//
// It does NOT:
//
// - load the OTP Challenge aggregate;
// - access OtpChallengeRepository;
// - access Prisma;
// - perform authorization;
// - validate Identity domain state;
// - validate OTP values;
// - validate OTP hashes;
// - contain domain business logic;
// - map the aggregate to a response DTO.
//
// -----------------------------------------------------------------------------
//
// Security:
//
// No OTP material is accepted by this DTO.
//
// This DTO must never carry:
//
// - raw OTP values;
// - OTP hashes;
// - passwords;
// - password hashes;
// - refresh tokens;
// - session credentials.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Swagger
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Class Transformer
// -----------------------------------------------------------------------------

import { Transform, type TransformFnParams } from 'class-transformer';

// -----------------------------------------------------------------------------
// Class Validator
// -----------------------------------------------------------------------------

import { IsString, MaxLength, MinLength } from 'class-validator';

// =============================================================================
// Constants
// =============================================================================

const MIN_OTP_CHALLENGE_PUBLIC_ID_LENGTH = 1;

const MAX_OTP_CHALLENGE_PUBLIC_ID_LENGTH = 128;

// =============================================================================
// Helpers
// =============================================================================

/**
 * Trims a transport string without introducing an unsafe cast.
 *
 * Non-string values are returned unchanged so class-validator remains
 * responsible for rejecting invalid transport input.
 */
const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// =============================================================================
// DTO
// =============================================================================

/**
 * REST query DTO for retrieving a single OTP Challenge aggregate.
 *
 * Required transport input:
 *
 * - publicId.
 *
 * The value remains a primitive string at the HTTP boundary.
 *
 * The controller/application boundary converts it into:
 *
 *     OtpChallengePublicId
 *
 * before constructing:
 *
 *     GetOtpChallengeQuery
 */
export class GetOtpChallengeQueryDto {
  // ===========================================================================
  // OTP Challenge Public ID
  // ===========================================================================

  /**
   * Public identifier of the OTP Challenge aggregate.
   *
   * Example:
   *
   *     OTP-01K3R8Y7Q2
   */
  @ApiProperty({
    example: 'OTP-01K3R8Y7Q2',
    description: 'Public identifier of the OTP Challenge to retrieve.',
    minLength: MIN_OTP_CHALLENGE_PUBLIC_ID_LENGTH,
    maxLength: MAX_OTP_CHALLENGE_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'publicId must be a string.',
  })
  @MinLength(MIN_OTP_CHALLENGE_PUBLIC_ID_LENGTH, {
    message: 'publicId must not be empty.',
  })
  @MaxLength(MAX_OTP_CHALLENGE_PUBLIC_ID_LENGTH, {
    message: `publicId must not exceed ${MAX_OTP_CHALLENGE_PUBLIC_ID_LENGTH} characters.`,
  })
  publicId!: string;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_OTP_CHALLENGE_PUBLIC_ID_LENGTH,
  MAX_OTP_CHALLENGE_PUBLIC_ID_LENGTH,
};

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetOtpChallengeQueryDto;
