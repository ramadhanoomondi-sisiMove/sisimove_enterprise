// -----------------------------------------------------------------------------
// sisiMove — Assets
// Query Handlers
// -----------------------------------------------------------------------------
//
// Central export surface for Asset application query handlers.
//
// Asset queries are separated according to what the application is asking the
// Asset domain to provide.
//
//
// GetAssetHandler
//     = retrieves a single Asset aggregate.
//
//
// GetAssetsHandler
//     = retrieves multiple Asset aggregates.
//
//
// GetAssetByObjectKeyHandler
//     = retrieves an Asset by its physical object-key identity.
//
//
// GetAssetsByOwnerHandler
//     = retrieves Assets belonging to an owner.
//
//
// GetAssetsByCategoryHandler
//     = retrieves Assets belonging to a category.
//
//
// GetAssetsByStatusHandler
//     = retrieves Assets by lifecycle status.
//
//
// CheckAssetExistsHandler
//     = checks whether an Asset exists.
//
//
// GetPublicAssetContentHandler
//     = retrieves the physical content of a public, usable Asset.
//
//
// GetPublicAssetReferenceQueryHandler
//     = resolves the consumer-facing public reference of a public, usable
//       Asset, including its public identity and delivery URL.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT
//
// Public Asset content and public Asset reference are intentionally separate
// application capabilities.
//
//
// GetPublicAssetContentHandler
//
//     Asset
//       │
//       ▼
//     physical content
//
//
//
// GetPublicAssetReferenceQueryHandler
//
//     Asset
//       │
//       ▼
//     public identity + delivery URL
//
//
// The reference handler does not retrieve physical content.
//
// The content handler does not resolve consumer-facing delivery URLs.
//
// This separation keeps Asset storage access distinct from Asset delivery
// resolution.
//
// -----------------------------------------------------------------------------
//
// HTTP / APPLICATION BOUNDARY
//
// The HTTP layer consumes these handlers through the Asset application
// module's DI tokens.
//
// The handlers themselves remain independent of HTTP concerns.
//
// -----------------------------------------------------------------------------

export { GetAssetHandler } from './get-asset.handler';

export { GetAssetsHandler } from './get-assets.handler';

export { GetAssetByObjectKeyHandler } from './get-asset-by-object-key.handler';

export { GetAssetsByOwnerHandler } from './get-assets-by-owner.handler';

export { GetAssetsByCategoryHandler } from './get-assets-by-category.handler';

export { GetAssetsByStatusHandler } from './get-assets-by-status.handler';

export { CheckAssetExistsHandler } from './check-asset-exists.handler';

export { GetPublicAssetContentHandler } from './get-public-asset-content.handler';

export { GetPublicAssetReferenceQueryHandler } from './get-public-asset-reference.handler';
