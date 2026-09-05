// -----------------------------------------------------------------------------
// Messaging — Add Participant Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler for adding a participant to a Messaging
// Conversation.
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
// - create the participant entity;
// - delegate membership validation to the conversation aggregate;
// - persist the updated conversation aggregate.
//
// This handler does NOT:
//
// - load Identity aggregates;
// - validate Identity state;
// - access Prisma;
// - authorize the caller;
// - implement participant membership rules.
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

import type { AddMessagingParticipantCommand } from '../commands/add-messaging-participant.command';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { MessagingConversationAggregate } from '../../domain/aggregates/messaging-conversation.aggregate';

// -----------------------------------------------------------------------------
// Domain — Entity
// -----------------------------------------------------------------------------

import { MessagingConversationParticipantEntity } from '../../domain/entities/messaging-conversation-participant.entity';

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
export class AddMessagingParticipantHandler implements CommandHandler<
  AddMessagingParticipantCommand,
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
    command: AddMessagingParticipantCommand,
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
    // Create participant entity
    // -------------------------------------------------------------------------

    const participant = MessagingConversationParticipantEntity.create(
      command.conversationId,
      command.memberPublicId,
      command.role,
      command.joinedAt,
    );

    // -------------------------------------------------------------------------
    // Delegate participant membership validation
    // -------------------------------------------------------------------------

    conversation.addParticipant(
      participant,
      command.correlationId,
      command.causationId,
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

export default AddMessagingParticipantHandler;
