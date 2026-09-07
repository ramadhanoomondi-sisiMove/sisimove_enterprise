// -----------------------------------------------------------------------------
// Support Case — Category Changed Domain Event
// -----------------------------------------------------------------------------
//
// Raised when the category of a Support Case changes.
//
// Both previous and new category values are included in the event contract.
// -----------------------------------------------------------------------------

import { SupportCaseDomainEvent } from './support-case-domain.event';

// =============================================================================
// Event
// =============================================================================

export class SupportCaseCategoryChangedEvent extends SupportCaseDomainEvent {
  public constructor(
    supportCaseId: string,
    public readonly publicId: string,
    public readonly previousCategory: string,
    public readonly category: string,
    public readonly changedAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      supportCaseId,
      'SupportCaseCategoryChanged',
      correlationId,
      causationId,
    );

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId,
      previousCategory: this.previousCategory,
      category: this.category,

      changedAt: new Date(this.changedAt.getTime()),
    };
  }
}
