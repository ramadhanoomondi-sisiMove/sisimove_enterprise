// -----------------------------------------------------------------------------
// Financial Payment Provider — Get Available Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving providers available to users when adding
// a Financial Payment Method.
//
// Only operational providers should be returned.
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

/**
 * Query for retrieving available Financial Payment Providers.
 */
export class GetAvailableFinancialPaymentProvidersQuery extends Query {
  public constructor() {
    super();
  }
}

export default GetAvailableFinancialPaymentProvidersQuery;
