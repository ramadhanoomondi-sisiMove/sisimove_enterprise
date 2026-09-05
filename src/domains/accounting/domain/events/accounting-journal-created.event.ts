// -----------------------------------------------------------------------------
// Accounting Journal — Created Domain Event
// -----------------------------------------------------------------------------
//
// Raised when an Accounting Journal aggregate is created.
//
// Aggregate:
//
// AccountingJournalAggregate
// ├── AccountingJournalEntity
// ├── AccountingJournalEntryEntity[]
// │   └── AccountingJournalLineEntity[]
// └── AccountingPostingReferenceEntity?
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
 * Raised when an Accounting Journal aggregate is created.
 */
export class AccountingJournalCreatedEvent extends AccountingDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    journalId: string,
    public readonly publicId: string,
    public readonly status: string,
    public readonly currency: string,
    public readonly periodPublicId: string | undefined,
    public readonly createdAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      journalId,
      'AccountingJournal',
      'AccountingJournalCreated',
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
      createdAt: this.createdAt,
    };
  }
}
