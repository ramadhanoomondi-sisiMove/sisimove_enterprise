// -----------------------------------------------------------------------------
// Support Case — Participant Removed Domain Event
// -----------------------------------------------------------------------------
//
// Raised when a participant leaves a Support Case.
//
// The participant's public identity and member public identity are retained in
// the event so consumers can identify which participant was removed.
// -----------------------------------------------------------------------------

import { SupportCaseDomainEvent } from './support-case-domain.event';

// =============================================================================
// Event
// =============================================================================

export class SupportCaseParticipantRemovedEvent extends SupportCaseDomainEvent {
  public constructor(
    supportCaseId: string,
    public readonly publicId: string,
    public readonly participantPublicId: string,
    public readonly memberPublicId: string,
    public readonly role: string,
    public readonly leftAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      supportCaseId,
      'SupportCaseParticipantRemoved',
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

      leftAt: new Date(this.leftAt.getTime()),
    };
  }
}
