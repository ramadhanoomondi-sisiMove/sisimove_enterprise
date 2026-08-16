// src/domains/trust/application/handlers/trust-profile/restore-trust-rating.handler.ts

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { RestoreTrustRatingCommand } from '../../commands/trust-profile/restore-trust-rating.command';

import { TrustProfileNotFoundException } from '../../../domain/exceptions';

import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import { TrustProfileId, TrustRatingId } from '../../../domain/value-objects';

export class RestoreTrustRatingHandler implements CommandHandler<RestoreTrustRatingCommand> {
  constructor(private readonly repository: TrustProfileRepository) {}

  async execute(command: RestoreTrustRatingCommand): Promise<void> {
    const profileId = new TrustProfileId(command.trustProfileId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TrustProfileNotFoundException();
    }

    aggregate.restoreRating(
      new TrustRatingId(command.ratingId),
      command.correlationId,
      command.causationId,
    );

    await this.repository.save(aggregate);
  }
}
