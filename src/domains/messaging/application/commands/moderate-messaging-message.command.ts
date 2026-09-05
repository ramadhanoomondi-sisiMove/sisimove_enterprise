// -----------------------------------------------------------------------------
// Messaging — Moderate Message Command
// -----------------------------------------------------------------------------
//
// Application command for marking a Messaging Message as moderated.
//
// The command records the intent to perform the message lifecycle transition.
// The actual moderation decision belongs to the appropriate application or
// moderation workflow.
//
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import type { MessagingConversationPublicId } from '../../domain/value-objects/messaging-conversation-public-id.vo';

import type { MessagingMessagePublicId } from '../../domain/value-objects/messaging-message-public-id.vo';

export class ModerateMessagingMessageCommand implements Command {
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
     * Application correlation identity.
     */
    public readonly correlationId: string,

    /**
     * Optional message moderation timestamp.
     */
    public readonly moderatedAt: Date | undefined = undefined,

    /**
     * Optional causation identity.
     */
    public readonly causationId?: string,
  ) {}
}

export default ModerateMessagingMessageCommand;
