// -----------------------------------------------------------------------------
// Support Case — Started Domain Event
// -----------------------------------------------------------------------------
//
// Raised when Support begins actively working on a Support Case.
//
// This corresponds to the IN_PROGRESS lifecycle state.
// -----------------------------------------------------------------------------

import { SupportCaseDomainEvent } from './support-case-domain.event';

// =============================================================================
// Event
// =============================================================================

export class SupportCaseStartedEvent extends SupportCaseDomainEvent {
  public constructor(
    supportCaseId: string,
    public readonly publicId: string,
    public readonly startedAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(supportCaseId, 'SupportCaseStarted', correlationId, causationId);

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId,

      startedAt: new Date(this.startedAt.getTime()),
    };
  }
}
