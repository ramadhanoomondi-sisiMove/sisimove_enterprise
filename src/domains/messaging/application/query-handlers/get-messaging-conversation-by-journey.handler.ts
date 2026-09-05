// -----------------------------------------------------------------------------
// Messaging — Get Messaging Conversation By Journey Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving Messaging Conversation aggregates
// associated with a Journey.
//
// Query:
// - GetMessagingConversationByJourneyQuery
//
// Repository:
// - MessagingConversationRepository.findByJourneyPublicId()
//
// Responsibilities:
//
// - load conversations by Journey public identity;
// - return the matching aggregate collection.
//
// This handler does NOT:
//
// - modify aggregates;
// - persist anything;
// - access Prisma directly;
// - perform authorization;
// - publish domain events;
// - load the Journey aggregate;
// - validate Journey state;
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

import type GetMessagingConversationByJourneyQuery from '../queries/get-messaging-conversation-by-journey.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { MessagingConversationAggregate } from '../../domain/aggregates/messaging-conversation.aggregate';

import type { MessagingConversationRepository } from '../../domain/repositories/messaging-conversation.repository';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetMessagingConversationByJourneyHandler implements QueryHandler<
  GetMessagingConversationByJourneyQuery,
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
   * Retrieves Messaging Conversation aggregates by Journey public identity.
   */
  public async execute(
    query: GetMessagingConversationByJourneyQuery,
  ): Promise<MessagingConversationAggregate[]> {
    return this.messagingConversationRepository.findByJourneyPublicId(
      query.journeyPublicId,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetMessagingConversationByJourneyHandler;
