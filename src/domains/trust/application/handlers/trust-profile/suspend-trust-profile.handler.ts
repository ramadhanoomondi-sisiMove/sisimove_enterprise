// src/domains/trust/application/handlers/trust-profile/suspend-trust-profile.handler.ts

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { SuspendTrustProfileCommand } from '../../commands/trust-profile/suspend-trust-profile.command';

import { TrustProfileNotFoundException } from '../../../domain/exceptions';

import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import { TrustProfileId } from '../../../domain/value-objects';

export class SuspendTrustProfileHandler implements CommandHandler<SuspendTrustProfileCommand> {
  constructor(private readonly repository: TrustProfileRepository) {}

  async execute(command: SuspendTrustProfileCommand): Promise<void> {
    const profileId = new TrustProfileId(command.trustProfileId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TrustProfileNotFoundException();
    }

    aggregate.suspend(
      command.correlationId,
      command.causationId,
      command.reason,
    );

    await this.repository.save(aggregate);
  }
}
