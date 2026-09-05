// -----------------------------------------------------------------------------
// Accounting — Get Accounting Accounts Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving Accounting Account aggregates.
//
// The query represents the application-level intent:
//
//     Get Accounting Accounts
//
// Optional filtering may be supplied by account status and/or account type.
//
// The query handler is responsible for selecting the appropriate repository
// query and returning the matching Accounting Account aggregates.
//
// This query does NOT:
//
// - modify Accounting Account aggregates;
// - access Prisma;
// - access infrastructure directly;
// - perform authorization checks;
// - calculate account balances;
// - create journal entries;
// - post journals;
// - publish domain events.
//
// Repository selection and query orchestration belong to the application
// layer.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Accounting
// -----------------------------------------------------------------------------

import type { AccountingAccountStatus } from '../../domain/value-objects/accounting-account-status.vo';

import type { AccountingAccountType } from '../../domain/value-objects/accounting-account-type.vo';

// =============================================================================
// Query
// =============================================================================

export class GetAccountingAccountsQuery implements Query {
  public constructor(
    /**
     * Optional Accounting Account lifecycle status filter.
     */
    public readonly status?: AccountingAccountStatus,

    /**
     * Optional Accounting Account classification/type filter.
     */
    public readonly type?: AccountingAccountType,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAccountingAccountsQuery;
