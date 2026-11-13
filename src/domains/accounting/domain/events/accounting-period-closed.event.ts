import { AccountingDomainEvent } from './accounting-domain.event';
import type { EventMetadata } from '../../../../foundation/kernel/domain/domain-event';

/**
 * Raised when an Accounting Period aggregate is closed.
 */
export class AccountingPeriodClosedEvent extends AccountingDomainEvent {
  public constructor(
    periodId: string,
    public readonly publicId: string,
    public readonly name: string,
    public readonly startsAt: Date,
    public readonly endsAt: Date,
    public readonly status: string,
    public readonly closedAt: Date,
    correlationId?: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
    restoredMetadata?: EventMetadata,
  ) {
    super(
      periodId,
      'AccountingPeriod',
      'AccountingPeriodClosed',
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
  ): AccountingPeriodClosedEvent {
    if (
      typeof payload.publicId !== 'string' ||
      typeof payload.name !== 'string' ||
      typeof payload.status !== 'string'
    ) {
      throw new Error(
        'Invalid AccountingPeriodClosed event payload: missing or invalid required fields.',
      );
    }

    const parseDate = (value: unknown, field: string): Date => {
      if (typeof value !== 'string' && !(value instanceof Date)) {
        throw new Error(
          `Invalid AccountingPeriodClosed event payload: ${field} must be a valid date.`,
        );
      }

      const date = new Date(value);

      if (Number.isNaN(date.getTime())) {
        throw new Error(
          `Invalid AccountingPeriodClosed event payload: ${field} is not a valid date.`,
        );
      }

      return date;
    };

    const startsAt = parseDate(payload.startsAt, 'startsAt');
    const endsAt = parseDate(payload.endsAt, 'endsAt');
    const closedAt = parseDate(payload.closedAt, 'closedAt');

    return new AccountingPeriodClosedEvent(
      metadata.aggregateId,
      payload.publicId,
      payload.name,
      startsAt,
      endsAt,
      payload.status,
      closedAt,
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
      name: this.name,
      startsAt: this.startsAt.toISOString(),
      endsAt: this.endsAt.toISOString(),
      status: this.status,
      closedAt: this.closedAt.toISOString(),
    };
  }
}

export default AccountingPeriodClosedEvent;
