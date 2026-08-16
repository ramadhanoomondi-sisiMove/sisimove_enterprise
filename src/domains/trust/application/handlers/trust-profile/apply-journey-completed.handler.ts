// src/domains/trust/application/handlers/trust-profile/apply-journey-completed.handler.ts

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { ApplyJourneyCompletedCommand } from '../../commands/trust-profile/apply-journey-completed.command';

import { TrustProfileNotFoundException } from '../../../domain/exceptions';

import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import {
  BookingPublicId,
  JourneyPublicId,
  TrustProfileId,
} from '../../../domain/value-objects';

export class ApplyJourneyCompletedHandler implements CommandHandler<ApplyJourneyCompletedCommand> {
  constructor(private readonly repository: TrustProfileRepository) {}

  async execute(command: ApplyJourneyCompletedCommand): Promise<void> {
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

    aggregate.applyJourneyCompleted(
      journeyPublicId,
      command.role,
      command.correlationId,
      command.causationId,
      bookingPublicId,
    );

    await this.repository.save(aggregate);
  }
}
