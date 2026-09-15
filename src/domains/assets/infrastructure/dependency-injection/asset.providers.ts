// -----------------------------------------------------------------------------
// Assets — Dependency Injection Providers
// -----------------------------------------------------------------------------
//
// Infrastructure dependency-injection providers for the Assets bounded
// context.
//
// The application layer depends only on abstractions:
//
// - AssetRepository;
// - AssetStoragePort;
// - AssetDeliveryPort.
//
// This provider file binds those application-facing abstractions to their
// concrete infrastructure implementations.
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
//                    ├── ASSET_STORAGE
//                    │       │
//                    │       ▼
//                    │   AssetStoragePort
//                    │       │
//                    │       ├───────────────┐
//                    │       ▼               ▼
//                    │   Local Storage    Bunny Storage
//                    │
//                    └── ASSET_DELIVERY
//                            │
//                            ▼
//                      AssetDeliveryPort
//                            │
//                            ▼
//                   configured delivery adapter
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
// -----------------------------------------------------------------------------
//
// DELIVERY
//
// Asset delivery is deliberately separated from physical storage.
//
// AssetStoragePort answers:
//
//     "How do we access the physical Asset object?"
//
// AssetDeliveryPort answers:
//
//     "What consumer-facing URL should be returned for this Asset?"
//
// The application layer therefore never constructs delivery URLs and never
// resolves a concrete delivery implementation.
//
// -----------------------------------------------------------------------------
//
// Current sisiMove deployment:
//
//     physical storage  → LOCAL
//     asset delivery    → LocalAssetDeliveryService
//
// The delivery implementation remains behind AssetDeliveryPort so the
// application layer does not depend on local filesystem details.
//
// A future Bunny/CDN delivery implementation can replace the configured
// adapter without changing Asset application handlers or domain behavior.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT
//
// The application layer never resolves:
//
//     LocalAssetStorageService
//     BunnyAssetStorageService
//     LocalAssetDeliveryService
//
// It resolves only:
//
//     ASSET_TOKENS.APPLICATION_SERVICES.ASSET_STORAGE
//     ASSET_TOKENS.APPLICATION_SERVICES.ASSET_DELIVERY
//
// These tokens represent:
//
//     AssetStoragePort
//     AssetDeliveryPort
//
// respectively.
//
// -----------------------------------------------------------------------------
//
// The repository is also hidden behind:
//
//     ASSET_TOKENS.REPOSITORIES.ASSET
//
// Therefore application handlers remain completely independent from
// infrastructure implementations.
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

import type { AssetDeliveryPort } from '../../application/ports/asset-delivery.port';

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

// -----------------------------------------------------------------------------
// Infrastructure — Delivery
// -----------------------------------------------------------------------------

import { LocalAssetDeliveryService } from '../storage/local-asset-delivery.service';

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
 * concrete implementation type to the application layer.
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
// Delivery Selection
// =============================================================================

/**
 * Creates the concrete AssetDeliveryPort implementation used by the
 * application layer.
 *
 * Delivery is intentionally separate from physical Asset storage.
 *
 * The public Asset reference use case needs a consumer-facing URL, but it
 * must not know how that URL is constructed.
 *
 * The delivery adapter therefore owns that responsibility.
 *
 * The current sisiMove deployment uses local delivery.
 *
 * A future Bunny/CDN delivery adapter can be selected here without changing
 * GetPublicAssetReferenceQueryHandler or any other application handler.
 */
function createAssetDeliveryProvider(): AssetDeliveryPort {
  return new LocalAssetDeliveryService();
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

  // ===========================================================================
  // Asset Delivery
  // ===========================================================================
  //
  // Application abstraction:
  //
  //     ASSET_TOKENS.APPLICATION_SERVICES.ASSET_DELIVERY
  //
  // Infrastructure implementation:
  //
  //     LocalAssetDeliveryService
  //
  // The concrete delivery adapter remains hidden behind AssetDeliveryPort.
  //
  // This provider is required by:
  //
  //     GetPublicAssetReferenceQueryHandler
  //
  // which depends on:
  //
  //     AssetDeliveryPort
  //
  // through:
  //
  //     ASSET_TOKENS.APPLICATION_SERVICES.ASSET_DELIVERY
  //
  // ---------------------------------------------------------------------------

  {
    provide: ASSET_TOKENS.APPLICATION_SERVICES.ASSET_DELIVERY,
    useFactory: createAssetDeliveryProvider,
  },
];

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ASSET_PROVIDERS;
