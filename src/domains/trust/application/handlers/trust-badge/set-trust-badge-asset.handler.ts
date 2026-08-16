// src/domains/trust/application/handlers/trust-badge/set-trust-badge-asset.handler.ts

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { SetTrustBadgeAssetCommand } from '../../commands/trust-badge/set-trust-badge-asset.command';

import { TrustBadgeNotFoundException } from '../../../domain/exceptions';

import type { TrustBadgeRepository } from '../../../domain/repositories/trust-badge.repository';

import { AssetPublicId, TrustBadgeId } from '../../../domain/value-objects';

export class SetTrustBadgeAssetHandler implements CommandHandler<SetTrustBadgeAssetCommand> {
  constructor(private readonly repository: TrustBadgeRepository) {}

  async execute(command: SetTrustBadgeAssetCommand): Promise<void> {
    const trustBadgeId = new TrustBadgeId(command.trustBadgeId);

    const aggregate = await this.repository.findById(trustBadgeId);

    if (aggregate === null) {
      throw new TrustBadgeNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Remove asset
    // -------------------------------------------------------------------------

    if (command.assetPublicId === undefined) {
      aggregate.removeAsset();
    }

    // -------------------------------------------------------------------------
    // Set asset
    // -------------------------------------------------------------------------
    else {
      aggregate.setAsset(new AssetPublicId(command.assetPublicId));
    }

    // -------------------------------------------------------------------------
    // Persistence
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);
  }
}
