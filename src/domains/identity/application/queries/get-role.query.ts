// -----------------------------------------------------------------------------
// Identity — Get Role Query
// -----------------------------------------------------------------------------
//
// Read-model query for retrieving a single Role aggregate.
//
// Aggregate ownership:
//
// RoleAggregate
// └── RoleEntity
//
// Query responsibility:
//
// - identify the Role aggregate by its public identifier;
// - remain immutable;
// - contain no business logic;
// - contain no persistence concerns;
// - contain no authorization logic;
// - contain no aggregate mutation logic.
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
// - IdentityRole;
// - RolePermission;
// - Identity aggregate;
// - Permission evaluation.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { RolePublicId } from '../../domain/value-objects/role-public-id.vo';

// =============================================================================
// Query
// =============================================================================

/**
 * Requests a single Role by its public identifier.
 */
export class GetRoleQuery {
  public constructor(
    /**
     * Public identifier of the Role aggregate.
     */
    public readonly rolePublicId: RolePublicId,
  ) {}
}
