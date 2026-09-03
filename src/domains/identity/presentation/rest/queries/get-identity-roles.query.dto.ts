// -----------------------------------------------------------------------------
// Identity — Get Identity Roles Query DTO
// -----------------------------------------------------------------------------
//
// Transport/query DTO for retrieving the Role assignments owned by an Identity.
//
// The DTO maps transport input into:
//
//     GetIdentityRolesQuery
//
// Aggregate boundary:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity[]
//
// The DTO does NOT:
//
// - access persistence directly;
// - expose persistence or ORM models;
// - resolve internal entity identifiers;
// - mutate the Identity aggregate;
// - assign a Role;
// - revoke a Role;
// - evaluate authorization permissions;
// - load or mutate the referenced Role aggregate.
//
// The query handler resolves the Identity aggregate and reads its aggregate-owned
// IdentityRoleEntity collection.
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
 * Transport DTO for retrieving the Role assignments owned by an Identity.
 *
 * The public identity is the application-facing identifier used to construct
 * GetIdentityRolesQuery.
 *
 * Required transport input:
 *
 * - identityPublicId.
 *
 * The query retrieves the complete aggregate-owned role-assignment collection.
 * Individual Role identifiers are therefore intentionally not supplied.
 *
 * Internal persistence identifiers remain an infrastructure concern and are
 * intentionally not exposed.
 */
export class GetIdentityRolesQueryDto {
  // ===========================================================================
  // Identity Public ID
  // ===========================================================================

  /**
   * Public identifier of the Identity whose Role assignments are requested.
   *
   * This is the externally meaningful Identity identifier and remains distinct
   * from the aggregate's internal persistence identity.
   */
  @ApiProperty({
    example: 'IDN-01K3R8Y7Q2',
    description:
      'Opaque public identifier of the Identity whose Role assignments are requested.',
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
  MIN_PUBLIC_ID_LENGTH as IDENTITY_ROLES_QUERY_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as IDENTITY_ROLES_QUERY_PUBLIC_ID_MAX_LENGTH,
};
