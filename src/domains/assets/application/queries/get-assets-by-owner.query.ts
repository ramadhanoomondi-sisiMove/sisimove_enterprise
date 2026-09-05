// -----------------------------------------------------------------------------
// Assets — Get Assets By Owner Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving Asset aggregates belonging to an Identity.
//
// AssetIdentityPublicId is an opaque cross-aggregate reference.
//
// This query does NOT:
//
// - load the Identity aggregate;
// - validate Identity state;
// - modify Identity;
// - perform authorization.
//
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

import type { AssetIdentityPublicId } from '../../domain/value-objects';

// =============================================================================
// Query
// =============================================================================

export class GetAssetsByOwnerQuery implements Query {
  public constructor(
    /**
     * Public identifier of the owning Identity aggregate.
     */
    public readonly identityPublicId: AssetIdentityPublicId,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAssetsByOwnerQuery;
