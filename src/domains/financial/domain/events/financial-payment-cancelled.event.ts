import type { EventMetadata } from '../../../../foundation/kernel/domain/domain-event';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import { PublicEntityId as PublicEntityIdValue } from '../../../../foundation/kernel/domain/public-entity-id';

import { FinancialDomainEvent } from './financial-domain.event';

import type { FinancialPaymentStatus } from '../value-objects/financial-payment-status.vo';
import { FinancialPaymentStatus as FinancialPaymentStatusValue } from '../value-objects/financial-payment-status.vo';

import type { Money } from '../value-objects/money.vo';
import { Money as MoneyValue } from '../value-objects/money.vo';

export class FinancialPaymentCancelledEvent extends FinancialDomainEvent {
  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    amount: Money,
    status: FinancialPaymentStatus,
    cancelledAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
    restoredMetadata?: EventMetadata,
  ) {
    super(
      aggregateId,
      'FinancialPayment',
      'FinancialPaymentCancelled',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
      restoredMetadata,
    );

    this.publicId = publicId;
    this.amount = amount;
    this.status = status;
    this.cancelledAt = cancelledAt;
  }

  public readonly publicId: PublicEntityId;
  public readonly amount: Money;
  public readonly status: FinancialPaymentStatus;
  public readonly cancelledAt: Date;

  public static rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): FinancialPaymentCancelledEvent {
    const { publicId, amount, status, cancelledAt } = payload;

    if (
      typeof publicId !== 'string' ||
      typeof amount !== 'object' ||
      amount === null ||
      typeof status !== 'string' ||
      typeof cancelledAt !== 'string'
    ) {
      throw new Error('Invalid payload for FinancialPaymentCancelled event');
    }

    const amountPayload = amount as Record<string, unknown>;

    if (
      typeof amountPayload.amount !== 'number' ||
      typeof amountPayload.currency !== 'string'
    ) {
      throw new Error('Invalid amount in FinancialPaymentCancelled payload');
    }

    const parsedCancelledAt = new Date(cancelledAt);

    if (Number.isNaN(parsedCancelledAt.getTime())) {
      throw new Error(
        'Invalid cancelledAt in FinancialPaymentCancelled payload',
      );
    }

    return new FinancialPaymentCancelledEvent(
      metadata.aggregateId,
      new PublicEntityIdValue(publicId),
      MoneyValue.fromCode(amountPayload.amount, amountPayload.currency),
      FinancialPaymentStatusValue.create(status),
      parsedCancelledAt,
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
      cancelledAt: this.cancelledAt.toISOString(),
    };
  }
}
