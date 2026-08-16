// src/domains/trust/application/handlers/trust-profile/update-trust-review.handler.ts

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { UpdateTrustReviewCommand } from '../../commands/trust-profile/update-trust-review.command';

import { TrustProfileNotFoundException } from '../../../domain/exceptions';

import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import {
  TrustProfileId,
  TrustReviewContent,
  TrustReviewId,
} from '../../../domain/value-objects';

export class UpdateTrustReviewHandler implements CommandHandler<UpdateTrustReviewCommand> {
  constructor(private readonly repository: TrustProfileRepository) {}

  async execute(command: UpdateTrustReviewCommand): Promise<void> {
    const profileId = new TrustProfileId(command.trustProfileId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TrustProfileNotFoundException();
    }

    aggregate.updateReview(
      new TrustReviewId(command.reviewId),
      new TrustReviewContent(command.content),
      command.correlationId,
      command.causationId,
    );

    await this.repository.save(aggregate);
  }
}
