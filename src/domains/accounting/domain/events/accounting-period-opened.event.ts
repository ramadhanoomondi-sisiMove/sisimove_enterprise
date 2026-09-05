// -----------------------------------------------------------------------------
// Accounting Period — Opened Domain Event
// -----------------------------------------------------------------------------
//
// Raised when an Accounting Period aggregate is opened.
//
// Aggregate:
//
// AccountingPeriodAggregate
// └── AccountingPeriodEntity
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Accounting
// -----------------------------------------------------------------------------

import { AccountingDomainEvent } from './accounting-domain.event';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

/**
 * Raised when an Accounting Period aggregate is opened.
 */
export class AccountingPeriodOpenedEvent extends AccountingDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    periodId: string,
    public readonly publicId: string,
    public readonly name: string,
    public readonly startsAt: Date,
    public readonly endsAt: Date,
    public readonly status: string,
    public readonly openedAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      periodId,
      'AccountingPeriod',
      'AccountingPeriodOpened',
      correlationId,
      causationId,
    );

    Object.freeze(this);
  }

  // ===========================================================================
  // Payload
  // ===========================================================================

  /**
   * Returns the event-specific payload.
   */
  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      publicId: this.publicId,
      name: this.name,
      startsAt: this.startsAt,
      endsAt: this.endsAt,
      status: this.status,
      openedAt: this.openedAt,
    };
  }
}
