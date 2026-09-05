// -----------------------------------------------------------------------------
// Accounting Journal — Posted Domain Event
// -----------------------------------------------------------------------------
//
// Raised when an Accounting Journal aggregate is posted.
//
// A posted journal is an authoritative accounting record. Its entries and
// lines are therefore treated as part of the journal aggregate.
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
 * Raised when an Accounting Journal aggregate is posted.
 */
export class AccountingJournalPostedEvent extends AccountingDomainEvent {
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
    public readonly postedAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      journalId,
      'AccountingJournal',
      'AccountingJournalPosted',
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
      postedAt: this.postedAt,
    };
  }
}
