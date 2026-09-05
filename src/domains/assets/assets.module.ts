// -----------------------------------------------------------------------------
// Assets — NestJS Module
// -----------------------------------------------------------------------------
//
// Central NestJS module for the Assets bounded context.
//
// Registered capabilities:
//
// - Asset aggregate;
// - Asset persistence;
// - Asset physical-storage orchestration;
// - Asset lifecycle management;
// - Asset visibility;
// - Asset retrieval and lookup.
//
// The module wires:
//
// - REST controllers;
// - infrastructure repository provider;
// - configured asset-storage provider;
// - application command handlers;
// - application query handlers.
//
// Domain behavior remains inside:
//
// - AssetAggregate;
// - AssetEntity.
//
// Application handlers coordinate use cases and depend only on:
//
// - AssetRepository;
// - AssetStoragePort.
//
// Infrastructure implements those abstractions through:
//
// - PrismaAssetRepository;
// - configured AssetStorage implementation.
//
// -----------------------------------------------------------------------------
//
// Aggregate boundary:
//
// AssetAggregate
// └── AssetEntity
//
// The Asset aggregate owns:
//
// - Asset identity;
// - ownership reference;
// - classification;
// - visibility;
// - storage metadata;
// - file metadata;
// - lifecycle state.
//
// AssetsModule contains no domain business rules.
//
// -----------------------------------------------------------------------------
//
// Infrastructure boundary:
//
// Assets Application
//        │
//        ▼
//   ASSET_TOKENS
//        │
//        ├── REPOSITORIES.ASSET
//        │       │
//        │       ▼
//        │   PrismaAssetRepository
//        │
//        └── APPLICATION_SERVICES.ASSET_STORAGE
//                │
//                ▼
//          AssetStoragePort
//                │
//                └── configured implementation
//
// The concrete storage implementation is selected by ASSET_PROVIDERS.
//
// -----------------------------------------------------------------------------
//
// Storage selection:
//
//     ASSET_STORAGE_PROVIDER=LOCAL
//             │
//             ▼
//     LocalAssetStorageService
//
//
//
//     ASSET_STORAGE_PROVIDER=BUNNY
//             │
//             ▼
//     BunnyAssetStorageService
//
// Only the selected implementation is instantiated.
//
// Neither LocalAssetStorageService nor BunnyAssetStorageService is registered
// independently as a NestJS provider.
//
// This is intentional.
//
// The application layer depends only on:
//
//     ASSET_TOKENS.APPLICATION_SERVICES.ASSET_STORAGE
//
// which represents:
//
//     AssetStoragePort
//
// -----------------------------------------------------------------------------
//
// Storage dependency flow:
//
//     Application Handler
//            │
//            ▼
//     AssetStoragePort
//            │
//            ▼
//     ASSET_TOKENS.APPLICATION_SERVICES.ASSET_STORAGE
//            │
//            ▼
//     configured infrastructure adapter
//
// Therefore the application layer remains completely independent of:
//
// - local filesystem implementation;
// - Bunny implementation;
// - Bunny credentials;
// - storage SDKs;
// - storage-specific configuration.
//
// -----------------------------------------------------------------------------
//
// Prisma:
//
// PrismaModule provides PrismaService to:
//
//     PrismaAssetRepository
//
// The concrete repository remains hidden behind:
//
//     ASSET_TOKENS.REPOSITORIES.ASSET
//
// -----------------------------------------------------------------------------
//
// Application command handlers:
//
// - CreateAssetHandler
// - UploadAssetHandler
// - ArchiveAssetHandler
// - DeleteAssetHandler
// - ChangeAssetVisibilityHandler
//
// -----------------------------------------------------------------------------
//
// Application query handlers:
//
// - GetAssetHandler
// - GetAssetsHandler
// - GetAssetByObjectKeyHandler
// - GetAssetsByOwnerHandler
// - GetAssetsByCategoryHandler
// - GetAssetsByStatusHandler
// - CheckAssetExistsHandler
//
// -----------------------------------------------------------------------------
//
// Dependency direction:
//
// Presentation
//      │
//      ▼
// Application
//      │
//      ├── AssetRepository abstraction
//      │
//      └── AssetStoragePort abstraction
//             │
//             ▼
// Infrastructure DI
//      │
//      ├── PrismaAssetRepository
//      │
//      └── configured AssetStorage implementation
//
// The application layer does not import concrete infrastructure
// implementations.
//
// -----------------------------------------------------------------------------
//
// Module boundary:
//
// AssetsModule owns:
//
// - controller registration;
// - repository registration;
// - storage abstraction registration;
// - command-handler registration;
// - query-handler registration.
//
// AssetsModule exposes only application-facing tokens required by other
// modules.
//
// It does NOT expose:
//
// - PrismaAssetRepository;
// - LocalAssetStorageService;
// - BunnyAssetStorageService.
//
// Concrete infrastructure implementations remain internal to AssetsModule.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// Do not add:
//
//     LocalAssetStorageService
//
// or:
//
//     BunnyAssetStorageService
//
// directly to `providers`.
//
// Doing so would allow NestJS to instantiate concrete infrastructure services
// independently of the configured storage selection.
//
// The storage provider must remain:
//
//     ASSET_TOKENS.APPLICATION_SERVICES.ASSET_STORAGE
//
// with ASSET_PROVIDERS responsible for selecting the implementation.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Module } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Infrastructure — Database
// -----------------------------------------------------------------------------

import { PrismaModule } from '../../infrastructure/database/prisma/prisma.module';

// -----------------------------------------------------------------------------
// Presentation — Controllers
// -----------------------------------------------------------------------------

import { AssetsController } from './presentation/rest/controllers/assets.controller';

// -----------------------------------------------------------------------------
// Infrastructure — Dependency Injection
// -----------------------------------------------------------------------------

import { ASSET_PROVIDERS } from './infrastructure/dependency-injection/asset.providers';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { ASSET_TOKENS } from './application/asset.tokens';

// -----------------------------------------------------------------------------
// Application — Command Handlers
// -----------------------------------------------------------------------------

import {
  ArchiveAssetHandler,
  ChangeAssetVisibilityHandler,
  CreateAssetHandler,
  DeleteAssetHandler,
  UploadAssetHandler,
} from './application/command-handlers';

// -----------------------------------------------------------------------------
// Application — Query Handlers
// -----------------------------------------------------------------------------

import {
  CheckAssetExistsHandler,
  GetAssetByObjectKeyHandler,
  GetAssetHandler,
  GetAssetsByCategoryHandler,
  GetAssetsByOwnerHandler,
  GetAssetsByStatusHandler,
  GetAssetsHandler,
} from './application/query-handlers';

// =============================================================================
// Assets Module
// =============================================================================

@Module({
  // ===========================================================================
  // Imports
  // ===========================================================================
  //
  // PrismaModule provides PrismaService to:
  //
  //     PrismaAssetRepository
  //
  // The repository itself is bound through ASSET_PROVIDERS.
  //
  // ---------------------------------------------------------------------------

  imports: [PrismaModule],

  // ===========================================================================
  // Controllers
  // ===========================================================================

  controllers: [AssetsController],

  // ===========================================================================
  // Providers
  // ===========================================================================
  //
  // ASSET_PROVIDERS is the infrastructure composition boundary.
  //
  // It registers exactly:
  //
  // 1. AssetRepository
  // 2. AssetStoragePort
  //
  // The storage provider factory selects exactly one concrete implementation:
  //
  //     LOCAL → LocalAssetStorageService
  //     BUNNY → BunnyAssetStorageService
  //
  // Concrete storage implementations are NOT registered separately here.
  //
  // ---------------------------------------------------------------------------

  providers: [
    // =========================================================================
    // Infrastructure
    // =========================================================================

    ...ASSET_PROVIDERS,

    // =========================================================================
    // Application — Command Handlers
    // =========================================================================

    {
      provide: ASSET_TOKENS.COMMAND_HANDLERS.CREATE_ASSET,
      useClass: CreateAssetHandler,
    },

    {
      provide: ASSET_TOKENS.COMMAND_HANDLERS.UPLOAD_ASSET,
      useClass: UploadAssetHandler,
    },

    {
      provide: ASSET_TOKENS.COMMAND_HANDLERS.ARCHIVE_ASSET,
      useClass: ArchiveAssetHandler,
    },

    {
      provide: ASSET_TOKENS.COMMAND_HANDLERS.DELETE_ASSET,
      useClass: DeleteAssetHandler,
    },

    {
      provide: ASSET_TOKENS.COMMAND_HANDLERS.CHANGE_ASSET_VISIBILITY,
      useClass: ChangeAssetVisibilityHandler,
    },

    // =========================================================================
    // Application — Query Handlers
    // =========================================================================

    {
      provide: ASSET_TOKENS.QUERY_HANDLERS.GET_ASSET,
      useClass: GetAssetHandler,
    },

    {
      provide: ASSET_TOKENS.QUERY_HANDLERS.GET_ASSETS,
      useClass: GetAssetsHandler,
    },

    {
      provide: ASSET_TOKENS.QUERY_HANDLERS.GET_ASSET_BY_OBJECT_KEY,
      useClass: GetAssetByObjectKeyHandler,
    },

    {
      provide: ASSET_TOKENS.QUERY_HANDLERS.GET_ASSETS_BY_OWNER,
      useClass: GetAssetsByOwnerHandler,
    },

    {
      provide: ASSET_TOKENS.QUERY_HANDLERS.GET_ASSETS_BY_CATEGORY,
      useClass: GetAssetsByCategoryHandler,
    },

    {
      provide: ASSET_TOKENS.QUERY_HANDLERS.GET_ASSETS_BY_STATUS,
      useClass: GetAssetsByStatusHandler,
    },

    {
      provide: ASSET_TOKENS.QUERY_HANDLERS.CHECK_ASSET_EXISTS,
      useClass: CheckAssetExistsHandler,
    },
  ],

  // ===========================================================================
  // Exports
  // ===========================================================================
  //
  // Expose application-facing abstractions/tokens only.
  //
  // The repository token may be consumed by other application/infrastructure
  // composition where the Assets bounded context is intentionally integrated.
  //
  // Command/query handler tokens are exported for the same reason.
  //
  // The concrete infrastructure implementations remain private.
  //
  // ---------------------------------------------------------------------------

  exports: [
    // -------------------------------------------------------------------------
    // Repository
    // -------------------------------------------------------------------------

    ASSET_TOKENS.REPOSITORIES.ASSET,

    // -------------------------------------------------------------------------
    // Application — Command Handlers
    // -------------------------------------------------------------------------

    ASSET_TOKENS.COMMAND_HANDLERS.CREATE_ASSET,

    ASSET_TOKENS.COMMAND_HANDLERS.UPLOAD_ASSET,

    ASSET_TOKENS.COMMAND_HANDLERS.ARCHIVE_ASSET,

    ASSET_TOKENS.COMMAND_HANDLERS.DELETE_ASSET,

    ASSET_TOKENS.COMMAND_HANDLERS.CHANGE_ASSET_VISIBILITY,

    // -------------------------------------------------------------------------
    // Application — Query Handlers
    // -------------------------------------------------------------------------

    ASSET_TOKENS.QUERY_HANDLERS.GET_ASSET,

    ASSET_TOKENS.QUERY_HANDLERS.GET_ASSETS,

    ASSET_TOKENS.QUERY_HANDLERS.GET_ASSET_BY_OBJECT_KEY,

    ASSET_TOKENS.QUERY_HANDLERS.GET_ASSETS_BY_OWNER,

    ASSET_TOKENS.QUERY_HANDLERS.GET_ASSETS_BY_CATEGORY,

    ASSET_TOKENS.QUERY_HANDLERS.GET_ASSETS_BY_STATUS,

    ASSET_TOKENS.QUERY_HANDLERS.CHECK_ASSET_EXISTS,
  ],
})
export class AssetsModule {}

// =============================================================================
// Default Export
// =============================================================================

export default AssetsModule;
