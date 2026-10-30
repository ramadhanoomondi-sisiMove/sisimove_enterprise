
// -----------------------------------------------------------------------------
// Financial Payment Provider — Get All Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving all Financial Payment Provider aggregates.
//
// The query does not mutate provider aggregates.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Query for retrieving all Financial Payment Provider aggregates.
 */
export class GetFinancialPaymentProvidersQuery extends Query {
  public constructor() {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialPaymentProvidersQuery;
