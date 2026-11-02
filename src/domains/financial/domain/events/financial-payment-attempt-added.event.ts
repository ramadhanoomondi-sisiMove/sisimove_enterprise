import type { EventMetadata } from '../../../../foundation/kernel/domain/domain-event';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import { PublicEntityId as PublicEntityIdValue } from '../../../../foundation/kernel/domain/public-entity-id';

import { FinancialDomainEvent } from './financial-domain.event';

import type { FinancialPaymentAttemptStatus } from '../value-objects/financial-payment-attempt-status.vo';
import { FinancialPaymentAttemptStatus as FinancialPaymentAttemptStatusValue } from '../value-objects/financial-payment-attempt-status.vo';

import type { FinancialProvider } from '../value-objects/financial-provider.vo';
import { FinancialProvider as FinancialProviderValue } from '../value-objects/financial-provider.vo';

import type { Money } from '../value-objects/money.vo';
import { Money as MoneyValue } from '../value-objects/money.vo';

export class FinancialPaymentAttemptAddedEvent extends FinancialDomainEvent {
  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    attemptPublicId: PublicEntityId,
    status: FinancialPaymentAttemptStatus,
    provider: FinancialProvider,
    amount: Money,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
    restoredMetadata?: EventMetadata,
  ) {
    super(
      aggregateId,
      'FinancialPayment',
      'FinancialPaymentAttemptAdded',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
      restoredMetadata,
    );

    this.publicId = publicId;
    this.attemptPublicId = attemptPublicId;
    this.status = status;
    this.provider = provider;
    this.amount = amount;
  }

  public readonly publicId: PublicEntityId;
  public readonly attemptPublicId: PublicEntityId;
  public readonly status: FinancialPaymentAttemptStatus;
  public readonly provider: FinancialProvider;
  public readonly amount: Money;

  public static rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): FinancialPaymentAttemptAddedEvent {
    const { publicId, attemptPublicId, status, provider, amount } = payload;

    if (
      typeof publicId !== 'string' ||
      typeof attemptPublicId !== 'string' ||
      typeof status !== 'string' ||
      typeof provider !== 'string' ||
      typeof amount !== 'object' ||
      amount === null
    ) {
      throw new Error('Invalid payload for FinancialPaymentAttemptAdded event');
    }

    const amountPayload = amount as Record<string, unknown>;

    if (
      typeof amountPayload.amount !== 'number' ||
      typeof amountPayload.currency !== 'string'
    ) {
      throw new Error('Invalid amount in FinancialPaymentAttemptAdded payload');
    }

    return new FinancialPaymentAttemptAddedEvent(
      metadata.aggregateId,
      new PublicEntityIdValue(publicId),
      new PublicEntityIdValue(attemptPublicId),
      FinancialPaymentAttemptStatusValue.create(status),
      FinancialProviderValue.create(provider),
      MoneyValue.fromCode(amountPayload.amount, amountPayload.currency),
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
      attemptPublicId: this.attemptPublicId.toString(),
      status: this.status.toString(),
      provider: this.provider.toString(),
      amount: {
        amount: this.amount.amount,
        currency: this.amount.currency.toString(),
      },
    };
  }
}
