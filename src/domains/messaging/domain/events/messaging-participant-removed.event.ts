// -----------------------------------------------------------------------------
// Messaging Participant — Removed Domain Event
// -----------------------------------------------------------------------------
//
// Raised by:
//
// MessagingConversationAggregate
//
// Aggregate:
//
// MessagingConversationAggregate
// ├── MessagingConversationEntity
// └── MessagingConversationParticipantEntity
//
// This event represents the removal of a participant from the Messaging
// Conversation aggregate.
//
// Event identity is rooted in the Messaging Conversation aggregate:
// - aggregateId   = conversation internal identity
// - aggregateType = MessagingConversation
// - eventType     = MessagingParticipantRemoved
//
// The participant and member public identities are included in the payload
// to identify the participant affected by the transition.
//
// -----------------------------------------------------------------------------

import { MessagingDomainEvent } from './messaging-domain.event';

// =============================================================================
// Event
// =============================================================================

/**
 * Raised when a participant is removed from a Messaging Conversation.
 *
 * The MessagingConversationAggregate is responsible for enforcing the
 * conversation-level invariants before this event is recorded.
 *
 * The participant entity performs the participant-local lifecycle transition:
 *
 * ACTIVE → REMOVED
 *
 * A REMOVED participant remains in the aggregate's participant collection.
 * The participant is not physically removed because the aggregate must retain
 * membership history.
 *
 * A removed participant can no longer participate in operational conversation
 * activity.
 */
export class MessagingParticipantRemovedEvent extends MessagingDomainEvent {
  public constructor(
    conversationId: string,
    public readonly conversationPublicId: string,
    public readonly participantPublicId: string,
    public readonly memberPublicId: string,
    public readonly removedAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      conversationId,
      'MessagingConversation',
      'MessagingParticipantRemoved',
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
   * Public identities and lifecycle information are represented as primitive
   * values so the event can safely cross application and infrastructure
   * boundaries.
   *
   * A defensive Date copy prevents consumers from mutating the Date instance
   * held by the event.
   */
  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      conversationPublicId: this.conversationPublicId,
      participantPublicId: this.participantPublicId,
      memberPublicId: this.memberPublicId,
      removedAt: new Date(this.removedAt.getTime()),
    };
  }
}
