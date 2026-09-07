// -----------------------------------------------------------------------------
// Support — Get Support Cases By Assignee Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving SupportCase aggregates assigned to a
// specific support agent.
//
// The query handler is responsible for loading complete SupportCase
// aggregates through SupportCaseRepository.findByAssignedToPublicId().
//
// assignedToPublicId is an opaque Identity-domain public reference.
//
// The query does NOT:
//
// - validate the support agent;
// - dereference Identity;
// - perform authorization;
// - modify SupportCase aggregates;
// - access Prisma;
// - publish domain events.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { SupportCaseAssignedToPublicId } from '../../domain/value-objects/support-case-assigned-to-public-id.vo';

// =============================================================================
// Query
// =============================================================================

export class GetSupportCasesByAssigneeQuery implements Query {
  public constructor(
    /**
     * Public identity of the support agent assigned to the Support Cases.
     *
     * This is an opaque Identity-domain reference.
     */
    public readonly assignedToPublicId: SupportCaseAssignedToPublicId,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetSupportCasesByAssigneeQuery;
