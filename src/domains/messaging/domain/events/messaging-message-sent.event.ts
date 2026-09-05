// -----------------------------------------------------------------------------
// Messaging Message — Sent Domain Event
// -----------------------------------------------------------------------------
//
// Raised when a Messaging Message is sent.
//
// Event ownership:
//
// MessagingConversation
// └── MessagingMessageSent
//
// The event is conversation-rooted because the Messaging Conversation is the
// consistency boundary that owns message participation and conversation
// lifecycle.
//
// The event identifies:
//
// - the owning conversation;
// - the affected message;
// - the sender;
// - the message type;
// - the optional Asset reference;
// - the message sent timestamp.
//
// Message content is intentionally excluded.
//
// -----------------------------------------------------------------------------

import { MessagingDomainEvent } from './messaging-domain.event';

// =============================================================================
// Event
// =============================================================================

/**
 * Raised when a message is sent within a Messaging Conversation.
 *
 * The aggregate identity is the internal Messaging Conversation identity.
 *
 * The message public identity remains part of the event payload so consumers
 * can identify the affected message without depending on Messaging internals.
 */
export class MessagingMessageSentEvent extends MessagingDomainEvent {
  public constructor(
    conversationId: string,
    public readonly conversationPublicId: string,
    public readonly messagePublicId: string,
    public readonly senderPublicId: string,
    public readonly type: string,
    public readonly assetPublicId: string | undefined,
    public readonly sentAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      conversationId,
      'MessagingConversation',
      'MessagingMessageSent',
      correlationId,
      causationId,
    );

    Object.freeze(this);
  }

  // ===========================================================================
  // Payload
  // ===========================================================================

  /**
   * Returns the event payload.
   *
   * The payload contains only integration-safe primitive values.
   *
   * Domain value objects are intentionally not exposed through the event
   * payload.
   */
  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      conversationPublicId: this.conversationPublicId,

      messagePublicId: this.messagePublicId,

      senderPublicId: this.senderPublicId,

      type: this.type,

      assetPublicId: this.assetPublicId,

      sentAt: new Date(this.sentAt.getTime()),
    };
  }
}
