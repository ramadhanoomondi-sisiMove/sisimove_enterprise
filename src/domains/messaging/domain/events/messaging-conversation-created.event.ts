// -----------------------------------------------------------------------------
// Messaging Conversation — Created Domain Event
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
// This event represents the creation of a Messaging Conversation aggregate.
//
// Event identity is rooted in the Messaging Conversation aggregate:
// - aggregateId   = conversation internal identity
// - aggregateType = MessagingConversation
// - eventType     = MessagingConversationCreated
//
// Public/domain value objects are serialized to primitives in the event:
// - conversation public identity
// - conversation type
// - conversation status
// - journey public identity
// - optional booking public identity
//
// The aggregate internal identity remains in
// DomainEvent.metadata.aggregateId.
//
// -----------------------------------------------------------------------------

import { MessagingDomainEvent } from './messaging-domain.event';

// =============================================================================
// Event
// =============================================================================

/**
 * Raised when a Messaging Conversation aggregate is created.
 *
 * The event is rooted in the Messaging Conversation aggregate.
 *
 * The aggregate is responsible for ensuring that:
 *
 * - the conversation identity is valid;
 * - the conversation type is valid;
 * - the conversation status is valid;
 * - a journey public identity exists;
 * - the optional booking public identity is valid;
 * - the creation timestamp is valid.
 *
 * The event contains primitive values rather than domain value objects so
 * that it can safely cross application, infrastructure, and integration
 * boundaries.
 */
export class MessagingConversationCreatedEvent extends MessagingDomainEvent {
  public constructor(
    conversationId: string,
    public readonly publicId: string,
    public readonly type: string,
    public readonly status: string,
    public readonly journeyPublicId: string,
    public readonly bookingPublicId: string | undefined,
    public readonly createdAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      conversationId,
      'MessagingConversation',
      'MessagingConversationCreated',
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
   * Domain value objects have already been converted to primitive values by
   * the aggregate before constructing this event.
   *
   * A defensive Date copy prevents consumers from mutating the Date instance
   * held by the event.
   */
  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      publicId: this.publicId,
      type: this.type,
      status: this.status,
      journeyPublicId: this.journeyPublicId,
      bookingPublicId: this.bookingPublicId,
      createdAt: new Date(this.createdAt.getTime()),
    };
  }
}
