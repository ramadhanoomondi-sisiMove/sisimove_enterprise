// -----------------------------------------------------------------------------
// Assets — Dependency Injection Providers
// -----------------------------------------------------------------------------
//
// Infrastructure dependency-injection providers for the Assets bounded
// context.
//
// The application layer depends on:
//
// - AssetRepository;
// - AssetStoragePort.
//
// This provider file binds:
//
// - AssetRepository to the concrete Prisma repository;
// - AssetStoragePort to the configured storage implementation.
//
// Supported storage implementations:
//
// - LocalAssetStorageService
// - BunnyAssetStorageService
//
// Storage selection is infrastructure configuration.
//
// The Asset domain and application layers remain unaware of which physical
// storage implementation is being used.
//
// -----------------------------------------------------------------------------
//
// Dependency direction:
//
//     Assets Application
//            │
//            ▼
//       ASSET_TOKENS
//            │
//            ├── REPOSITORIES
//            │       │
//            │       ▼
//            │   PrismaAssetRepository
//            │
//            └── APPLICATION_SERVICES
//                    │
//                    ▼
//              AssetStoragePort
//                    │
//                    ├───────────────┐
//                    ▼               ▼
//             Local Storage     Bunny Storage
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
//     ASSET_STORAGE_PROVIDER=BUNNY
//             │
//             ▼
//     BunnyAssetStorageService
//
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// Only the configured concrete storage service is instantiated and exposed
// through:
//
//     ASSET_TOKENS.APPLICATION_SERVICES.ASSET_STORAGE
//
// This is intentional.
//
// In particular, BunnyAssetStorageService requires Bunny credentials in its
// constructor. Local development must therefore NOT instantiate the Bunny
// service merely because it exists as an available infrastructure adapter.
//
// -----------------------------------------------------------------------------
//
// The concrete storage implementations are NOT exposed to the application
// layer. The application layer resolves only:
//
//     AssetStoragePort
//
// through:
//
//     ASSET_TOKENS.APPLICATION_SERVICES.ASSET_STORAGE
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import type { Provider } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { ASSET_TOKENS } from '../../application/asset.tokens';

// -----------------------------------------------------------------------------
// Infrastructure — Persistence
// -----------------------------------------------------------------------------

import { PrismaAssetRepository } from '../persistence/prisma/repositories/prisma-asset.repository';

// -----------------------------------------------------------------------------
// Infrastructure — Storage
// -----------------------------------------------------------------------------

import { BunnyAssetStorageService } from '../storage/bunny-asset-storage.service';

import { LocalAssetStorageService } from '../storage/local-asset-storage.service';

// =============================================================================
// Storage Selection
// =============================================================================

/**
 * Selects the concrete AssetStoragePort implementation at the composition
 * root.
 *
 * Only the selected implementation is instantiated.
 *
 * Supported values:
 *
 * - LOCAL
 * - BUNNY
 *
 * Default:
 *
 * - LOCAL
 *
 * This keeps local development independent from Bunny configuration while
 * allowing production to use Bunny Storage.
 */
function createAssetStorageProvider():
  LocalAssetStorageService | BunnyAssetStorageService {
  const provider = (process.env.ASSET_STORAGE_PROVIDER ?? 'LOCAL')
    .trim()
    .toUpperCase();

  switch (provider) {
    case 'LOCAL':
      return new LocalAssetStorageService();

    case 'BUNNY':
      return new BunnyAssetStorageService();

    default:
      throw new Error(
        `Unsupported ASSET_STORAGE_PROVIDER "${provider}". Expected "LOCAL" or "BUNNY".`,
      );
  }
}

// =============================================================================
// Providers
// =============================================================================

export const ASSET_PROVIDERS: Provider[] = [
  // ===========================================================================
  // Asset Repository
  // ===========================================================================
  //
  // Application abstraction:
  //
  //     ASSET_TOKENS.REPOSITORIES.ASSET
  //
  // Infrastructure implementation:
  //
  //     PrismaAssetRepository
  //
  // ---------------------------------------------------------------------------

  {
    provide: ASSET_TOKENS.REPOSITORIES.ASSET,
    useClass: PrismaAssetRepository,
  },

  // ===========================================================================
  // Asset Storage
  // ===========================================================================
  //
  // Application abstraction:
  //
  //     ASSET_TOKENS.APPLICATION_SERVICES.ASSET_STORAGE
  //
  // Infrastructure implementation:
  //
  //     LocalAssetStorageService
  //     OR
  //     BunnyAssetStorageService
  //
  // Selection:
  //
  //     ASSET_STORAGE_PROVIDER
  //
  // Only the selected implementation is instantiated.
  //
  // ---------------------------------------------------------------------------

  {
    provide: ASSET_TOKENS.APPLICATION_SERVICES.ASSET_STORAGE,
    useFactory: createAssetStorageProvider,
  },
];

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ASSET_PROVIDERS;
