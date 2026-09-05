// -----------------------------------------------------------------------------
// Assets — Get Asset By Object Key Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving an Asset aggregate by its storage object
// key.
//
// The object key is treated as an opaque Asset storage identifier.
//
// The query does NOT communicate with the physical storage provider.
//
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

import type { AssetObjectKey } from '../../domain/value-objects';

// =============================================================================
// Query
// =============================================================================

export class GetAssetByObjectKeyQuery implements Query {
  public constructor(
    /**
     * Storage object key identifying the Asset.
     */
    public readonly objectKey: AssetObjectKey,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAssetByObjectKeyQuery;
