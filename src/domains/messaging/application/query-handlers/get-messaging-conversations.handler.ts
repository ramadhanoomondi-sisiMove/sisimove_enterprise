// -----------------------------------------------------------------------------
// Messaging — Get Messaging Conversations Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving Messaging Conversation aggregates.
//
// Query:
// - GetMessagingConversationsQuery
//
// Repository:
// - MessagingConversationRepository.findAll()
// - MessagingConversationRepository.findByType()
// - MessagingConversationRepository.findByStatus()
//
// Responsibilities:
//
// - load Messaging Conversation aggregates;
// - apply optional persistence-oriented conversation filters;
// - return the aggregate collection to the application/query boundary.
//
// This handler does NOT:
//
// - modify aggregates;
// - persist anything;
// - access Prisma directly;
// - perform authorization;
// - publish domain events;
// - load Identity aggregates;
// - load Journey aggregates;
// - load Booking aggregates;
// - load Asset aggregates;
// - perform conversation business logic.
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

import type GetMessagingConversationsQuery from '../queries/get-messaging-conversations.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { MessagingConversationAggregate } from '../../domain/aggregates/messaging-conversation.aggregate';

import type { MessagingConversationRepository } from '../../domain/repositories/messaging-conversation.repository';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetMessagingConversationsHandler implements QueryHandler<
  GetMessagingConversationsQuery,
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
   * Retrieves Messaging Conversation aggregates.
   *
   * Optional query filters:
   *
   * - type
   * - status
   *
   * When both filters are supplied, the repository provides the base
   * collection and the remaining filter is applied in memory.
   */
  public async execute(
    query: GetMessagingConversationsQuery,
  ): Promise<MessagingConversationAggregate[]> {
    // -------------------------------------------------------------------------
    // No filters
    // -------------------------------------------------------------------------

    if (query.type === undefined && query.status === undefined) {
      return this.messagingConversationRepository.findAll();
    }

    // -------------------------------------------------------------------------
    // Type filter only
    // -------------------------------------------------------------------------

    if (query.type !== undefined && query.status === undefined) {
      return this.messagingConversationRepository.findByType(query.type);
    }

    // -------------------------------------------------------------------------
    // Status filter only
    // -------------------------------------------------------------------------

    if (query.type === undefined && query.status !== undefined) {
      return this.messagingConversationRepository.findByStatus(query.status);
    }

    // -------------------------------------------------------------------------
    // Type + Status filters
    // -------------------------------------------------------------------------

    const conversations = await this.messagingConversationRepository.findByType(
      query.type!,
    );

    return conversations.filter(
      (conversation) => conversation.status === query.status,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetMessagingConversationsHandler;
