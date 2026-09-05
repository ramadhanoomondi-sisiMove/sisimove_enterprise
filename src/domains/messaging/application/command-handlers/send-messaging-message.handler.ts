// -----------------------------------------------------------------------------
// Messaging — Send Message Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler for sending a Messaging Message.
//
// Aggregate workflow:
//
// MessagingConversationAggregate
// ├── MessagingConversationEntity
// ├── MessagingConversationParticipantEntity[]
// └── MessagingMessageEntity
//
// MessagingMessageAggregate
// └── MessagingMessageEntity
//
// Responsibilities:
//
// - retrieve the owning Messaging Conversation aggregate;
// - create the Messaging Message entity;
// - create the Messaging Message aggregate;
// - delegate conversation membership and lifecycle validation to the
//   MessagingConversationAggregate;
// - persist the Messaging Message aggregate;
// - persist the updated Messaging Conversation aggregate.
//
// This handler does NOT:
//
// - access Prisma directly;
// - perform persistence mapping;
// - validate Identity state;
// - validate Asset state;
// - perform external moderation;
// - contain message lifecycle rules;
// - contain conversation membership rules.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Messaging
// -----------------------------------------------------------------------------

import { MESSAGING_TOKENS } from '../messaging.tokens';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { SendMessagingMessageCommand } from '../commands/send-messaging-message.command';

// -----------------------------------------------------------------------------
// Domain — Aggregates
// -----------------------------------------------------------------------------

import { MessagingMessageAggregate } from '../../domain/aggregates/messaging-message.aggregate';

// -----------------------------------------------------------------------------
// Domain — Entity
// -----------------------------------------------------------------------------

import { MessagingMessageEntity } from '../../domain/entities/messaging-message.entity';

// -----------------------------------------------------------------------------
// Domain — Repositories
// -----------------------------------------------------------------------------

import type { MessagingConversationRepository } from '../../domain/repositories/messaging-conversation.repository';

import type { MessagingMessageRepository } from '../../domain/repositories/messaging-message.repository';

// -----------------------------------------------------------------------------
// Domain — Exceptions
// -----------------------------------------------------------------------------

import { MessagingConversationNotFoundException } from '../../domain/exceptions/messaging-conversation-not-found.exception';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class SendMessagingMessageHandler implements CommandHandler<
  SendMessagingMessageCommand,
  MessagingMessageAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(MESSAGING_TOKENS.REPOSITORIES.MESSAGING_CONVERSATION)
    private readonly messagingConversationRepository: MessagingConversationRepository,

    @Inject(MESSAGING_TOKENS.REPOSITORIES.MESSAGING_MESSAGE)
    private readonly messagingMessageRepository: MessagingMessageRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: SendMessagingMessageCommand,
  ): Promise<MessagingMessageAggregate> {
    // -------------------------------------------------------------------------
    // Load conversation aggregate
    // -------------------------------------------------------------------------

    const conversation =
      await this.messagingConversationRepository.findByPublicId(
        command.conversationPublicId,
      );

    if (conversation === null) {
      throw new MessagingConversationNotFoundException(
        command.conversationPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Verify conversation identity consistency
    // -------------------------------------------------------------------------
    //
    // The public identity and internal identity supplied by the command must
    // identify the same Messaging Conversation aggregate.
    //
    // -------------------------------------------------------------------------

    if (!conversation.id.equals(command.conversationId)) {
      throw new MessagingConversationNotFoundException(
        command.conversationPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Create message entity
    // -------------------------------------------------------------------------
    //
    // The message entity is created with the conversation identities supplied
    // by the command. Conversation membership and lifecycle validation remain
    // owned by the MessagingConversationAggregate.
    //
    // -------------------------------------------------------------------------

    const message = MessagingMessageEntity.create(
      command.conversationId,
      command.conversationPublicId,
      command.senderPublicId,
      command.type,
      command.content,
      command.assetPublicId,
      command.sentAt,
    );

    // -------------------------------------------------------------------------
    // Create message aggregate
    // -------------------------------------------------------------------------

    const messageAggregate = MessagingMessageAggregate.create(message);

    // -------------------------------------------------------------------------
    // Delegate conversation validation
    // -------------------------------------------------------------------------
    //
    // MessagingConversationAggregate.sendMessage() accepts the message entity.
    //
    // The conversation aggregate owns:
    //
    // - conversation lifecycle validation;
    // - participant existence;
    // - participant active state;
    // - sender membership;
    // - message ownership;
    // - duplicate message protection;
    // - temporal consistency;
    // - conversation message activity.
    //
    // The MessagingMessageAggregate remains responsible for the message's
    // own lifecycle and domain state.
    //
    // -------------------------------------------------------------------------

    conversation.sendMessage(
      message,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // Persist message aggregate
    // -------------------------------------------------------------------------

    await this.messagingMessageRepository.save(messageAggregate);

    // -------------------------------------------------------------------------
    // Persist updated conversation aggregate
    // -------------------------------------------------------------------------

    await this.messagingConversationRepository.save(conversation);

    // -------------------------------------------------------------------------
    // Return message aggregate
    // -------------------------------------------------------------------------

    return messageAggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default SendMessagingMessageHandler;
