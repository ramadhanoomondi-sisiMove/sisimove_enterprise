// src/domains/trust/application/handlers/trust-profile/award-trust-badge.handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { AwardTrustBadgeCommand } from '../../commands/trust-profile/award-trust-badge.command';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import {
  TrustBadgeNotFoundException,
  TrustProfileNotFoundException,
} from '../../../domain/exceptions';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import { TrustProfileBadgeEntity } from '../../../domain/entities/trust-profile-badge.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  TrustBadgeId,
  TrustProfileBadgeId,
  TrustProfileId,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

export class AwardTrustBadgeHandler implements CommandHandler<AwardTrustBadgeCommand> {
  constructor(private readonly repository: TrustProfileRepository) {}

  async execute(command: AwardTrustBadgeCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Profile Identity
    // -------------------------------------------------------------------------

    const profileId = new TrustProfileId(command.trustProfileId);

    // -------------------------------------------------------------------------
    // Load Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TrustProfileNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Badge Identity
    // -------------------------------------------------------------------------

    const badgeId = new TrustBadgeId(command.badgeId);

    // -------------------------------------------------------------------------
    // Existing Badge Definition
    //
    // TrustBadge is the master/definition entity. Awarding a badge must not
    // create another badge definition.
    // -------------------------------------------------------------------------

    const badge = aggregate.getBadgeById(badgeId);

    if (badge === undefined) {
      throw new TrustBadgeNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Profile Badge Identity
    // -------------------------------------------------------------------------

    const profileBadgeId = new TrustProfileBadgeId(command.profileBadgeId);

    // -------------------------------------------------------------------------
    // Existing Profile Badge
    //
    // If the profile badge already belongs to the aggregate, the aggregate
    // decides whether it is already active or should be restored.
    // -------------------------------------------------------------------------

    const existingProfileBadge = aggregate.getProfileBadgeById(profileBadgeId);

    if (existingProfileBadge !== undefined) {
      aggregate.awardBadge(
        badge,
        existingProfileBadge,
        command.correlationId,
        command.causationId,
      );

      await this.repository.save(aggregate);

      return;
    }

    // -------------------------------------------------------------------------
    // Create Profile Badge
    // -------------------------------------------------------------------------

    const profileBadge = TrustProfileBadgeEntity.create({
      publicId: profileBadgeId,

      profileId,

      badgeId: badge.publicId,

      awardedAt: new Date(),

      revokedAt: undefined,

      active: true,

      createdAt: new Date(),

      updatedAt: new Date(),
    });

    // -------------------------------------------------------------------------
    // Domain Operation
    // -------------------------------------------------------------------------

    aggregate.awardBadge(
      badge,
      profileBadge,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // Persistence
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);
  }
}
