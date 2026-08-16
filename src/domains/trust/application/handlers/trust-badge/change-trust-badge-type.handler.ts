// src/domains/trust/application/handlers/trust-badge/change-trust-badge-type.handler.ts

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { ChangeTrustBadgeTypeCommand } from '../../commands/trust-badge/change-trust-badge-type.command';

import { TrustBadgeNotFoundException } from '../../../domain/exceptions';

import type { TrustBadgeRepository } from '../../../domain/repositories/trust-badge.repository';

import {
  TrustBadgeId,
  TrustBadgeTypeValueObject,
} from '../../../domain/value-objects';

export class ChangeTrustBadgeTypeHandler implements CommandHandler<ChangeTrustBadgeTypeCommand> {
  constructor(private readonly repository: TrustBadgeRepository) {}

  async execute(command: ChangeTrustBadgeTypeCommand): Promise<void> {
    const trustBadgeId = new TrustBadgeId(command.trustBadgeId);

    const aggregate = await this.repository.findById(trustBadgeId);

    if (aggregate === null) {
      throw new TrustBadgeNotFoundException();
    }

    aggregate.changeType(new TrustBadgeTypeValueObject(command.type));

    await this.repository.save(aggregate);
  }
}
