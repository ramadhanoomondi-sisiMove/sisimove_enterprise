// -----------------------------------------------------------------------------
// Assets — Create Asset Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for creating an Asset aggregate.
//
// Aggregate boundary:
//
// AssetAggregate
// └── AssetEntity
//
// Responsibilities:
//
// - enforce Asset uniqueness by object key;
// - create AssetEntity through the domain factory;
// - create AssetAggregate;
// - record AssetCreatedEvent through the aggregate;
// - persist the aggregate;
// - return the created aggregate.
//
// The handler does NOT:
//
// - upload physical file content;
// - access the filesystem;
// - access AWS S3;
// - access Google Cloud Storage;
// - access Azure Blob Storage;
// - access Cloudinary;
// - interact with storage-provider SDKs;
// - validate Identity domain state;
// - load the Identity aggregate;
// - generate AssetPublicId;
// - generate internal persistence IDs;
// - determine initial AssetStatus;
// - construct domain events directly;
// - access Prisma;
// - perform authorization checks;
// - generate URLs;
// - process files.
//
// Physical storage belongs behind AssetStoragePort.
//
// Asset lifecycle state belongs to AssetEntity / AssetAggregate.
//
// Persistence belongs behind AssetRepository.
//
// -----------------------------------------------------------------------------
//
// Application orchestration:
//
//     CreateAssetCommand
//              │
//              ▼
//     assetRepository.existsByObjectKey()
//              │
//              ├── exists → AssetAlreadyExistsException
//              │
//              ▼
//        AssetEntity.create()
//              │
//              ▼
//        AssetAggregate.create()
//              │
//              ▼
//        aggregate.recordCreated()
//              │
//              ▼
//        assetRepository.save()
//              │
//              ▼
//          AssetAggregate
//
// -----------------------------------------------------------------------------
//
// Important:
//
// This handler intentionally knows nothing about whether the Asset was created
// directly or as part of an UploadAssetHandler workflow.
//
// That keeps CreateAssetHandler reusable as the dedicated Asset creation
// operation.
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
// Assets — Application Command
// -----------------------------------------------------------------------------

import type { CreateAssetCommand } from '../commands/create-asset.command';

// -----------------------------------------------------------------------------
// Assets — Application Tokens
// -----------------------------------------------------------------------------

import { ASSET_TOKENS } from '../asset.tokens';

// -----------------------------------------------------------------------------
// Assets — Domain Aggregate
// -----------------------------------------------------------------------------

import { AssetAggregate } from '../../domain/aggregates/asset.aggregate';

// -----------------------------------------------------------------------------
// Assets — Domain Entity
// -----------------------------------------------------------------------------

import { AssetEntity } from '../../domain/entities/asset.entity';

// -----------------------------------------------------------------------------
// Assets — Domain Repository
// -----------------------------------------------------------------------------

import type { AssetRepository } from '../../domain/repositories/asset.repository';

// -----------------------------------------------------------------------------
// Assets — Domain Exception
// -----------------------------------------------------------------------------

import { AssetAlreadyExistsException } from '../../domain/exceptions/asset-already-exists.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Creates a new Asset aggregate.
 *
 * This handler owns the Create Asset operation.
 *
 * It can be invoked directly by another application workflow, such as
 * UploadAssetHandler.
 */
@Injectable()
export class CreateAssetHandler implements CommandHandler<
  CreateAssetCommand,
  AssetAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(ASSET_TOKENS.REPOSITORIES.ASSET)
    private readonly assetRepository: AssetRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the CreateAssetCommand.
   *
   * The handler performs Asset aggregate creation only.
   *
   * It does not perform physical storage operations.
   */
  public async execute(command: CreateAssetCommand): Promise<AssetAggregate> {
    // -------------------------------------------------------------------------
    // 1. Enforce Asset uniqueness
    // -------------------------------------------------------------------------

    const exists = await this.assetRepository.existsByObjectKey(
      command.objectKey,
    );

    if (exists) {
      throw new AssetAlreadyExistsException(
        `Asset with object key ${command.objectKey.value} already exists.`,
      );
    }

    // -------------------------------------------------------------------------
    // 2. Create AssetEntity
    // -------------------------------------------------------------------------
    //
    // AssetEntity.create() owns:
    //
    // - AssetPublicId generation;
    // - internal identity generation;
    // - initial UPLOADING state;
    // - lifecycle timestamps;
    // - entity invariants.
    // -------------------------------------------------------------------------

    const asset = AssetEntity.create(
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
    );

    // -------------------------------------------------------------------------
    // 3. Create AssetAggregate
    // -------------------------------------------------------------------------

    const aggregate = AssetAggregate.create(asset);

    // -------------------------------------------------------------------------
    // 4. Record AssetCreatedEvent
    // -------------------------------------------------------------------------

    aggregate.recordCreated(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // 5. Persist AssetAggregate
    // -------------------------------------------------------------------------

    await this.assetRepository.save(aggregate);

    // -------------------------------------------------------------------------
    // 6. Return AssetAggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateAssetHandler;
