// -----------------------------------------------------------------------------
// Journey Booking — Get Detail Query Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import type { GetJourneyBookingDetailQuery } from '../queries/get-journey-booking-detail.query';
import { FindJourneyBookingsByJourneyQuery } from '../queries/find-journey-bookings-by-journey.query';

import type { JourneyBookingAggregate } from '../../domain/aggregates/journey-booking.aggregate';
import type { JourneyBookingRepository } from '../../domain/repositories/journey-booking.repository';
import type { JourneyBookingEntity } from '../../domain/entities/journey-booking.entity';

import type {
  JourneyBookingActivitySummary,
  JourneyBookingDetail,
  JourneyBookingDetailCancellation,
  JourneyBookingDetailJourney,
  JourneyBookingDetailPayment,
  JourneyBookingDetailPricing,
  JourneyBookingDetailProvider,
  JourneyBookingDetailResponse,
  JourneyBookingDetailSnapshot,
} from '../responses/journey-booking-detail.response';

import {
  JourneyBookingInvalidPassengerException,
  JourneyBookingNotFoundException,
} from '../../domain/exceptions';

import { JOURNEY_BOOKING_TOKENS } from '../journey-booking.tokens';

import { GetJourneyQuery } from '../../../journey/application/queries/journey';
import { GetJourneyQueryHandler } from '../../../journey/application/query-handlers/journey';

import { GetPublicTravellerByMemberQuery } from '../../../social/application/queries/get-public-traveller-by-member.query';

import {
  GetPublicTravellerByMemberQueryHandler,
  type PublicTravellerProfileResponse,
} from '../../../social/application/query-handlers/get-public-traveller-by-member.query-handler';

import { TRAVELLER_PROFILE_TOKENS } from '../../../social/application/traveller-profile.tokens';

import { GetPublicTrustProfileByMemberQuery } from '../../../trust/application/queries/trust-profile/get-public-trust-profile-by-member.query';

import {
  GetPublicTrustProfileByMemberQueryHandler,
  type PublicTrustProfile,
} from '../../../trust/application/query-handlers/trust-profile/get-public-trust-profile-by-member.query-handler';

import { TRUST_PROFILE_TOKENS } from '../../../trust/application/trust-profile.tokens';

import { MemberPublicId } from '../../../social/domain/value-objects/member-public-id.vo';

import {
  JourneyPublicId as BookingJourneyPublicId,
  JourneyPublicId,
} from '../../domain/value-objects/journey-public-id.vo';

// -----------------------------------------------------------------------------
// Journey Boarding
// -----------------------------------------------------------------------------

import type { JourneyBoardingAggregate } from '../../../journey-boarding/domain/aggregates/journey-boarding.aggregate';

import { GetJourneyBoardingByJourneyQuery } from '../../../journey-boarding/application/queries/get-journey-boarding-by-journey.query';

import { JOURNEY_BOARDING_TOKENS } from '../../../journey-boarding/application/journey-boarding.tokens';

import { JourneyBoardingNotFoundException } from '../../../journey-boarding/domain/exceptions';

// -----------------------------------------------------------------------------
// Messaging
// -----------------------------------------------------------------------------

import { MessagingMemberPublicId } from '../../../messaging/domain/value-objects/messaging-member-public-id.vo';
import { MessagingJourneyPublicId } from '../../../messaging/domain/value-objects/messaging-journey-public-id.vo';

import GetMessagingConversationByJourneyQuery from '../../../messaging/application/queries/get-messaging-conversation-by-journey.query';

import type { MessagingConversationAggregate } from '../../../messaging/domain/aggregates/messaging-conversation.aggregate';

import { MESSAGING_TOKENS } from '../../../messaging/application/messaging.tokens';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetJourneyBookingDetailQueryHandler implements QueryHandler<
  GetJourneyBookingDetailQuery,
  JourneyBookingDetailResponse
> {
  constructor(
    @Inject(JOURNEY_BOOKING_TOKENS.REPOSITORY)
    private readonly repository: JourneyBookingRepository,

    private readonly getJourneyQueryHandler: GetJourneyQueryHandler,

    @Inject(
      TRAVELLER_PROFILE_TOKENS.QUERY_HANDLERS.GET_PUBLIC_BY_MEMBER_PUBLIC_ID,
    )
    private readonly getPublicTravellerByMemberQueryHandler: GetPublicTravellerByMemberQueryHandler,

    @Inject(TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET_PUBLIC_BY_MEMBER_PUBLIC_ID)
    private readonly getPublicTrustProfileByMemberQueryHandler: GetPublicTrustProfileByMemberQueryHandler,

    @Inject(JOURNEY_BOOKING_TOKENS.QUERY_HANDLERS.FIND_BY_JOURNEY)
    private readonly findJourneyBookingsByJourneyHandler: QueryHandler<
      FindJourneyBookingsByJourneyQuery,
      JourneyBookingEntity[]
    >,

    @Inject(JOURNEY_BOARDING_TOKENS.QUERY_HANDLERS.GET_BY_JOURNEY)
    private readonly getJourneyBoardingByJourneyHandler: QueryHandler<
      GetJourneyBoardingByJourneyQuery,
      JourneyBoardingAggregate
    >,

    @Inject(
      MESSAGING_TOKENS.QUERY_HANDLERS.GET_MESSAGING_CONVERSATION_BY_JOURNEY,
    )
    private readonly getMessagingConversationByJourneyHandler: QueryHandler<
      GetMessagingConversationByJourneyQuery,
      MessagingConversationAggregate[]
    >,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetJourneyBookingDetailQuery,
  ): Promise<JourneyBookingDetailResponse> {
    // -------------------------------------------------------------------------
    // Phase 1 — Load booking
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      query.journeyBookingPublicId,
    );

    if (aggregate === null) {
      throw new JourneyBookingNotFoundException(
        query.journeyBookingPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Phase 2 — Verify passenger ownership
    // -------------------------------------------------------------------------

    if (!aggregate.belongsToPassenger(query.passengerPublicId)) {
      throw new JourneyBookingInvalidPassengerException(
        query.passengerPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Phase 3 — Resolve journey
    // -------------------------------------------------------------------------

    const journey = await this.getJourneyQueryHandler.execute(
      new GetJourneyQuery(aggregate.journeyPublicId),
    );

    // -------------------------------------------------------------------------
    // Phase 4 — Resolve provider profiles
    // -------------------------------------------------------------------------

    const providerPublicId = journey.providerPublicId.value;
    const memberPublicId = new MemberPublicId(providerPublicId);

    const [traveller, trust] = await Promise.all([
      this.getPublicTravellerByMemberQueryHandler.execute(
        new GetPublicTravellerByMemberQuery(memberPublicId),
      ),

      this.getPublicTrustProfileByMemberQueryHandler.execute(
        new GetPublicTrustProfileByMemberQuery(providerPublicId),
      ),
    ]);

    // -------------------------------------------------------------------------
    // Phase 5 — Resolve journey activity
    // -------------------------------------------------------------------------

    const activitySummary = await this.getActivitySummary(
      aggregate,
      journey,
      query.passengerPublicId.value,
    );

    // -------------------------------------------------------------------------
    // Compose response
    // -------------------------------------------------------------------------

    return {
      booking: this.toBookingDetail(aggregate, journey, traveller, trust),
      activitySummary,
    };
  }

  // ===========================================================================
  // Activity Summary
  // ===========================================================================

  private async getActivitySummary(
    aggregate: JourneyBookingAggregate,
    journey: Awaited<ReturnType<GetJourneyQueryHandler['execute']>>,
    passengerPublicId: string,
  ): Promise<JourneyBookingActivitySummary | null> {
    const booking = aggregate.journeyBooking;

    // Only provide live activity information for confirmed bookings.
    // Terminal journey outcomes remain distinct and retain their booking detail.
    const terminalJourneyStatuses = new Set([
      'COMPLETED',
      'CANCELLED',
      'EXPIRED',
    ]);

    if (
      booking.status.value !== 'CONFIRMED' ||
      terminalJourneyStatuses.has(journey.status.value)
    ) {
      return null;
    }

    const bookingJourneyPublicId = new BookingJourneyPublicId(
      booking.journeyPublicId.value,
    );

    const messagingJourneyPublicId = MessagingJourneyPublicId.create(
      booking.journeyPublicId.value,
    );

    const boardingJourneyPublicId = new JourneyPublicId(
      booking.journeyPublicId.value,
    );

    const memberPublicId = MessagingMemberPublicId.create(passengerPublicId);

    const [bookings, boarding, conversations] = await Promise.all([
      this.findJourneyBookingsByJourneyHandler.execute(
        new FindJourneyBookingsByJourneyQuery(bookingJourneyPublicId),
      ),

      this.getBoardingOrNull(boardingJourneyPublicId),

      this.getMessagingConversationByJourneyHandler.execute(
        new GetMessagingConversationByJourneyQuery(messagingJourneyPublicId),
      ),
    ]);

    return {
      associatedBookingsCount: bookings.length,
      participantsCount: boarding?.participantCount ?? 0,
      messagesCount: this.countVisibleMessages(conversations),
      unreadMessagesCount: this.countUnreadMessages(
        conversations,
        memberPublicId,
      ),
    };
  }

  // ===========================================================================
  // Boarding
  // ===========================================================================

  private async getBoardingOrNull(
    journeyPublicId: JourneyPublicId,
  ): Promise<JourneyBoardingAggregate | null> {
    try {
      return await this.getJourneyBoardingByJourneyHandler.execute(
        new GetJourneyBoardingByJourneyQuery(journeyPublicId),
      );
    } catch (error: unknown) {
      if (error instanceof JourneyBoardingNotFoundException) {
        return null;
      }

      throw error;
    }
  }

  // ===========================================================================
  // Messages
  // ===========================================================================

  private countVisibleMessages(
    conversations: readonly MessagingConversationAggregate[],
  ): number {
    let count = 0;

    for (const conversation of conversations) {
      for (const message of conversation.messages) {
        if (message.isDeleted() || message.isModerated()) {
          continue;
        }

        count += 1;
      }
    }

    return count;
  }

  private countUnreadMessages(
    conversations: readonly MessagingConversationAggregate[],
    memberPublicId: MessagingMemberPublicId,
  ): number {
    let unreadCount = 0;

    for (const conversation of conversations) {
      const participant =
        conversation.findParticipantByMemberPublicId(memberPublicId);

      if (!participant || !participant.canReadMessages()) {
        continue;
      }

      const lastReadAt = participant.lastReadAt;

      for (const message of conversation.messages) {
        // Messages sent by the current passenger are not unread for them.
        if (message.senderPublicId.value === memberPublicId.value) {
          continue;
        }

        if (message.isDeleted() || message.isModerated()) {
          continue;
        }

        if (!lastReadAt || message.sentAt.getTime() > lastReadAt.getTime()) {
          unreadCount += 1;
        }
      }
    }

    return unreadCount;
  }

  // ===========================================================================
  // Booking Detail Mapping
  // ===========================================================================

  private toBookingDetail(
    aggregate: JourneyBookingAggregate,
    journey: Awaited<ReturnType<GetJourneyQueryHandler['execute']>>,
    traveller: PublicTravellerProfileResponse,
    trust: PublicTrustProfile,
  ): JourneyBookingDetail {
    const booking = aggregate.journeyBooking;

    return {
      publicId: booking.publicId.value,
      journeyPublicId: booking.journeyPublicId.value,
      passengerPublicId: booking.passengerPublicId.value,

      status: booking.status.value,
      seats: booking.seats.value,

      confirmedAt: booking.confirmedAt ?? null,
      cancelledAt: booking.cancelledAt ?? null,
      completedAt: booking.completedAt ?? null,
      expiredAt: booking.expiredAt ?? null,

      journey: this.toJourneyDetail(journey, traveller, trust),

      snapshot: this.toSnapshot(booking.snapshot),
      pricing: this.toPricing(booking.pricing),
      payment: this.toPayment(booking.payment),
      cancellation: this.toCancellation(booking.cancellation),

      version: booking.version,

      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };
  }

  // ===========================================================================
  // Journey Detail Mapping
  // ===========================================================================

  private toJourneyDetail(
    journey: Awaited<ReturnType<GetJourneyQueryHandler['execute']>>,
    traveller: PublicTravellerProfileResponse,
    trust: PublicTrustProfile,
  ): JourneyBookingDetailJourney {
    return {
      publicId: journey.publicId.value,
      providerPublicId: journey.providerPublicId.value,

      status: journey.status.value,

      publishedAt: journey.publishedAt ?? null,
      startedAt: journey.startedAt ?? null,
      completionRequestedAt: journey.completionRequestedAt ?? null,
      completedAt: journey.completedAt ?? null,
      cancelledAt: journey.cancelledAt ?? null,
      expiredAt: journey.expiredAt ?? null,

      version: journey.version,

      provider: this.toProviderDetail(traveller, trust),
    };
  }

  // ===========================================================================
  // Provider Detail Mapping
  // ===========================================================================

  private toProviderDetail(
    traveller: PublicTravellerProfileResponse,
    trust: PublicTrustProfile,
  ): JourneyBookingDetailProvider {
    return {
      traveller: {
        publicId: traveller.publicId,
        handle: traveller.handle,
        bio: traveller.bio,
        avatar: traveller.avatar,
        countryCode: traveller.countryCode,
      },

      trust: {
        verificationLevel: trust.verificationLevel,
        ratingAverage: trust.ratingAverage,
        ratingCount: trust.ratingCount,
        completedJourneys: trust.completedJourneys,

        badges: trust.badges.map((badge) => ({
          publicId: badge.publicId,
          type: badge.type,
          name: badge.name,
          description: badge.description,

          asset:
            badge.asset === null
              ? null
              : {
                  publicId: badge.asset.publicId,
                  url: badge.asset.url,
                  alt: badge.asset.alt,
                },
        })),
      },
    };
  }

  // ===========================================================================
  // Snapshot Mapping
  // ===========================================================================

  private toSnapshot(
    snapshot: JourneyBookingAggregate['snapshot'],
  ): JourneyBookingDetailSnapshot | null {
    if (snapshot === undefined) {
      return null;
    }

    return {
      publicId: snapshot.publicId.value,

      originName: snapshot.originName.value,
      destinationName: snapshot.destinationName.value,

      originCoordinates: {
        latitude: snapshot.originCoordinates.latitude,
        longitude: snapshot.originCoordinates.longitude,
      },

      destinationCoordinates: {
        latitude: snapshot.destinationCoordinates.latitude,
        longitude: snapshot.destinationCoordinates.longitude,
      },

      departureAt: snapshot.departureAt.value,
      arrivalAt: snapshot.arrivalAt?.value ?? null,
      timezone: snapshot.timezone.value,

      vehicleMake: snapshot.vehicleMake ?? null,
      vehicleModel: snapshot.vehicleModel ?? null,
      vehicleYear: snapshot.vehicleYear ?? null,
      vehicleColor: snapshot.vehicleColor ?? null,
      vehicleRegistration: snapshot.vehicleRegistration ?? null,

      createdAt: snapshot.createdAt,
      updatedAt: snapshot.updatedAt,
    };
  }

  // ===========================================================================
  // Pricing Mapping
  // ===========================================================================

  private toPricing(
    pricing: JourneyBookingAggregate['pricing'],
  ): JourneyBookingDetailPricing | null {
    if (pricing === undefined) {
      return null;
    }

    return {
      publicId: pricing.publicId.value,

      pricePerSeat: pricing.pricePerSeat.value,
      seats: pricing.seats.value,
      subtotal: pricing.subtotal.value,
      discountAmount: pricing.discountAmount.value,
      adjustmentAmount: pricing.adjustmentAmount.value,
      totalAmount: pricing.totalAmount.value,
      currency: pricing.currency.value,

      createdAt: pricing.createdAt,
      updatedAt: pricing.updatedAt,
    };
  }

  // ===========================================================================
  // Payment Mapping
  // ===========================================================================

  private toPayment(
    payment: JourneyBookingAggregate['payment'],
  ): JourneyBookingDetailPayment | null {
    if (payment === undefined) {
      return null;
    }

    return {
      publicId: payment.publicId.value,

      status: payment.status.value,
      amount: payment.amount.value,
      currency: payment.currency.value,

      transactionPublicId: payment.transactionPublicId?.value ?? null,

      authorizedAt: payment.authorizedAt ?? null,
      capturedAt: payment.capturedAt ?? null,
      failedAt: payment.failedAt ?? null,
      refundedAt: payment.refundedAt ?? null,

      failureReason: payment.failureReason?.value ?? null,

      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }

  // ===========================================================================
  // Cancellation Mapping
  // ===========================================================================

  private toCancellation(
    cancellation: JourneyBookingAggregate['cancellation'],
  ): JourneyBookingDetailCancellation | null {
    if (cancellation === undefined) {
      return null;
    }

    return {
      publicId: cancellation.publicId.value,

      reason: cancellation.reason.value,
      cancelledByPublicId: cancellation.cancelledByPublicId?.value ?? null,
      reasonDescription: cancellation.reasonDescription?.value ?? null,
      cancelledAt: cancellation.cancelledAt,

      createdAt: cancellation.createdAt,
      updatedAt: cancellation.updatedAt,
    };
  }
}
