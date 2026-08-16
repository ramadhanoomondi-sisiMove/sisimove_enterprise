// src/domains/trust/application/handlers/trust-badge/activate-trust-badge.handler.ts

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { ActivateTrustBadgeCommand } from '../../commands/trust-badge/activate-trust-badge.command';

import { TrustBadgeNotFoundException } from '../../../domain/exceptions';

import type { TrustBadgeRepository } from '../../../domain/repositories/trust-badge.repository';

import { TrustBadgeId } from '../../../domain/value-objects';

export class ActivateTrustBadgeHandler implements CommandHandler<ActivateTrustBadgeCommand> {
  constructor(private readonly repository: TrustBadgeRepository) {}

  async execute(command: ActivateTrustBadgeCommand): Promise<void> {
    const trustBadgeId = new TrustBadgeId(command.trustBadgeId);

    const aggregate = await this.repository.findById(trustBadgeId);

    if (aggregate === null) {
      throw new TrustBadgeNotFoundException();
    }

    aggregate.activate();

    await this.repository.save(aggregate);
  }
}
