// src/domains/trust/application/handlers/trust-profile/create-trust-review.handler.ts

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { CreateTrustReviewCommand } from '../../commands/trust-profile/create-trust-review.command';

import { TrustProfileNotFoundException } from '../../../domain/exceptions';

import { TrustReviewEntity } from '../../../domain/entities/trust-review.entity';

import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import {
  TrustProfileId,
  TrustRatingId,
  TrustReviewContent,
  TrustReviewId,
} from '../../../domain/value-objects';

export class CreateTrustReviewHandler implements CommandHandler<CreateTrustReviewCommand> {
  constructor(private readonly repository: TrustProfileRepository) {}

  async execute(command: CreateTrustReviewCommand): Promise<void> {
    const profileId = new TrustProfileId(command.trustProfileId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TrustProfileNotFoundException();
    }

    const review = TrustReviewEntity.create({
      publicId: new TrustReviewId(),

      ratingId: new TrustRatingId(command.ratingId),

      content: new TrustReviewContent(command.content),

      createdAt: new Date(),

      updatedAt: new Date(),
    });

    aggregate.createReview(review, command.correlationId, command.causationId);

    await this.repository.save(aggregate);
  }
}
