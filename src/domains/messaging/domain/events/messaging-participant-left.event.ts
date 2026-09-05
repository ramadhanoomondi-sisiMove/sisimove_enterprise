// -----------------------------------------------------------------------------
// Messaging Participant — Left Domain Event
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
// This event represents the voluntary departure of a participant from the
// Messaging Conversation aggregate.
//
// Event identity is rooted in the Messaging Conversation aggregate:
// - aggregateId   = conversation internal identity
// - aggregateType = MessagingConversation
// - eventType     = MessagingParticipantLeft
//
// The participant and member public identities are included in the payload
// to identify which participant performed the transition.
//
// -----------------------------------------------------------------------------

import { MessagingDomainEvent } from './messaging-domain.event';

// =============================================================================
// Event
// =============================================================================

/**
 * Raised when a participant voluntarily leaves a Messaging Conversation.
 *
 * The MessagingConversationAggregate is responsible for enforcing the
 * conversation-level invariants before this event is recorded.
 *
 * The participant entity performs the participant-local lifecycle transition:
 *
 * ACTIVE → LEFT
 *
 * A LEFT participant remains part of the aggregate's historical participant
 * collection. The participant is not removed from the collection because
 * membership history must remain available for aggregate consistency and
 * historical event interpretation.
 */
export class MessagingParticipantLeftEvent extends MessagingDomainEvent {
  public constructor(
    conversationId: string,
    public readonly conversationPublicId: string,
    public readonly participantPublicId: string,
    public readonly memberPublicId: string,
    public readonly leftAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      conversationId,
      'MessagingConversation',
      'MessagingParticipantLeft',
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
      leftAt: new Date(this.leftAt.getTime()),
    };
  }
}
