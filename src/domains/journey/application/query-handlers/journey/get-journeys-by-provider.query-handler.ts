import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import type { GetJourneysByProviderQuery } from '../../queries/journey/get-journeys-by-provider.query';

import type { JourneyAggregate } from '../../../domain/aggregates/journey.aggregate';
import type { JourneyRepository } from '../../../domain/repositories/journey.repository';
import { JourneyProviderPublicId } from '../../../domain/value-objects/journey-provider-public-id.vo';
import { JOURNEY_TOKENS } from '../../journey.tokens';

import type { JourneyBookingEntity } from '../../../../journey-booking/domain/entities/journey-booking.entity';
import { FindJourneyBookingsByJourneyQuery } from '../../../../journey-booking/application/queries/find-journey-bookings-by-journey.query';
import { JOURNEY_BOOKING_TOKENS } from '../../../../journey-booking/application/journey-booking.tokens';
import { JourneyPublicId as BookingJourneyPublicId } from '../../../../journey-booking/domain/value-objects/journey-public-id.vo';

import type { JourneyBoardingAggregate } from '../../../../journey-boarding/domain/aggregates/journey-boarding.aggregate';
import { GetJourneyBoardingByJourneyQuery } from '../../../../journey-boarding/application/queries/get-journey-boarding-by-journey.query';
import { JOURNEY_BOARDING_TOKENS } from '../../../../journey-boarding/application/journey-boarding.tokens';
import { JourneyBoardingJourneyId } from '../../../../journey-boarding/domain/value-objects/journey-boarding-journey-id.vo';
import { JourneyBoardingNotFoundException } from '../../../../journey-boarding/domain/exceptions';

import type { MessagingConversationAggregate } from '../../../../messaging/domain/aggregates/messaging-conversation.aggregate';
import { MessagingMemberPublicId } from '../../../../messaging/domain/value-objects/messaging-member-public-id.vo';
import { MessagingJourneyPublicId } from '../../../../messaging/domain/value-objects/messaging-journey-public-id.vo';
import GetMessagingConversationByJourneyQuery from '../../../../messaging/application/queries/get-messaging-conversation-by-journey.query';
import { MESSAGING_TOKENS } from '../../../../messaging/application/messaging.tokens';

// -----------------------------------------------------------------------------
// Enriched Provider Journey Result
// -----------------------------------------------------------------------------

export interface GetJourneysByProviderResult {
  readonly journey: JourneyAggregate;
  readonly bookings: readonly JourneyBookingEntity[];
  readonly boarding: JourneyBoardingAggregate | null;
  readonly unreadMessagesCount: number;
}

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

@Injectable()
export class GetJourneysByProviderQueryHandler implements QueryHandler<
  GetJourneysByProviderQuery,
  GetJourneysByProviderResult[]
> {
  public constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly journeyRepository: JourneyRepository,

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

  public async execute(
    query: GetJourneysByProviderQuery,
  ): Promise<GetJourneysByProviderResult[]> {
    const providerPublicId = new JourneyProviderPublicId(
      query.providerPublicId,
    );

    const memberPublicId = MessagingMemberPublicId.create(
      query.providerPublicId,
    );

    const journeys =
      await this.journeyRepository.findByProviderPublicId(providerPublicId);

    return Promise.all(
      journeys.map(async (journey) => {
        const bookingJourneyPublicId = new BookingJourneyPublicId(
          journey.journey.publicId.value,
        );

        const messagingJourneyPublicId = MessagingJourneyPublicId.create(
          journey.journey.publicId.value,
        );

        const boardingJourneyId = JourneyBoardingJourneyId.create(
          journey.aggregateId.toString(),
        );

        const [bookings, boarding, conversations] = await Promise.all([
          this.findJourneyBookingsByJourneyHandler.execute(
            new FindJourneyBookingsByJourneyQuery(bookingJourneyPublicId),
          ),
          this.getBoardingOrNull(boardingJourneyId),
          this.getMessagingConversationByJourneyHandler.execute(
            new GetMessagingConversationByJourneyQuery(
              messagingJourneyPublicId,
            ),
          ),
        ]);

        return {
          journey,
          bookings,
          boarding,
          unreadMessagesCount: this.countUnreadMessages(
            conversations,
            memberPublicId,
          ),
        };
      }),
    );
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

  private async getBoardingOrNull(
    journeyId: JourneyBoardingJourneyId,
  ): Promise<JourneyBoardingAggregate | null> {
    try {
      return await this.getJourneyBoardingByJourneyHandler.execute(
        new GetJourneyBoardingByJourneyQuery(journeyId),
      );
    } catch (error: unknown) {
      if (error instanceof JourneyBoardingNotFoundException) {
        return null;
      }

      throw error;
    }
  }
}
