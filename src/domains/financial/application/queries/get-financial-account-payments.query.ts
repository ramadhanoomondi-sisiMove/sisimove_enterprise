// -----------------------------------------------------------------------------
// Financial Account — Get Financial Payments Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving Financial Payments associated with a
// Financial Account.
//
// FinancialAccountAggregate and FinancialPaymentAggregate remain separate
// aggregate roots.
//
// The query carries the Financial Account public identity as an opaque
// cross-aggregate reference.
//
// Repository access and aggregate retrieval belong to the query handler.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { FinancialAccountPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Query for retrieving Financial Payments belonging to a Financial Account.
 */
export class GetFinancialAccountPaymentsQuery extends Query {
  public constructor(
    /**
     * Public identity of the Financial Account whose payments are retrieved.
     */
    public readonly accountPublicId: FinancialAccountPublicId,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialAccountPaymentsQuery;
