// -----------------------------------------------------------------------------
// Identity — Get Role Permission Query DTO
// -----------------------------------------------------------------------------
//
// Transport/query DTO for retrieving a single RolePermission aggregate by its
// public identifier.
//
// The DTO maps transport input into:
//
//     GetRolePermissionQuery
//
// Aggregate:
//
// RolePermissionAggregate
// └── RolePermissionEntity
//
// Query responsibility:
//
// - identify the RolePermission aggregate by its public identifier;
// - remain immutable;
// - contain no business logic;
// - contain no persistence concerns;
// - contain no authorization logic;
// - contain no aggregate mutation logic.
//
// The query handler is responsible for:
//
// - resolving the RolePermission aggregate through
//   RolePermissionRepository;
// - handling the not-found case;
// - translating the aggregate into the application response/read model.
//
// This DTO does NOT:
//
// - mutate the RolePermission aggregate;
// - create or revoke assignments;
// - create or modify Roles;
// - create or modify Permissions;
// - evaluate authorization;
// - determine Role or Permission eligibility;
// - access Prisma or ORM models;
// - communicate with external systems.
//
// -----------------------------------------------------------------------------
//
// Lookup:
//
// RolePermissionPublicId
//
// The public identifier identifies the RolePermission assignment itself.
//
// Role and Permission public identifiers are separate cross-aggregate
// references owned by the RolePermission aggregate.
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
 * Transport DTO for retrieving a single RolePermission aggregate by public
 * identifier.
 *
 * The RolePermission public identifier is the application-facing identifier
 * used to construct GetRolePermissionQuery.
 *
 * Internal persistence identifiers remain an infrastructure concern and are
 * intentionally not exposed.
 */
export class GetRolePermissionQueryDto {
  // ===========================================================================
  // RolePermission Public ID
  // ===========================================================================

  /**
   * Public identifier of the RolePermission aggregate to retrieve.
   *
   * This identifies the RolePermission assignment itself and is distinct from
   * the public identifiers of the referenced Role and Permission aggregates.
   */
  @ApiProperty({
    example: 'RP-01K3R8Y7Q2',
    description:
      'Opaque public identifier of the RolePermission assignment to retrieve.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'rolePermissionPublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'rolePermissionPublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `rolePermissionPublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  rolePermissionPublicId!: string;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_PUBLIC_ID_LENGTH as ROLE_PERMISSION_QUERY_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as ROLE_PERMISSION_QUERY_PUBLIC_ID_MAX_LENGTH,
};
