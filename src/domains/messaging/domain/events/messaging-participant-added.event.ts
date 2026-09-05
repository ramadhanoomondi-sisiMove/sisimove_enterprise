// -----------------------------------------------------------------------------
// Messaging Participant — Added Domain Event
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
// This event represents the addition of a participant to the
// Messaging Conversation aggregate.
//
// Event identity is rooted in the Messaging Conversation aggregate:
// - aggregateId   = conversation internal identity
// - aggregateType = MessagingConversation
// - eventType     = MessagingParticipantAdded
//
// The participant and member public identities are included in the payload
// because they identify the participant that was added.
//
// Domain value objects are serialized to primitive values before the event
// reaches this boundary.
//
// -----------------------------------------------------------------------------

import { MessagingDomainEvent } from './messaging-domain.event';

// =============================================================================
// Event
// =============================================================================

/**
 * Raised when a participant is added to a Messaging Conversation.
 *
 * The MessagingConversationAggregate is responsible for enforcing the
 * conversation-level invariants before this event is recorded, including:
 *
 * - the participant belongs to the conversation;
 * - the participant is active;
 * - the participant identity is unique within the conversation;
 * - the member identity is not already participating in the conversation.
 *
 * The event itself remains a historical description of the transition.
 */
export class MessagingParticipantAddedEvent extends MessagingDomainEvent {
  public constructor(
    conversationId: string,
    public readonly conversationPublicId: string,
    public readonly participantPublicId: string,
    public readonly memberPublicId: string,
    public readonly role: string,
    public readonly status: string,
    public readonly joinedAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      conversationId,
      'MessagingConversation',
      'MessagingParticipantAdded',
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
   * The aggregate and participant identities are represented as primitive
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
      role: this.role,
      status: this.status,
      joinedAt: new Date(this.joinedAt.getTime()),
    };
  }
}
