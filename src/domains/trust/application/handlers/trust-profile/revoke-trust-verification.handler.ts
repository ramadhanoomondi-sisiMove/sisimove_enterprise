// src/domains/trust/application/handlers/trust-profile/revoke-trust-verification.handler.ts

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { RevokeTrustVerificationCommand } from '../../commands/trust-profile/revoke-trust-verification.command';

import { TrustProfileNotFoundException } from '../../../domain/exceptions';

import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import { TrustProfileId } from '../../../domain/value-objects';

export class RevokeTrustVerificationHandler implements CommandHandler<RevokeTrustVerificationCommand> {
  constructor(private readonly repository: TrustProfileRepository) {}

  async execute(command: RevokeTrustVerificationCommand): Promise<void> {
    const profileId = new TrustProfileId(command.trustProfileId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TrustProfileNotFoundException();
    }

    aggregate.revokeVerification(command.correlationId, command.causationId);

    await this.repository.save(aggregate);
  }
}
