// -----------------------------------------------------------------------------
// Messaging — Edit Message Command
// -----------------------------------------------------------------------------
//
// Application command for editing a Messaging Message.
//
// The MessagingMessageAggregate owns message-local editing invariants.
// Conversation membership and authorization remain application concerns.
//
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import type { MessagingConversationPublicId } from '../../domain/value-objects/messaging-conversation-public-id.vo';

import type { MessagingMessagePublicId } from '../../domain/value-objects/messaging-message-public-id.vo';

import type { MessagingMemberPublicId } from '../../domain/value-objects/messaging-member-public-id.vo';

import type { MessagingMessageContent } from '../../domain/value-objects/messaging-message-content.vo';

export class EditMessagingMessageCommand implements Command {
  public constructor(
    /**
     * Internal identity of the Messaging Conversation containing the message.
     */
    public readonly conversationId: UniqueEntityId,

    /**
     * Public identity of the Messaging Conversation containing the message.
     */
    public readonly conversationPublicId: MessagingConversationPublicId,

    /**
     * Internal identity of the Messaging Message.
     */
    public readonly messageId: UniqueEntityId,

    /**
     * Public identity of the Messaging Message.
     */
    public readonly messagePublicId: MessagingMessagePublicId,

    /**
     * Public identity of the member editing the message.
     */
    public readonly memberPublicId: MessagingMemberPublicId,

    /**
     * Replacement message content.
     */
    public readonly content: MessagingMessageContent,

    /**
     * Application correlation identity.
     */
    public readonly correlationId: string,

    /**
     * Optional message edit timestamp.
     */
    public readonly editedAt: Date | undefined = undefined,

    /**
     * Optional causation identity.
     */
    public readonly causationId?: string,
  ) {}
}

export default EditMessagingMessageCommand;
