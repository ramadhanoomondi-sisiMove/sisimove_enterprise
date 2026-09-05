// -----------------------------------------------------------------------------
// Messaging Message — Edited Domain Event
// -----------------------------------------------------------------------------
//
// Raised when a Messaging Message is edited.
//
// Event ownership:
//
// MessagingConversation
// └── MessagingMessageEdited
//
// The event is conversation-rooted because the Messaging Conversation is the
// aggregate consistency boundary for message participation and lifecycle.
//
// The event identifies:
//
// - the owning conversation;
// - the affected message;
// - the message sender;
// - when the edit occurred.
//
// Message content is intentionally excluded from this domain event.
//
// -----------------------------------------------------------------------------

import { MessagingDomainEvent } from './messaging-domain.event';

// =============================================================================
// Event
// =============================================================================

/**
 * Raised when a previously sent Messaging Message is edited.
 *
 * The aggregate identity is the internal Messaging Conversation identity.
 *
 * The message public identity identifies the specific message affected by the
 * edit without exposing Messaging persistence details.
 *
 * The edited content is intentionally excluded from the domain event.
 * Consumers that require the current message representation should retrieve
 * the message through the appropriate application/query boundary rather than
 * coupling the domain event to message content.
 */
export class MessagingMessageEditedEvent extends MessagingDomainEvent {
  public constructor(
    conversationId: string,
    public readonly conversationPublicId: string,
    public readonly messagePublicId: string,
    public readonly senderPublicId: string,
    public readonly editedAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      conversationId,
      'MessagingConversation',
      'MessagingMessageEdited',
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

      editedAt: new Date(this.editedAt.getTime()),
    };
  }
}
