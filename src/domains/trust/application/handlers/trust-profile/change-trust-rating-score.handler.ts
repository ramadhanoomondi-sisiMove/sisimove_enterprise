// src/domains/trust/application/handlers/trust-profile/change-trust-rating-score.handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { ChangeTrustRatingScoreCommand } from '../../commands/trust-profile/change-trust-rating-score.command';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { TrustProfileNotFoundException } from '../../../domain/exceptions';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { TrustProfileId, TrustRatingId } from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

export class ChangeTrustRatingScoreHandler implements CommandHandler<ChangeTrustRatingScoreCommand> {
  constructor(private readonly repository: TrustProfileRepository) {}

  async execute(command: ChangeTrustRatingScoreCommand): Promise<void> {
    const profileId = new TrustProfileId(command.trustProfileId);

    const ratingId = new TrustRatingId(command.ratingId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TrustProfileNotFoundException();
    }

    aggregate.changeRatingScore(
      ratingId,
      command.score,
      command.correlationId,
      command.causationId,
    );

    await this.repository.save(aggregate);
  }
}
