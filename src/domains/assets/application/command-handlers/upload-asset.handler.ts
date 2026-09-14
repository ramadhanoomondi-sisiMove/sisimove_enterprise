// -----------------------------------------------------------------------------
// sisiMove — Assets
// Upload Asset Command Handler
// -----------------------------------------------------------------------------
//
// Application orchestrator for:
//
//     Upload Asset
//
// Complete successful lifecycle:
//
//     UPLOADING
//          ↓
//     UPLOADED
//          ↓
//     READY
//
// The handler coordinates the workflow.
//
// AssetAggregate / AssetEntity remain responsible for enforcing lifecycle
// transitions and recording domain events.
//
// -----------------------------------------------------------------------------
//
// APPLICATION WORKFLOW
//
//     UploadAssetCommand
//             │
//             ▼
//     CreateAssetHandler
//             │
//             ├── AssetEntity.create()
//             ├── AssetAggregate.create()
//             ├── AssetCreatedEvent
//             └── repository.save()
//             │
//             │ Asset = UPLOADING
//             ▼
//     AssetStoragePort.upload()
//             │
//             ├── failure → Asset remains UPLOADING
//             │
//             ▼
//     aggregate.markUploaded()
//             │
//             └── UPLOADING → UPLOADED
//             │
//             ▼
//     repository.save()
//             │
//             │ Asset = UPLOADED
//             ▼
//     aggregate.markReady()
//             │
//             └── UPLOADED → READY
//             │
//             ▼
//     repository.save()
//             │
//             ▼
//     AssetAggregate
//
// -----------------------------------------------------------------------------
//
// WHY CREATE THE ASSET FIRST
//
// Database persistence and physical storage are separate systems and cannot
// participate in one atomic transaction.
//
// The Asset domain explicitly models UPLOADING.
//
// Therefore:
//
//     1. Persist Asset as UPLOADING.
//     2. Upload the physical object.
//     3. Mark Asset UPLOADED.
//     4. Persist UPLOADED.
//     5. Mark Asset READY.
//     6. Persist READY.
//
// If physical storage fails, the Asset remains:
//
//     UPLOADING
//
// This avoids the more problematic state:
//
//     physical object exists
//     Asset record does not exist
//
// which creates an orphaned physical object.
//
// -----------------------------------------------------------------------------
//
// WHY UPLOADED IS PERSISTED BEFORE READY
//
// UPLOADED represents a durable acknowledgement that the physical object has
// successfully been accepted by AssetStoragePort.
//
// READY is the final application-level state for the current Asset workflow.
//
// Persisting UPLOADED before attempting READY gives the system a recoverable
// intermediate state:
//
//     physical object exists
//     Asset = UPLOADED
//
// If the READY persistence operation fails, a later reconciliation workflow
// can retry:
//
//     UPLOADED → READY
//
// without uploading the physical object again.
//
// -----------------------------------------------------------------------------
//
// RESPONSIBILITIES
//
// This handler:
//
// - coordinates the Upload Asset use case;
// - delegates initial Asset creation to CreateAssetHandler;
// - invokes AssetStoragePort;
// - requests UPLOADING → UPLOADED;
// - persists UPLOADED;
// - requests UPLOADED → READY;
// - persists READY;
// - returns the completed Asset aggregate.
//
// This handler does NOT:
//
// - implement lifecycle rules;
// - mutate AssetEntity directly;
// - assign AssetStatus directly;
// - construct domain events;
// - access Prisma;
// - access storage-provider SDKs;
// - depend on Express.Multer.File;
// - generate AssetPublicId;
// - generate internal persistence IDs;
// - generate URLs;
// - generate signed URLs;
// - perform authorization;
// - process media.
//
// -----------------------------------------------------------------------------
//
// FAILURE SEMANTICS
//
// Create Asset failure:
//
//     no Asset
//     no physical upload
//
// Physical upload failure:
//
//     Asset = UPLOADING
//     no UPLOADED transition
//     no READY transition
//
// UPLOADED persistence failure:
//
//     physical object exists
//     database Asset remains UPLOADING
//
// READY persistence failure:
//
//     physical object exists
//     database Asset remains UPLOADED
//     READY can be retried/reconciled
//
// -----------------------------------------------------------------------------
//
// IMPORTANT
//
// This handler does not attempt to make database persistence and physical
// storage atomic.
//
// A database UnitOfWork cannot roll back an already-completed operation in an
// external storage provider.
//
// Distributed consistency is therefore represented explicitly by Asset's
// lifecycle.
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
 * Successful lifecycle:
 *
 *     UPLOADING → UPLOADED → READY
 *
 * The handler coordinates the workflow while AssetAggregate owns the
 * individual lifecycle transitions and domain-event recording.
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
   * The workflow deliberately separates:
   *
   *     domain creation
   *     physical storage
   *     lifecycle completion
   *
   * while presenting them as one application-level use case.
   */
  public async execute(command: UploadAssetCommand): Promise<AssetAggregate> {
    // -------------------------------------------------------------------------
    // 1. Create the Asset aggregate in UPLOADING state
    // -------------------------------------------------------------------------
    //
    // CreateAssetHandler owns:
    //
    // - Asset identity generation;
    // - object-key uniqueness checks;
    // - AssetEntity creation;
    // - AssetAggregate creation;
    // - AssetCreatedEvent;
    // - initial persistence.
    //
    // No physical storage operation occurs before this succeeds.
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

    const aggregate = await this.createAssetHandler.execute(createAssetCommand);

    // -------------------------------------------------------------------------
    // 2. Upload the physical object
    // -------------------------------------------------------------------------
    //
    // At this point the durable Asset state is:
    //
    //     UPLOADING
    //
    // AssetStoragePort is responsible only for physical storage.
    //
    // It does not change Asset lifecycle state.
    //
    // If this operation fails, execution stops here and the Asset remains
    // UPLOADING in persistence.
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
    // 3. Transition UPLOADING → UPLOADED
    // -------------------------------------------------------------------------
    //
    // Physical storage has successfully completed.
    //
    // The aggregate owns the lifecycle transition.
    //
    // The aggregate also records AssetUploadedEvent.
    //
    // Correlation and causation metadata belong to the application/domain
    // event boundary and are therefore passed through the aggregate.
    // -------------------------------------------------------------------------

    aggregate.markUploaded(
      command.correlationId,
      new Date(),
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 4. Persist UPLOADED state
    // -------------------------------------------------------------------------
    //
    // The physical object now exists and the database records:
    //
    //     Asset = UPLOADED
    //
    // This persistence point is important because it gives the system a
    // durable recovery state before attempting READY.
    // -------------------------------------------------------------------------

    await this.assetRepository.save(aggregate);

    // -------------------------------------------------------------------------
    // 5. Transition UPLOADED → READY
    // -------------------------------------------------------------------------
    //
    // READY is the final state of the current upload workflow.
    //
    // The aggregate owns this transition and records AssetReadyEvent.
    //
    // No direct status mutation occurs in the handler.
    // -------------------------------------------------------------------------

    aggregate.markReady(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // 6. Persist READY state
    // -------------------------------------------------------------------------
    //
    // The Asset is now durably represented as:
    //
    //     READY
    //
    // Consumers may treat the Asset as usable according to their own
    // application/domain rules.
    // -------------------------------------------------------------------------

    await this.assetRepository.save(aggregate);

    // -------------------------------------------------------------------------
    // 7. Return the completed aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default UploadAssetHandler;
