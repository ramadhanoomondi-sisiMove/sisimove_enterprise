// -----------------------------------------------------------------------------
// Accounting — Get Accounting Journals Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving Accounting Journal aggregates.
//
// The query represents the application-level intent:
//
//     Get Accounting Journals
//
// Optional filters may be supplied for:
//
// - journal status;
// - accounting currency;
// - Accounting Period public identifier.
//
// The query handler is responsible for selecting the appropriate repository
// query and composing the requested result.
//
// This query does NOT:
//
// - modify Accounting Journal aggregates;
// - access Prisma;
// - access infrastructure directly;
// - validate Accounting Period existence;
// - determine whether an Accounting Period is open;
// - validate Accounting Account aggregates;
// - calculate or mutate journal balances;
// - authorize the caller;
// - publish domain events.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Accounting — Value Objects
// -----------------------------------------------------------------------------

import type { AccountingCurrency } from '../../domain/value-objects/accounting-currency.vo';

import type { AccountingJournalStatus } from '../../domain/value-objects/accounting-journal-status.vo';

import type { AccountingPeriodPublicId } from '../../domain/value-objects/accounting-period-public-id.vo';

// =============================================================================
// Query
// =============================================================================

export class GetAccountingJournalsQuery implements Query {
  public constructor(
    /**
     * Optional Accounting Journal lifecycle status filter.
     */
    public readonly status?: AccountingJournalStatus,

    /**
     * Optional accounting currency filter.
     */
    public readonly currency?: AccountingCurrency,

    /**
     * Optional Accounting Period public identifier filter.
     */
    public readonly periodPublicId?: AccountingPeriodPublicId,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAccountingJournalsQuery;
