// -----------------------------------------------------------------------------
// Identity — Get Verification Request Query DTO
// -----------------------------------------------------------------------------
//
// Transport/query DTO for retrieving a single Verification Request owned by a
// Verification aggregate.
//
// The DTO maps transport input into:
//
//     GetVerificationRequestQuery
//
// Aggregate boundary:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity[]
//
// VerificationRequestEntity is an owned child entity and not an aggregate root.
//
// Therefore, the request is addressed within its owning Verification aggregate
// using:
//
// - verificationPublicId;
// - verificationRequestPublicId.
//
// The application/query mapping boundary converts these transport strings into:
//
// - VerificationPublicId;
// - VerificationRequestPublicId.
//
// The application query handler is responsible for resolving the Verification
// aggregate or appropriate read model and obtaining the requested
// VerificationRequestEntity.
//
// The DTO does NOT:
//
// - access persistence directly;
// - expose Prisma or ORM models;
// - resolve internal persistence identifiers;
// - mutate the Verification aggregate;
// - mutate the Verification Request;
// - create a Verification;
// - create a Verification Request;
// - approve, reject, or cancel a Verification Request;
// - grant, reject, reopen, expire, or revoke Verification;
// - introduce an independent VerificationRequestRepository;
// - evaluate domain eligibility or lifecycle rules;
// - perform authorization;
// - communicate with external systems.
//
// -----------------------------------------------------------------------------
//
// Route:
//
//     GET /verifications/:verificationPublicId/requests/
//         :verificationRequestPublicId
//
// Example:
//
//     GET /verifications/VER-01K3R8Y7Q2/requests/VREQ-01K3R8Y8M4
//
// Route parameters:
//
//     {
//       "verificationPublicId": "VER-01K3R8Y7Q2",
//       "verificationRequestPublicId": "VREQ-01K3R8Y8M4"
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

import { IsString, MaxLength, MinLength } from 'class-validator';

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

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * Transport DTO for retrieving a single Verification Request owned by a
 * Verification aggregate.
 *
 * Required transport inputs:
 *
 * - verificationPublicId;
 * - verificationRequestPublicId.
 *
 * Both identifiers remain transport-level strings and are converted into their
 * corresponding domain value objects at the presentation/application mapping
 * boundary.
 *
 * The Verification Request is resolved within the owning Verification aggregate
 * boundary and is not treated as an independently addressable aggregate root.
 */
export class GetVerificationRequestQueryDto {
  // ===========================================================================
  // Verification Public ID
  // ===========================================================================

  /**
   * Public identifier of the owning Verification aggregate.
   *
   * This identifies the aggregate boundary within which the requested
   * Verification Request is resolved.
   *
   * This is an opaque application-facing identifier and is distinct from any
   * internal persistence identifier.
   */
  @ApiProperty({
    example: 'VER-01K3R8Y7Q2',
    description:
      'Opaque public identifier of the Verification aggregate that owns the requested Verification Request.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'verificationPublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'verificationPublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `verificationPublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  verificationPublicId!: string;

  // ===========================================================================
  // Verification Request Public ID
  // ===========================================================================

  /**
   * Public identifier of the Verification Request to retrieve.
   *
   * The Verification Request is an owned child entity and is resolved through
   * the owning Verification aggregate rather than through an independent
   * VerificationRequestRepository.
   *
   * This is an opaque application-facing identifier and is distinct from any
   * internal persistence identifier.
   */
  @ApiProperty({
    example: 'VREQ-01K3R8Y8M4',
    description:
      'Opaque public identifier of the Verification Request to retrieve within the owning Verification aggregate.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'verificationRequestPublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'verificationRequestPublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `verificationRequestPublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  verificationRequestPublicId!: string;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_PUBLIC_ID_LENGTH as VERIFICATION_REQUEST_QUERY_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as VERIFICATION_REQUEST_QUERY_PUBLIC_ID_MAX_LENGTH,
};
