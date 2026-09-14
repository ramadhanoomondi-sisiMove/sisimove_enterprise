// -----------------------------------------------------------------------------
// sisiMove — Assets
// NestJS Module
// -----------------------------------------------------------------------------
//
// Central NestJS module for the Assets bounded context.
//
// Registered capabilities:
//
// - Asset aggregate;
// - Asset persistence;
// - Asset physical-storage orchestration;
// - Asset delivery resolution;
// - Asset lifecycle management;
// - Asset visibility;
// - Asset retrieval and lookup;
// - public Asset reference resolution;
// - public Asset content delivery.
//
// The module wires:
//
// - REST controllers;
// - infrastructure repository provider;
// - configured AssetStoragePort implementation;
// - configured AssetDeliveryPort implementation;
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
// - AssetStoragePort;
// - AssetDeliveryPort.
//
// Infrastructure implements those abstractions through:
//
// - PrismaAssetRepository;
// - configured AssetStorage implementation;
// - configured AssetDelivery implementation.
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
//        ├── APPLICATION_SERVICES.ASSET_STORAGE
//        │       │
//        │       ▼
//        │   AssetStoragePort
//        │       │
//        │       └── configured storage implementation
//        │
//        └── APPLICATION_SERVICES.ASSET_DELIVERY
//                │
//                ▼
//            AssetDeliveryPort
//                │
//                └── configured delivery implementation
//
// ASSET_PROVIDERS is responsible for binding these application-facing
// abstractions to concrete infrastructure implementations.
//
// -----------------------------------------------------------------------------
//
// STORAGE SELECTION
//
//     ASSET_STORAGE_PROVIDER=LOCAL
//             │
//             ▼
//     LocalAssetStorageService
//
//
//     ASSET_STORAGE_PROVIDER=BUNNY
//             │
//             ▼
//     BunnyAssetStorageService
//
// Only the selected storage implementation is instantiated.
//
// Concrete storage implementations are not independently registered as
// application dependencies.
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
// DELIVERY SELECTION
//
// Asset delivery is deliberately separate from physical storage.
//
//     AssetStoragePort
//         │
//         └── physical object access
//
//     AssetDeliveryPort
//         │
//         └── consumer-facing URL resolution
//
// The application layer depends only on:
//
//     ASSET_TOKENS.APPLICATION_SERVICES.ASSET_DELIVERY
//
// which represents:
//
//     AssetDeliveryPort
//
// The concrete delivery implementation is selected by ASSET_PROVIDERS.
//
// The module does not instantiate a concrete delivery service directly.
//
// -----------------------------------------------------------------------------
//
// STORAGE DEPENDENCY FLOW:
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
// -----------------------------------------------------------------------------
//
// DELIVERY DEPENDENCY FLOW:
//
//     Application Handler
//            │
//            ▼
//     AssetDeliveryPort
//            │
//            ▼
//     ASSET_TOKENS.APPLICATION_SERVICES.ASSET_DELIVERY
//            │
//            ▼
//     configured infrastructure adapter
//
// -----------------------------------------------------------------------------
//
// Public Asset reference:
//
//     GET /assets/public/:assetPublicId/reference
//            │
//            ▼
//     GetPublicAssetReferenceQuery
//            │
//            ▼
//     GetPublicAssetReferenceQueryHandler
//            │
//            ├── AssetRepository
//            │       │
//            │       └── AssetAggregate
//            │
//            └── AssetDeliveryPort
//                    │
//                    ▼
//             consumer-facing URL
//
// The public reference handler verifies that the Asset:
//
// - exists;
// - is usable;
// - is public.
//
// It then delegates URL resolution to AssetDeliveryPort.
//
// The handler does not access physical storage.
//
// -----------------------------------------------------------------------------
//
// Public Asset content:
//
//     GET /assets/public/:assetPublicId
//            │
//            ▼
//     GetPublicAssetContentQuery
//            │
//            ▼
//     GetPublicAssetContentHandler
//            │
//            ├── AssetRepository
//            │       │
//            │       └── AssetAggregate
//            │
//            └── AssetStoragePort
//                    │
//                    ▼
//             AssetStorageObjectContent
//
// The public-content handler verifies that the Asset:
//
// - exists;
// - is public;
// - is usable;
//
// before retrieving the physical content through AssetStoragePort.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT
//
// Public Asset reference and public Asset content are intentionally separate
// application capabilities.
//
// Public reference:
//
//     publicId + consumer-facing URL
//
// Public content:
//
//     physical content stream
//
// The public reference operation does not retrieve physical content.
//
// The public content operation does not resolve a delivery URL.
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
// - GetPublicAssetReferenceQueryHandler
// - GetPublicAssetContentHandler
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
//      ├── AssetStoragePort abstraction
//      │
//      └── AssetDeliveryPort abstraction
//             │
//             ▼
// Infrastructure DI
//      │
//      ├── PrismaAssetRepository
//      ├── configured AssetStorage implementation
//      └── configured AssetDelivery implementation
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
// - delivery abstraction registration;
// - command-handler registration;
// - query-handler registration.
//
// AssetsModule exposes application-facing tokens required by other modules.
//
// It does NOT expose:
//
// - PrismaAssetRepository;
// - LocalAssetStorageService;
// - BunnyAssetStorageService;
// - concrete delivery implementations.
//
// Concrete infrastructure implementations remain internal to AssetsModule.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// Do not add concrete storage or delivery services directly to `providers`:
//
//     LocalAssetStorageService
//     BunnyAssetStorageService
//     LocalAssetDeliveryService
//     BunnyAssetDeliveryService
//
// ASSET_PROVIDERS owns infrastructure selection.
//
// The application dependencies must remain:
//
//     ASSET_TOKENS.APPLICATION_SERVICES.ASSET_STORAGE
//
// and:
//
//     ASSET_TOKENS.APPLICATION_SERVICES.ASSET_DELIVERY
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
  GetPublicAssetContentHandler,
  GetPublicAssetReferenceQueryHandler,
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
  // It is responsible for binding:
  //
  //     AssetRepository
  //     AssetStoragePort
  //     AssetDeliveryPort
  //
  // to their configured infrastructure implementations.
  //
  // Concrete infrastructure services are NOT registered separately here.
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

    // =========================================================================
    // Public Asset Reference
    // =========================================================================
    //
    // This handler backs:
    //
    //     GET /assets/public/:assetPublicId/reference
    //
    // It deliberately does not expose AssetStoragePort.
    //
    // Instead, it coordinates:
    //
    //     AssetRepository
    //             │
    //             ▼
    //        AssetAggregate
    //             │
    //             ▼
    //       AssetDeliveryPort
    //
    // The result is the reduced public Asset reference:
    //
    //     {
    //       publicId,
    //       url,
    //     }
    //
    // -------------------------------------------------------------------------

    {
      provide: ASSET_TOKENS.QUERY_HANDLERS.GET_PUBLIC_ASSET_REFERENCE,
      useClass: GetPublicAssetReferenceQueryHandler,
    },

    // =========================================================================
    // Public Asset Content
    // =========================================================================
    //
    // This handler backs:
    //
    //     GET /assets/public/:assetPublicId
    //
    // It is deliberately registered as a query handler rather than exposing
    // AssetStoragePort directly to the controller.
    //
    // The handler enforces:
    //
    // - Asset existence;
    // - public visibility;
    // - usable lifecycle state;
    // - physical content availability.
    //
    // -------------------------------------------------------------------------

    {
      provide: ASSET_TOKENS.QUERY_HANDLERS.GET_PUBLIC_ASSET_CONTENT,
      useClass: GetPublicAssetContentHandler,
    },
  ],

  // ===========================================================================
  // Exports
  // ===========================================================================
  //
  // Expose application-facing tokens only.
  //
  // Concrete infrastructure implementations remain private to AssetsModule.
  //
  // ---------------------------------------------------------------------------

  exports: [
    // -------------------------------------------------------------------------
    // Repository
    // -------------------------------------------------------------------------

    ASSET_TOKENS.REPOSITORIES.ASSET,

    // -------------------------------------------------------------------------
    // Command Handlers
    // -------------------------------------------------------------------------

    ASSET_TOKENS.COMMAND_HANDLERS.CREATE_ASSET,

    ASSET_TOKENS.COMMAND_HANDLERS.UPLOAD_ASSET,

    ASSET_TOKENS.COMMAND_HANDLERS.ARCHIVE_ASSET,

    ASSET_TOKENS.COMMAND_HANDLERS.DELETE_ASSET,

    ASSET_TOKENS.COMMAND_HANDLERS.CHANGE_ASSET_VISIBILITY,

    // -------------------------------------------------------------------------
    // Query Handlers
    // -------------------------------------------------------------------------

    ASSET_TOKENS.QUERY_HANDLERS.GET_ASSET,

    ASSET_TOKENS.QUERY_HANDLERS.GET_ASSETS,

    ASSET_TOKENS.QUERY_HANDLERS.GET_ASSET_BY_OBJECT_KEY,

    ASSET_TOKENS.QUERY_HANDLERS.GET_ASSETS_BY_OWNER,

    ASSET_TOKENS.QUERY_HANDLERS.GET_ASSETS_BY_CATEGORY,

    ASSET_TOKENS.QUERY_HANDLERS.GET_ASSETS_BY_STATUS,

    ASSET_TOKENS.QUERY_HANDLERS.CHECK_ASSET_EXISTS,

    // -------------------------------------------------------------------------
    // Public Asset Reference
    // -------------------------------------------------------------------------

    ASSET_TOKENS.QUERY_HANDLERS.GET_PUBLIC_ASSET_REFERENCE,

    // -------------------------------------------------------------------------
    // Public Asset Content
    // -------------------------------------------------------------------------

    ASSET_TOKENS.QUERY_HANDLERS.GET_PUBLIC_ASSET_CONTENT,
  ],
})
export class AssetsModule {}

// =============================================================================
// Default Export
// =============================================================================

export default AssetsModule;
