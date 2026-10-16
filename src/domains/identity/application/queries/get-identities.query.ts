/**
 * Identity — Get Identities Query
 *
 * Application query for retrieving a filtered, sorted, paginated collection
 * of Identity aggregates for administrative member management.
 *
 * Query behavior belongs to the application/query layer.
 * Repository access and aggregate retrieval belong to the query handler.
 *
 * This query does not access persistence, expose ORM models, mutate aggregates,
 * manage authentication, or evaluate permissions. HTTP validation and
 * authorization remain outside this query.
 */

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { IdentityStatus } from '../../domain/value-objects/identity-status.vo';
import type { IdentityRoleRolePublicId } from '../../domain/value-objects/identity-role-role-public-id.vo';

// -----------------------------------------------------------------------------
// Repository Directory Contract
// -----------------------------------------------------------------------------

import type {
  IdentityDirectorySortField,
  IdentityDirectorySortDirection,
} from '../../domain/repositories/identity.repository';

// =============================================================================
// Types
// =============================================================================

export type GetIdentitiesSortField = IdentityDirectorySortField;
export type GetIdentitiesSortDirection = IdentityDirectorySortDirection;

// =============================================================================
// Query
// =============================================================================

/**
 * Query for retrieving identities matching directory criteria.
 *
 * Pagination is one-based. The handler translates this query into repository
 * criteria; the repository is responsible for database-side filtering,
 * sorting, pagination, and total-count calculation.
 *
 * The application boundary must validate page/pageSize, date boundaries,
 * sort values, and any supplied filters before dispatching this query.
 */
export class GetIdentitiesQuery extends Query {
  public constructor(
    /** One-based page number. */
    public readonly page: number,

    /** Maximum number of identities requested for one page. */
    public readonly pageSize: number,

    /** Optional search across the supported identity directory fields. */
    public readonly search: string | undefined,

    /** Optional Identity lifecycle filter. */
    public readonly status: IdentityStatus | undefined,

    /** Optional opaque public identifier for filtering by active role. */
    public readonly rolePublicId: IdentityRoleRolePublicId | undefined,

    /** Optional inclusive lower creation-date boundary. */
    public readonly createdFrom: Date | undefined,

    /** Optional inclusive upper creation-date boundary. */
    public readonly createdTo: Date | undefined,

    /** Field used to sort matching identities. */
    public readonly sortBy: GetIdentitiesSortField,

    /** Direction used to sort matching identities. */
    public readonly sortDirection: GetIdentitiesSortDirection,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetIdentitiesQuery;
