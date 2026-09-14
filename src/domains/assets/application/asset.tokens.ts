// -----------------------------------------------------------------------------
// sisiMove — Assets Application DI Tokens
// -----------------------------------------------------------------------------
//
// Central dependency-injection tokens for the Asset application layer.
//
// Covers:
//
// - repositories;
// - application-facing storage and delivery ports;
// - command handlers;
// - query handlers.
//
// Aggregate boundary:
//
// AssetAggregate
// └── AssetEntity
//
// IMPORTANT:
//
// Asset is responsible for asset metadata, identity, ownership, visibility,
// classification, and lifecycle.
//
// Physical file storage is represented through AssetStoragePort.
//
// Public asset delivery is represented through AssetDeliveryPort.
//
// The application layer coordinates use cases and delegates business rules
// to AssetAggregate and AssetEntity.
//
// Concrete infrastructure implementations are bound to these tokens by the
// infrastructure dependency-injection layer.
//
// The application layer MUST NOT import concrete infrastructure storage or
// delivery implementations directly.
//
// -----------------------------------------------------------------------------
//
// Asset responsibilities:
//
// - asset creation;
// - physical asset upload orchestration;
// - asset readiness;
// - asset archival;
// - asset deletion;
// - asset visibility;
// - asset retrieval;
// - public asset content retrieval;
// - public asset reference resolution;
// - asset ownership queries;
// - asset classification queries;
// - asset lifecycle queries.
//
// -----------------------------------------------------------------------------
//
// Storage boundary:
//
// AssetStoragePort represents the application-facing abstraction for physical
// asset storage.
//
// It deals with the physical object:
//
// - storage provider;
// - bucket;
// - object key;
// - content stream;
// - MIME type;
// - physical size.
//
// Concrete implementations may include:
//
// - local filesystem storage;
// - Bunny;
// - AWS S3;
// - Google Cloud Storage;
// - Azure Blob Storage;
// - Cloudinary;
// - other supported storage providers.
//
// Storage credentials, SDKs, filesystem APIs, provider-specific types, and
// physical storage concerns remain inside infrastructure.
//
// -----------------------------------------------------------------------------
//
// Delivery boundary:
//
// AssetDeliveryPort represents the application-facing abstraction for resolving
// a consumer-facing URL for a usable Asset.
//
// It is deliberately separate from AssetStoragePort.
//
// Storage answers:
//
//     "Where is the physical object stored?"
//
// Delivery answers:
//
//     "How can a consumer access this Asset?"
//
// This allows the physical storage implementation and public delivery
// mechanism to evolve independently.
//
// -----------------------------------------------------------------------------
//
// Public asset content:
//
// GetPublicAssetContentHandler is intentionally separate from GetAssetHandler.
//
// GetAssetHandler returns the Asset aggregate for Asset-management use cases.
//
// GetPublicAssetContentHandler:
//
// - accepts only AssetPublicId;
// - resolves the Asset aggregate;
// - verifies that the Asset is public;
// - verifies that the Asset is usable;
// - retrieves the physical content through AssetStoragePort;
// - returns the storage content stream and metadata.
//
// HTTP response handling remains in the controller.
//
// -----------------------------------------------------------------------------
//
// Public asset reference:
//
// GetPublicAssetReferenceHandler is intentionally separate from both
// GetAssetHandler and GetPublicAssetContentHandler.
//
// GetPublicAssetReferenceHandler:
//
// - accepts only AssetPublicId;
// - resolves the Asset aggregate;
// - verifies that the Asset is public;
// - verifies that the Asset is usable;
// - resolves a consumer-facing URL through AssetDeliveryPort;
// - returns a small public asset reference.
//
// This capability is intended for public read-model composition across
// bounded contexts, for example:
//
// Trust badge
//     ↓
// opaque assetPublicId
//     ↓
// Asset public-reference query
//     ↓
// public asset URL
//
// Other bounded contexts must not know about:
//
// - storage provider;
// - bucket;
// - object key;
// - filesystem paths;
// - storage SDKs;
// - delivery implementation details.
//
// The Asset bounded context remains responsible for deciding whether an Asset
// can be publicly represented.
//
// -----------------------------------------------------------------------------
//
// Public asset reference versus public content:
//
// GET_PUBLIC_ASSET_CONTENT:
//
//     public ID
//         ↓
//     AssetAggregate
//         ↓
//     public + usable verification
//         ↓
//     AssetStoragePort
//         ↓
//     AssetStorageObjectContent
//
// GET_PUBLIC_ASSET_REFERENCE:
//
//     public ID
//         ↓
//     AssetAggregate
//         ↓
//     public + usable verification
//         ↓
//     AssetDeliveryPort
//         ↓
//     PublicAssetReference
//
// The first retrieves physical content.
//
// The second resolves a consumer-facing URL.
//
// Neither handler owns HTTP transport concerns.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Asset Tokens
// =============================================================================

export const ASSET_TOKENS = {
  // ===========================================================================

  // Repositories

  // ===========================================================================

  REPOSITORIES: {
    /**
     * Asset aggregate repository.
     *
     * Infrastructure provides the concrete persistence implementation.
     */
    ASSET: Symbol('AssetRepository'),
  } as const,

  // ===========================================================================

  // Application Services / Ports

  // ===========================================================================

  APPLICATION_SERVICES: {
    /**
     * Asset physical-storage abstraction.
     *
     * Used by application handlers to upload and retrieve physical Asset
     * objects without depending on a concrete storage provider.
     *
     * Physical storage operations remain behind AssetStoragePort.
     */
    ASSET_STORAGE: Symbol('AssetStoragePort'),

    /**
     * Asset delivery abstraction.
     *
     * Resolves consumer-facing URLs for usable Assets.
     *
     * AssetDeliveryPort is deliberately separate from AssetStoragePort:
     *
     * AssetStoragePort
     *     = physical object storage
     *
     * AssetDeliveryPort
     *     = consumer-facing delivery
     */
    ASSET_DELIVERY: Symbol('AssetDeliveryPort'),
  } as const,

  // ===========================================================================

  // Command Handlers

  // ===========================================================================

  COMMAND_HANDLERS: {
    // =========================================================================
    // Asset
    // =========================================================================

    /**
     * Creates an Asset aggregate.
     *
     * This establishes the Asset metadata and aggregate identity before
     * physical content is uploaded.
     */
    CREATE_ASSET: Symbol('CreateAssetHandler'),

    /**
     * Uploads the physical Asset object through AssetStoragePort.
     *
     * The handler coordinates physical storage with the Asset aggregate
     * lifecycle:
     *
     *     create
     *       ↓
     *     upload
     *       ↓
     *     UPLOADED
     *       ↓
     *     READY
     */
    UPLOAD_ASSET: Symbol('UploadAssetHandler'),

    /**
     * Archives an Asset aggregate.
     *
     * Archival changes Asset lifecycle state without physically deleting the
     * underlying object.
     */
    ARCHIVE_ASSET: Symbol('ArchiveAssetHandler'),

    /**
     * Deletes an Asset aggregate.
     *
     * The application workflow coordinates Asset lifecycle deletion with
     * physical storage removal where required.
     */
    DELETE_ASSET: Symbol('DeleteAssetHandler'),

    /**
     * Changes Asset visibility.
     *
     * Visibility controls whether a usable Asset may be exposed through
     * public delivery or public-reference resolution.
     */
    CHANGE_ASSET_VISIBILITY: Symbol('ChangeAssetVisibilityHandler'),
  } as const,

  // ===========================================================================

  // Query Handlers

  // ===========================================================================

  QUERY_HANDLERS: {
    // =========================================================================
    // Asset
    // =========================================================================

    /**
     * Retrieves an Asset aggregate by public ID.
     *
     * This is the general Asset-management read path and does not itself
     * retrieve physical file content.
     */
    GET_ASSET: Symbol('GetAssetHandler'),

    /**
     * Retrieves Assets using general query criteria.
     */
    GET_ASSETS: Symbol('GetAssetsHandler'),

    /**
     * Retrieves an Asset by its physical storage object key.
     */
    GET_ASSET_BY_OBJECT_KEY: Symbol('GetAssetByObjectKeyHandler'),

    /**
     * Retrieves Assets belonging to an Identity.
     */
    GET_ASSETS_BY_OWNER: Symbol('GetAssetsByOwnerHandler'),

    /**
     * Retrieves Assets by category.
     */
    GET_ASSETS_BY_CATEGORY: Symbol('GetAssetsByCategoryHandler'),

    /**
     * Retrieves Assets by lifecycle status.
     */
    GET_ASSETS_BY_STATUS: Symbol('GetAssetsByStatusHandler'),

    /**
     * Checks whether an Asset exists.
     */
    CHECK_ASSET_EXISTS: Symbol('CheckAssetExistsHandler'),

    /**
     * Retrieves the physical content of one publicly deliverable Asset.
     *
     * This query is intentionally separate from GET_ASSET.
     *
     * GET_ASSET:
     *
     *     public ID
     *         ↓
     *     AssetAggregate
     *
     * GET_PUBLIC_ASSET_CONTENT:
     *
     *     public ID
     *         ↓
     *     AssetAggregate
     *         ↓
     *     public + usable verification
     *         ↓
     *     AssetStoragePort
     *         ↓
     *     AssetStorageObjectContent
     *
     * The handler does not deal with HTTP responses, headers, URL generation,
     * Express/Nest response objects, or concrete storage implementations.
     */
    GET_PUBLIC_ASSET_CONTENT: Symbol('GetPublicAssetContentHandler'),

    /**
     * Resolves a public Asset identifier into a consumer-facing URL.
     *
     * This query is intended for public read-model composition across bounded
     * contexts, such as:
     *
     *     Trust badge
     *         ↓
     *     assetPublicId
     *         ↓
     *     public Asset reference
     *
     * GET_PUBLIC_ASSET_REFERENCE:
     *
     *     public ID
     *         ↓
     *     AssetAggregate
     *         ↓
     *     public + usable verification
     *         ↓
     *     AssetDeliveryPort
     *         ↓
     *     PublicAssetReference
     *
     * The handler does not:
     *
     * - retrieve physical file content;
     * - access storage directly;
     * - expose storage metadata;
     * - generate URLs in the consuming bounded context;
     * - handle HTTP responses;
     * - depend on a concrete delivery implementation.
     */
    GET_PUBLIC_ASSET_REFERENCE: Symbol('GetPublicAssetReferenceHandler'),
  } as const,
} as const;

// =============================================================================
// Default Export
// =============================================================================

export default ASSET_TOKENS;
