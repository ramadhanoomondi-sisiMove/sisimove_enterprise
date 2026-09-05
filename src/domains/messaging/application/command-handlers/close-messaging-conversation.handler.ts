// -----------------------------------------------------------------------------
// Messaging — Close Conversation Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler for closing a Messaging Conversation.
//
// Responsibilities:
//
// - retrieve the Messaging Conversation aggregate;
// - verify aggregate identity consistency;
// - delegate closure to the aggregate;
// - persist the updated aggregate.
//
// This handler does NOT:
//
// - access Prisma directly;
// - perform persistence mapping;
// - implement closure rules;
// - publish domain events;
// - physically delete the conversation.
//
// Conversation closure is a terminal domain transition owned by the aggregate.
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

import type { CloseMessagingConversationCommand } from '../commands/close-messaging-conversation.command';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { MessagingConversationAggregate } from '../../domain/aggregates/messaging-conversation.aggregate';

// -----------------------------------------------------------------------------
// Domain — Repository
// -----------------------------------------------------------------------------

import type { MessagingConversationRepository } from '../../domain/repositories/messaging-conversation.repository';

// -----------------------------------------------------------------------------
// Domain — Exceptions
// -----------------------------------------------------------------------------

import { MessagingConversationNotFoundException } from '../../domain/exceptions/messaging-conversation-not-found.exception';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class CloseMessagingConversationHandler implements CommandHandler<
  CloseMessagingConversationCommand,
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

  public async execute(
    command: CloseMessagingConversationCommand,
  ): Promise<MessagingConversationAggregate> {
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

    if (!conversation.id.equals(command.conversationId)) {
      throw new MessagingConversationNotFoundException(
        command.conversationPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Close conversation
    // -------------------------------------------------------------------------

    conversation.close(
      command.correlationId,
      command.causationId,
      command.closedAt ?? new Date(),
    );

    // -------------------------------------------------------------------------
    // Persist aggregate
    // -------------------------------------------------------------------------

    await this.messagingConversationRepository.save(conversation);

    // -------------------------------------------------------------------------
    // Return aggregate
    // -------------------------------------------------------------------------

    return conversation;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CloseMessagingConversationHandler;
