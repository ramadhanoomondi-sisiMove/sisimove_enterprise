// -----------------------------------------------------------------------------
// Financial Payment Method — Get Default Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving the default Financial Payment Method
// belonging to a Financial Account.
//
// The query carries the owning Financial Account public identity.
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

import type { FinancialAccountPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Query for retrieving the default Financial Payment Method belonging
 * to a Financial Account.
 */
export class GetDefaultFinancialPaymentMethodQuery extends Query {
  public constructor(
    /**
     * Public identity of the Financial Account whose default payment
     * method should be retrieved.
     */
    public readonly accountPublicId: FinancialAccountPublicId,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetDefaultFinancialPaymentMethodQuery;
