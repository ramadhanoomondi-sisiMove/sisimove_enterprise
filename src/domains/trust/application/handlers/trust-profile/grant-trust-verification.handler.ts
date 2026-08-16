// src/domains/trust/application/handlers/trust-profile/grant-trust-verification.handler.ts

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { GrantTrustVerificationCommand } from '../../commands/trust-profile/grant-trust-verification.command';

import { TrustProfileNotFoundException } from '../../../domain/exceptions';

import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import { TrustProfileId } from '../../../domain/value-objects';

export class GrantTrustVerificationHandler implements CommandHandler<GrantTrustVerificationCommand> {
  constructor(private readonly repository: TrustProfileRepository) {}

  async execute(command: GrantTrustVerificationCommand): Promise<void> {
    const profileId = new TrustProfileId(command.trustProfileId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TrustProfileNotFoundException();
    }

    aggregate.grantVerification(
      command.verificationLevel,
      command.correlationId,
      command.causationId,
    );

    await this.repository.save(aggregate);
  }
}
