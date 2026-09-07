// -----------------------------------------------------------------------------
// Support — Get Support Cases By Priority Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving SupportCase aggregates having a specific
// priority.
//
// The query handler is responsible for loading complete SupportCase
// aggregates through SupportCaseRepository.findByPriority().
//
// Priority filtering is persistence-oriented. This query does not determine
// Support Case priority policy.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { SupportCasePriority } from '../../domain/value-objects/support-case-priority.vo';

// =============================================================================
// Query
// =============================================================================

export class GetSupportCasesByPriorityQuery implements Query {
  public constructor(
    /**
     * Support Case priority used as the persistence filter.
     */
    public readonly priority: SupportCasePriority,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetSupportCasesByPriorityQuery;
