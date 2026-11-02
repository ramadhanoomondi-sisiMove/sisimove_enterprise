import type { EventMetadata } from '../../../../foundation/kernel/domain/domain-event';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import { PublicEntityId as PublicEntityIdValue } from '../../../../foundation/kernel/domain/public-entity-id';

import { FinancialDomainEvent } from './financial-domain.event';

import type { FinancialPaymentStatus } from '../value-objects/financial-payment-status.vo';
import { FinancialPaymentStatus as FinancialPaymentStatusValue } from '../value-objects/financial-payment-status.vo';

export class FinancialPaymentTransactionLinkedEvent extends FinancialDomainEvent {
  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    transactionPublicId: string,
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
      'FinancialPaymentTransactionLinked',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
      restoredMetadata,
    );

    const normalizedTransactionPublicId = transactionPublicId.trim();

    if (!normalizedTransactionPublicId) {
      throw new Error(
        'Financial Payment transaction public ID must not be empty',
      );
    }

    this.publicId = publicId;
    this.transactionPublicId = normalizedTransactionPublicId;
    this.status = status;
  }

  public readonly publicId: PublicEntityId;
  public readonly transactionPublicId: string;
  public readonly status: FinancialPaymentStatus;

  public static rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): FinancialPaymentTransactionLinkedEvent {
    const { publicId, transactionPublicId, status } = payload;

    if (
      typeof publicId !== 'string' ||
      typeof transactionPublicId !== 'string' ||
      typeof status !== 'string'
    ) {
      throw new Error(
        'Invalid payload for FinancialPaymentTransactionLinked event',
      );
    }

    return new FinancialPaymentTransactionLinkedEvent(
      metadata.aggregateId,
      new PublicEntityIdValue(publicId),
      transactionPublicId,
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
      transactionPublicId: this.transactionPublicId,
      status: this.status.toString(),
    };
  }
}
