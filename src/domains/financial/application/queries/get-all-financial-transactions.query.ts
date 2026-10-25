// -----------------------------------------------------------------------------
// Financial Transaction — Get All Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving all Financial Transactions.
//
// The query does not mutate Financial Transaction aggregates.
//
// Repository access and transaction retrieval belong to the query handler.
// Projection, authorization, and presentation concerns remain outside
// the domain.
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
 * Query for retrieving all Financial Transactions.
 */
export class GetAllFinancialTransactionsQuery extends Query {
  public constructor() {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAllFinancialTransactionsQuery;
