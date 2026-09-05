// -----------------------------------------------------------------------------
// Messaging — Leave Conversation Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler for a participant voluntarily leaving a
// Messaging Conversation.
//
// Responsibilities:
//
// - retrieve the owning conversation aggregate;
// - verify conversation identity consistency;
// - verify participant identity consistency;
// - delegate participant lifecycle mutation to the aggregate;
// - persist the updated aggregate.
//
// This handler does NOT:
//
// - access Prisma directly;
// - mutate persistence models;
// - implement participant lifecycle rules;
// - authorize the caller;
// - publish domain events.
//
// The participant entity owns its ACTIVE -> LEFT transition.
// The conversation aggregate owns participant membership within the
// conversation boundary.
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

import type { LeaveMessagingConversationCommand } from '../commands/leave-messaging-conversation.command';

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
export class LeaveMessagingConversationHandler implements CommandHandler<
  LeaveMessagingConversationCommand,
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
    command: LeaveMessagingConversationCommand,
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
    // Leave conversation
    // -------------------------------------------------------------------------

    conversation.leaveParticipant(
      command.participantId,
      command.correlationId,
      command.causationId,
      command.leftAt ?? new Date(),
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

export default LeaveMessagingConversationHandler;
