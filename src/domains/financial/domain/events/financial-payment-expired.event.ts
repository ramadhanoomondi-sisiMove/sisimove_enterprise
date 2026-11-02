import type { EventMetadata } from '../../../../foundation/kernel/domain/domain-event';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import { PublicEntityId as PublicEntityIdValue } from '../../../../foundation/kernel/domain/public-entity-id';

import { FinancialDomainEvent } from './financial-domain.event';

import type { FinancialPaymentStatus } from '../value-objects/financial-payment-status.vo';
import { FinancialPaymentStatus as FinancialPaymentStatusValue } from '../value-objects/financial-payment-status.vo';

import type { Money } from '../value-objects/money.vo';
import { Money as MoneyValue } from '../value-objects/money.vo';

export class FinancialPaymentExpiredEvent extends FinancialDomainEvent {
  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    amount: Money,
    status: FinancialPaymentStatus,
    expiredAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
    restoredMetadata?: EventMetadata,
  ) {
    super(
      aggregateId,
      'FinancialPayment',
      'FinancialPaymentExpired',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
      restoredMetadata,
    );

    this.publicId = publicId;
    this.amount = amount;
    this.status = status;
    this.expiredAt = expiredAt;
  }

  public readonly publicId: PublicEntityId;
  public readonly amount: Money;
  public readonly status: FinancialPaymentStatus;
  public readonly expiredAt: Date;

  public static rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): FinancialPaymentExpiredEvent {
    const { publicId, amount, status, expiredAt } = payload;

    if (
      typeof publicId !== 'string' ||
      typeof amount !== 'object' ||
      amount === null ||
      typeof status !== 'string' ||
      typeof expiredAt !== 'string'
    ) {
      throw new Error('Invalid payload for FinancialPaymentExpired event');
    }

    const amountPayload = amount as Record<string, unknown>;

    if (
      typeof amountPayload.amount !== 'number' ||
      typeof amountPayload.currency !== 'string'
    ) {
      throw new Error('Invalid amount in FinancialPaymentExpired payload');
    }

    const parsedExpiredAt = new Date(expiredAt);

    if (Number.isNaN(parsedExpiredAt.getTime())) {
      throw new Error('Invalid expiredAt in FinancialPaymentExpired payload');
    }

    return new FinancialPaymentExpiredEvent(
      metadata.aggregateId,
      new PublicEntityIdValue(publicId),
      MoneyValue.fromCode(amountPayload.amount, amountPayload.currency),
      FinancialPaymentStatusValue.create(status),
      parsedExpiredAt,
      metadata.correlationId ?? '',
      metadata.causationId,
      metadata.eventVersion,
      metadata.eventSchemaVersion,
      metadata,
    );
  }

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      publicId: this.publicId.toString(),
      amount: {
        amount: this.amount.amount,
        currency: this.amount.currency.toString(),
      },
      status: this.status.toString(),
      expiredAt: this.expiredAt.toISOString(),
    };
  }
}
