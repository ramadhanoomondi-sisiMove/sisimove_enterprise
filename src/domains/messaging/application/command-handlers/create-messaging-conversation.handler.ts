// -----------------------------------------------------------------------------
// Messaging — Create Conversation Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler for creating a Messaging Conversation.
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
// - create the Messaging Conversation entity;
// - create the Messaging Conversation aggregate;
// - record the conversation-created domain event;
// - persist the aggregate.
//
// This handler does NOT:
//
// - access Prisma directly;
// - perform persistence mapping;
// - validate Journey existence;
// - validate Booking existence;
// - authorize the caller;
// - create participants;
// - create messages.
//
// Cross-domain references remain opaque to Messaging.
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

import type { CreateMessagingConversationCommand } from '../commands/create-messaging-conversation.command';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import { MessagingConversationAggregate } from '../../domain/aggregates/messaging-conversation.aggregate';

// -----------------------------------------------------------------------------
// Domain — Entity
// -----------------------------------------------------------------------------

import { MessagingConversationEntity } from '../../domain/entities/messaging-conversation.entity';

// -----------------------------------------------------------------------------
// Domain — Repository
// -----------------------------------------------------------------------------

import type { MessagingConversationRepository } from '../../domain/repositories/messaging-conversation.repository';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class CreateMessagingConversationHandler implements CommandHandler<
  CreateMessagingConversationCommand,
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
    command: CreateMessagingConversationCommand,
  ): Promise<MessagingConversationAggregate> {
    // -------------------------------------------------------------------------
    // Create conversation entity
    // -------------------------------------------------------------------------

    const conversation = MessagingConversationEntity.create(
      command.type,
      command.journeyPublicId,
      command.bookingPublicId,
      command.createdAt,
    );

    // -------------------------------------------------------------------------
    // Create conversation aggregate
    // -------------------------------------------------------------------------

    const aggregate = MessagingConversationAggregate.create(conversation);

    // -------------------------------------------------------------------------
    // Record conversation-created event
    // -------------------------------------------------------------------------

    aggregate.recordCreated(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // Persist aggregate
    // -------------------------------------------------------------------------

    await this.messagingConversationRepository.save(aggregate);

    // -------------------------------------------------------------------------
    // Return aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateMessagingConversationHandler;
