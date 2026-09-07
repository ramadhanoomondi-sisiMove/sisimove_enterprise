// -----------------------------------------------------------------------------
// Support Case — Participant Added Domain Event
// -----------------------------------------------------------------------------
//
// Raised when a participant is added to a Support Case.
//
// Aggregate:
// SupportCaseAggregate
//
// Child entity:
// SupportCaseParticipantEntity
//
// The event exposes the participant's Support public identity and the opaque
// Identity public ID of the participating member.
// -----------------------------------------------------------------------------

import { SupportCaseDomainEvent } from './support-case-domain.event';

// =============================================================================
// Event
// =============================================================================

export class SupportCaseParticipantAddedEvent extends SupportCaseDomainEvent {
  public constructor(
    supportCaseId: string,
    public readonly publicId: string,
    public readonly participantPublicId: string,
    public readonly memberPublicId: string,
    public readonly role: string,
    public readonly joinedAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      supportCaseId,
      'SupportCaseParticipantAdded',
      correlationId,
      causationId,
    );

    Object.freeze(this);
  }

  // ===========================================================================
  // Payload
  // ===========================================================================

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId,

      participantPublicId: this.participantPublicId,
      memberPublicId: this.memberPublicId,
      role: this.role,

      joinedAt: new Date(this.joinedAt.getTime()),
    };
  }
}
