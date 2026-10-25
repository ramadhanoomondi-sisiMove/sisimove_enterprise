// -----------------------------------------------------------------------------
// Financial Account Holds — Get All Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving all Financial Account Holds across all
// Financial Accounts, regardless of lifecycle status.
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
 * Query for retrieving all Financial Account Hold aggregates across all
 * Financial Accounts.
 *
 * Includes ACTIVE, RELEASED, CAPTURED and CANCELLED holds.
 */
export class GetAllFinancialAccountHoldsQuery extends Query {
  public constructor() {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAllFinancialAccountHoldsQuery;
