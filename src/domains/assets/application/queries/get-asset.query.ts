// -----------------------------------------------------------------------------
// Assets — Get Asset Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving a single Asset aggregate by its public
// identifier.
//
// The query represents the application-level intent:
//
//     Get Asset
//
// The query handler is responsible for loading the Asset aggregate through
// AssetRepository.
//
// This query does NOT:
//
// - modify the Asset aggregate;
// - modify AssetEntity;
// - access Prisma;
// - access physical storage;
// - generate URLs;
// - perform authorization checks.
//
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

import type { AssetPublicId } from '../../domain/value-objects';

// =============================================================================
// Query
// =============================================================================

export class GetAssetQuery implements Query {
  public constructor(
    /**
     * Public identifier of the Asset aggregate.
     */
    public readonly publicId: AssetPublicId,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAssetQuery;
