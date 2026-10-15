// -----------------------------------------------------------------------------
// Identity — Count Identities Query
// -----------------------------------------------------------------------------
//
// Application query for counting existing Identity records.
//
// Aggregate boundary:
//
// IdentityRepository
// └── count()
//
// The query carries no parameters because the count covers all Identity records.
//
// Query behavior belongs to the application/query layer.
// Repository access and counting belong to the query handler.
//
// The query does NOT:
//
// - access persistence directly;
// - expose Prisma or ORM models;
// - retrieve or rehydrate individual Identity aggregates;
// - mutate Identity aggregates;
// - assign or revoke Identity Roles;
// - execute authentication;
// - manage sessions, devices, recovery, or OTP challenges;
// - manage verification;
// - evaluate permissions;
// - persist data.
//
// The query handler is responsible for obtaining the count through the
// IdentityRepository.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// =============================================================================
// Query
// =============================================================================

/**
 * Query for counting all existing Identity records.
 *
 * This query carries no parameters.
 *
 * The query handler is responsible for obtaining the count through
 * IdentityRepository.count().
 *
 * The repository performs the count without requiring individual Identity
 * aggregates to be rehydrated.
 *
 * Note:
 * This count includes all Identity records because the current Identity
 * model does not define a separate IdentityType distinction.
 */
export class CountIdentitiesQuery extends Query {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor() {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CountIdentitiesQuery;
