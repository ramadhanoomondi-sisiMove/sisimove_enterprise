// -----------------------------------------------------------------------------
// Financial Payments — Get My Payments Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving all Financial Payment aggregates belonging
// to the authenticated customer's Financial Account.
//
// The query carries a domain-ready Financial Account public identifier.
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
 * Query for retrieving all Financial Payments associated with a
 * Financial Account.
 *
 * The account identifier must be resolved from the authenticated customer's
 * identity by the calling application workflow.
 */
export class GetMyFinancialPaymentsQuery extends Query {
  public constructor(
    /**
     * Public identity of the Financial Account whose payments are retrieved.
     */
    public readonly accountId: FinancialAccountPublicId,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetMyFinancialPaymentsQuery;
