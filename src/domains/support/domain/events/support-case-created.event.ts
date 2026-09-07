// -----------------------------------------------------------------------------
// Support Case — Created Domain Event
// -----------------------------------------------------------------------------
//
// Raised when a SupportCaseAggregate is created.
//
// Event identity:
//
// - aggregateId   = Support Case internal identity
// - aggregateType = SupportCase
// - eventName     = SupportCaseCreated
//
// Aggregate identity remains in DomainEvent.metadata.aggregateId.
//
// The payload exposes the initial Support Case state required by consumers.
// -----------------------------------------------------------------------------

import { SupportCaseDomainEvent } from './support-case-domain.event';

// =============================================================================
// Event
// =============================================================================

export class SupportCaseCreatedEvent extends SupportCaseDomainEvent {
  public constructor(
    supportCaseId: string,
    public readonly publicId: string,
    public readonly requesterPublicId: string,
    public readonly status: string,
    public readonly priority: string,
    public readonly category: string,
    public readonly subject: string,
    public readonly description: string | undefined,
    public readonly referenceType: string | undefined,
    public readonly referencePublicId: string | undefined,
    public readonly assignedToPublicId: string | undefined,
    public readonly openedAt: Date,
    public readonly createdAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(supportCaseId, 'SupportCaseCreated', correlationId, causationId);

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId,
      requesterPublicId: this.requesterPublicId,

      status: this.status,
      priority: this.priority,
      category: this.category,

      subject: this.subject,
      description: this.description,

      referenceType: this.referenceType,
      referencePublicId: this.referencePublicId,

      assignedToPublicId: this.assignedToPublicId,

      openedAt: new Date(this.openedAt.getTime()),
      createdAt: new Date(this.createdAt.getTime()),
    };
  }
}
