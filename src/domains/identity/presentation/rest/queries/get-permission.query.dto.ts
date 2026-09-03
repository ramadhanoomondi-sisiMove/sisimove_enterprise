// -----------------------------------------------------------------------------
// Identity — Get Permission Query DTO
// -----------------------------------------------------------------------------
//
// Transport/query DTO for retrieving a single Permission aggregate by its
// public identifier.
//
// The DTO maps transport input into:
//
//     GetPermissionQuery
//
// Aggregate:
//
// PermissionAggregate
// └── PermissionEntity
//
// Query responsibility:
//
// - identify the Permission aggregate by its public identifier;
// - remain immutable;
// - contain no business logic;
// - contain no persistence concerns;
// - contain no authorization logic;
// - contain no aggregate mutation logic.
//
// The query handler is responsible for:
//
// - resolving the Permission aggregate through PermissionRepository;
// - handling the not-found case;
// - translating the aggregate into the application response/read model.
//
// This DTO does NOT:
//
// - mutate the Permission aggregate;
// - evaluate authorization;
// - assign Permissions to Roles;
// - remove Permissions from Roles;
// - manage RolePermission;
// - access Prisma or ORM models;
// - communicate with external systems.
//
// -----------------------------------------------------------------------------
//
// Lookup:
//
// PermissionPublicId
//
// The public identifier is the external/application-facing identity of the
// Permission. Internal persistence identifiers remain an infrastructure
// concern and are intentionally not exposed.
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
 * Transport DTO for retrieving a single Permission aggregate by public
 * identifier.
 *
 * The Permission public identifier is the application-facing identifier used
 * to construct GetPermissionQuery.
 *
 * Internal persistence identifiers remain an infrastructure concern and are
 * intentionally not exposed.
 */
export class GetPermissionQueryDto {
  // ===========================================================================
  // Permission Public ID
  // ===========================================================================

  /**
   * Public identifier of the Permission aggregate to retrieve.
   *
   * This is an opaque public identifier and not a persistence identifier.
   */
  @ApiProperty({
    example: 'PERM-01K3R8Y7Q2',
    description:
      'Opaque public identifier of the Permission aggregate to retrieve.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'permissionPublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'permissionPublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `permissionPublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  permissionPublicId!: string;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_PUBLIC_ID_LENGTH as PERMISSION_QUERY_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as PERMISSION_QUERY_PUBLIC_ID_MAX_LENGTH,
};
