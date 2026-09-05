// -----------------------------------------------------------------------------
// Messaging Message — Deleted Domain Event
// -----------------------------------------------------------------------------
//
// Raised when a Messaging Message is deleted.
//
// Event ownership:
//
// MessagingConversation
// └── MessagingMessageDeleted
//
// The event is conversation-rooted because the Messaging Conversation is the
// aggregate consistency boundary for message participation and lifecycle.
//
// The event identifies:
//
// - the owning conversation;
// - the affected message;
// - the message sender;
// - when the deletion occurred.
//
// Message content is intentionally excluded from the event payload.
//
// -----------------------------------------------------------------------------

import { MessagingDomainEvent } from './messaging-domain.event';

// =============================================================================
// Event
// =============================================================================

/**
 * Raised when a Messaging Message is deleted.
 *
 * The aggregate identity is the internal Messaging Conversation identity.
 *
 * The message public identity identifies the specific message affected by the
 * deletion without exposing Messaging persistence details.
 *
 * Message content is intentionally excluded from the domain event.
 *
 * Deletion is represented by the lifecycle transition and its timestamp;
 * consumers should not depend on the deleted message content being present in
 * the event.
 */
export class MessagingMessageDeletedEvent extends MessagingDomainEvent {
  public constructor(
    conversationId: string,
    public readonly conversationPublicId: string,
    public readonly messagePublicId: string,
    public readonly senderPublicId: string,
    public readonly deletedAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      conversationId,
      'MessagingConversation',
      'MessagingMessageDeleted',
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
   * Only primitive integration-safe values are exposed.
   *
   * A defensive Date copy prevents consumers from mutating the timestamp
   * through a shared Date instance.
   */
  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      conversationPublicId: this.conversationPublicId,

      messagePublicId: this.messagePublicId,

      senderPublicId: this.senderPublicId,

      deletedAt: new Date(this.deletedAt.getTime()),
    };
  }
}
