// -----------------------------------------------------------------------------
// Identity — Get Identity Roles Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving the Role assignments owned by an Identity.
//
// Aggregate boundary:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity[]
//
// The query carries a domain-ready Identity public identifier.
//
// Query behavior belongs to the application/query layer.
// Repository access and aggregate rehydration belong to the query handler.
//
// The query does NOT:
//
// - access persistence directly;
// - expose persistence models;
// - resolve internal entity identifiers;
// - mutate the Identity aggregate;
// - assign a Role;
// - revoke a Role;
// - evaluate authorization permissions;
// - load or mutate the referenced Role aggregate.
//
// The Identity aggregate owns IdentityRoleEntity instances. Therefore, the
// query handler retrieves the Identity aggregate and reads its owned role
// assignments from the aggregate boundary.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { IdentityPublicId } from '../../domain/value-objects';

// =============================================================================
// Query
// =============================================================================

/**
 * Query for retrieving the Role assignments owned by an Identity.
 *
 * The Identity public identity is the application-facing identifier.
 *
 * The query handler is responsible for:
 *
 * - resolving the Identity aggregate through IdentityRepository;
 * - handling the case where the Identity does not exist;
 * - reading the aggregate-owned IdentityRoleEntity collection;
 * - mapping the resulting domain state into the appropriate read model.
 *
 * This query intentionally does not carry Role identifiers because it retrieves
 * the complete role-assignment collection owned by the specified Identity.
 */
export class GetIdentityRolesQuery extends Query {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Identity whose Role assignments are requested.
     *
     * This is the externally meaningful Identity identifier and remains
     * distinct from the aggregate's internal persistence identity.
     */
    public readonly identityPublicId: IdentityPublicId,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetIdentityRolesQuery;
