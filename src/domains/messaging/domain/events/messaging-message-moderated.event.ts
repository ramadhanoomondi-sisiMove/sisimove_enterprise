// -----------------------------------------------------------------------------
// Messaging Message — Moderated Domain Event
// -----------------------------------------------------------------------------
//
// Raised when a Messaging Message is moderated.
//
// Event ownership:
//
// MessagingConversation
// └── MessagingMessageModerated
//
// The event is conversation-rooted because the Messaging Conversation is the
// aggregate consistency boundary for message participation and conversation
// lifecycle.
//
// The event identifies:
//
// - the owning conversation;
// - the affected message;
// - the sender;
// - the moderation timestamp.
//
// Message content and moderation reasoning are intentionally excluded.
//
// -----------------------------------------------------------------------------

import { MessagingDomainEvent } from './messaging-domain.event';

// =============================================================================
// Event
// =============================================================================

/**
 * Raised when a Messaging Message is moderated.
 *
 * The aggregate identity is the internal Messaging Conversation identity.
 *
 * The message public identity remains part of the event payload so consumers
 * can identify the affected message without depending on Messaging internals.
 *
 * Moderation reasoning and message content are deliberately excluded from this
 * domain event. If required by a future integration contract, they should be
 * introduced explicitly rather than leaking moderation workflow details into
 * the core domain event.
 */
export class MessagingMessageModeratedEvent extends MessagingDomainEvent {
  public constructor(
    conversationId: string,
    public readonly conversationPublicId: string,
    public readonly messagePublicId: string,
    public readonly senderPublicId: string,
    public readonly moderatedAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      conversationId,
      'MessagingConversation',
      'MessagingMessageModerated',
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
   * A defensive Date copy prevents consumers of the payload from mutating the
   * event's timestamp through a shared Date instance.
   */
  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      conversationPublicId: this.conversationPublicId,

      messagePublicId: this.messagePublicId,

      senderPublicId: this.senderPublicId,

      moderatedAt: new Date(this.moderatedAt.getTime()),
    };
  }
}
