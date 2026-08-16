// src/domains/trust/application/handlers/trust-badge/update-trust-badge.handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Application
// -----------------------------------------------------------------------------

import type { UpdateTrustBadgeCommand } from '../../commands/trust-badge/update-trust-badge.command';

// -----------------------------------------------------------------------------
// Domain — Exceptions
// -----------------------------------------------------------------------------

import { TrustBadgeNotFoundException } from '../../../domain/exceptions';

// -----------------------------------------------------------------------------
// Domain — Repository
// -----------------------------------------------------------------------------

import type { TrustBadgeRepository } from '../../../domain/repositories/trust-badge.repository';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  AssetPublicId,
  TrustBadgeDescription,
  TrustBadgeId,
  TrustBadgeName,
  TrustBadgeTypeValueObject,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

export class UpdateTrustBadgeHandler implements CommandHandler<UpdateTrustBadgeCommand> {
  constructor(private readonly repository: TrustBadgeRepository) {}

  async execute(command: UpdateTrustBadgeCommand): Promise<void> {
    // =========================================================================
    // Identity
    // =========================================================================

    const trustBadgeId = new TrustBadgeId(command.trustBadgeId);

    // =========================================================================
    // Load Aggregate
    // =========================================================================

    const aggregate = await this.repository.findById(trustBadgeId);

    if (aggregate === null) {
      throw new TrustBadgeNotFoundException();
    }

    // =========================================================================
    // Type
    // =========================================================================

    if (command.type !== undefined) {
      aggregate.changeType(new TrustBadgeTypeValueObject(command.type));
    }

    // =========================================================================
    // Name
    // =========================================================================

    if (command.name !== undefined) {
      aggregate.changeName(new TrustBadgeName(command.name));
    }

    // =========================================================================
    // Description
    // =========================================================================

    if (command.description !== undefined) {
      aggregate.changeDescription(
        new TrustBadgeDescription(command.description),
      );
    }

    // =========================================================================
    // Asset
    // =========================================================================

    if (command.assetPublicId !== undefined) {
      aggregate.setAsset(new AssetPublicId(command.assetPublicId));
    }

    // =========================================================================
    // Persist
    // =========================================================================

    await this.repository.save(aggregate);
  }
}
