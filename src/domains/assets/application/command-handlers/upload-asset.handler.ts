// -----------------------------------------------------------------------------
// Assets — Upload Asset Command Handler
// -----------------------------------------------------------------------------
//
// Application orchestrator for the user-facing:
//
//     Upload Asset
//
// The user does not need to understand Asset aggregate creation. The upload
// workflow therefore owns the complete application operation:
//
//     physical upload
//          ↓
//     Asset aggregate creation
//          ↓
//     Asset lifecycle completion
//
// Responsibilities:
//
// - coordinate physical Asset storage;
// - invoke AssetStoragePort;
// - delegate Asset aggregate creation to CreateAssetHandler;
// - transition the created Asset from UPLOADING to UPLOADED;
// - persist the updated aggregate;
// - return the completed Asset aggregate.
//
// The handler does NOT:
//
// - implement Asset lifecycle rules;
// - directly mutate AssetEntity state;
// - construct AssetCreatedEvent;
// - construct AssetUploadedEvent;
// - access Prisma;
// - access AWS SDK;
// - access Google Cloud SDK;
// - access Azure Blob SDK;
// - access Cloudinary SDK;
// - access concrete filesystem implementations;
// - depend on Express.Multer.File;
// - validate Identity domain state;
// - load Identity aggregates;
// - generate AssetPublicId;
// - generate internal persistence IDs;
// - generate URLs;
// - generate signed URLs;
// - perform authorization checks;
// - process images, videos, audio, or documents.
//
// Physical storage is accessed exclusively through AssetStoragePort.
//
// Asset aggregate creation belongs to CreateAssetHandler.
//
// Asset lifecycle transitions belong to AssetAggregate / AssetEntity.
//
// Asset persistence belongs to AssetRepository.
//
// -----------------------------------------------------------------------------
//
// Orchestration:
//
//     UploadAssetCommand
//              │
//              ▼
//     assetStorage.upload()
//              │
//              ├── failure → operation fails
//              │
//              ▼
//     CreateAssetCommand
//              │
//              ▼
//     CreateAssetHandler
//              │
//              ├── uniqueness check
//              ├── AssetEntity.create()
//              ├── AssetAggregate.create()
//              ├── AssetCreatedEvent
//              └── repository.save()
//              │
//              ▼
//     aggregate.markUploaded()
//              │
//              ├── UPLOADING → UPLOADED
//              └── AssetUploadedEvent
//              │
//              ▼
//     assetRepository.save()
//              │
//              ▼
//        AssetAggregate
//
// -----------------------------------------------------------------------------
//
// Why UploadAssetHandler orchestrates:
//
// The user-facing operation is "Upload Asset".
//
// The application therefore starts with the physical file. Once the physical
// object has been successfully accepted by storage, the handler delegates
// aggregate creation to CreateAssetHandler.
//
// CreateAssetHandler remains independently responsible for the Create Asset
// operation.
//
// This follows the same application-handler delegation pattern used elsewhere
// in the system:
//
//     higher-level use case
//          ↓
//     lower-level application handler
//
// -----------------------------------------------------------------------------
//
// Physical storage:
//
// Storage is deliberately performed before the Asset is created.
//
// Therefore, CreateAssetHandler is not invoked when the physical upload fails.
//
// This prevents an Asset database record from being created for a failed
// physical upload.
//
// -----------------------------------------------------------------------------
//
// Lifecycle:
//
// CreateAssetHandler creates the Asset in:
//
//     UPLOADING
//
// After physical storage succeeds, this handler invokes:
//
//     aggregate.markUploaded()
//
// resulting in:
//
//     UPLOADING → UPLOADED
//
// The aggregate owns the lifecycle rule and AssetUploadedEvent recording.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation — Application
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Assets — Application Tokens
// -----------------------------------------------------------------------------

import { ASSET_TOKENS } from '../asset.tokens';

// -----------------------------------------------------------------------------
// Assets — Commands
// -----------------------------------------------------------------------------

import type { UploadAssetCommand } from '../commands/upload-asset.command';
import { CreateAssetCommand } from '../commands/create-asset.command';

// -----------------------------------------------------------------------------
// Assets — Command Handler
// -----------------------------------------------------------------------------

import type { CreateAssetHandler } from './create-asset.handler';

// -----------------------------------------------------------------------------
// Assets — Domain Aggregate
// -----------------------------------------------------------------------------

import { AssetAggregate } from '../../domain/aggregates/asset.aggregate';

// -----------------------------------------------------------------------------
// Assets — Domain Repository
// -----------------------------------------------------------------------------

import type { AssetRepository } from '../../domain/repositories/asset.repository';

// -----------------------------------------------------------------------------
// Assets — Storage Port
// -----------------------------------------------------------------------------

import type { AssetStoragePort } from '../ports/asset-storage.port';

// =============================================================================
// Handler
// =============================================================================

/**
 * Orchestrates the complete Upload Asset application workflow.
 *
 * The user-facing operation is:
 *
 *     Upload Asset
 *
 * This handler owns that application workflow while delegating dedicated
 * responsibilities to the appropriate application components.
 */
@Injectable()
export class UploadAssetHandler implements CommandHandler<
  UploadAssetCommand,
  AssetAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(ASSET_TOKENS.APPLICATION_SERVICES.ASSET_STORAGE)
    private readonly assetStorage: AssetStoragePort,

    @Inject(ASSET_TOKENS.COMMAND_HANDLERS.CREATE_ASSET)
    private readonly createAssetHandler: CreateAssetHandler,

    @Inject(ASSET_TOKENS.REPOSITORIES.ASSET)
    private readonly assetRepository: AssetRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the complete Upload Asset workflow.
   *
   * Application orchestration:
   *
   *     command
   *       ↓
   *     storage.upload()
   *       ↓
   *     CreateAssetCommand
   *       ↓
   *     CreateAssetHandler
   *       ↓
   *     aggregate.markUploaded()
   *       ↓
   *     repository.save()
   *       ↓
   *     return aggregate
   */
  public async execute(command: UploadAssetCommand): Promise<AssetAggregate> {
    // -------------------------------------------------------------------------
    // 1. Upload physical Asset object
    // -------------------------------------------------------------------------
    //
    // The physical file is uploaded before Asset aggregate creation.
    //
    // If this operation fails, CreateAssetHandler is never invoked and no
    // Asset aggregate is created.
    // -------------------------------------------------------------------------

    await this.assetStorage.upload({
      storageProvider: command.storageProvider,
      bucket: command.bucket,
      objectKey: command.objectKey,
      content: command.content,
      mimeType: command.mimeType,
      sizeBytes: command.sizeBytes,
    });

    // -------------------------------------------------------------------------
    // 2. Construct CreateAssetCommand
    // -------------------------------------------------------------------------
    //
    // UploadAssetHandler owns the orchestration.
    //
    // CreateAssetHandler still owns the actual Asset aggregate creation.
    //
    // The physical content is intentionally NOT forwarded because the physical
    // upload has already been completed.
    // -------------------------------------------------------------------------

    const createAssetCommand = new CreateAssetCommand(
      command.ownerIdentityPublicId,
      command.type,
      command.category,
      command.visibility,
      command.storageProvider,
      command.bucket,
      command.objectKey,
      command.originalFilename,
      command.mimeType,
      command.sizeBytes,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 3. Delegate Asset aggregate creation
    // -------------------------------------------------------------------------
    //
    // CreateAssetHandler owns:
    //
    // - uniqueness;
    // - AssetEntity creation;
    // - AssetAggregate creation;
    // - AssetCreatedEvent;
    // - initial persistence.
    // -------------------------------------------------------------------------

    const aggregate = await this.createAssetHandler.execute(createAssetCommand);

    // -------------------------------------------------------------------------
    // 4. Complete Asset lifecycle
    // -------------------------------------------------------------------------
    //
    // The physical upload succeeded and the Asset aggregate now exists in
    // UPLOADING state.
    //
    // The aggregate owns the lifecycle transition:
    //
    //     UPLOADING → UPLOADED
    //
    // and records AssetUploadedEvent.
    // -------------------------------------------------------------------------

    aggregate.markUploaded(
      command.correlationId,
      new Date(),
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 5. Persist completed Asset aggregate
    // -------------------------------------------------------------------------
    //
    // The aggregate is now authoritative for the successful upload state.
    // -------------------------------------------------------------------------

    await this.assetRepository.save(aggregate);

    // -------------------------------------------------------------------------
    // 6. Return completed Asset aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default UploadAssetHandler;
