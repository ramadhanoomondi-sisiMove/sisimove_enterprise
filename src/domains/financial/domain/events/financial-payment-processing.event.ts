import type { EventMetadata } from '../../../../foundation/kernel/domain/domain-event';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import { PublicEntityId as PublicEntityIdValue } from '../../../../foundation/kernel/domain/public-entity-id';

import { FinancialDomainEvent } from './financial-domain.event';
import type { FinancialPaymentStatus, Money } from '../value-objects';

import { FinancialPaymentStatus as FinancialPaymentStatusValue } from '../value-objects';
import { Money as MoneyValue } from '../value-objects';

export class FinancialPaymentProcessingEvent extends FinancialDomainEvent {
  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    accountId: PublicEntityId,
    amount: Money,
    status: FinancialPaymentStatus,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
    restoredMetadata?: EventMetadata,
  ) {
    super(
      aggregateId,
      'FinancialPayment',
      'FinancialPaymentProcessing',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
      restoredMetadata,
    );

    this.publicId = publicId;
    this.accountId = accountId;
    this.amount = amount;
    this.status = status;
  }

  public readonly publicId: PublicEntityId;
  public readonly accountId: PublicEntityId;
  public readonly amount: Money;
  public readonly status: FinancialPaymentStatus;

  public static rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): FinancialPaymentProcessingEvent {
    const publicId = payload.publicId;
    const accountId = payload.accountId;
    const amount = payload.amount;
    const currency = payload.currency;
    const status = payload.status;

    if (
      typeof publicId !== 'string' ||
      typeof accountId !== 'string' ||
      typeof amount !== 'number' ||
      typeof currency !== 'string' ||
      typeof status !== 'string'
    ) {
      throw new Error('Invalid payload for FinancialPaymentProcessing event');
    }

    return new FinancialPaymentProcessingEvent(
      metadata.aggregateId,
      new PublicEntityIdValue(publicId),
      new PublicEntityIdValue(accountId),
      MoneyValue.fromCode(amount, currency),
      FinancialPaymentStatusValue.create(status),
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
      accountId: this.accountId.toString(),
      amount: this.amount.amount,
      currency: this.amount.currency.toString(),
      status: this.status.toString(),
    };
  }
}
