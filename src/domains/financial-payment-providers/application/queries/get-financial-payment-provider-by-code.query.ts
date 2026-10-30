// -----------------------------------------------------------------------------
// Financial Payment Provider — Get By Code Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving a Financial Payment Provider aggregate
// by its business code.
//
// The code is a domain value object, not a persistence identifier.
// The query does not mutate provider aggregates.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import type { FinancialPaymentProviderCode } from '../../domain/value-objects/financial-payment-provider-code.vo';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Query for retrieving a Financial Payment Provider by its business code.
 */
export class GetFinancialPaymentProviderByCodeQuery extends Query {
  public constructor(public readonly code: FinancialPaymentProviderCode) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialPaymentProviderByCodeQuery;
