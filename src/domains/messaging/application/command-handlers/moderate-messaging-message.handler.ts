// -----------------------------------------------------------------------------
// Messaging — Moderate Message Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler for moderating a Messaging Message.
//
// The handler records the requested lifecycle transition. The actual decision
// to moderate belongs to the appropriate application or moderation workflow.
//
// Responsibilities:
//
// - retrieve the Messaging Message aggregate;
// - verify the supplied conversation identity;
// - delegate moderation to MessagingMessageAggregate;
// - persist the updated aggregate.
//
// This handler does NOT:
//
// - access Prisma directly;
// - perform external moderation;
// - determine moderation policy;
// - modify MessagingMessageEntity directly;
// - load Identity aggregates;
// - load Asset aggregates;
// - publish domain events directly.
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

import type { ModerateMessagingMessageCommand } from '../commands/moderate-messaging-message.command';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { MessagingMessageAggregate } from '../../domain/aggregates/messaging-message.aggregate';

// -----------------------------------------------------------------------------
// Domain — Repository
// -----------------------------------------------------------------------------

import type { MessagingMessageRepository } from '../../domain/repositories/messaging-message.repository';

// -----------------------------------------------------------------------------
// Domain — Exceptions
// -----------------------------------------------------------------------------

import { MessagingMessageNotFoundException } from '../../domain/exceptions/messaging-message-not-found.exception';

import { MessagingException } from '../../domain/exceptions/messaging.exception';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class ModerateMessagingMessageHandler implements CommandHandler<
  ModerateMessagingMessageCommand,
  MessagingMessageAggregate
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

  public async execute(
    command: ModerateMessagingMessageCommand,
  ): Promise<MessagingMessageAggregate> {
    // -------------------------------------------------------------------------
    // Load message aggregate
    // -------------------------------------------------------------------------

    const message = await this.messagingMessageRepository.findByPublicId(
      command.messagePublicId,
    );

    if (message === null) {
      throw new MessagingMessageNotFoundException(
        command.messagePublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Verify message internal identity
    // -------------------------------------------------------------------------

    if (!message.id.equals(command.messageId)) {
      throw new MessagingMessageNotFoundException(
        command.messagePublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Verify conversation identity
    // -------------------------------------------------------------------------

    if (!message.conversationId.equals(command.conversationId)) {
      throw new MessagingException(
        'Messaging message does not belong to the supplied conversation.',
      );
    }

    if (
      !message.belongsToConversationPublicId(command.conversationPublicId.value)
    ) {
      throw new MessagingException(
        'Messaging message does not belong to the supplied conversation.',
      );
    }

    // -------------------------------------------------------------------------
    // Moderate message
    // -------------------------------------------------------------------------

    message.moderate(
      command.correlationId,
      command.causationId,
      command.moderatedAt ?? new Date(),
    );

    // -------------------------------------------------------------------------
    // Persist aggregate
    // -------------------------------------------------------------------------

    await this.messagingMessageRepository.save(message);

    // -------------------------------------------------------------------------
    // Return aggregate
    // -------------------------------------------------------------------------

    return message;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ModerateMessagingMessageHandler;
