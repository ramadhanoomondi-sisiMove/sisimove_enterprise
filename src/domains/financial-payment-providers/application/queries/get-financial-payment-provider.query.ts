
// -----------------------------------------------------------------------------
// Financial Payment Provider — Get Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving a Financial Payment Provider aggregate
// by its public identity.
//
// The query does not mutate provider aggregates.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import type { FinancialPaymentProviderPublicId } from '../../domain/value-objects/financial-payment-provider-public-id.vo';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Query for retrieving a Financial Payment Provider by public ID.
 */
export class GetFinancialPaymentProviderQuery extends Query {
  public constructor(
    public readonly providerPublicId: FinancialPaymentProviderPublicId,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialPaymentProviderQuery;
