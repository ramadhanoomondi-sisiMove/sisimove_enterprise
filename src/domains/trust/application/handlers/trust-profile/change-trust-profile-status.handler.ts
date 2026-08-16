// src/domains/trust/application/handlers/trust-profile/change-trust-profile-status.handler.ts

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { ChangeTrustProfileStatusCommand } from '../../commands/trust-profile/change-trust-profile-status.command';

import { TrustProfileNotFoundException } from '../../../domain/exceptions';

import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import { TrustProfileId } from '../../../domain/value-objects';

export class ChangeTrustProfileStatusHandler implements CommandHandler<ChangeTrustProfileStatusCommand> {
  constructor(private readonly repository: TrustProfileRepository) {}

  async execute(command: ChangeTrustProfileStatusCommand): Promise<void> {
    const profileId = new TrustProfileId(command.trustProfileId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TrustProfileNotFoundException();
    }

    aggregate.changeStatus(
      command.status,
      command.correlationId,
      command.causationId,
    );

    await this.repository.save(aggregate);
  }
}
