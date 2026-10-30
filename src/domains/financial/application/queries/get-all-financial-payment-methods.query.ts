// -----------------------------------------------------------------------------
// Financial Payment Method — Get All Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving all Financial Payment Method aggregates.
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
// Query
// -----------------------------------------------------------------------------

/**
 * Query for retrieving all Financial Payment Method aggregates.
 */
export class GetAllFinancialPaymentMethodsQuery extends Query {
  public constructor() {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAllFinancialPaymentMethodsQuery;
