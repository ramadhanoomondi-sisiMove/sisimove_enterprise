// -----------------------------------------------------------------------------
// Accounting — Get Accounting Period Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving a single Accounting Period aggregate by
// its public identifier.
//
// The query represents the application-level intent:
//
//     Get Accounting Period
//
// The query handler is responsible for loading the Accounting Period through
// AccountingPeriodRepository.
//
// This query does NOT:
//
// - modify the Accounting Period aggregate;
// - modify AccountingPeriodEntity;
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

import type { AccountingPeriodPublicId } from '../../domain/value-objects/accounting-period-public-id.vo';

// =============================================================================
// Query
// =============================================================================

export class GetAccountingPeriodQuery implements Query {
  public constructor(
    /**
     * Public identifier of the Accounting Period aggregate.
     */
    public readonly publicId: AccountingPeriodPublicId,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAccountingPeriodQuery;
