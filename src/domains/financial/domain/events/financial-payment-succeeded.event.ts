// -----------------------------------------------------------------------------
// Financial Payment Succeeded Domain Event
// -----------------------------------------------------------------------------

import type { EventMetadata } from '../../../../foundation/kernel/domain/domain-event';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import { PublicEntityId as PublicEntityIdValue } from '../../../../foundation/kernel/domain/public-entity-id';

import { FinancialDomainEvent } from './financial-domain.event';

import type { FinancialPaymentStatus } from '../value-objects/financial-payment-status.vo';
import { FinancialPaymentStatus as FinancialPaymentStatusValue } from '../value-objects/financial-payment-status.vo';

import type { Money } from '../value-objects/money.vo';
import { Money as MoneyValue } from '../value-objects/money.vo';

import type { FinancialPaymentMethodPublicId } from '../value-objects/financial-payment-method-public-id.vo';
import { FinancialPaymentMethodPublicId as FinancialPaymentMethodPublicIdValue } from '../value-objects/financial-payment-method-public-id.vo';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

export class FinancialPaymentSucceededEvent extends FinancialDomainEvent {
  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    amount: Money,
    status: FinancialPaymentStatus,
    methodId: FinancialPaymentMethodPublicId | undefined,
    attemptPublicId: PublicEntityId,
    transactionPublicId: string | undefined,
    completedAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
    restoredMetadata?: EventMetadata,
  ) {
    super(
      aggregateId,
      'FinancialPayment',
      'FinancialPaymentSucceeded',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
      restoredMetadata,
    );

    this.publicId = publicId;
    this.amount = amount;
    this.status = status;
    this.methodId = methodId;
    this.attemptPublicId = attemptPublicId;
    this.transactionPublicId = transactionPublicId;
    this.completedAt = completedAt;
  }

  public readonly publicId: PublicEntityId;
  public readonly amount: Money;
  public readonly status: FinancialPaymentStatus;
  public readonly methodId: FinancialPaymentMethodPublicId | undefined;
  public readonly attemptPublicId: PublicEntityId;
  public readonly transactionPublicId: string | undefined;
  public readonly completedAt: Date;

  public static rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): FinancialPaymentSucceededEvent {
    const publicId = payload.publicId;
    const amount = payload.amount;
    const status = payload.status;
    const methodId = payload.methodId;
    const attemptPublicId = payload.attemptPublicId;
    const transactionPublicId = payload.transactionPublicId;
    const completedAt = payload.completedAt;

    if (
      typeof publicId !== 'string' ||
      typeof amount !== 'object' ||
      amount === null ||
      typeof status !== 'string' ||
      (methodId !== undefined && typeof methodId !== 'string') ||
      typeof attemptPublicId !== 'string' ||
      (transactionPublicId !== undefined &&
        typeof transactionPublicId !== 'string') ||
      typeof completedAt !== 'string'
    ) {
      throw new Error('Invalid payload for FinancialPaymentSucceeded event');
    }

    const amountPayload = amount as Record<string, unknown>;

    if (
      typeof amountPayload.amount !== 'number' ||
      typeof amountPayload.currency !== 'string'
    ) {
      throw new Error('Invalid amount in FinancialPaymentSucceeded payload');
    }

    const parsedCompletedAt = new Date(completedAt);

    if (Number.isNaN(parsedCompletedAt.getTime())) {
      throw new Error(
        'Invalid completedAt in FinancialPaymentSucceeded payload',
      );
    }

    return new FinancialPaymentSucceededEvent(
      metadata.aggregateId,
      new PublicEntityIdValue(publicId),
      MoneyValue.fromCode(amountPayload.amount, amountPayload.currency),
      FinancialPaymentStatusValue.create(status),
      typeof methodId === 'string'
        ? new FinancialPaymentMethodPublicIdValue(methodId)
        : undefined,
      new PublicEntityIdValue(attemptPublicId),
      typeof transactionPublicId === 'string' ? transactionPublicId : undefined,
      parsedCompletedAt,
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
      methodId: this.methodId?.toString(),
      attemptPublicId: this.attemptPublicId.toString(),
      transactionPublicId: this.transactionPublicId,
      completedAt: this.completedAt.toISOString(),
    };
  }
}
