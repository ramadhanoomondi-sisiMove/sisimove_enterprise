// -----------------------------------------------------------------------------
// Assets — Change Asset Visibility Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for changing the visibility of an existing Asset.
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
// - delegate the visibility change to AssetAggregate;
// - persist the updated aggregate;
// - return the updated aggregate.
//
// The handler does NOT:
//
// - implement Asset visibility rules;
// - directly mutate AssetEntity;
// - access Prisma;
// - access storage-provider SDKs;
// - modify physical storage;
// - construct domain events;
// - validate Identity domain state.
//
// Asset ownership verification is performed at the application boundary.
//
// AssetAggregate / AssetEntity own the domain behavior.
//
// AssetRepository owns persistence.
//
// -----------------------------------------------------------------------------
//
// Change flow:
//
//     ChangeAssetVisibilityCommand
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
//     aggregate.changeVisibility()
//              │
//              ├── domain rules enforced by AssetAggregate / AssetEntity
//              │
//              ▼
//     assetRepository.save()
//              │
//              ▼
//        AssetAggregate
//
// -----------------------------------------------------------------------------
//
// Ownership:
//
// The authenticated Identity public ID comes from the application command.
//
// The handler compares it with the Asset's ownerIdentityPublicId.
//
// A missing owner or ownership mismatch is deliberately reported as
// AssetNotFoundException so the application does not reveal whether an Asset
// belonging to another Identity exists.
//
// -----------------------------------------------------------------------------
//
// Correlation / Causation:
//
// The command carries correlationId and causationId for application-level
// operation context.
//
// If the domain visibility operation records a domain event, the aggregate
// remains responsible for propagating the appropriate operation context.
//
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { ASSET_TOKENS } from '../asset.tokens';

import type { ChangeAssetVisibilityCommand } from '../commands/change-asset-visibility.command';

import { AssetAggregate } from '../../domain/aggregates/asset.aggregate';

import type { AssetRepository } from '../../domain/repositories/asset.repository';

import { AssetNotFoundException } from '../../domain/exceptions/asset-not-found.exception';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class ChangeAssetVisibilityHandler implements CommandHandler<
  ChangeAssetVisibilityCommand,
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

  public async execute(
    command: ChangeAssetVisibilityCommand,
  ): Promise<AssetAggregate> {
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
    // Changing visibility is a self-service operation.
    //
    // Only the Identity that owns the Asset may change its visibility.
    //
    // A missing owner or ownership mismatch is deliberately reported as
    // AssetNotFoundException so the existence of another Identity's Asset
    // cannot be inferred from the response.
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
    // Change visibility
    // -------------------------------------------------------------------------
    //
    // AssetAggregate exposes the visibility operation using the
    // AssetVisibility value object.
    //
    // Lifecycle mutability rules remain inside the domain.
    //
    // -------------------------------------------------------------------------

    aggregate.changeVisibility(command.visibility);

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

export default ChangeAssetVisibilityHandler;
