// -----------------------------------------------------------------------------
// Accounting — Get Accounting Journals By Source Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving Accounting Journal aggregates associated
// with a posting source.
//
// The query represents the application-level intent:
//
//     Get Accounting Journals By Source
//
// A posting source consists of:
//
//     sourceType
//     sourcePublicId
//
// The query handler is responsible for loading journals through
// AccountingJournalRepository.findByPostingSource().
//
// This query does NOT:
//
// - modify Accounting Journal aggregates;
// - access Prisma;
// - access infrastructure directly;
// - validate the source aggregate;
// - load the source aggregate;
// - interpret source-specific business rules;
// - authorize the caller;
// - publish domain events.
//
// The source identity is treated as an opaque cross-domain reference.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

// =============================================================================
// Query
// =============================================================================

export class GetAccountingJournalsBySourceQuery implements Query {
  public constructor(
    /**
     * Type/category of the aggregate or domain object that originated the
     * accounting posting.
     */
    public readonly sourceType: string,

    /**
     * Public identifier of the source that originated the accounting
     * posting.
     */
    public readonly sourcePublicId: string,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAccountingJournalsBySourceQuery;
