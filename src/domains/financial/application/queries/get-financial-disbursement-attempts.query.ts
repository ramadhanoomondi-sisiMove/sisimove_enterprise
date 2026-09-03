// -----------------------------------------------------------------------------
// Financial Disbursement — Get Attempts Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving the execution attempts belonging to an
// existing Financial Disbursement.
//
// The query carries a domain-ready Financial Disbursement public identifier.
//
// Query behavior belongs to the application/query layer.
// Repository access and aggregate rehydration belong to the query handler.
//
// FinancialDisbursementAttemptEntity instances are owned by the
// FinancialDisbursementEntity and are therefore retrieved through the
// Financial Disbursement aggregate boundary.
//
// The query does NOT:
//
// - access persistence directly;
// - expose persistence models;
// - address FinancialDisbursementAttemptEntity as an independent aggregate;
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
 * Query for retrieving all execution attempts belonging to a Financial
 * Disbursement.
 *
 * The public identity identifies the owning Financial Disbursement aggregate.
 *
 * The query handler is responsible for resolving the aggregate through the
 * FinancialDisbursementRepository and returning its authoritative attempt
 * collection.
 */
export class GetFinancialDisbursementAttemptsQuery extends Query {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Financial Disbursement whose execution attempts
     * should be retrieved.
     *
     * This identifies the aggregate root rather than an individual attempt.
     */
    public readonly disbursementPublicId: FinancialDisbursementPublicId,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialDisbursementAttemptsQuery;
