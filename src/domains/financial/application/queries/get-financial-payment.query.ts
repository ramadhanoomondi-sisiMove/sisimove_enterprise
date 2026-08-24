// -----------------------------------------------------------------------------
// Financial Payment — Get Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving an existing Financial Payment aggregate.
//
// The query carries a domain-ready public identifier.
//
// Query behavior belongs to the application/query layer.
// Repository access and aggregate rehydration belong to the query handler.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { FinancialPaymentPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Query for retrieving a Financial Payment aggregate by public identity.
 */
export class GetFinancialPaymentQuery extends Query {
  public constructor(
    /**
     * Public identity of the Financial Payment to retrieve.
     */
    public readonly paymentPublicId: FinancialPaymentPublicId,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialPaymentQuery;
