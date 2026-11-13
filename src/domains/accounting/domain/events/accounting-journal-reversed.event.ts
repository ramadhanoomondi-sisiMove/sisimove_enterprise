import { AccountingDomainEvent } from './accounting-domain.event';
import type { EventMetadata } from '../../../../foundation/kernel/domain/domain-event';

/**
 * Raised when an Accounting Journal aggregate is reversed.
 *
 * The original journal remains historically preserved. Reversal does not
 * mutate or remove its existing entries or lines.
 */
export class AccountingJournalReversedEvent extends AccountingDomainEvent {
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
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
    restoredMetadata?: EventMetadata,
  ) {
    super(
      journalId,
      'AccountingJournal',
      'AccountingJournalReversed',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
      restoredMetadata,
    );

    Object.freeze(this);
  }

  /**
   * Reconstructs the event from persisted event metadata and payload.
   */
  public static rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): AccountingJournalReversedEvent {
    if (
      typeof payload.publicId !== 'string' ||
      typeof payload.status !== 'string' ||
      typeof payload.currency !== 'string'
    ) {
      throw new Error(
        'Invalid AccountingJournalReversed event payload: missing or invalid required fields.',
      );
    }

    if (
      payload.periodPublicId !== undefined &&
      typeof payload.periodPublicId !== 'string'
    ) {
      throw new Error(
        'Invalid AccountingJournalReversed event payload: periodPublicId must be a string when provided.',
      );
    }

    if (
      payload.postingReferencePublicId !== undefined &&
      typeof payload.postingReferencePublicId !== 'string'
    ) {
      throw new Error(
        'Invalid AccountingJournalReversed event payload: postingReferencePublicId must be a string when provided.',
      );
    }

    const reversedAtValue = payload.reversedAt;

    if (
      typeof reversedAtValue !== 'string' &&
      !(reversedAtValue instanceof Date)
    ) {
      throw new Error(
        'Invalid AccountingJournalReversed event payload: reversedAt must be a valid date.',
      );
    }

    const reversedAt = new Date(reversedAtValue);

    if (Number.isNaN(reversedAt.getTime())) {
      throw new Error(
        'Invalid AccountingJournalReversed event payload: reversedAt is not a valid date.',
      );
    }

    return new AccountingJournalReversedEvent(
      metadata.aggregateId,
      payload.publicId,
      payload.status,
      payload.currency,
      payload.periodPublicId,
      payload.postingReferencePublicId,
      reversedAt,
      metadata.correlationId ?? '',
      metadata.causationId,
      1,
      '1.0.0',
      metadata,
    );
  }

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
      reversedAt: this.reversedAt.toISOString(),
    };
  }
}

export default AccountingJournalReversedEvent;
