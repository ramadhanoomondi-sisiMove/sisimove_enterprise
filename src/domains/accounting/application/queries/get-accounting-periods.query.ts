// -----------------------------------------------------------------------------
// Accounting — Get Accounting Periods Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving Accounting Period aggregates.
//
// The query represents the application-level intent:
//
//     Get Accounting Periods
//
// An optional lifecycle status may be supplied to restrict the result.
//
// The query handler is responsible for selecting the appropriate repository
// query.
//
// This query does NOT:
//
// - modify Accounting Period aggregates;
// - access Prisma;
// - access infrastructure directly;
// - perform authorization checks;
// - validate other aggregates;
// - publish domain events;
// - perform application orchestration outside query selection.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Accounting
// -----------------------------------------------------------------------------

import type { AccountingPeriodStatus } from '../../domain/value-objects/accounting-period-status.vo';

// =============================================================================
// Query
// =============================================================================

export class GetAccountingPeriodsQuery implements Query {
  public constructor(
    /**
     * Optional Accounting Period lifecycle status filter.
     *
     * When omitted, the query represents a request for all Accounting Periods.
     */
    public readonly status?: AccountingPeriodStatus,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAccountingPeriodsQuery;
