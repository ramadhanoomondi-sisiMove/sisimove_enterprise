// -----------------------------------------------------------------------------
// Identity — Get Identity Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving an existing Identity aggregate.
//
// Aggregate:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity[]
//
// The query carries a domain-ready public identifier.
//
// Query behavior belongs to the application/query layer.
// Repository access and aggregate rehydration belong to the query handler.
//
// The query does NOT:
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
// The query handler is responsible for resolving the complete IdentityAggregate
// through the IdentityRepository.
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
 * Query for retrieving an existing Identity aggregate by public identity.
 *
 * The public identity is the application-facing identifier.
 *
 * The query handler is responsible for resolving the complete aggregate through
 * IdentityRepository.findByPublicId().
 *
 * The returned aggregate, when found, must represent the complete aggregate
 * boundary:
 *
 * IdentityAggregate
 * └── IdentityEntity
 *     └── IdentityRoleEntity[]
 *
 * Internal persistence identifiers remain an infrastructure concern and are not
 * exposed through this query.
 */
export class GetIdentityQuery extends Query {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Identity aggregate to retrieve.
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

export default GetIdentityQuery;
