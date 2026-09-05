// -----------------------------------------------------------------------------
// Assets — Application DI Tokens
// -----------------------------------------------------------------------------
//
// Central dependency-injection tokens for the Asset application layer.
//
// Covers:
//
// - repositories;
// - storage services;
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
// Asset is responsible for asset metadata and lifecycle.
//
// Physical file storage is represented through AssetStoragePort.
//
// The application layer coordinates use cases and delegates business rules
// to AssetAggregate and AssetEntity.
//
// Concrete infrastructure implementations are bound to these tokens by the
// infrastructure dependency-injection layer.
//
// The application layer MUST NOT import concrete infrastructure storage
// implementations directly.
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
// - asset ownership queries;
// - asset classification queries;
// - asset lifecycle queries.
//
// -----------------------------------------------------------------------------
//
// Storage boundary:
//
// AssetStoragePort represents the application/domain-facing abstraction for
// physical asset storage.
//
// Concrete implementations may include:
//
// - local filesystem storage;
// - AWS S3;
// - Google Cloud Storage;
// - Azure Blob Storage;
// - Cloudinary;
// - other supported storage providers.
//
// Storage credentials, SDKs, filesystem APIs, and provider-specific types
// remain inside infrastructure.
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
     * Used by application handlers to upload, retrieve, and remove physical
     * asset objects without depending on a concrete storage provider.
     */
    ASSET_STORAGE: Symbol('AssetStoragePort'),
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
     * This establishes the Asset metadata and aggregate identity.
     */
    CREATE_ASSET: Symbol('CreateAssetHandler'),

    /**
     * Uploads the physical Asset object through AssetStoragePort.
     *
     * The handler coordinates physical storage with the Asset aggregate
     * lifecycle.
     */
    UPLOAD_ASSET: Symbol('UploadAssetHandler'),

    /**
     * Archives an Asset aggregate.
     */
    ARCHIVE_ASSET: Symbol('ArchiveAssetHandler'),

    /**
     * Deletes an Asset aggregate.
     *
     * The application workflow coordinates aggregate deletion with physical
     * storage where required.
     */
    DELETE_ASSET: Symbol('DeleteAssetHandler'),

    /**
     * Changes Asset visibility.
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
     */
    GET_ASSET: Symbol('GetAssetHandler'),

    /**
     * Retrieves Assets using general query criteria.
     */
    GET_ASSETS: Symbol('GetAssetsHandler'),

    /**
     * Retrieves an Asset by storage object key.
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
  } as const,
} as const;

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ASSET_TOKENS;
