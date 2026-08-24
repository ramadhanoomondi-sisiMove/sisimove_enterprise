// -----------------------------------------------------------------------------
// Financial Payment Method — Get Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving an existing Financial Payment Method
// aggregate by its public identity.
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

import type { FinancialPaymentMethodPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Query for retrieving a Financial Payment Method aggregate by public
 * identity.
 */
export class GetFinancialPaymentMethodQuery extends Query {
  public constructor(
    /**
     * Public identity of the Financial Payment Method to retrieve.
     */
    public readonly paymentMethodPublicId: FinancialPaymentMethodPublicId,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialPaymentMethodQuery;
