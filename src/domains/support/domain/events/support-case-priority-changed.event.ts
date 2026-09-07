// -----------------------------------------------------------------------------
// Support Case — Priority Changed Domain Event
// -----------------------------------------------------------------------------
//
// Raised when the priority of a Support Case changes.
//
// Both previous and new priority values are included so consumers do not need
// to reconstruct the transition from external state.
// -----------------------------------------------------------------------------

import { SupportCaseDomainEvent } from './support-case-domain.event';

// =============================================================================
// Event
// =============================================================================

export class SupportCasePriorityChangedEvent extends SupportCaseDomainEvent {
  public constructor(
    supportCaseId: string,
    public readonly publicId: string,
    public readonly previousPriority: string,
    public readonly priority: string,
    public readonly changedAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      supportCaseId,
      'SupportCasePriorityChanged',
      correlationId,
      causationId,
    );

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId,
      previousPriority: this.previousPriority,
      priority: this.priority,

      changedAt: new Date(this.changedAt.getTime()),
    };
  }
}
