// src/domains/trust/application/handlers/trust-badge/change-trust-badge-description.handler.ts

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { ChangeTrustBadgeDescriptionCommand } from '../../commands/trust-badge/change-trust-badge-description.command';

import { TrustBadgeNotFoundException } from '../../../domain/exceptions';

import type { TrustBadgeRepository } from '../../../domain/repositories/trust-badge.repository';

import {
  TrustBadgeDescription,
  TrustBadgeId,
} from '../../../domain/value-objects';

export class ChangeTrustBadgeDescriptionHandler implements CommandHandler<ChangeTrustBadgeDescriptionCommand> {
  constructor(private readonly repository: TrustBadgeRepository) {}

  async execute(command: ChangeTrustBadgeDescriptionCommand): Promise<void> {
    const trustBadgeId = new TrustBadgeId(command.trustBadgeId);

    const aggregate = await this.repository.findById(trustBadgeId);

    if (aggregate === null) {
      throw new TrustBadgeNotFoundException();
    }

    if (command.description === undefined) {
      aggregate.removeDescription();
    } else {
      aggregate.changeDescription(
        new TrustBadgeDescription(command.description),
      );
    }

    await this.repository.save(aggregate);
  }
}
