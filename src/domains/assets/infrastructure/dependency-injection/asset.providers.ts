// -----------------------------------------------------------------------------
// Assets — Dependency Injection Providers
// -----------------------------------------------------------------------------
//
// Infrastructure dependency-injection providers for the Assets bounded
// context.
//
// The application layer depends on abstractions:
//
// - AssetRepository;
// - AssetStoragePort.
//
// This provider file binds those abstractions to concrete infrastructure
// implementations.
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
// Current sisiMove deployment:
//
//     LOCAL
//
// Bunny remains available behind the same AssetStoragePort so that the
// physical storage implementation can be changed later without changing the
// Asset domain or application layer.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// Only the selected concrete storage implementation is instantiated.
//
// This is especially important for Bunny because its infrastructure adapter
// may require production-only configuration such as storage credentials.
//
// LOCAL therefore remains completely independent of Bunny configuration.
//
// -----------------------------------------------------------------------------
//
// The application layer never resolves:
//
//     LocalAssetStorageService
//     BunnyAssetStorageService
//
// It resolves only:
//
//     ASSET_TOKENS.APPLICATION_SERVICES.ASSET_STORAGE
//
// which represents:
//
//     AssetStoragePort
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
// Application — Ports
// -----------------------------------------------------------------------------

import type { AssetStoragePort } from '../../application/ports/asset-storage.port';

// -----------------------------------------------------------------------------
// Domain — Storage Provider
// -----------------------------------------------------------------------------

import { AssetStorageProvider } from '../../domain/value-objects/asset-storage-provider.vo';

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
// Storage Provider Configuration
// =============================================================================

/**
 * Reads and normalizes the configured physical Asset storage provider.
 *
 * LOCAL is the default because local filesystem storage is the current
 * sisiMove deployment configuration.
 *
 * Bunny can be selected later without changing the application or domain
 * contracts.
 */
function getConfiguredStorageProvider(): string {
  return (process.env.ASSET_STORAGE_PROVIDER ?? 'LOCAL').trim().toUpperCase();
}

// =============================================================================
// Storage Selection
// =============================================================================

/**
 * Creates the concrete AssetStoragePort implementation selected by
 * infrastructure configuration.
 *
 * The factory returns the application-facing port rather than exposing a
 * concrete implementation type to the composition boundary.
 *
 * Only the selected implementation is instantiated.
 */
function createAssetStorageProvider(): AssetStoragePort {
  const provider = getConfiguredStorageProvider();

  switch (provider) {
    case AssetStorageProvider.LOCAL:
      return new LocalAssetStorageService();

    case AssetStorageProvider.BUNNY:
      return new BunnyAssetStorageService();

    default:
      throw new Error(
        `Unsupported ASSET_STORAGE_PROVIDER "${provider}". ` +
          `Expected "${AssetStorageProvider.LOCAL}" or ` +
          `"${AssetStorageProvider.BUNNY}".`,
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
  // The concrete implementation is selected exclusively by infrastructure
  // configuration.
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
