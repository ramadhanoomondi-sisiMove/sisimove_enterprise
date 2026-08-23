// -----------------------------------------------------------------------------
// Financial Account — Get Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving an existing Financial Account aggregate.
//
// The query carries a domain-ready public identifier.
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
 * Query for retrieving a Financial Account aggregate by public identity.
 */
export class GetFinancialAccountQuery extends Query {
  public constructor(
    /**
     * Public identity of the Financial Account to retrieve.
     */
    public readonly accountPublicId: FinancialAccountPublicId,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialAccountQuery;
