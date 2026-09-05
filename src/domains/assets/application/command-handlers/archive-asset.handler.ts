// -----------------------------------------------------------------------------
// Assets — Archive Asset Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for archiving an existing Asset aggregate.
//
// This is an authenticated-owner operation.
//
// Responsibilities:
//
// - load the Asset aggregate;
// - verify that the authenticated Identity owns the Asset;
// - delegate the archive operation to AssetAggregate;
// - persist the updated aggregate;
// - return the updated aggregate.
//
// The handler does NOT:
//
// - implement Asset lifecycle rules;
// - directly mutate AssetEntity;
// - construct AssetArchivedEvent;
// - access Prisma;
// - access storage-provider SDKs;
// - delete the physical Asset object.
//
// Authorization boundary:
//
// - authentication is established by JwtAuthGuard;
// - the authenticated Identity public ID is carried by
//   ArchiveAssetCommand;
// - ownership authorization is enforced here;
// - lifecycle authorization/rules remain inside AssetAggregate / AssetEntity.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
// JwtAuthGuard
//      │
//      ▼
// authenticatedIdentityPublicId
//      │
//      ▼
// ArchiveAssetCommand
//      │
//      ▼
// ArchiveAssetHandler
//      │
//      ├── load AssetAggregate
//      │
//      ├── verify ownership
//      │
//      ├── aggregate.archive()
//      │
//      └── repository.save()
//      │
//      ▼
// updated AssetAggregate
//
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { ASSET_TOKENS } from '../asset.tokens';

import type { ArchiveAssetCommand } from '../commands/archive-asset.command';

import { AssetAggregate } from '../../domain/aggregates/asset.aggregate';

import type { AssetRepository } from '../../domain/repositories/asset.repository';

import { AssetNotFoundException } from '../../domain/exceptions/asset-not-found.exception';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class ArchiveAssetHandler implements CommandHandler<
  ArchiveAssetCommand,
  AssetAggregate
> {
  public constructor(
    @Inject(ASSET_TOKENS.REPOSITORIES.ASSET)
    private readonly assetRepository: AssetRepository,
  ) {}

  public async execute(command: ArchiveAssetCommand): Promise<AssetAggregate> {
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
    // Archive is a self-service operation.
    //
    // The authenticated Identity comes from the security context and is
    // carried into the application command.
    //
    // The caller must own the Asset before the lifecycle operation can be
    // delegated to the aggregate.
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
    // Archive aggregate
    // -------------------------------------------------------------------------
    //
    // IMPORTANT:
    //
    // The AssetAggregate owns the lifecycle transition.
    //
    // The current signature expects:
    //
    //     archivedAt
    //     correlationId
    //     causationId
    //
    // Therefore correlationId is passed as the SECOND argument.
    //
    // -------------------------------------------------------------------------

    aggregate.archive(new Date(), command.correlationId, command.causationId);

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

export default ArchiveAssetHandler;
