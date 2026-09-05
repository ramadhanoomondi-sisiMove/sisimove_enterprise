// -----------------------------------------------------------------------------
// Accounting — Get Accounting Journal Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving a single Accounting Journal aggregate by
// its public identifier.
//
// The query represents the application-level intent:
//
//     Get Accounting Journal
//
// The query handler is responsible for loading the Accounting Journal through
// AccountingJournalRepository.
//
// This query does NOT:
//
// - modify the Accounting Journal aggregate;
// - modify AccountingJournalEntity;
// - access Prisma;
// - access infrastructure directly;
// - perform authorization checks;
// - publish domain events;
// - perform application orchestration.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Accounting
// -----------------------------------------------------------------------------

import type { AccountingJournalPublicId } from '../../domain/value-objects/accounting-journal-public-id.vo';

// =============================================================================
// Query
// =============================================================================

export class GetAccountingJournalQuery implements Query {
  public constructor(
    /**
     * Public identifier of the Accounting Journal aggregate.
     */
    public readonly publicId: AccountingJournalPublicId,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAccountingJournalQuery;
