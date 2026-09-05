// -----------------------------------------------------------------------------
// Messaging — Edit Message Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler for editing a Messaging Message.
//
// Responsibilities:
//
// - retrieve the Messaging Message aggregate;
// - verify the supplied conversation identity;
// - verify that the requesting member is the message sender;
// - delegate message editing to MessagingMessageAggregate;
// - persist the updated aggregate.
//
// This handler does NOT:
//
// - access Prisma directly;
// - perform persistence mapping;
// - modify MessagingMessageEntity directly;
// - implement message editing rules;
// - perform external authorization infrastructure;
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

import type { EditMessagingMessageCommand } from '../commands/edit-messaging-message.command';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { MessagingMessageAggregate } from '../../domain/aggregates/messaging-message.aggregate';

// -----------------------------------------------------------------------------
// Domain — Repository
// -----------------------------------------------------------------------------

import type { MessagingMessageRepository } from '../../domain/repositories/messaging-message.repository';

// -----------------------------------------------------------------------------
// Domain — Exception
// -----------------------------------------------------------------------------

import { MessagingMessageNotFoundException } from '../../domain/exceptions/messaging-message-not-found.exception';

import { MessagingException } from '../../domain/exceptions/messaging.exception';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class EditMessagingMessageHandler implements CommandHandler<
  EditMessagingMessageCommand,
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
    command: EditMessagingMessageCommand,
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
    //
    // Sender ownership is an application-level operation. The message
    // aggregate only compares the opaque member identity and does not perform
    // external authorization.
    //
    // -------------------------------------------------------------------------

    if (!message.wasSentBy(command.memberPublicId)) {
      throw new MessagingException(
        'Messaging message may only be edited by its sender.',
      );
    }

    // -------------------------------------------------------------------------
    // Edit message
    // -------------------------------------------------------------------------

    message.edit(
      command.content,
      command.correlationId,
      command.causationId,
      command.editedAt ?? new Date(),
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

export default EditMessagingMessageHandler;
