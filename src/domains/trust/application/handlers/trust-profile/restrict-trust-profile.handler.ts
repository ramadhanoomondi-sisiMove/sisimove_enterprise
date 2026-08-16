// src/domains/trust/application/handlers/trust-profile/restrict-trust-profile.handler.ts

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { RestrictTrustProfileCommand } from '../../commands/trust-profile/restrict-trust-profile.command';

import { TrustProfileNotFoundException } from '../../../domain/exceptions';

import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import { TrustProfileId } from '../../../domain/value-objects';

export class RestrictTrustProfileHandler implements CommandHandler<RestrictTrustProfileCommand> {
  constructor(private readonly repository: TrustProfileRepository) {}

  async execute(command: RestrictTrustProfileCommand): Promise<void> {
    const profileId = new TrustProfileId(command.trustProfileId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TrustProfileNotFoundException();
    }

    aggregate.restrict(
      command.correlationId,
      command.causationId,
      command.reason,
    );

    await this.repository.save(aggregate);
  }
}
