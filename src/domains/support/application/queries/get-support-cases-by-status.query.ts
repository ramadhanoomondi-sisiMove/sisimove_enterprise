// -----------------------------------------------------------------------------
// Support — Get Support Cases By Status Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving SupportCase aggregates having a specific
// lifecycle status.
//
// The query handler is responsible for loading complete SupportCase
// aggregates through SupportCaseRepository.findByStatus().
//
// This query is persistence-oriented and does not define SupportCase lifecycle
// policy.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { SupportCaseStatus } from '../../domain/value-objects/support-case-status.vo';

// =============================================================================
// Query
// =============================================================================

export class GetSupportCasesByStatusQuery implements Query {
  public constructor(
    /**
     * Support Case lifecycle status used as the persistence filter.
     */
    public readonly status: SupportCaseStatus,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetSupportCasesByStatusQuery;
