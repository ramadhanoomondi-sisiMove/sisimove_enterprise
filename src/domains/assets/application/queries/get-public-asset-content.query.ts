// -----------------------------------------------------------------------------
// Assets — Get Public Asset Content Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving the physical content of one publicly
// deliverable Asset by its stable public identifier.
//
// Application intent:
//
//     Get Public Asset Content
//
// This query is intentionally different from GetAssetQuery.
//
// GetAssetQuery:
//
//     AssetPublicId
//          ↓
//     AssetAggregate
//
// It is used for authenticated Asset-management/read operations.
//
// GetPublicAssetContentQuery:
//
//     AssetPublicId
//          ↓
//     publicly deliverable Asset content
//
// It is used by the anonymous public Asset delivery boundary.
//
// -----------------------------------------------------------------------------
//
// RESPONSIBILITIES
// -----------------------------------------------------------------------------
//
// This query represents only the application-level request:
//
//     "Give me the content of this publicly deliverable Asset."
//
// The query does NOT:
//
// - access Prisma;
// - access physical storage;
// - generate URLs;
// - inspect files;
// - mutate the Asset aggregate;
// - perform HTTP response handling;
// - accept storage provider information;
// - accept bucket information;
// - accept object key information;
// - accept an owner Identity public ID.
//
// The Asset aggregate remains the authoritative source for all physical
// storage addressing.
//
// -----------------------------------------------------------------------------
//
// PUBLIC IDENTIFIER
// -----------------------------------------------------------------------------
//
// The caller provides only:
//
//     AssetPublicId
//
// The application layer resolves:
//
//     AssetPublicId
//          ↓
//     AssetAggregate
//          ↓
//     storageProvider
//     bucket
//     objectKey
//
// This prevents anonymous callers from supplying arbitrary physical storage
// locations.
//
// -----------------------------------------------------------------------------
//
// PUBLIC ASSET COMPOSITION
// -----------------------------------------------------------------------------
//
// A public Journey may contain multiple Assets originating from different
// bounded contexts:
//
//     Traveller
//         └── avatar
//
//     Vehicle
//         └── vehicle image
//
//     Trust Badge
//         └── badge image
//
//     Journey
//         └── journey/gallery images
//
// Each Asset remains independently addressable by AssetPublicId.
//
// This query therefore represents delivery of exactly ONE Asset. Collection
// composition belongs to the consuming public read boundary.
//
// For example:
//
//     PublicJourney
//         ├── provider.traveller.avatar
//         ├── provider.trust.badges[].asset
//         ├── vehicle.asset
//         └── assets[]
//
// Each resulting PublicAsset may expose a URL whose delivery ultimately
// resolves through:
//
//     GET /assets/public/:assetPublicId
//
// -----------------------------------------------------------------------------
//
// STORAGE BOUNDARY
// -----------------------------------------------------------------------------
//
// Physical storage remains behind:
//
//     AssetStoragePort
//
// The query itself knows nothing about:
//
// - local filesystem;
// - Bunny;
// - S3;
// - Cloudinary;
// - storage paths;
// - buckets;
// - object keys.
//
// Those concerns belong to the application handler and storage port boundary.
//
// -----------------------------------------------------------------------------
//
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

import type { AssetPublicId } from '../../domain/value-objects';

// =============================================================================
// Query
// =============================================================================

export class GetPublicAssetContentQuery implements Query {
  public constructor(
    /**
     * Stable public identifier of the Asset to be delivered.
     *
     * This is the only Asset identifier accepted by the anonymous public
     * delivery boundary.
     */
    public readonly publicId: AssetPublicId,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetPublicAssetContentQuery;
