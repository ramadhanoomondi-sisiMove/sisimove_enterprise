// -----------------------------------------------------------------------------
// Support Case — Cancelled Domain Event
// -----------------------------------------------------------------------------
//
// Raised when a Support Case is cancelled.
//
// CANCELLED represents termination of the Support Case without normal
// resolution.
// -----------------------------------------------------------------------------

import { SupportCaseDomainEvent } from './support-case-domain.event';

// =============================================================================
// Event
// =============================================================================

export class SupportCaseCancelledEvent extends SupportCaseDomainEvent {
  public constructor(
    supportCaseId: string,
    public readonly publicId: string,
    public readonly cancelledAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(supportCaseId, 'SupportCaseCancelled', correlationId, causationId);

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId,

      cancelledAt: new Date(this.cancelledAt.getTime()),
    };
  }
}
