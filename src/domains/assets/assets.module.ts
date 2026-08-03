// src/domains/assets/assets.module.ts

import { Module } from '@nestjs/common';

import { EventsModule } from '../../infrastructure/events/events.module';

// ============================================================================
// Tokens
// ============================================================================

import {
  ASSET_EVENT_PUBLISHER,
  ASSET_REPOSITORY,
} from './application/asset.tokens';

// ============================================================================
// Infrastructure
// ============================================================================

import { PrismaService } from '../../infrastructure/database/prisma/prisma.service';

import { EventPublisher } from '../../infrastructure/events/event-publisher';

import { PrismaAssetRepository } from './infrastructure/persistence';

// ============================================================================
// Controllers
// ============================================================================

import {
  AssetsController,
  AssetModerationController,
} from './presentation/rest/controllers';

// ============================================================================
// Response Mappers
// ============================================================================

import { AssetResponseMapper } from './presentation/rest/mappers';

// ============================================================================
// Command Handlers
// ============================================================================

import {
  ApproveAssetHandler,
  ArchiveAssetHandler,
  ChangeAssetVisibilityHandler,
  CompleteProcessingHandler,
  CreateAssetHandler,
  DeleteAssetHandler,
  RejectAssetHandler,
  ScanAssetHandler,
  StartProcessingHandler,
  UploadAssetHandler,
} from './application/handlers';

// ============================================================================
// Query Handlers
// ============================================================================

import {
  AssetExistsByChecksumHandler,
  AssetExistsByObjectKeyHandler,
  AssetExistsByOwnerIdentityIdHandler,
  AssetExistsByPublicIdHandler,
  FindAssetByObjectKeyHandler,
  FindAssetByOwnerIdentityIdHandler,
  FindAssetByPublicIdHandler,
  FindAssetEntitiesByCategoryHandler,
  FindAssetEntitiesByStatusHandler,
  FindAssetEntitiesByTypeHandler,
  FindAssetEntityByObjectKeyHandler,
  FindAssetEntityByPublicIdHandler,
  FindAssetModerationsHandler,
  FindAssetProcessingsHandler,
  FindAssetReferencesByFieldHandler,
  FindAssetReferencesByResourceHandler,
  FindAssetReferencesHandler,
  FindAssetScansHandler,
  FindAssetVariantHandler,
  FindAssetVariantsHandler,
} from './application/query-handlers';

@Module({
  imports: [EventsModule],

  controllers: [AssetsController, AssetModerationController],

  providers: [
    // =========================================================================
    // Infrastructure
    // =========================================================================

    PrismaService,

    PrismaAssetRepository,

    AssetResponseMapper,

    // =========================================================================
    // Repository Tokens
    // =========================================================================

    {
      provide: ASSET_REPOSITORY,
      useExisting: PrismaAssetRepository,
    },

    // =========================================================================
    // Application Services
    // =========================================================================

    {
      provide: ASSET_EVENT_PUBLISHER,
      useExisting: EventPublisher,
    },

    // =========================================================================
    // Command Handlers
    // =========================================================================

    CreateAssetHandler,
    UploadAssetHandler,
    ScanAssetHandler,
    StartProcessingHandler,
    CompleteProcessingHandler,
    ChangeAssetVisibilityHandler,
    ArchiveAssetHandler,
    DeleteAssetHandler,
    ApproveAssetHandler,
    RejectAssetHandler,

    // =========================================================================
    // Query Handlers
    // =========================================================================

    AssetExistsByChecksumHandler,
    AssetExistsByObjectKeyHandler,
    AssetExistsByOwnerIdentityIdHandler,
    AssetExistsByPublicIdHandler,

    FindAssetByObjectKeyHandler,
    FindAssetByOwnerIdentityIdHandler,
    FindAssetByPublicIdHandler,

    FindAssetEntityByObjectKeyHandler,
    FindAssetEntityByPublicIdHandler,

    FindAssetEntitiesByCategoryHandler,
    FindAssetEntitiesByStatusHandler,
    FindAssetEntitiesByTypeHandler,

    FindAssetVariantHandler,
    FindAssetVariantsHandler,

    FindAssetReferencesHandler,
    FindAssetReferencesByResourceHandler,
    FindAssetReferencesByFieldHandler,

    FindAssetProcessingsHandler,

    FindAssetScansHandler,

    FindAssetModerationsHandler,
  ],

  exports: [
    // =========================================================================
    // Repositories
    // =========================================================================

    ASSET_REPOSITORY,

    // =========================================================================
    // Application Services
    // =========================================================================

    ASSET_EVENT_PUBLISHER,
  ],
})
export class AssetsModule {}
