// src/domains/trust/application/handlers/trust-profile/remove-trust-rating.handler.ts

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { RemoveTrustRatingCommand } from '../../commands/trust-profile/remove-trust-rating.command';

import { TrustProfileNotFoundException } from '../../../domain/exceptions';

import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import { TrustProfileId, TrustRatingId } from '../../../domain/value-objects';

export class RemoveTrustRatingHandler implements CommandHandler<RemoveTrustRatingCommand> {
  constructor(private readonly repository: TrustProfileRepository) {}

  async execute(command: RemoveTrustRatingCommand): Promise<void> {
    const profileId = new TrustProfileId(command.trustProfileId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TrustProfileNotFoundException();
    }

    aggregate.removeRating(
      new TrustRatingId(command.ratingId),
      command.correlationId,
      command.causationId,
      command.reason,
    );

    await this.repository.save(aggregate);
  }
}
