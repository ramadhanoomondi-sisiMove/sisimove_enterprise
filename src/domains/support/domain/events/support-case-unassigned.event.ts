// -----------------------------------------------------------------------------
// Support Case — Unassigned Domain Event
// -----------------------------------------------------------------------------
//
// Raised when a Support Case is unassigned from its current Support agent.
//
// The previously assigned Identity public ID is retained in the event payload
// so consumers can understand what assignment was removed.
// -----------------------------------------------------------------------------

import { SupportCaseDomainEvent } from './support-case-domain.event';

// =============================================================================
// Event
// =============================================================================

export class SupportCaseUnassignedEvent extends SupportCaseDomainEvent {
  public constructor(
    supportCaseId: string,
    public readonly publicId: string,
    public readonly previousAssignedToPublicId: string,
    public readonly unassignedAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(supportCaseId, 'SupportCaseUnassigned', correlationId, causationId);

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId,
      previousAssignedToPublicId: this.previousAssignedToPublicId,

      unassignedAt: new Date(this.unassignedAt.getTime()),
    };
  }
}
