// -----------------------------------------------------------------------------
// Support Case — Opened Domain Event
// -----------------------------------------------------------------------------
//
// Raised when a Support Case is opened.
//
// Event identity:
//
// - aggregateId   = Support Case internal identity
// - aggregateType = SupportCase
// - eventName     = SupportCaseOpened
//
// The event represents the beginning of the active Support Case lifecycle.
// -----------------------------------------------------------------------------

import { SupportCaseDomainEvent } from './support-case-domain.event';

// =============================================================================
// Event
// =============================================================================

export class SupportCaseOpenedEvent extends SupportCaseDomainEvent {
  public constructor(
    supportCaseId: string,
    public readonly publicId: string,
    public readonly requesterPublicId: string,
    public readonly category: string,
    public readonly subject: string,
    public readonly openedAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(supportCaseId, 'SupportCaseOpened', correlationId, causationId);

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId,
      requesterPublicId: this.requesterPublicId,
      category: this.category,
      subject: this.subject,

      openedAt: new Date(this.openedAt.getTime()),
    };
  }
}
