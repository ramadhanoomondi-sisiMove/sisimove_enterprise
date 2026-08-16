// src/domains/trust/application/handlers/trust-profile/revoke-trust-badge.handler.ts

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { RevokeTrustBadgeCommand } from '../../commands/trust-profile/revoke-trust-badge.command';

import { TrustProfileNotFoundException } from '../../../domain/exceptions';

import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import {
  TrustProfileId,
  TrustProfileBadgeId,
} from '../../../domain/value-objects';

export class RevokeTrustBadgeHandler implements CommandHandler<RevokeTrustBadgeCommand> {
  constructor(private readonly repository: TrustProfileRepository) {}

  async execute(command: RevokeTrustBadgeCommand): Promise<void> {
    const profileId = new TrustProfileId(command.trustProfileId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TrustProfileNotFoundException();
    }

    aggregate.revokeBadge(
      new TrustProfileBadgeId(command.profileBadgeId),
      command.correlationId,
      command.causationId,
      command.reason,
    );

    await this.repository.save(aggregate);
  }
}
