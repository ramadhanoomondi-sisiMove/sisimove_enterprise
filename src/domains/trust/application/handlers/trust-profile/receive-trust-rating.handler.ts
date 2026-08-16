// src/domains/trust/application/handlers/trust-profile/receive-trust-rating.handler.ts

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { ReceiveTrustRatingCommand } from '../../commands/trust-profile/receive-trust-rating.command';

import { TrustProfileNotFoundException } from '../../../domain/exceptions';

import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import { TrustRatingEntity } from '../../../domain/entities/trust-rating.entity';

import {
  BookingPublicId,
  JourneyPublicId,
  ReviewerPublicId,
  RevieweePublicId,
  TrustProfileId,
  TrustRatingId,
  TrustRatingRoleValueObject,
  TrustRatingScore,
  TrustRatingStatusValueObject,
} from '../../../domain/value-objects';

export class ReceiveTrustRatingHandler implements CommandHandler<ReceiveTrustRatingCommand> {
  constructor(private readonly repository: TrustProfileRepository) {}

  async execute(command: ReceiveTrustRatingCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Profile Identity
    // -------------------------------------------------------------------------

    const profileId = new TrustProfileId(command.trustProfileId);

    // -------------------------------------------------------------------------
    // Load Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TrustProfileNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Create Rating
    // -------------------------------------------------------------------------

    const rating = TrustRatingEntity.create({
      publicId: new TrustRatingId(command.ratingId),

      reviewerPublicId: new ReviewerPublicId(command.reviewerPublicId),

      revieweePublicId: new RevieweePublicId(command.revieweePublicId),

      journeyPublicId: new JourneyPublicId(command.journeyPublicId),

      bookingPublicId:
        command.bookingPublicId !== undefined
          ? new BookingPublicId(command.bookingPublicId)
          : undefined,

      role: new TrustRatingRoleValueObject(command.role),

      score: new TrustRatingScore(command.score),

      status: new TrustRatingStatusValueObject(command.status),

      reviewPublicId: undefined,

      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // -------------------------------------------------------------------------
    // Domain Operation
    // -------------------------------------------------------------------------

    aggregate.receiveRating(rating, command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // Persistence
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);
  }
}
