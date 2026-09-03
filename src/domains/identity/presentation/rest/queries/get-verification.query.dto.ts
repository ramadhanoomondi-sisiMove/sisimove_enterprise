// -----------------------------------------------------------------------------
// Identity — Get Verification Query DTO
// -----------------------------------------------------------------------------
//
// Transport/query DTO for retrieving a Verification aggregate.
//
// The DTO maps transport input into:
//
//     GetVerificationQuery
//
// Aggregate boundary:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity[]
//
// Query responsibility:
//
// - identify the Verification aggregate;
// - provide its public identifier;
// - remain immutable transport input;
// - contain no business logic.
//
// The Verification aggregate is identified directly by its
// `verificationPublicId`.
//
// IMPORTANT:
//
// This DTO is intentionally aligned with:
//
//     GetVerificationQuery
//
// which receives:
//
//     VerificationPublicId
//
// The owning Identity is part of the Verification aggregate relationship,
// but is not required as a query parameter when the Verification public
// identifier is already known.
//
// The DTO does NOT:
//
// - access persistence directly;
// - expose ORM/database identifiers;
// - resolve internal entity identifiers;
// - mutate the Verification aggregate;
// - create a Verification;
// - create or modify a VerificationRequest;
// - grant verification;
// - reject verification;
// - reopen verification;
// - expire verification;
// - revoke verification;
// - evaluate verification eligibility;
// - perform external verification-provider operations.
//
// The query handler is responsible for resolving the Verification aggregate
// or appropriate read model and returning the application result.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     GET /verifications/VER-01K3R8Y8M4
//
// Route parameter:
//
//     {
//       "verificationPublicId": "VER-01K3R8Y8M4"
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
 * Transport DTO for retrieving a Verification aggregate by its public
 * identifier.
 *
 * The Verification public identifier is the authoritative application-facing
 * reference used to construct GetVerificationQuery.
 *
 * Required transport input:
 *
 * - verificationPublicId.
 *
 * The DTO intentionally does not expose:
 *
 * - internal database identifiers;
 * - Identity persistence identifiers;
 * - Verification status;
 * - Verification level;
 * - VerificationRequest state;
 * - domain events.
 *
 * Those concerns belong to the application, domain, and infrastructure
 * boundaries.
 */
export class GetVerificationQueryDto {
  // ===========================================================================
  // Verification Public ID
  // ===========================================================================

  /**
   * Public identifier of the Verification aggregate being retrieved.
   *
   * This is an opaque application-facing identifier and is distinct from the
   * internal persistence identifier.
   *
   * It corresponds directly to the Verification public identifier used by
   * GetVerificationQuery.
   */
  @ApiProperty({
    example: 'VER-01K3R8Y8M4',
    description:
      'Opaque public identifier of the Verification aggregate to retrieve.',
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
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_PUBLIC_ID_LENGTH as VERIFICATION_QUERY_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as VERIFICATION_QUERY_PUBLIC_ID_MAX_LENGTH,
};
