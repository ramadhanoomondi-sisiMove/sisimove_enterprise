import type { EventMetadata } from '../../../../foundation/kernel/domain/domain-event';

import { AccountingDomainEvent } from './accounting-domain.event';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

/**
 * Raised when an Accounting Journal aggregate is posted.
 *
 * A posted journal is an authoritative accounting record. Its entries and
 * lines are therefore treated as part of the journal aggregate.
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
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
    restoredMetadata?: EventMetadata,
  ) {
    super(
      journalId,
      'AccountingJournal',
      'AccountingJournalPosted',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
      restoredMetadata,
    );

    Object.freeze(this);
  }

  // ===========================================================================
  // Rehydrate
  // ===========================================================================

  public static rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): AccountingJournalPostedEvent {
    const {
      publicId,
      status,
      currency,
      periodPublicId,
      postingReferencePublicId,
      postedAt,
    } = payload;

    // -------------------------------------------------------------------------
    // Validate Required Properties
    // -------------------------------------------------------------------------

    if (
      typeof publicId !== 'string' ||
      !publicId.trim() ||
      typeof status !== 'string' ||
      !status.trim() ||
      typeof currency !== 'string' ||
      !currency.trim()
    ) {
      throw new Error('Invalid payload for AccountingJournalPosted event');
    }

    // -------------------------------------------------------------------------
    // Validate Optional Properties
    // -------------------------------------------------------------------------

    if (
      (periodPublicId !== undefined && typeof periodPublicId !== 'string') ||
      (postingReferencePublicId !== undefined &&
        typeof postingReferencePublicId !== 'string')
    ) {
      throw new Error(
        'Invalid optional properties for AccountingJournalPosted event',
      );
    }

    // -------------------------------------------------------------------------
    // Restore Posted Date
    // -------------------------------------------------------------------------

    if (typeof postedAt !== 'string' && !(postedAt instanceof Date)) {
      throw new Error(
        'Invalid postedAt value for AccountingJournalPosted event',
      );
    }

    const restoredPostedAt =
      postedAt instanceof Date
        ? new Date(postedAt.getTime())
        : new Date(postedAt);

    if (Number.isNaN(restoredPostedAt.getTime())) {
      throw new Error(
        'Invalid postedAt date for AccountingJournalPosted event',
      );
    }

    // -------------------------------------------------------------------------
    // Restore Event
    // -------------------------------------------------------------------------

    return new AccountingJournalPostedEvent(
      metadata.aggregateId,
      publicId,
      status,
      currency,
      periodPublicId,
      postingReferencePublicId,
      restoredPostedAt,
      metadata.correlationId ?? '',
      metadata.causationId,
      metadata.eventVersion,
      metadata.eventSchemaVersion,
      metadata,
    );
  }

  // ===========================================================================
  // Payload
  // ===========================================================================

  protected override getPayload(): Record<string, unknown> {
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
      postedAt: this.postedAt.toISOString(),
    };
  }
}

export default AccountingJournalPostedEvent;
