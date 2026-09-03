// -----------------------------------------------------------------------------
// Identity — Get Role Query DTO
// -----------------------------------------------------------------------------
//
// Transport/query DTO for retrieving a single Role aggregate by its public
// identifier.
//
// The DTO maps transport input into:
//
//     GetRoleQuery
//
// Aggregate:
//
// RoleAggregate
// └── RoleEntity
//
// Query responsibility:
//
// - identify the Role aggregate by its public identifier;
//
// The DTO does NOT:
//
// - access persistence directly;
// - expose Prisma or ORM models;
// - resolve internal entity identifiers;
// - mutate the Role aggregate;
// - assign Roles to Identities;
// - assign Permissions to Roles;
// - evaluate authorization;
// - contain business logic.
//
// The query handler is responsible for:
//
// - resolving the Role aggregate through RoleRepository;
// - handling the not-found case;
// - translating the aggregate into the application response/read model.
//
// Role is an independent aggregate root.
//
// Therefore this query does not involve:
//
// - IdentityRole;
// - RolePermission;
// - Identity aggregate;
// - Permission evaluation.
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
 * Transport DTO for retrieving a single Role aggregate by public identifier.
 *
 * The Role public identifier is the application-facing identifier used to
 * construct GetRoleQuery.
 *
 * Internal persistence identifiers remain an infrastructure concern and are
 * intentionally not exposed.
 */
export class GetRoleQueryDto {
  // ===========================================================================
  // Role Public ID
  // ===========================================================================

  /**
   * Public identifier of the Role aggregate to retrieve.
   *
   * This is an opaque public identifier and not a persistence identifier.
   */
  @ApiProperty({
    example: 'ROLE-01K3R8Y7Q2',
    description: 'Opaque public identifier of the Role aggregate to retrieve.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'rolePublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'rolePublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `rolePublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  rolePublicId!: string;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_PUBLIC_ID_LENGTH as ROLE_QUERY_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as ROLE_QUERY_PUBLIC_ID_MAX_LENGTH,
};
