// -----------------------------------------------------------------------------
// Verification — Get Verification Requests Query DTO
// -----------------------------------------------------------------------------
//
// Transport/query DTO for retrieving the Verification Requests owned by a
// Verification aggregate.
//
// The DTO maps transport input into:
//
//     GetVerificationRequestsQuery
//
// Aggregate ownership:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity[]
//
// Query responsibility:
//
// - identify the Verification aggregate;
// - request its owned Verification Requests;
//
// The DTO does NOT:
//
// - access persistence directly;
// - expose Prisma or ORM models;
// - resolve internal entity identifiers;
// - mutate the Verification aggregate;
// - approve Verification Requests;
// - reject Verification Requests;
// - cancel Verification Requests;
// - expire Verification Requests;
// - mutate Verification lifecycle state;
// - contain query/business logic;
// - introduce a VerificationRequestRepository.
//
// The query handler is responsible for:
//
// - loading the Verification aggregate/read model;
// - retrieving the aggregate-owned Verification Requests;
// - translating the result into the application response.
//
// -----------------------------------------------------------------------------
//
// VerificationRequestEntity is NOT an independent aggregate.
//
// Therefore:
//
// - verificationPublicId identifies the owning Verification aggregate;
// - request identifiers are not accepted by this query;
// - no VerificationRequestRepository is introduced.
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
 * Transport DTO for retrieving all Verification Requests owned by a
 * Verification aggregate.
 *
 * The DTO contains only the public identifier required to construct:
 *
 *     GetVerificationRequestsQuery
 *
 * The VerificationRequestEntity collection remains owned by the
 * Verification aggregate.
 */
export class GetVerificationRequestsQueryDto {
  // ===========================================================================
  // Verification Public ID
  // ===========================================================================

  /**
   * Public identifier of the Verification aggregate whose Verification
   * Requests should be retrieved.
   *
   * This is the externally meaningful Verification identifier and remains
   * distinct from the aggregate's internal persistence identity.
   */
  @ApiProperty({
    example: 'VER-01K3R8Y7Q2',
    description:
      'Opaque public identifier of the Verification aggregate whose requests should be retrieved.',
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
  MIN_PUBLIC_ID_LENGTH as VERIFICATION_REQUESTS_QUERY_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as VERIFICATION_REQUESTS_QUERY_PUBLIC_ID_MAX_LENGTH,
};
