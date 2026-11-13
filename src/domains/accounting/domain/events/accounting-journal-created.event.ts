import { AccountingDomainEvent } from './accounting-domain.event';
import type { EventMetadata } from '../../../../foundation/kernel/domain/domain-event';

/**
 * Raised when an Accounting Journal aggregate is created.
 */
export class AccountingJournalCreatedEvent extends AccountingDomainEvent {
  public constructor(
    journalId: string,
    public readonly publicId: string,
    public readonly status: string,
    public readonly currency: string,
    public readonly periodPublicId: string | undefined,
    public readonly createdAt: Date,
    correlationId?: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
    restoredMetadata?: EventMetadata,
  ) {
    super(
      journalId,
      'AccountingJournal',
      'AccountingJournalCreated',
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
  ): AccountingJournalCreatedEvent {
    if (
      typeof payload.publicId !== 'string' ||
      typeof payload.status !== 'string' ||
      typeof payload.currency !== 'string'
    ) {
      throw new Error(
        'Invalid AccountingJournalCreated event payload: missing or invalid required fields.',
      );
    }

    if (
      payload.periodPublicId !== undefined &&
      typeof payload.periodPublicId !== 'string'
    ) {
      throw new Error(
        'Invalid AccountingJournalCreated event payload: periodPublicId must be a string when provided.',
      );
    }

    const createdAtValue = payload.createdAt;

    if (
      typeof createdAtValue !== 'string' &&
      !(createdAtValue instanceof Date)
    ) {
      throw new Error(
        'Invalid AccountingJournalCreated event payload: createdAt must be a valid date.',
      );
    }

    const createdAt = new Date(createdAtValue);

    if (Number.isNaN(createdAt.getTime())) {
      throw new Error(
        'Invalid AccountingJournalCreated event payload: createdAt is not a valid date.',
      );
    }

    return new AccountingJournalCreatedEvent(
      metadata.aggregateId,
      payload.publicId,
      payload.status,
      payload.currency,
      payload.periodPublicId,
      createdAt,
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
      createdAt: this.createdAt.toISOString(),
    };
  }
}

export default AccountingJournalCreatedEvent;
