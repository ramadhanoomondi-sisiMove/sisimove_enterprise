// -----------------------------------------------------------------------------
// Messaging — Get Messaging Conversation Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving one Messaging Conversation
// aggregate by its public identifier.
//
// Query:
// - GetMessagingConversationQuery
//
// Repository:
// - MessagingConversationRepository.findByPublicId()
//
// Responsibilities:
//
// - load the Messaging Conversation aggregate by public identity;
// - fail when the requested aggregate does not exist;
// - return the aggregate to the application/query boundary.
//
// This handler does NOT:
//
// - modify the aggregate;
// - persist anything;
// - access Prisma directly;
// - perform authorization;
// - publish domain events;
// - load Identity aggregates;
// - load Journey aggregates;
// - load Booking aggregates;
// - load Asset aggregates;
// - validate conversation business rules.
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

import type GetMessagingConversationQuery from '../queries/get-messaging-conversation.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { MessagingConversationAggregate } from '../../domain/aggregates/messaging-conversation.aggregate';

import type { MessagingConversationRepository } from '../../domain/repositories/messaging-conversation.repository';

import { MessagingConversationNotFoundException } from '../../domain/exceptions/messaging-conversation-not-found.exception';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetMessagingConversationHandler implements QueryHandler<
  GetMessagingConversationQuery,
  MessagingConversationAggregate
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
   * Retrieves a Messaging Conversation aggregate by public identifier.
   */
  public async execute(
    query: GetMessagingConversationQuery,
  ): Promise<MessagingConversationAggregate> {
    const aggregate = await this.messagingConversationRepository.findByPublicId(
      query.publicId,
    );

    if (aggregate === null) {
      throw new MessagingConversationNotFoundException(query.publicId.value);
    }

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetMessagingConversationHandler;
