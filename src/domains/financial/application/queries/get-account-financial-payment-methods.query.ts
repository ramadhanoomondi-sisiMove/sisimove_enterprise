// -----------------------------------------------------------------------------
// Financial Payment Method — Get Account Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving all Financial Payment Methods belonging
// to a specific Financial Account.
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
 * Query for retrieving all Financial Payment Methods belonging to a
 * Financial Account.
 *
 * Includes active and inactive payment methods.
 */
export class GetAccountFinancialPaymentMethodsQuery extends Query {
  public constructor(
    /**
     * Public identity of the Financial Account whose payment methods
     * should be retrieved.
     */
    public readonly accountPublicId: FinancialAccountPublicId,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAccountFinancialPaymentMethodsQuery;
