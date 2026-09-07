// -----------------------------------------------------------------------------
// Support Case — Closed Domain Event
// -----------------------------------------------------------------------------
//
// Raised when a resolved Support Case is closed.
//
// CLOSED represents completion of the Support Case lifecycle.
// -----------------------------------------------------------------------------

import { SupportCaseDomainEvent } from './support-case-domain.event';

// =============================================================================
// Event
// =============================================================================

export class SupportCaseClosedEvent extends SupportCaseDomainEvent {
  public constructor(
    supportCaseId: string,
    public readonly publicId: string,
    public readonly closedAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(supportCaseId, 'SupportCaseClosed', correlationId, causationId);

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId,

      closedAt: new Date(this.closedAt.getTime()),
    };
  }
}
