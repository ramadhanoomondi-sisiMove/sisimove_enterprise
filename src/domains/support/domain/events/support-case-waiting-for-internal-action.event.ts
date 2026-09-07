// -----------------------------------------------------------------------------
// Support Case — Waiting For Internal Action Domain Event
// -----------------------------------------------------------------------------
//
// Raised when a Support Case is waiting for an internal action before work
// can continue.
//
// This corresponds to the WAITING_FOR_INTERNAL_ACTION lifecycle state.
// -----------------------------------------------------------------------------

import { SupportCaseDomainEvent } from './support-case-domain.event';

// =============================================================================
// Event
// =============================================================================

export class SupportCaseWaitingForInternalActionEvent extends SupportCaseDomainEvent {
  public constructor(
    supportCaseId: string,
    public readonly publicId: string,
    public readonly waitingAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      supportCaseId,
      'SupportCaseWaitingForInternalAction',
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
