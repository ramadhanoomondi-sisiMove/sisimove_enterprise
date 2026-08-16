// src/domains/trust/application/handlers/trust-profile/apply-journey-cancelled.handler.ts

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { ApplyJourneyCancelledCommand } from '../../commands/trust-profile/apply-journey-cancelled.command';

import { TrustProfileNotFoundException } from '../../../domain/exceptions';

import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import {
  TrustProfileId,
  JourneyPublicId,
  BookingPublicId,
} from '../../../domain/value-objects';

export class ApplyJourneyCancelledHandler implements CommandHandler<ApplyJourneyCancelledCommand> {
  constructor(private readonly repository: TrustProfileRepository) {}

  async execute(command: ApplyJourneyCancelledCommand): Promise<void> {
    const profileId = new TrustProfileId(command.trustProfileId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TrustProfileNotFoundException();
    }

    const journeyPublicId = new JourneyPublicId(command.journeyPublicId);

    const bookingPublicId =
      command.bookingPublicId !== undefined && command.bookingPublicId !== null
        ? new BookingPublicId(command.bookingPublicId)
        : undefined;

    aggregate.applyJourneyCancelled(
      journeyPublicId,
      command.role,
      command.correlationId,
      command.causationId,
      bookingPublicId,
      command.reason,
    );

    await this.repository.save(aggregate);
  }
}
