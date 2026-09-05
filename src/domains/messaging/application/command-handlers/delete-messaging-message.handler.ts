// -----------------------------------------------------------------------------
// Messaging — Delete Message Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler for deleting a Messaging Message.
//
// Deletion is a domain lifecycle transition. It does not physically remove
// the Messaging Message from persistence.
//
// Responsibilities:
//
// - retrieve the Messaging Message aggregate;
// - verify the supplied conversation identity;
// - verify that the requesting member is the message sender;
// - delegate deletion to MessagingMessageAggregate;
// - persist the updated aggregate.
//
// This handler does NOT:
//
// - access Prisma directly;
// - physically delete the message;
// - modify MessagingMessageEntity directly;
// - implement deletion lifecycle rules;
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

import type { DeleteMessagingMessageCommand } from '../commands/delete-messaging-message.command';

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
export class DeleteMessagingMessageHandler implements CommandHandler<
  DeleteMessagingMessageCommand,
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
    command: DeleteMessagingMessageCommand,
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
    // Verify message sender
    // -------------------------------------------------------------------------

    if (!message.wasSentBy(command.memberPublicId)) {
      throw new MessagingException(
        'Messaging message may only be deleted by its sender.',
      );
    }

    // -------------------------------------------------------------------------
    // Delete message
    // -------------------------------------------------------------------------

    message.delete(
      command.correlationId,
      command.causationId,
      command.deletedAt ?? new Date(),
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

export default DeleteMessagingMessageHandler;
