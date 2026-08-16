// src/domains/trust/application/handlers/trust-profile/remove-trust-review.handler.ts

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { RemoveTrustReviewCommand } from '../../commands/trust-profile/remove-trust-review.command';

import { TrustProfileNotFoundException } from '../../../domain/exceptions';

import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import { TrustProfileId, TrustReviewId } from '../../../domain/value-objects';

export class RemoveTrustReviewHandler implements CommandHandler<RemoveTrustReviewCommand> {
  constructor(private readonly repository: TrustProfileRepository) {}

  async execute(command: RemoveTrustReviewCommand): Promise<void> {
    const profileId = new TrustProfileId(command.trustProfileId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TrustProfileNotFoundException();
    }

    aggregate.removeReview(
      new TrustReviewId(command.reviewId),
      command.correlationId,
      command.causationId,
      command.reason,
    );

    await this.repository.save(aggregate);
  }
}
