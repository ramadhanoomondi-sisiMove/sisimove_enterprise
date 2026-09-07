// -----------------------------------------------------------------------------
// Support Case — Waiting For Member Domain Event
// -----------------------------------------------------------------------------
//
// Raised when Support is waiting for information or action from a member.
//
// This corresponds to the WAITING_FOR_MEMBER lifecycle state.
// -----------------------------------------------------------------------------

import { SupportCaseDomainEvent } from './support-case-domain.event';

// =============================================================================
// Event
// =============================================================================

export class SupportCaseWaitingForMemberEvent extends SupportCaseDomainEvent {
  public constructor(
    supportCaseId: string,
    public readonly publicId: string,
    public readonly waitingAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      supportCaseId,
      'SupportCaseWaitingForMember',
      correlationId,
      causationId,
    );

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId,

      waitingAt: new Date(this.waitingAt.getTime()),
    };
  }
}