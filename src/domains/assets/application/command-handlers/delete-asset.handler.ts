// -----------------------------------------------------------------------------
// Assets — Delete Asset Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for deleting an existing Asset aggregate.
//
// Aggregate boundary:
//
// AssetAggregate
// └── AssetEntity
//
// Responsibilities:
//
// - load the existing Asset aggregate;
// - verify that the authenticated Identity owns the Asset;
// - coordinate physical Asset deletion through AssetStoragePort;
// - transition the Asset aggregate to DELETED;
// - persist the updated aggregate;
// - return the updated aggregate.
//
// The handler does NOT:
//
// - implement Asset lifecycle rules;
// - directly mutate AssetEntity state;
// - construct AssetDeletedEvent;
// - access Prisma;
// - access AWS SDK;
// - access Google Cloud SDK;
// - access Azure Blob SDK;
// - access Cloudinary SDK;
// - access filesystem implementations;
// - depend on Express.Multer.File;
// - generate AssetPublicId;
// - generate persistence IDs;
// - generate URLs;
// - validate Identity domain state.
//
// Ownership verification is an application-level authorization boundary.
//
// Physical storage is accessed exclusively through AssetStoragePort.
//
// Asset lifecycle remains inside AssetAggregate / AssetEntity.
//
// Asset persistence remains behind AssetRepository.
//
// -----------------------------------------------------------------------------
//
// Delete flow:
//
//     DeleteAssetCommand
//              │
//              ▼
//     assetRepository.findByPublicId()
//              │
//              ├── not found → AssetNotFoundException
//              │
//              ▼
//     verify authenticated owner
//              │
//              ├── mismatch → AssetNotFoundException
//              │
//              ▼
//     assetStorage.delete()
//              │
//              ├── failure → aggregate remains unchanged
//              │
//              ▼
//     aggregate.delete()
//              │
//              ├── AssetEntity → DELETED
//              │
//              └── AssetDeletedEvent recorded
//              │
//              ▼
//     assetRepository.save()
//              │
//              ▼
//        AssetAggregate
//
// -----------------------------------------------------------------------------
//
// Lifecycle:
//
//     UPLOADING ───────┐
//     UPLOADED ────────┤
//     READY ───────────┼──► DELETED
//     ARCHIVED ────────┘
//
// The exact lifecycle rules are enforced by AssetEntity.
//
// The handler does not reproduce those rules.
//
// -----------------------------------------------------------------------------
//
// Ownership:
//
// The authenticated Identity public ID comes from the application command.
//
// The handler compares it with the Asset's ownerIdentityPublicId.
//
// A missing owner or ownership mismatch is intentionally reported as
// AssetNotFoundException rather than exposing whether another Identity owns
// the Asset.
//
// -----------------------------------------------------------------------------
//
// Physical storage:
//
// Physical deletion is coordinated through AssetStoragePort.
//
// The handler does not use a concrete storage implementation.
//
// The storage provider, bucket, and object key are obtained from the aggregate
// and passed to the storage boundary.
//
// -----------------------------------------------------------------------------
//
// Correlation / Causation:
//
// correlationId identifies the end-to-end application operation.
//
// causationId optionally identifies the command or domain event that caused
// this command.
//
// Both are propagated to AssetAggregate.delete() so the resulting
// AssetDeletedEvent retains the operation context.
//
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { ASSET_TOKENS } from '../asset.tokens';

import type { DeleteAssetCommand } from '../commands/delete-asset.command';

import { AssetAggregate } from '../../domain/aggregates/asset.aggregate';

import type { AssetRepository } from '../../domain/repositories/asset.repository';

import type { AssetStoragePort } from '../ports/asset-storage.port';

import { AssetNotFoundException } from '../../domain/exceptions/asset-not-found.exception';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class DeleteAssetHandler implements CommandHandler<
  DeleteAssetCommand,
  AssetAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(ASSET_TOKENS.REPOSITORIES.ASSET)
    private readonly assetRepository: AssetRepository,

    @Inject(ASSET_TOKENS.APPLICATION_SERVICES.ASSET_STORAGE)
    private readonly assetStorage: AssetStoragePort,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(command: DeleteAssetCommand): Promise<AssetAggregate> {
    // -------------------------------------------------------------------------
    // Load aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.assetRepository.findByPublicId(
      command.publicId,
    );

    if (aggregate === null) {
      throw new AssetNotFoundException(
        `Asset with public ID ${command.publicId.value} was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // Verify ownership
    // -------------------------------------------------------------------------
    //
    // Deletion is a self-service operation.
    //
    // Only the Identity that owns the Asset may request its deletion.
    //
    // A missing owner or ownership mismatch is deliberately reported as
    // AssetNotFoundException so the endpoint does not reveal the existence of
    // another Identity's Asset.
    //
    // -------------------------------------------------------------------------

    const ownerIdentityPublicId = aggregate.asset.ownerIdentityPublicId;

    if (
      ownerIdentityPublicId === undefined ||
      ownerIdentityPublicId.value !==
        command.authenticatedIdentityPublicId.value
    ) {
      throw new AssetNotFoundException(
        `Asset with public ID ${command.publicId.value} was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // Delete physical object
    // -------------------------------------------------------------------------
    //
    // The physical object is removed before the domain lifecycle transition.
    //
    // If storage deletion fails, aggregate.delete() is never called and the
    // aggregate remains unchanged in memory.
    //
    // -------------------------------------------------------------------------

    await this.assetStorage.delete(
      aggregate.asset.storageProvider,
      aggregate.asset.bucket,
      aggregate.asset.objectKey,
    );

    // -------------------------------------------------------------------------
    // Delete aggregate
    // -------------------------------------------------------------------------
    //
    // AssetAggregate coordinates the domain operation.
    //
    // AssetEntity owns the lifecycle transition.
    //
    // AssetDeletedEvent is recorded by AssetAggregate.delete().
    //
    // -------------------------------------------------------------------------

    aggregate.delete(new Date(), command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // Persist aggregate
    // -------------------------------------------------------------------------

    await this.assetRepository.save(aggregate);

    // -------------------------------------------------------------------------
    // Return updated aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default DeleteAssetHandler;
