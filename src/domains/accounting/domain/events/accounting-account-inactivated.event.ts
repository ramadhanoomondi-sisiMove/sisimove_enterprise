import { AccountingDomainEvent } from './accounting-domain.event';
import type { EventMetadata } from '../../../../foundation/kernel/domain/domain-event';

/**
 * Raised when an Accounting Account aggregate is inactivated.
 */
export class AccountingAccountInactivatedEvent extends AccountingDomainEvent {
  public constructor(
    accountId: string,
    public readonly publicId: string,
    public readonly code: string,
    public readonly type: string,
    public readonly status: string,
    public readonly inactivatedAt: Date,
    correlationId?: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
    restoredMetadata?: EventMetadata,
  ) {
    super(
      accountId,
      'AccountingAccount',
      'AccountingAccountInactivated',
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
  ): AccountingAccountInactivatedEvent {
    if (
      typeof payload.publicId !== 'string' ||
      typeof payload.code !== 'string' ||
      typeof payload.type !== 'string' ||
      typeof payload.status !== 'string'
    ) {
      throw new Error(
        'Invalid AccountingAccountInactivated event payload: missing or invalid required fields.',
      );
    }

    const inactivatedAtValue = payload.inactivatedAt;

    if (
      typeof inactivatedAtValue !== 'string' &&
      !(inactivatedAtValue instanceof Date)
    ) {
      throw new Error(
        'Invalid AccountingAccountInactivated event payload: inactivatedAt must be a valid date.',
      );
    }

    const inactivatedAt = new Date(inactivatedAtValue);

    if (Number.isNaN(inactivatedAt.getTime())) {
      throw new Error(
        'Invalid AccountingAccountInactivated event payload: inactivatedAt is not a valid date.',
      );
    }

    return new AccountingAccountInactivatedEvent(
      metadata.aggregateId,
      payload.publicId,
      payload.code,
      payload.type,
      payload.status,
      inactivatedAt,
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
      code: this.code,
      type: this.type,
      status: this.status,
      inactivatedAt: this.inactivatedAt.toISOString(),
    };
  }
}

export default AccountingAccountInactivatedEvent;
