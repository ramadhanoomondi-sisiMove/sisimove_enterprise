// -----------------------------------------------------------------------------
// sisiMove — Assets
// Queries
// -----------------------------------------------------------------------------
//
// Central export surface for Asset application queries.
//
// Query responsibilities:
//
// - retrieve one Asset aggregate;
// - retrieve collections of Assets;
// - retrieve Assets by object key, owner, category, or status;
// - check Asset existence;
// - resolve the public reference of a publicly deliverable Asset;
// - retrieve the physical content of a publicly deliverable Asset.
//
// -----------------------------------------------------------------------------
//
// PUBLIC ASSET QUERIES
//
// Public Asset reference and public Asset content are intentionally separate
// application capabilities.
//
//
// GetPublicAssetReferenceQuery
//
//     = resolves the consumer-facing public reference of a public, usable
//       Asset.
//
//     The result contains the stable public identity and consumer-facing
//     delivery URL.
//
//
//
// GetPublicAssetContentQuery
//
//     = retrieves the physical content of a public, usable Asset for the
//       HTTP delivery boundary.
//
//     The query accepts only the Asset public identity and does not expose
//     storage provider, bucket, object key, or other infrastructure details
//     to callers.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT
//
// The two public queries serve different delivery concerns:
//
//
//     Public Asset Reference
//             │
//             └── publicId + delivery URL
//
//
//
//     Public Asset Content
//             │
//             └── physical content stream
//
//
// Reference resolution does not retrieve physical content.
//
// Physical content retrieval does not exist merely to construct a URL.
//
// Keeping these capabilities separate prevents storage concerns from leaking
// into the public application contract.
//
// -----------------------------------------------------------------------------
//
// DOMAIN / INFRASTRUCTURE BOUNDARY
//
// Both public queries accept the Asset's public identity rather than exposing
// physical storage metadata to the HTTP caller.
//
// Storage provider, bucket, and object key remain internal Asset/application
// data and are resolved behind the appropriate application ports.
//
// -----------------------------------------------------------------------------

export { GetAssetQuery } from './get-asset.query';

export { GetAssetsQuery } from './get-assets.query';

export { GetAssetByObjectKeyQuery } from './get-asset-by-object-key.query';

export { GetAssetsByOwnerQuery } from './get-assets-by-owner.query';

export { GetAssetsByCategoryQuery } from './get-assets-by-category.query';

export { GetAssetsByStatusQuery } from './get-assets-by-status.query';

export { CheckAssetExistsQuery } from './check-asset-exists.query';

export type { CheckAssetExistsCriteria } from './check-asset-exists.query';

export { GetPublicAssetReferenceQuery } from './get-public-asset-reference.query';

export { GetPublicAssetContentQuery } from './get-public-asset-content.query';
