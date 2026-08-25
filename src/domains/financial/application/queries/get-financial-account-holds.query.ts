// -----------------------------------------------------------------------------
// Financial Account Holds — Get Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving the ACTIVE Financial Account Holds
// belonging to a Financial Account.
//
// A Financial Account may have multiple ACTIVE holds simultaneously.
// Each hold represents funds reserved for a separate business workflow,
// such as a booking.
//
// The query carries a domain-ready Financial Account public identifier.
//
// Query behavior belongs to the application/query layer.
// Repository access and aggregate rehydration belong to the query handler.
//
// Only ACTIVE holds are relevant to this application query.
// RELEASED, CAPTURED and CANCELLED holds are terminal and are therefore
// excluded.
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
 * Query for retrieving the ACTIVE Financial Account Holds belonging to
 * a Financial Account.
 *
 * A Financial Account may have multiple ACTIVE holds simultaneously.
 */
export class GetFinancialAccountHoldsQuery extends Query {
  public constructor(
    /**
     * Public identity of the Financial Account whose ACTIVE holds
     * should be retrieved.
     */
    public readonly accountPublicId: FinancialAccountPublicId,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialAccountHoldsQuery;
