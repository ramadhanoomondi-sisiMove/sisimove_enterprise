import { AccountingDomainEvent } from './accounting-domain.event';
import type { EventMetadata } from '../../../../foundation/kernel/domain/domain-event';

/**
 * Raised when an Accounting Account aggregate is closed.
 */
export class AccountingAccountClosedEvent extends AccountingDomainEvent {
  public constructor(
    accountId: string,
    public readonly publicId: string,
    public readonly code: string,
    public readonly type: string,
    public readonly status: string,
    public readonly closedAt: Date,
    correlationId?: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
    restoredMetadata?: EventMetadata,
  ) {
    super(
      accountId,
      'AccountingAccount',
      'AccountingAccountClosed',
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
  ): AccountingAccountClosedEvent {
    if (
      typeof payload.publicId !== 'string' ||
      typeof payload.code !== 'string' ||
      typeof payload.type !== 'string' ||
      typeof payload.status !== 'string'
    ) {
      throw new Error(
        'Invalid AccountingAccountClosed event payload: missing or invalid required fields.',
      );
    }

    const closedAtValue = payload.closedAt;

    if (typeof closedAtValue !== 'string' && !(closedAtValue instanceof Date)) {
      throw new Error(
        'Invalid AccountingAccountClosed event payload: closedAt must be a valid date.',
      );
    }

    const closedAt = new Date(closedAtValue);

    if (Number.isNaN(closedAt.getTime())) {
      throw new Error(
        'Invalid AccountingAccountClosed event payload: closedAt is not a valid date.',
      );
    }

    return new AccountingAccountClosedEvent(
      metadata.aggregateId,
      payload.publicId,
      payload.code,
      payload.type,
      payload.status,
      closedAt,
      metadata.correlationId ?? '',
      metadata.causationId,
      1,
      metadata.eventSchemaVersion ?? '1.0.0',
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
      code: this.code,
      type: this.type,
      status: this.status,
      closedAt: this.closedAt.toISOString(),
    };
  }
}

export default AccountingAccountClosedEvent;
