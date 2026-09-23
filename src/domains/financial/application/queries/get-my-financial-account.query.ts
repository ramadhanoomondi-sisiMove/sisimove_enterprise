// -----------------------------------------------------------------------------
// Financial Account — Get My Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving the Financial Account belonging to the
// currently authenticated owner.
//
// The query carries the domain-ready owner public identifier.
//
// Query behavior belongs to the application/query layer.
// Repository access and aggregate rehydration belong to the query handler.
//
// Important:
//
// - This query does NOT accept an account public ID.
// - The authenticated owner is represented by an opaque
//   FinancialAccountOwnerPublicId.
// - Identity resolution remains outside the Financial domain.
// - The query itself performs no repository access or mutation.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { FinancialAccountOwnerPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Query for retrieving the Financial Account belonging to the
 * currently authenticated owner.
 */
export class GetMyFinancialAccountQuery extends Query {
  public constructor(
    /**
     * Public identity of the owner of the Financial Account.
     *
     * This is an opaque cross-domain reference to the owning Identity.
     */
    public readonly ownerPublicId: FinancialAccountOwnerPublicId,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetMyFinancialAccountQuery;
