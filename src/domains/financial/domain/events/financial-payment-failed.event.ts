import type { EventMetadata } from '../../../../foundation/kernel/domain/domain-event';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import { PublicEntityId as PublicEntityIdValue } from '../../../../foundation/kernel/domain/public-entity-id';

import { FinancialDomainEvent } from './financial-domain.event';

import type { FinancialPaymentStatus } from '../value-objects/financial-payment-status.vo';
import { FinancialPaymentStatus as FinancialPaymentStatusValue } from '../value-objects/financial-payment-status.vo';

import type { Money } from '../value-objects/money.vo';
import { Money as MoneyValue } from '../value-objects/money.vo';

export class FinancialPaymentFailedEvent extends FinancialDomainEvent {
  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    amount: Money,
    status: FinancialPaymentStatus,
    attemptPublicId: PublicEntityId | undefined,
    failureCode: string | undefined,
    failureMessage: string | undefined,
    failedAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
    restoredMetadata?: EventMetadata,
  ) {
    super(
      aggregateId,
      'FinancialPayment',
      'FinancialPaymentFailed',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
      restoredMetadata,
    );

    this.publicId = publicId;
    this.amount = amount;
    this.status = status;
    this.attemptPublicId = attemptPublicId;
    this.failureCode = failureCode;
    this.failureMessage = failureMessage;
    this.failedAt = failedAt;
  }

  public readonly publicId: PublicEntityId;
  public readonly amount: Money;
  public readonly status: FinancialPaymentStatus;
  public readonly attemptPublicId: PublicEntityId | undefined;
  public readonly failureCode: string | undefined;
  public readonly failureMessage: string | undefined;
  public readonly failedAt: Date;

  public static rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): FinancialPaymentFailedEvent {
    const {
      publicId,
      amount,
      status,
      attemptPublicId,
      failureCode,
      failureMessage,
      failedAt,
    } = payload;

    if (
      typeof publicId !== 'string' ||
      typeof amount !== 'object' ||
      amount === null ||
      typeof status !== 'string' ||
      (attemptPublicId !== undefined && typeof attemptPublicId !== 'string') ||
      (failureCode !== undefined && typeof failureCode !== 'string') ||
      (failureMessage !== undefined && typeof failureMessage !== 'string') ||
      typeof failedAt !== 'string'
    ) {
      throw new Error('Invalid payload for FinancialPaymentFailed event');
    }

    const amountPayload = amount as Record<string, unknown>;

    if (
      typeof amountPayload.amount !== 'number' ||
      typeof amountPayload.currency !== 'string'
    ) {
      throw new Error('Invalid amount in FinancialPaymentFailed payload');
    }

    const parsedFailedAt = new Date(failedAt);

    if (Number.isNaN(parsedFailedAt.getTime())) {
      throw new Error('Invalid failedAt in FinancialPaymentFailed payload');
    }

    return new FinancialPaymentFailedEvent(
      metadata.aggregateId,
      new PublicEntityIdValue(publicId),
      MoneyValue.fromCode(amountPayload.amount, amountPayload.currency),
      FinancialPaymentStatusValue.create(status),
      typeof attemptPublicId === 'string'
        ? new PublicEntityIdValue(attemptPublicId)
        : undefined,
      typeof failureCode === 'string' ? failureCode : undefined,
      typeof failureMessage === 'string' ? failureMessage : undefined,
      parsedFailedAt,
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
      attemptPublicId: this.attemptPublicId?.toString(),
      failureCode: this.failureCode,
      failureMessage: this.failureMessage,
      failedAt: this.failedAt.toISOString(),
    };
  }
}
