// -----------------------------------------------------------------------------
// Identity — Get Roles Query DTO
// -----------------------------------------------------------------------------
//
// Transport/query DTO for retrieving a collection of Role aggregates.
//
// The DTO maps transport input into:
//
//     GetRolesQuery
//
// Aggregate:
//
// RoleAggregate
// └── RoleEntity
//
// Query responsibility:
//
// - optionally constrain the Role collection through supported filters;
// - remain transport-focused;
// - contain no business logic;
// - contain no persistence concerns;
// - contain no authorization logic;
// - contain no aggregate mutation logic.
//
// The query handler is responsible for:
//
// - selecting the appropriate RoleRepository query;
// - retrieving the Role aggregates;
// - translating them into application response/read models.
//
// This DTO does NOT:
//
// - assign Roles to Identities;
// - revoke Roles from Identities;
// - evaluate permissions;
// - manage IdentityRole;
// - manage RolePermission.
//
// -----------------------------------------------------------------------------
//
// Supported filters:
//
// - isActive
// - isSystem
// - assignable
// - orderByDisplayOrder
//
// All filters are optional.
//
// When no filter is supplied, the handler should retrieve the complete Role
// collection using the repository's general collection strategy.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Swagger
// -----------------------------------------------------------------------------

import { ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Class Transformer
// -----------------------------------------------------------------------------

import { Type } from 'class-transformer';

// -----------------------------------------------------------------------------
// Class Validator
// -----------------------------------------------------------------------------

import { IsBoolean, IsOptional } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

/**
 * Transport DTO for retrieving a collection of Role aggregates.
 *
 * All properties are optional and correspond directly to the supported
 * GetRolesQueryFilters.
 */
export class GetRolesQueryDto {
  // ===========================================================================
  // Active Filter
  // ===========================================================================

  /**
   * Restricts the result to active or inactive Roles.
   */
  @ApiPropertyOptional({
    example: true,
    description: 'Restrict the result to active or inactive Roles.',
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({
    message: 'isActive must be a boolean.',
  })
  isActive?: boolean;

  // ===========================================================================
  // System Filter
  // ===========================================================================

  /**
   * Restricts the result to system-defined or custom Roles.
   */
  @ApiPropertyOptional({
    example: false,
    description: 'Restrict the result to system-defined or custom Roles.',
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({
    message: 'isSystem must be a boolean.',
  })
  isSystem?: boolean;

  // ===========================================================================
  // Assignable Filter
  // ===========================================================================

  /**
   * Restricts the result to Roles currently eligible for assignment.
   *
   * This is a domain-level read filter and is resolved by the query handler
   * through the appropriate RoleRepository query.
   */
  @ApiPropertyOptional({
    example: true,
    description:
      'Restrict the result to Roles currently eligible for assignment.',
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({
    message: 'assignable must be a boolean.',
  })
  assignable?: boolean;

  // ===========================================================================
  // Display Order
  // ===========================================================================

  /**
   * Orders the result by administrative display order.
   */
  @ApiPropertyOptional({
    example: true,
    description: 'Order the result by administrative display order.',
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({
    message: 'orderByDisplayOrder must be a boolean.',
  })
  orderByDisplayOrder?: boolean;
}
