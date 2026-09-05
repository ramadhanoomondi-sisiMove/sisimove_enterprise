// -----------------------------------------------------------------------------
// Messaging — Get Messaging Messages Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving Messaging Message aggregates.
//
// Query:
// - GetMessagingMessagesQuery
//
// Repository:
// - MessagingMessageRepository.findAll()
// - MessagingMessageRepository.findByConversationPublicId()
// - MessagingMessageRepository.findBySenderPublicId()
// - MessagingMessageRepository.findByStatus()
// - MessagingMessageRepository.findByType()
// - MessagingMessageRepository.findByAssetPublicId()
//
// Responsibilities:
//
// - load Messaging Message aggregates;
// - apply optional persistence-oriented message filters;
// - return the aggregate collection to the application/query boundary.
//
// This handler does NOT:
//
// - modify aggregates;
// - persist anything;
// - access Prisma directly;
// - perform authorization;
// - publish domain events;
// - load Messaging Conversation aggregates;
// - load Identity aggregates;
// - load Asset aggregates;
// - perform message lifecycle operations.
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

import type GetMessagingMessagesQuery from '../queries/get-messaging-messages.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { MessagingMessageAggregate } from '../../domain/aggregates/messaging-message.aggregate';

import type { MessagingMessageRepository } from '../../domain/repositories/messaging-message.repository';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetMessagingMessagesHandler implements QueryHandler<
  GetMessagingMessagesQuery,
  MessagingMessageAggregate[]
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(MESSAGING_TOKENS.REPOSITORIES.MESSAGING_MESSAGE)
    private readonly messagingMessageRepository: MessagingMessageRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Retrieves Messaging Message aggregates.
   *
   * Optional query filters:
   *
   * - conversationPublicId
   * - senderPublicId
   * - status
   * - type
   * - assetPublicId
   *
   * The repository is used for the primary filter.
   *
   * Any additional filters are applied to the resulting aggregate collection.
   */
  public async execute(
    query: GetMessagingMessagesQuery,
  ): Promise<MessagingMessageAggregate[]> {
    // -------------------------------------------------------------------------
    // No filters
    // -------------------------------------------------------------------------

    if (
      query.conversationPublicId === undefined &&
      query.senderPublicId === undefined &&
      query.status === undefined &&
      query.type === undefined &&
      query.assetPublicId === undefined
    ) {
      return this.messagingMessageRepository.findAll();
    }

    // -------------------------------------------------------------------------
    // Primary repository query
    // -------------------------------------------------------------------------

    let messages: MessagingMessageAggregate[];

    if (query.conversationPublicId !== undefined) {
      messages =
        await this.messagingMessageRepository.findByConversationPublicId(
          query.conversationPublicId,
        );
    } else if (query.senderPublicId !== undefined) {
      messages = await this.messagingMessageRepository.findBySenderPublicId(
        query.senderPublicId,
      );
    } else if (query.status !== undefined) {
      messages = await this.messagingMessageRepository.findByStatus(
        query.status,
      );
    } else if (query.type !== undefined) {
      messages = await this.messagingMessageRepository.findByType(query.type);
    } else {
      messages = await this.messagingMessageRepository.findByAssetPublicId(
        query.assetPublicId!,
      );
    }

    // -------------------------------------------------------------------------
    // Additional filters
    // -------------------------------------------------------------------------

    return messages.filter((message) => {
      if (
        query.conversationPublicId !== undefined &&
        !message.conversationPublicId.equals(query.conversationPublicId)
      ) {
        return false;
      }

      if (
        query.senderPublicId !== undefined &&
        !message.senderPublicId.equals(query.senderPublicId)
      ) {
        return false;
      }

      if (query.status !== undefined && !message.status.equals(query.status)) {
        return false;
      }

      if (query.type !== undefined && !message.type.equals(query.type)) {
        return false;
      }

      if (query.assetPublicId !== undefined) {
        if (
          message.assetPublicId === undefined ||
          !message.assetPublicId.equals(query.assetPublicId)
        ) {
          return false;
        }
      }

      return true;
    });
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetMessagingMessagesHandler;
