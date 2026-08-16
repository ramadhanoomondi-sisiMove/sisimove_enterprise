// src/domains/trust/application/handlers/trust-profile/apply-trust-dispute-opened.handler.ts

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { ApplyTrustDisputeOpenedCommand } from '../../commands/trust-profile/apply-trust-dispute-opened.command';

import { TrustProfileNotFoundException } from '../../../domain/exceptions';

import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import {
  TrustProfileId,
  DisputePublicId,
  JourneyPublicId,
  BookingPublicId,
  ActorPublicId,
} from '../../../domain/value-objects';

export class ApplyTrustDisputeOpenedHandler implements CommandHandler<ApplyTrustDisputeOpenedCommand> {
  constructor(private readonly repository: TrustProfileRepository) {}

  async execute(command: ApplyTrustDisputeOpenedCommand): Promise<void> {
    const aggregate = await this.repository.findById(
      new TrustProfileId(command.trustProfileId),
    );

    if (aggregate === null) {
      throw new TrustProfileNotFoundException();
    }

    aggregate.applyDisputeOpened(
      new DisputePublicId(command.disputePublicId),
      command.correlationId,
      command.causationId,

      command.journeyPublicId !== undefined && command.journeyPublicId !== null
        ? new JourneyPublicId(command.journeyPublicId)
        : undefined,

      command.bookingPublicId !== undefined && command.bookingPublicId !== null
        ? new BookingPublicId(command.bookingPublicId)
        : undefined,

      command.actorPublicId !== undefined && command.actorPublicId !== null
        ? new ActorPublicId(command.actorPublicId)
        : undefined,

      command.reason,
    );

    await this.repository.save(aggregate);
  }
}
