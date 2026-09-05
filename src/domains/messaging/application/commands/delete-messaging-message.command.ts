// -----------------------------------------------------------------------------
// Messaging — Delete Message Command
// -----------------------------------------------------------------------------
//
// Application command for deleting a Messaging Message.
//
// Deletion is a lifecycle transition owned by MessagingMessageAggregate.
// Physical persistence deletion is not implied.
//
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import type { MessagingConversationPublicId } from '../../domain/value-objects/messaging-conversation-public-id.vo';

import type { MessagingMessagePublicId } from '../../domain/value-objects/messaging-message-public-id.vo';

import type { MessagingMemberPublicId } from '../../domain/value-objects/messaging-member-public-id.vo';

export class DeleteMessagingMessageCommand implements Command {
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
     * Public identity of the member requesting deletion.
     */
    public readonly memberPublicId: MessagingMemberPublicId,

    /**
     * Application correlation identity.
     */
    public readonly correlationId: string,

    /**
     * Optional message deletion timestamp.
     */
    public readonly deletedAt: Date | undefined = undefined,

    /**
     * Optional causation identity.
     */
    public readonly causationId?: string,
  ) {}
}

export default DeleteMessagingMessageCommand;
