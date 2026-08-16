// src/domains/trust/application/handlers/trust-profile/apply-trust-manual-adjustment.handler.ts

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { ApplyTrustManualAdjustmentCommand } from '../../commands/trust-profile/apply-trust-manual-adjustment.command';

import { TrustProfileNotFoundException } from '../../../domain/exceptions';

import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import { TrustProfileId, ActorPublicId } from '../../../domain/value-objects';

export class ApplyTrustManualAdjustmentHandler implements CommandHandler<ApplyTrustManualAdjustmentCommand> {
  constructor(private readonly repository: TrustProfileRepository) {}

  async execute(command: ApplyTrustManualAdjustmentCommand): Promise<void> {
    const aggregate = await this.repository.findById(
      new TrustProfileId(command.trustProfileId),
    );

    if (aggregate === null) {
      throw new TrustProfileNotFoundException();
    }

    aggregate.applyManualAdjustment(
      new ActorPublicId(command.actorPublicId),
      command.reason,
      command.adjustment,
      command.metadata,
      command.correlationId,
      command.causationId,
    );

    await this.repository.save(aggregate);
  }
}
