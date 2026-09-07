// -----------------------------------------------------------------------------
// Support — Get Support Cases By Category Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving SupportCase aggregates having a specific
// Support Case category.
//
// The query handler is responsible for loading complete SupportCase
// aggregates through SupportCaseRepository.findByCategory().
//
// Category filtering is persistence-oriented. This query does not determine
// Support Case categorization policy.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { SupportCaseCategory } from '../../domain/value-objects/support-case-category.vo';

// =============================================================================
// Query
// =============================================================================

export class GetSupportCasesByCategoryQuery implements Query {
  public constructor(
    /**
     * Support Case category used as the persistence filter.
     */
    public readonly category: SupportCaseCategory,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetSupportCasesByCategoryQuery;
