// -----------------------------------------------------------------------------
// Accounting — Get Accounting Account By Code Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving a single Accounting Account aggregate by
// its account code.
//
// The query represents the application-level intent:
//
//     Get Accounting Account By Code
//
// The query handler is responsible for loading the Accounting Account through
// AccountingAccountRepository.findByCode().
//
// Account code is expected to be unique at the persistence boundary.
//
// This query does NOT:
//
// - modify the Accounting Account aggregate;
// - modify AccountingAccountEntity;
// - access Prisma;
// - access infrastructure directly;
// - perform authorization checks;
// - create journal entries;
// - calculate account balances;
// - publish domain events.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Accounting
// -----------------------------------------------------------------------------

import type { AccountingAccountCode } from '../../domain/value-objects/accounting-account-code.vo';

// =============================================================================
// Query
// =============================================================================

export class GetAccountingAccountByCodeQuery implements Query {
  public constructor(
    /**
     * Account code of the Accounting Account to retrieve.
     */
    public readonly code: AccountingAccountCode,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAccountingAccountByCodeQuery;
