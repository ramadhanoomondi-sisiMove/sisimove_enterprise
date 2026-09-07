// -----------------------------------------------------------------------------
// Support — Get Support Cases By Reference Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving SupportCase aggregates associated with an
// external resource reference.
//
// The reference is represented by:
//
// - referenceType;
// - referencePublicId.
//
// These are opaque cross-domain references.
//
// The query handler is responsible for loading complete SupportCase
// aggregates through SupportCaseRepository.findByReferenceTypeAndReferencePublicId().
//
// The query does NOT:
//
// - load the referenced aggregate;
// - validate the referenced resource;
// - dereference another bounded context;
// - modify SupportCase aggregates;
// - access Prisma;
// - publish domain events.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

// =============================================================================
// Query
// =============================================================================

export class GetSupportCasesByReferenceQuery implements Query {
  public constructor(
    /**
     * Type of the externally referenced resource.
     */
    public readonly referenceType: string,

    /**
     * Public identity of the externally referenced resource.
     */
    public readonly referencePublicId: string,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetSupportCasesByReferenceQuery;
