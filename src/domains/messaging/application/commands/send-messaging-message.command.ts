// -----------------------------------------------------------------------------
// Messaging — Send Message Command
// -----------------------------------------------------------------------------
//
// Application command for sending a Messaging Message.
//
// The command carries intent and the identities required by the application
// workflow. Conversation membership and conversation lifecycle validation remain
// outside the MessagingMessageAggregate.
//
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import type { MessagingConversationPublicId } from '../../domain/value-objects/messaging-conversation-public-id.vo';

import type { MessagingMemberPublicId } from '../../domain/value-objects/messaging-member-public-id.vo';

import type { MessagingMessageContent } from '../../domain/value-objects/messaging-message-content.vo';

import type { MessagingMessageType } from '../../domain/value-objects/messaging-message-type.vo';

import type { MessagingAssetPublicId } from '../../domain/value-objects/messaging-asset-public-id.vo';

export class SendMessagingMessageCommand implements Command {
  public constructor(
    /**
     * Internal identity of the owning Messaging Conversation.
     */
    public readonly conversationId: UniqueEntityId,

    /**
     * Public identity of the owning Messaging Conversation.
     */
    public readonly conversationPublicId: MessagingConversationPublicId,

    /**
     * Public identity of the member sending the message.
     */
    public readonly senderPublicId: MessagingMemberPublicId,

    /**
     * Message type.
     */
    public readonly type: MessagingMessageType,

    /**
     * Optional message content.
     */
    public readonly content: MessagingMessageContent | undefined,

    /**
     * Optional referenced Asset public identity.
     */
    public readonly assetPublicId: MessagingAssetPublicId | undefined,

    /**
     * Message sent timestamp.
     */
    public readonly sentAt: Date | undefined,

    /**
     * Application correlation identity.
     */
    public readonly correlationId: string,

    /**
     * Optional causation identity.
     */
    public readonly causationId?: string,
  ) {}
}

export default SendMessagingMessageCommand;
