// src/domains/trust/application/handlers/trust-badge/deactivate-trust-badge.handler.ts

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { DeactivateTrustBadgeCommand } from '../../commands/trust-badge/deactivate-trust-badge.command';

import { TrustBadgeNotFoundException } from '../../../domain/exceptions';

import type { TrustBadgeRepository } from '../../../domain/repositories/trust-badge.repository';

import { TrustBadgeId } from '../../../domain/value-objects';

export class DeactivateTrustBadgeHandler implements CommandHandler<DeactivateTrustBadgeCommand> {
  constructor(private readonly repository: TrustBadgeRepository) {}

  async execute(command: DeactivateTrustBadgeCommand): Promise<void> {
    const trustBadgeId = new TrustBadgeId(command.trustBadgeId);

    const aggregate = await this.repository.findById(trustBadgeId);

    if (aggregate === null) {
      throw new TrustBadgeNotFoundException();
    }

    aggregate.deactivate();

    await this.repository.save(aggregate);
  }
}
