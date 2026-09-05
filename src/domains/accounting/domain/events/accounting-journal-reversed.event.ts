// -----------------------------------------------------------------------------
// Accounting Journal — Reversed Domain Event
// -----------------------------------------------------------------------------
//
// Raised when an Accounting Journal aggregate is reversed.
//
// Reversal is a lifecycle transition of the journal aggregate. The original
// journal remains historically preserved; the event does not mutate or remove
// its existing entries or lines.
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
 * Raised when an Accounting Journal aggregate is reversed.
 */
export class AccountingJournalReversedEvent extends AccountingDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    journalId: string,
    public readonly publicId: string,
    public readonly status: string,
    public readonly currency: string,
    public readonly periodPublicId: string | undefined,
    public readonly postingReferencePublicId: string | undefined,
    public readonly reversedAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      journalId,
      'AccountingJournal',
      'AccountingJournalReversed',
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
      status: this.status,
      currency: this.currency,
      ...(this.periodPublicId !== undefined && {
        periodPublicId: this.periodPublicId,
      }),
      ...(this.postingReferencePublicId !== undefined && {
        postingReferencePublicId: this.postingReferencePublicId,
      }),
      reversedAt: this.reversedAt,
    };
  }
}
