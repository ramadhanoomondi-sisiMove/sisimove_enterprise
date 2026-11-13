import { AccountingDomainEvent } from './accounting-domain.event';
import type { EventMetadata } from '../../../../foundation/kernel/domain/domain-event';

/**
 * Raised when an Accounting Account aggregate is created.
 *
 * The aggregate's internal identity is carried by
 * DomainEvent.metadata.aggregateId.
 *
 * The event payload exposes only stable account-level data intended for
 * downstream consumers.
 */
export class AccountingAccountCreatedEvent extends AccountingDomainEvent {
  public constructor(
    accountId: string,
    public readonly publicId: string,
    public readonly code: string,
    public readonly name: string,
    public readonly type: string,
    public readonly status: string,
    public readonly createdAt: Date,
    correlationId?: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
    restoredMetadata?: EventMetadata,
  ) {
    super(
      accountId,
      'AccountingAccount',
      'AccountingAccountCreated',
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
  ): AccountingAccountCreatedEvent {
    if (
      typeof payload.publicId !== 'string' ||
      typeof payload.code !== 'string' ||
      typeof payload.name !== 'string' ||
      typeof payload.type !== 'string' ||
      typeof payload.status !== 'string'
    ) {
      throw new Error(
        'Invalid AccountingAccountCreated event payload: missing or invalid required fields.',
      );
    }

    const createdAtValue = payload.createdAt;

    if (
      typeof createdAtValue !== 'string' &&
      !(createdAtValue instanceof Date)
    ) {
      throw new Error(
        'Invalid AccountingAccountCreated event payload: createdAt must be a valid date.',
      );
    }

    const createdAt = new Date(createdAtValue);

    if (Number.isNaN(createdAt.getTime())) {
      throw new Error(
        'Invalid AccountingAccountCreated event payload: createdAt is not a valid date.',
      );
    }

    return new AccountingAccountCreatedEvent(
      metadata.aggregateId,
      payload.publicId,
      payload.code,
      payload.name,
      payload.type,
      payload.status,
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
   *
   * The internal Accounting Account identity remains in
   * DomainEvent.metadata.aggregateId.
   */
  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      publicId: this.publicId,
      code: this.code,
      name: this.name,
      type: this.type,
      status: this.status,
      createdAt: this.createdAt.toISOString(),
    };
  }
}

export default AccountingAccountCreatedEvent;
