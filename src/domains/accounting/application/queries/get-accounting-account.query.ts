// -----------------------------------------------------------------------------
// Accounting — Get Accounting Account Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving a single Accounting Account aggregate by
// its public identifier.
//
// The query represents the application-level intent:
//
//     Get Accounting Account
//
// The query handler is responsible for loading the Accounting Account through
// AccountingAccountRepository.
//
// This query does NOT:
//
// - modify the Accounting Account aggregate;
// - modify AccountingAccountEntity;
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

import type { AccountingAccountPublicId } from '../../domain/value-objects/accounting-account-public-id.vo';

// =============================================================================
// Query
// =============================================================================

export class GetAccountingAccountQuery implements Query {
  public constructor(
    /**
     * Public identifier of the Accounting Account aggregate.
     */
    public readonly publicId: AccountingAccountPublicId,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAccountingAccountQuery;
