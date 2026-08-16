// src/domains/trust/application/handlers/trust-profile/restore-trust-profile.handler.ts

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { RestoreTrustProfileCommand } from '../../commands/trust-profile/restore-trust-profile.command';

import { TrustProfileNotFoundException } from '../../../domain/exceptions';

import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import { TrustProfileId } from '../../../domain/value-objects';

export class RestoreTrustProfileHandler implements CommandHandler<RestoreTrustProfileCommand> {
  constructor(private readonly repository: TrustProfileRepository) {}

  async execute(command: RestoreTrustProfileCommand): Promise<void> {
    const profileId = new TrustProfileId(command.trustProfileId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TrustProfileNotFoundException();
    }

    aggregate.restore(command.correlationId, command.causationId);

    await this.repository.save(aggregate);
  }
}
