// -----------------------------------------------------------------------------
// Support Case — Assigned Domain Event
// -----------------------------------------------------------------------------
//
// Raised when a Support Case is assigned to a Support agent/member.
//
// The assigned member is represented by its opaque Identity public ID.
// -----------------------------------------------------------------------------

import { SupportCaseDomainEvent } from './support-case-domain.event';

// =============================================================================
// Event
// =============================================================================

export class SupportCaseAssignedEvent extends SupportCaseDomainEvent {
  public constructor(
    supportCaseId: string,
    public readonly publicId: string,
    public readonly assignedToPublicId: string,
    public readonly assignedAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(supportCaseId, 'SupportCaseAssigned', correlationId, causationId);

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId,
      assignedToPublicId: this.assignedToPublicId,

      assignedAt: new Date(this.assignedAt.getTime()),
    };
  }
}
