// -----------------------------------------------------------------------------
// Messaging Conversation — Closed Domain Event
// -----------------------------------------------------------------------------
//
// Raised by:
//
// MessagingConversationAggregate
//
// Aggregate:
//
// MessagingConversationAggregate
// └── MessagingConversationEntity
//
// This event represents the terminal lifecycle transition of the
// Messaging Conversation aggregate.
//
// Closing a conversation prevents further operational conversation activity.
//
// Event identity is rooted in the Messaging Conversation aggregate:
// - aggregateId      = conversation internal identity
// - aggregateType    = MessagingConversation
// - eventType        = MessagingConversationClosed
//
// The publicId identifies the conversation at the application/transport
// boundary.
//
// -----------------------------------------------------------------------------

import { MessagingDomainEvent } from './messaging-domain.event';

// =============================================================================
// Event
// =============================================================================

/**
 * Raised when a Messaging Conversation is closed.
 *
 * Closing is a terminal conversation lifecycle transition.
 *
 * After a conversation is closed:
 *
 * - no new messages may be sent;
 * - existing messages may not be operationally mutated through the
 *   conversation aggregate;
 * - the conversation remains available as historical information;
 * - the closure timestamp records when the transition occurred.
 */
export class MessagingConversationClosedEvent extends MessagingDomainEvent {
  public constructor(
    conversationId: string,
    public readonly publicId: string,
    public readonly closedAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      conversationId,
      'MessagingConversation',
      'MessagingConversationClosed',
      correlationId,
      causationId,
    );

    Object.freeze(this);
  }

  // ===========================================================================
  // Payload
  // ===========================================================================

  /**
   * Build the event payload.
   *
   * A defensive Date copy is returned so consumers cannot mutate the
   * Date instance held by the event.
   */
  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      publicId: this.publicId,
      closedAt: new Date(this.closedAt.getTime()),
    };
  }
}
