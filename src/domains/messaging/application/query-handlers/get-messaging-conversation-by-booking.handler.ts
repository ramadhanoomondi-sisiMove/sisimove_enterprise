// -----------------------------------------------------------------------------
// Messaging — Get Messaging Conversation By Booking Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving Messaging Conversation aggregates
// associated with a Journey Booking.
//
// Query:
// - GetMessagingConversationByBookingQuery
//
// Repository:
// - MessagingConversationRepository.findByBookingPublicId()
//
// Responsibilities:
//
// - load conversations by Booking public identity;
// - return the matching aggregate collection.
//
// This handler does NOT:
//
// - modify aggregates;
// - persist anything;
// - access Prisma directly;
// - perform authorization;
// - publish domain events;
// - load the Booking aggregate;
// - validate Booking state;
// - create conversations;
// - modify participants;
// - load messages independently.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Messaging
// -----------------------------------------------------------------------------

import { MESSAGING_TOKENS } from '../messaging.tokens';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type GetMessagingConversationByBookingQuery from '../queries/get-messaging-conversation-by-booking.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { MessagingConversationAggregate } from '../../domain/aggregates/messaging-conversation.aggregate';

import type { MessagingConversationRepository } from '../../domain/repositories/messaging-conversation.repository';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetMessagingConversationByBookingHandler implements QueryHandler<
  GetMessagingConversationByBookingQuery,
  MessagingConversationAggregate[]
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(MESSAGING_TOKENS.REPOSITORIES.MESSAGING_CONVERSATION)
    private readonly messagingConversationRepository: MessagingConversationRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Retrieves Messaging Conversation aggregates by Booking public identity.
   */
  public async execute(
    query: GetMessagingConversationByBookingQuery,
  ): Promise<MessagingConversationAggregate[]> {
    return this.messagingConversationRepository.findByBookingPublicId(
      query.bookingPublicId,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetMessagingConversationByBookingHandler;
