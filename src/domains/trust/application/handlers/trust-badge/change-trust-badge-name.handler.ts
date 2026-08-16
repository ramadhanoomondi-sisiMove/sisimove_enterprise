// src/domains/trust/application/handlers/trust-badge/change-trust-badge-name.handler.ts

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { ChangeTrustBadgeNameCommand } from '../../commands/trust-badge/change-trust-badge-name.command';

import { TrustBadgeNotFoundException } from '../../../domain/exceptions';

import type { TrustBadgeRepository } from '../../../domain/repositories/trust-badge.repository';

import { TrustBadgeId, TrustBadgeName } from '../../../domain/value-objects';

export class ChangeTrustBadgeNameHandler implements CommandHandler<ChangeTrustBadgeNameCommand> {
  constructor(private readonly repository: TrustBadgeRepository) {}

  async execute(command: ChangeTrustBadgeNameCommand): Promise<void> {
    const trustBadgeId = new TrustBadgeId(command.trustBadgeId);

    const aggregate = await this.repository.findById(trustBadgeId);

    if (aggregate === null) {
      throw new TrustBadgeNotFoundException();
    }

    aggregate.changeName(new TrustBadgeName(command.name));

    await this.repository.save(aggregate);
  }
}
