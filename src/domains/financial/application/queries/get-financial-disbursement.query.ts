// -----------------------------------------------------------------------------
// Financial Disbursement — Get Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving an existing Financial Disbursement
// aggregate.
//
// The query carries a domain-ready public identifier.
//
// Query behavior belongs to the application/query layer.
// Repository access and aggregate rehydration belong to the query handler.
//
// The query does NOT:
//
// - access persistence directly;
// - expose persistence models;
// - resolve internal entity identifiers;
// - mutate the Financial Disbursement aggregate;
// - execute provider operations;
// - modify Financial Account balances;
// - create or post Financial Transactions.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { FinancialDisbursementPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Query for retrieving a Financial Disbursement aggregate by public identity.
 *
 * The public identity is used as the application-facing identifier.
 *
 * The query handler is responsible for resolving the aggregate through the
 * FinancialDisbursementRepository.
 */
export class GetFinancialDisbursementQuery extends Query {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Financial Disbursement to retrieve.
     *
     * This is the externally meaningful Financial Disbursement identity and
     * remains distinct from the aggregate's internal persistence identity.
     */
    public readonly disbursementPublicId: FinancialDisbursementPublicId,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialDisbursementQuery;
