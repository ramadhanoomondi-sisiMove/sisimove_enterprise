// -----------------------------------------------------------------------------
// Verification — Get Verification Request Query DTO
// -----------------------------------------------------------------------------
//
// Transport/query DTO for retrieving a single Verification Request owned by a
// Verification aggregate.
//
// The DTO maps transport input into:
//
//     GetVerificationRequestQuery
//
// Aggregate ownership:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity[]
//
// Query responsibility:
//
// - identify the owning Verification aggregate;
// - identify the requested Verification Request;
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
// - contain business logic;
// - introduce a VerificationRequestRepository.
//
// IMPORTANT
//
// VerificationRequestEntity is an owned child entity, not an aggregate root.
//
// Therefore:
//
// - verificationPublicId identifies the owning Verification aggregate;
// - requestPublicId identifies the requested owned Verification Request;
// - both identifiers are required;
// - the application handler resolves the Verification aggregate and obtains
//   the request through the aggregate boundary.
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
 * Both public identifiers are required to construct:
 *
 *     GetVerificationRequestQuery
 *
 * The Verification Request remains an aggregate-owned child entity and is
 * therefore never resolved independently at the repository boundary.
 */
export class GetVerificationRequestQueryDto {
  // ===========================================================================
  // Verification Public ID
  // ===========================================================================

  /**
   * Public identifier of the owning Verification aggregate.
   *
   * This identifies the aggregate boundary within which the requested
   * Verification Request exists.
   */
  @ApiProperty({
    example: 'VER-01K3R8Y7Q2',
    description:
      'Opaque public identifier of the owning Verification aggregate.',
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
   * Public identifier of the Verification Request owned by the Verification
   * aggregate.
   *
   * This identifier is resolved only within the owning Verification aggregate
   * boundary.
   */
  @ApiProperty({
    example: 'VREQ-01K3R9A4B7',
    description:
      'Opaque public identifier of the owned Verification Request to retrieve.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'requestPublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'requestPublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `requestPublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  requestPublicId!: string;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_PUBLIC_ID_LENGTH as VERIFICATION_REQUEST_QUERY_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as VERIFICATION_REQUEST_QUERY_PUBLIC_ID_MAX_LENGTH,
};
