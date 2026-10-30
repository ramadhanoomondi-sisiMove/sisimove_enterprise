// -----------------------------------------------------------------------------
// Financial Payment — Get All Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving all Financial Payment aggregates.
//
// This query does not require parameters because it requests the complete
// collection of Financial Payments.
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
 * Query for retrieving all Financial Payment aggregates.
 */
export class GetAllFinancialPaymentsQuery extends Query {
  public constructor() {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAllFinancialPaymentsQuery;
