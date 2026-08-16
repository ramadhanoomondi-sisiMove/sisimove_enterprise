// src/domains/trust/application/handlers/trust-profile/hide-trust-rating.handler.ts

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { HideTrustRatingCommand } from '../../commands/trust-profile/hide-trust-rating.command';

import { TrustProfileNotFoundException } from '../../../domain/exceptions';

import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import { TrustProfileId, TrustRatingId } from '../../../domain/value-objects';

export class HideTrustRatingHandler implements CommandHandler<HideTrustRatingCommand> {
  constructor(private readonly repository: TrustProfileRepository) {}

  async execute(command: HideTrustRatingCommand): Promise<void> {
    const profileId = new TrustProfileId(command.trustProfileId);
    const ratingId = new TrustRatingId(command.ratingId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TrustProfileNotFoundException();
    }

    aggregate.hideRating(
      ratingId,
      command.correlationId,
      command.causationId,
      command.reason,
    );

    await this.repository.save(aggregate);
  }
}
