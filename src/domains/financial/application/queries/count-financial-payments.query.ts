// -----------------------------------------------------------------------------
// Financial Payment — Count Query
// -----------------------------------------------------------------------------
//
// Application query for counting all Financial Payment records.
//
// The query carries no parameters because the dashboard requires the total
// number of Financial Payment records, regardless of status.
//
// Query behavior belongs to the application/query layer.
// Repository access belongs to the query handler.
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
 * Query for counting all Financial Payment records.
 */
export class CountFinancialPaymentsQuery extends Query {
  public constructor() {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CountFinancialPaymentsQuery;
