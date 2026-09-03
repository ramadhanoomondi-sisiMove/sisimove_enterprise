// -----------------------------------------------------------------------------
// Verification Request — Create Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for submitting verification evidence.
//
// Aggregate boundary:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity
//
// Applicant flow:
//
//     POST /verifications/:verificationPublicId/requests
//
// The authenticated identity is obtained from:
//
//     req.user.sub
//
// The applicant provides only:
//
// - type;
// - assetPublicId.
//
// The applicant does NOT provide:
//
// - identityPublicId;
// - verificationPublicId;
// - verificationRequestPublicId;
// - status;
// - correlationId;
// - causationId;
// - submittedAt;
// - reviewedAt;
// - reviewedByPublicId;
// - rejectionReason;
// - createdAt;
// - updatedAt.
//
// VerificationRequest creation represents submission.
//
// Creation always produces:
//
//     status = PENDING
//
// The application/domain layer is responsible for:
//
// - resolving the authenticated Identity;
// - resolving the Verification aggregate;
// - validating aggregate ownership;
// - validating the Verification lifecycle state;
// - validating the request type;
// - resolving the submitted Asset;
// - preventing invalid or duplicate requests;
// - generating VerificationRequestPublicId;
// - establishing submittedAt;
// - establishing createdAt;
// - establishing the initial request state;
// - recording domain events.
//
// -----------------------------------------------------------------------------
//
// Verification request types:
//
// - PROFILE_PHOTO
// - GOVERNMENT_ID
// - DRIVER_LICENSE
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "type": "GOVERNMENT_ID",
//       "assetPublicId": "AST-01K3R8Y9P6"
//     }
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

import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// Domain Types
// -----------------------------------------------------------------------------

import {
  VERIFICATION_REQUEST_TYPES,
  type VerificationRequestTypeValue,
} from '../../../../domain/value-objects';

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

// =============================================================================
// DTO
// =============================================================================

/**
 * REST request for submitting verification evidence.
 *
 * The authenticated identity is established from the JWT security context.
 *
 * The Verification aggregate is identified by the route:
 *
 *     /verifications/:verificationPublicId/requests
 *
 * The applicant supplies only the verification evidence type and the
 * public identifier of the uploaded asset.
 *
 * The aggregate and application layer establish all ownership, lifecycle,
 * audit, correlation, causation, and timestamp information.
 */
export class CreateVerificationRequestRequestDto {
  // ===========================================================================
  // Verification Request Type
  // ===========================================================================

  /**
   * Type of verification evidence being submitted.
   *
   * Supported values:
   *
   * - PROFILE_PHOTO;
   * - GOVERNMENT_ID;
   * - DRIVER_LICENSE.
   */
  @ApiProperty({
    example: 'GOVERNMENT_ID',
    description: 'Type of verification evidence being submitted.',
    enum: VERIFICATION_REQUEST_TYPES,
  })
  @Transform(trimString)
  @IsString({
    message: 'type must be a string.',
  })
  @IsEnum(VERIFICATION_REQUEST_TYPES, {
    message: `type must be one of: ${VERIFICATION_REQUEST_TYPES.join(', ')}.`,
  })
  type!: VerificationRequestTypeValue;

  // ===========================================================================
  // Asset Public ID
  // ===========================================================================

  /**
   * Public identifier of the uploaded asset containing the verification
   * evidence.
   *
   * Examples:
   *
   * - uploaded profile photograph;
   * - uploaded government identification document;
   * - uploaded driver's licence.
   *
   * The asset itself is not contained in this request. The application layer
   * resolves the Asset using this public identifier.
   */
  @ApiProperty({
    example: 'AST-01K3R8Y9P6',
    description:
      'Public identifier of the uploaded asset containing the verification evidence.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'assetPublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'assetPublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `assetPublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  assetPublicId!: string;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_PUBLIC_ID_LENGTH as VERIFICATION_REQUEST_CREATE_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as VERIFICATION_REQUEST_CREATE_PUBLIC_ID_MAX_LENGTH,
};
