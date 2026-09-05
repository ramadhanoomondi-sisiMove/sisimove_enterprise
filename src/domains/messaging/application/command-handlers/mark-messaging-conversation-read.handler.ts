// -----------------------------------------------------------------------------
// Messaging — Mark Conversation Read Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler for recording participant read state within a
// Messaging Conversation.
//
// Aggregate:
//
// MessagingConversationAggregate
// ├── MessagingConversationEntity
// ├── MessagingConversationParticipantEntity[]
// └── MessagingMessageEntity[]
//
// Responsibilities:
//
// - retrieve the owning conversation aggregate;
// - verify conversation identity consistency;
// - retrieve the participant from the aggregate;
// - verify participant identity consistency;
// - delegate read-state mutation to the participant entity;
// - persist the updated conversation aggregate.
//
// This handler does NOT:
//
// - access Prisma directly;
// - mutate persistence models;
// - implement participant read-state invariants;
// - authorize the caller;
// - publish domain events.
//
// The participant entity owns:
//
// - ACTIVE-state validation;
// - read timestamp validation;
// - monotonic read-state progression.
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

import type { MarkMessagingConversationReadCommand } from '../commands/mark-messaging-conversation-read.command';

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

import { MessagingException } from '../../domain/exceptions/messaging.exception';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class MarkMessagingConversationReadHandler implements CommandHandler<
  MarkMessagingConversationReadCommand,
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
    command: MarkMessagingConversationReadCommand,
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
    // Load participant from aggregate
    // -------------------------------------------------------------------------

    const participant = conversation.getParticipant(command.participantId);

    if (participant === undefined) {
      throw new MessagingException(
        'Messaging conversation participant does not belong to this conversation.',
      );
    }

    // -------------------------------------------------------------------------
    // Verify participant public identity consistency
    // -------------------------------------------------------------------------

    if (!participant.publicId.equals(command.participantPublicId)) {
      throw new MessagingException(
        'Messaging conversation participant identity does not match the supplied public identity.',
      );
    }

    // -------------------------------------------------------------------------
    // Mark conversation as read
    // -------------------------------------------------------------------------
    //
    // Read state is participant-local state. The participant entity owns the
    // ACTIVE-state, timestamp, and monotonic progression invariants.
    //
    // The participant remains inside the loaded conversation aggregate, so the
    // updated aggregate is persisted as one consistency boundary.
    //
    // -------------------------------------------------------------------------

    participant.markAsRead(command.readAt);

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

export default MarkMessagingConversationReadHandler;
