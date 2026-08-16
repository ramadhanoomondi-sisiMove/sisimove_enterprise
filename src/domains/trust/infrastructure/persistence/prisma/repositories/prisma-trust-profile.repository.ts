// src/domains/trust/infrastructure/persistence/prisma/repositories/prisma-trust-profile.repository.ts

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { Prisma } from '@prisma/client';

import type { PrismaService } from '../../../../../../infrastructure/database/prisma/prisma.service';

// -----------------------------------------------------------------------------
// Domain Repository
// -----------------------------------------------------------------------------

import type { TrustProfileRepository } from '../../../../domain/repositories/trust-profile.repository';

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import { TrustProfileAggregate } from '../../../../domain/aggregates/trust-profile.aggregate';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { TrustProfileEntity } from '../../../../domain/entities/trust-profile.entity';
import type { TrustRatingEntity } from '../../../../domain/entities/trust-rating.entity';
import type { TrustReviewEntity } from '../../../../domain/entities/trust-review.entity';
import type { TrustProfileBadgeEntity } from '../../../../domain/entities/trust-profile-badge.entity';
import type { TrustEventEntity } from '../../../../domain/entities/trust-event.entity';

// -----------------------------------------------------------------------------
// Mappers
// -----------------------------------------------------------------------------

import {
  TrustBadgePrismaMapper,
  TrustEventPrismaMapper,
  TrustProfileBadgePrismaMapper,
  TrustProfilePrismaMapper,
  TrustRatingPrismaMapper,
  TrustReviewPrismaMapper,
} from '../mappers';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { TrustProfileId } from '../../../../domain/value-objects/trust-profile-id.vo';
import type { MemberPublicId } from '../../../../domain/value-objects/member-public-id.vo';

import type { TrustRatingId } from '../../../../domain/value-objects/trust-rating-id.vo';
import type { TrustReviewId } from '../../../../domain/value-objects/trust-review-id.vo';
import type { TrustProfileBadgeId } from '../../../../domain/value-objects/trust-profile-badge-id.vo';
import type { TrustEventId } from '../../../../domain/value-objects/trust-event-id.vo';

import type { JourneyPublicId } from '../../../../domain/value-objects/journey-public-id.vo';
import type { BookingPublicId } from '../../../../domain/value-objects/booking-public-id.vo';
import type { RatingPublicId } from '../../../../domain/value-objects/rating-public-id.vo';
import type { BadgePublicId } from '../../../../domain/value-objects/badge-public-id.vo';
import type { DisputePublicId } from '../../../../domain/value-objects/dispute-public-id.vo';

import type { TrustProfileStatusValueObject } from '../../../../domain/value-objects/trust-profile-status.vo';
import type { TrustVerificationLevelValueObject } from '../../../../domain/value-objects/trust-verification-level.vo';

// -----------------------------------------------------------------------------
// Prisma Payload
// -----------------------------------------------------------------------------

type TrustProfileWithComponents = Prisma.TrustProfileGetPayload<{
  include: {
    ratings: {
      include: {
        review: true;
      };
      orderBy: {
        createdAt: 'asc';
      };
    };

    badges: {
      include: {
        badge: true;
      };
      orderBy: {
        awardedAt: 'asc';
      };
    };

    events: {
      orderBy: {
        createdAt: 'asc';
      };
    };
  };
}>;

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

export class PrismaTrustProfileRepository implements TrustProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Aggregate Persistence
  // ===========================================================================

  async save(aggregate: TrustProfileAggregate): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const profile = aggregate.profile;
      const profileId = profile.id.toString();

      // -----------------------------------------------------------------------
      // Trust Profile
      // -----------------------------------------------------------------------

      await tx.trustProfile.upsert({
        where: {
          id: profileId,
        },

        create: TrustProfilePrismaMapper.toPersistence(profile),

        update: TrustProfilePrismaMapper.toUpdate(profile),
      });

      // -----------------------------------------------------------------------
      // Ratings
      // -----------------------------------------------------------------------
      //
      // Ratings are owned by the TrustProfile aggregate.
      // -----------------------------------------------------------------------

      const ratings = aggregate.ratings;

      const ratingIds = ratings.map((rating) => rating.id.toString());

      await tx.trustRating.deleteMany({
        where: {
          profileId,

          ...(ratingIds.length > 0
            ? {
                id: {
                  notIn: ratingIds,
                },
              }
            : {}),
        },
      });

      for (const rating of ratings) {
        await tx.trustRating.upsert({
          where: {
            id: rating.id.toString(),
          },

          create: TrustRatingPrismaMapper.toPersistence(rating, profileId),

          update: TrustRatingPrismaMapper.toUpdate(rating),
        });
      }

      // -----------------------------------------------------------------------
      // Reviews
      // -----------------------------------------------------------------------
      //
      // Reviews are children of ratings and therefore belong to the same
      // aggregate persistence boundary.
      // -----------------------------------------------------------------------

      const reviews = aggregate.reviews;

      const reviewIds = reviews.map((review) => review.id.toString());

      if (reviewIds.length === 0) {
        await tx.trustReview.deleteMany({
          where: {
            rating: {
              profileId,
            },
          },
        });
      } else {
        await tx.trustReview.deleteMany({
          where: {
            rating: {
              profileId,
            },

            id: {
              notIn: reviewIds,
            },
          },
        });
      }

      for (const review of reviews) {
        await tx.trustReview.upsert({
          where: {
            id: review.id.toString(),
          },

          create: TrustReviewPrismaMapper.toPersistence(review),

          update: TrustReviewPrismaMapper.toUpdate(review),
        });
      }

      // -----------------------------------------------------------------------
      // Profile Badges
      // -----------------------------------------------------------------------
      //
      // TrustBadge is the badge definition/master entity.
      // TrustProfileBadge is the aggregate-owned assignment.
      //
      // Therefore the aggregate persists profileBadges, not badge definitions.
      // -----------------------------------------------------------------------

      const profileBadges = aggregate.profileBadges;

      const profileBadgeIds = profileBadges.map((profileBadge) =>
        profileBadge.id.toString(),
      );

      await tx.trustProfileBadge.deleteMany({
        where: {
          profileId,

          ...(profileBadgeIds.length > 0
            ? {
                id: {
                  notIn: profileBadgeIds,
                },
              }
            : {}),
        },
      });

      for (const profileBadge of profileBadges) {
        await tx.trustProfileBadge.upsert({
          where: {
            id: profileBadge.id.toString(),
          },

          create: TrustProfileBadgePrismaMapper.toPersistence(profileBadge),

          update: TrustProfileBadgePrismaMapper.toUpdate(profileBadge),
        });
      }

      // -----------------------------------------------------------------------
      // Trust Events
      // -----------------------------------------------------------------------
      //
      // TrustEvent history is owned by the TrustProfile aggregate.
      // -----------------------------------------------------------------------

      const events = aggregate.events;

      const eventIds = events.map((event) => event.id.toString());

      await tx.trustEvent.deleteMany({
        where: {
          profileId,

          ...(eventIds.length > 0
            ? {
                id: {
                  notIn: eventIds,
                },
              }
            : {}),
        },
      });

      for (const event of events) {
        await tx.trustEvent.upsert({
          where: {
            id: event.id.toString(),
          },

          create: TrustEventPrismaMapper.toPersistence(event, profileId),

          update: TrustEventPrismaMapper.toUpdate(event),
        });
      }
    });
  }

  // ===========================================================================
  // Aggregate Queries
  // ===========================================================================

  async findById(id: TrustProfileId): Promise<TrustProfileAggregate | null> {
    return this.findAggregateByPublicId(id.value);
  }

  async findByPublicId(
    publicId: TrustProfileId,
  ): Promise<TrustProfileAggregate | null> {
    return this.findAggregateByPublicId(publicId.value);
  }

  async findByMemberPublicId(
    memberPublicId: MemberPublicId,
  ): Promise<TrustProfileAggregate | null> {
    const record = await this.prisma.trustProfile.findUnique({
      where: {
        memberPublicId: memberPublicId.value,
      },

      include: this.aggregateInclude,
    });

    if (record === null) {
      return null;
    }

    return this.toAggregate(record);
  }

  async delete(id: TrustProfileId): Promise<void> {
    const profile = await this.prisma.trustProfile.findUnique({
      where: {
        publicId: id.value,
      },

      select: {
        id: true,
      },
    });

    if (profile === null) {
      return;
    }

    await this.prisma.trustProfile.delete({
      where: {
        id: profile.id,
      },
    });
  }

  async exists(id: TrustProfileId): Promise<boolean> {
    const count = await this.prisma.trustProfile.count({
      where: {
        publicId: id.value,
      },
    });

    return count > 0;
  }

  async existsByPublicId(publicId: TrustProfileId): Promise<boolean> {
    return this.exists(publicId);
  }

  async existsByMemberPublicId(
    memberPublicId: MemberPublicId,
  ): Promise<boolean> {
    const count = await this.prisma.trustProfile.count({
      where: {
        memberPublicId: memberPublicId.value,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Profile Queries
  // ===========================================================================

  async findProfileById(
    id: TrustProfileId,
  ): Promise<TrustProfileEntity | null> {
    return this.findProfileByPublicId(id);
  }

  async findProfileByPublicId(
    publicId: TrustProfileId,
  ): Promise<TrustProfileEntity | null> {
    const record = await this.prisma.trustProfile.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return TrustProfilePrismaMapper.toDomain(record);
  }

  async findProfileByMemberPublicId(
    memberPublicId: MemberPublicId,
  ): Promise<TrustProfileEntity | null> {
    const record = await this.prisma.trustProfile.findUnique({
      where: {
        memberPublicId: memberPublicId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return TrustProfilePrismaMapper.toDomain(record);
  }

  async findProfilesByStatus(
    status: TrustProfileStatusValueObject,
  ): Promise<TrustProfileEntity[]> {
    const records = await this.prisma.trustProfile.findMany({
      where: {
        status: status.value,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => TrustProfilePrismaMapper.toDomain(record));
  }

  async findProfilesByVerificationLevel(
    verificationLevel: TrustVerificationLevelValueObject,
  ): Promise<TrustProfileEntity[]> {
    const records = await this.prisma.trustProfile.findMany({
      where: {
        verificationLevel: verificationLevel.value,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => TrustProfilePrismaMapper.toDomain(record));
  }

  // ===========================================================================
  // Ratings
  // ===========================================================================

  async findRatingById(
    profileId: TrustProfileId,
    ratingId: TrustRatingId,
  ): Promise<TrustRatingEntity | null> {
    const profile = await this.getProfilePersistenceId(profileId);

    if (profile === null) {
      return null;
    }

    const record = await this.prisma.trustRating.findFirst({
      where: {
        publicId: ratingId.value,
        profileId: profile.id,
      },

      include: {
        review: true,
      },
    });

    if (record === null) {
      return null;
    }

    return TrustRatingPrismaMapper.toDomain(record);
  }

  async findRatings(profileId: TrustProfileId): Promise<TrustRatingEntity[]> {
    const profile = await this.getProfilePersistenceId(profileId);

    if (profile === null) {
      return [];
    }

    const records = await this.prisma.trustRating.findMany({
      where: {
        profileId: profile.id,
      },

      orderBy: {
        createdAt: 'asc',
      },

      include: {
        review: true,
      },
    });

    return records.map((record) => TrustRatingPrismaMapper.toDomain(record));
  }

  async findRatingsForReviewee(
    profileId: TrustProfileId,
    revieweePublicId: MemberPublicId,
  ): Promise<TrustRatingEntity[]> {
    const profile = await this.getProfilePersistenceId(profileId);

    if (profile === null) {
      return [];
    }

    const records = await this.prisma.trustRating.findMany({
      where: {
        profileId: profile.id,
        revieweePublicId: revieweePublicId.value,
      },

      orderBy: {
        createdAt: 'asc',
      },

      include: {
        review: true,
      },
    });

    return records.map((record) => TrustRatingPrismaMapper.toDomain(record));
  }

  async findRatingsByReviewer(
    profileId: TrustProfileId,
    reviewerPublicId: MemberPublicId,
  ): Promise<TrustRatingEntity[]> {
    const profile = await this.getProfilePersistenceId(profileId);

    if (profile === null) {
      return [];
    }

    const records = await this.prisma.trustRating.findMany({
      where: {
        profileId: profile.id,
        reviewerPublicId: reviewerPublicId.value,
      },

      orderBy: {
        createdAt: 'asc',
      },

      include: {
        review: true,
      },
    });

    return records.map((record) => TrustRatingPrismaMapper.toDomain(record));
  }

  async findRatingsForJourney(
    profileId: TrustProfileId,
    journeyPublicId: JourneyPublicId,
  ): Promise<TrustRatingEntity[]> {
    const profile = await this.getProfilePersistenceId(profileId);

    if (profile === null) {
      return [];
    }

    const records = await this.prisma.trustRating.findMany({
      where: {
        profileId: profile.id,
        journeyPublicId: journeyPublicId.value,
      },

      orderBy: {
        createdAt: 'asc',
      },

      include: {
        review: true,
      },
    });

    return records.map((record) => TrustRatingPrismaMapper.toDomain(record));
  }

  async existsRating(
    profileId: TrustProfileId,
    ratingId: TrustRatingId,
  ): Promise<boolean> {
    const profile = await this.getProfilePersistenceId(profileId);

    if (profile === null) {
      return false;
    }

    const count = await this.prisma.trustRating.count({
      where: {
        publicId: ratingId.value,
        profileId: profile.id,
      },
    });

    return count > 0;
  }

  async existsRatingForJourney(
    journeyPublicId: JourneyPublicId,
    reviewerPublicId: MemberPublicId,
    revieweePublicId: MemberPublicId,
  ): Promise<boolean> {
    const count = await this.prisma.trustRating.count({
      where: {
        journeyPublicId: journeyPublicId.value,
        reviewerPublicId: reviewerPublicId.value,
        revieweePublicId: revieweePublicId.value,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Reviews
  // ===========================================================================

  async findReviewById(
    profileId: TrustProfileId,
    reviewId: TrustReviewId,
  ): Promise<TrustReviewEntity | null> {
    const profile = await this.getProfilePersistenceId(profileId);

    if (profile === null) {
      return null;
    }

    const record = await this.prisma.trustReview.findFirst({
      where: {
        publicId: reviewId.value,

        rating: {
          profileId: profile.id,
        },
      },
    });

    if (record === null) {
      return null;
    }

    return TrustReviewPrismaMapper.toDomain(record);
  }

  async findReviews(profileId: TrustProfileId): Promise<TrustReviewEntity[]> {
    const profile = await this.getProfilePersistenceId(profileId);

    if (profile === null) {
      return [];
    }

    const records = await this.prisma.trustReview.findMany({
      where: {
        rating: {
          profileId: profile.id,
        },
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => TrustReviewPrismaMapper.toDomain(record));
  }

  async findReviewForRating(
    profileId: TrustProfileId,
    ratingId: TrustRatingId,
  ): Promise<TrustReviewEntity | null> {
    const profile = await this.getProfilePersistenceId(profileId);

    if (profile === null) {
      return null;
    }

    const record = await this.prisma.trustReview.findFirst({
      where: {
        rating: {
          profileId: profile.id,
          publicId: ratingId.value,
        },
      },
    });

    if (record === null) {
      return null;
    }

    return TrustReviewPrismaMapper.toDomain(record);
  }

  async existsReview(
    profileId: TrustProfileId,
    reviewId: TrustReviewId,
  ): Promise<boolean> {
    const profile = await this.getProfilePersistenceId(profileId);

    if (profile === null) {
      return false;
    }

    const count = await this.prisma.trustReview.count({
      where: {
        publicId: reviewId.value,

        rating: {
          profileId: profile.id,
        },
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Profile Badges
  // ===========================================================================

  async findProfileBadgeById(
    profileId: TrustProfileId,
    profileBadgeId: TrustProfileBadgeId,
  ): Promise<TrustProfileBadgeEntity | null> {
    const profile = await this.getProfilePersistenceId(profileId);

    if (profile === null) {
      return null;
    }

    const record = await this.prisma.trustProfileBadge.findFirst({
      where: {
        publicId: profileBadgeId.value,
        profileId: profile.id,
      },
    });

    if (record === null) {
      return null;
    }

    return TrustProfileBadgePrismaMapper.toDomain(record);
  }

  async findProfileBadges(
    profileId: TrustProfileId,
  ): Promise<TrustProfileBadgeEntity[]> {
    const profile = await this.getProfilePersistenceId(profileId);

    if (profile === null) {
      return [];
    }

    const records = await this.prisma.trustProfileBadge.findMany({
      where: {
        profileId: profile.id,
      },

      orderBy: {
        awardedAt: 'asc',
      },
    });

    return records.map((record) =>
      TrustProfileBadgePrismaMapper.toDomain(record),
    );
  }

  async findActiveProfileBadges(
    profileId: TrustProfileId,
  ): Promise<TrustProfileBadgeEntity[]> {
    const profile = await this.getProfilePersistenceId(profileId);

    if (profile === null) {
      return [];
    }

    const records = await this.prisma.trustProfileBadge.findMany({
      where: {
        profileId: profile.id,
        active: true,
      },

      orderBy: {
        awardedAt: 'asc',
      },
    });

    return records.map((record) =>
      TrustProfileBadgePrismaMapper.toDomain(record),
    );
  }

  async findProfileBadgeByBadgeId(
    profileId: TrustProfileId,
    badgeId: BadgePublicId,
  ): Promise<TrustProfileBadgeEntity | null> {
    const profile = await this.getProfilePersistenceId(profileId);

    if (profile === null) {
      return null;
    }

    const record = await this.prisma.trustProfileBadge.findFirst({
      where: {
        profileId: profile.id,

        badge: {
          publicId: badgeId.value,
        },
      },
    });

    if (record === null) {
      return null;
    }

    return TrustProfileBadgePrismaMapper.toDomain(record);
  }

  async existsProfileBadgeByBadgeId(
    profileId: TrustProfileId,
    badgeId: BadgePublicId,
  ): Promise<boolean> {
    const profile = await this.getProfilePersistenceId(profileId);

    if (profile === null) {
      return false;
    }

    const count = await this.prisma.trustProfileBadge.count({
      where: {
        profileId: profile.id,

        badge: {
          publicId: badgeId.value,
        },
      },
    });

    return count > 0;
  }

  async existsActiveProfileBadgeByBadgeId(
    profileId: TrustProfileId,
    badgeId: BadgePublicId,
  ): Promise<boolean> {
    const profile = await this.getProfilePersistenceId(profileId);

    if (profile === null) {
      return false;
    }

    const count = await this.prisma.trustProfileBadge.count({
      where: {
        profileId: profile.id,
        active: true,

        badge: {
          publicId: badgeId.value,
        },
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Trust Events
  // ===========================================================================

  async findEventById(
    profileId: TrustProfileId,
    eventId: TrustEventId,
  ): Promise<TrustEventEntity | null> {
    const profile = await this.getProfilePersistenceId(profileId);

    if (profile === null) {
      return null;
    }

    const record = await this.prisma.trustEvent.findFirst({
      where: {
        publicId: eventId.value,
        profileId: profile.id,
      },
    });

    if (record === null) {
      return null;
    }

    return TrustEventPrismaMapper.toDomain(record);
  }

  async findEvents(profileId: TrustProfileId): Promise<TrustEventEntity[]> {
    const profile = await this.getProfilePersistenceId(profileId);

    if (profile === null) {
      return [];
    }

    const records = await this.prisma.trustEvent.findMany({
      where: {
        profileId: profile.id,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => TrustEventPrismaMapper.toDomain(record));
  }

  async findEventsForJourney(
    profileId: TrustProfileId,
    journeyPublicId: JourneyPublicId,
  ): Promise<TrustEventEntity[]> {
    return this.findEventsByReference(profileId, {
      journeyPublicId: journeyPublicId.value,
    });
  }

  async findEventsForBooking(
    profileId: TrustProfileId,
    bookingPublicId: BookingPublicId,
  ): Promise<TrustEventEntity[]> {
    return this.findEventsByReference(profileId, {
      bookingPublicId: bookingPublicId.value,
    });
  }

  async findEventsForRating(
    profileId: TrustProfileId,
    ratingPublicId: RatingPublicId,
  ): Promise<TrustEventEntity[]> {
    return this.findEventsByReference(profileId, {
      ratingPublicId: ratingPublicId.value,
    });
  }

  async findEventsForBadge(
    profileId: TrustProfileId,
    badgePublicId: BadgePublicId,
  ): Promise<TrustEventEntity[]> {
    return this.findEventsByReference(profileId, {
      badgePublicId: badgePublicId.value,
    });
  }

  async findEventsForDispute(
    profileId: TrustProfileId,
    disputePublicId: DisputePublicId,
  ): Promise<TrustEventEntity[]> {
    return this.findEventsByReference(profileId, {
      disputePublicId: disputePublicId.value,
    });
  }

  async existsEvent(
    profileId: TrustProfileId,
    eventId: TrustEventId,
  ): Promise<boolean> {
    const profile = await this.getProfilePersistenceId(profileId);

    if (profile === null) {
      return false;
    }

    const count = await this.prisma.trustEvent.count({
      where: {
        publicId: eventId.value,
        profileId: profile.id,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Internal Mapping
  // ===========================================================================

  private readonly aggregateInclude = {
    ratings: {
      include: {
        review: true,
      },

      orderBy: {
        createdAt: 'asc' as const,
      },
    },

    badges: {
      include: {
        badge: true,
      },

      orderBy: {
        awardedAt: 'asc' as const,
      },
    },

    events: {
      orderBy: {
        createdAt: 'asc' as const,
      },
    },
  } satisfies Prisma.TrustProfileInclude;

  private async findAggregateByPublicId(
    publicId: string,
  ): Promise<TrustProfileAggregate | null> {
    const record = await this.prisma.trustProfile.findUnique({
      where: {
        publicId,
      },

      include: this.aggregateInclude,
    });

    if (record === null) {
      return null;
    }

    return this.toAggregate(record);
  }

  private toAggregate(
    record: TrustProfileWithComponents,
  ): TrustProfileAggregate {
    const profile = TrustProfilePrismaMapper.toDomain(record);

    const ratings = record.ratings.map((rating) =>
      TrustRatingPrismaMapper.toDomain(rating),
    );

    const reviews = record.ratings
      .filter((rating) => rating.review !== null)
      .map((rating) => TrustReviewPrismaMapper.toDomain(rating.review!));

    const profileBadges = record.badges.map((profileBadge) =>
      TrustProfileBadgePrismaMapper.toDomain(profileBadge),
    );

    const badges = record.badges.map((profileBadge) =>
      TrustBadgePrismaMapper.toDomain(profileBadge.badge),
    );

    const events = record.events.map((event) =>
      TrustEventPrismaMapper.toDomain(event),
    );

    return TrustProfileAggregate.rehydrate(
      profile,
      ratings,
      reviews,
      badges,
      profileBadges,
      events,
    );
  }

  private async getProfilePersistenceId(
    profileId: TrustProfileId,
  ): Promise<{ id: string } | null> {
    return this.prisma.trustProfile.findUnique({
      where: {
        publicId: profileId.value,
      },

      select: {
        id: true,
      },
    });
  }

  private async findEventsByReference(
    profileId: TrustProfileId,
    where: Prisma.TrustEventWhereInput,
  ): Promise<TrustEventEntity[]> {
    const profile = await this.getProfilePersistenceId(profileId);

    if (profile === null) {
      return [];
    }

    const records = await this.prisma.trustEvent.findMany({
      where: {
        profileId: profile.id,
        ...where,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => TrustEventPrismaMapper.toDomain(record));
  }
}
