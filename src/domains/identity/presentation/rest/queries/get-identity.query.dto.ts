// -----------------------------------------------------------------------------
// Identity — Get Identity Query DTO
// -----------------------------------------------------------------------------
//
// Transport/query DTO for retrieving an existing Identity aggregate by its
// public identifier.
//
// The DTO maps transport input into:
//
//     GetIdentityQuery
//
// Aggregate:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity[]
//
// The DTO does NOT:
//
// - access persistence directly;
// - expose Prisma or ORM models;
// - resolve internal entity identifiers;
// - mutate the Identity aggregate;
// - assign or revoke Identity Roles;
// - execute authentication;
// - manage sessions, devices, recovery, or OTP challenges;
// - manage verification;
// - evaluate permissions;
// - persist the aggregate.
//
// The query handler is responsible for resolving the complete
// IdentityAggregate through the IdentityRepository.
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
 * Transport DTO for retrieving an existing Identity aggregate by public
 * identity.
 *
 * The public identity is the application-facing identifier used to construct
 * GetIdentityQuery.
 *
 * Required transport input:
 *
 * - identityPublicId.
 *
 * Internal persistence identifiers remain an infrastructure concern and are
 * intentionally not exposed.
 */
export class GetIdentityQueryDto {
  // ===========================================================================
  // Identity Public ID
  // ===========================================================================

  /**
   * Public identifier of the Identity aggregate to retrieve.
   *
   * This is the externally meaningful Identity identifier and remains distinct
   * from the aggregate's internal persistence identity.
   */
  @ApiProperty({
    example: 'IDN-01K3R8Y7Q2',
    description:
      'Opaque public identifier of the Identity aggregate to retrieve.',
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
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_PUBLIC_ID_LENGTH as IDENTITY_QUERY_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as IDENTITY_QUERY_PUBLIC_ID_MAX_LENGTH,
};
