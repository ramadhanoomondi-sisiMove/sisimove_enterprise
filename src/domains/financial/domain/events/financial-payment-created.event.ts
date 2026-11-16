// -----------------------------------------------------------------------------
// Financial Payment — Created Event
// -----------------------------------------------------------------------------
//
// Domain event raised when a Financial Payment aggregate is created.
//
// The event carries the payment channel so downstream subscribers can
// distinguish STK Push from customer-initiated C2B payments.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { EventMetadata } from '../../../../foundation/kernel/domain/domain-event';

import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

import { PublicEntityId as PublicEntityIdValue } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Financial Domain Event
// -----------------------------------------------------------------------------

import { FinancialDomainEvent } from './financial-domain.event';

// -----------------------------------------------------------------------------
// Domain Value Objects — Types
// -----------------------------------------------------------------------------

import type {
  FinancialPaymentChannel,
  FinancialPaymentMethodPublicId,
  FinancialPaymentStatus,
  FinancialReferencePublicId,
  FinancialReferenceType,
  Money,
} from '../value-objects';

// -----------------------------------------------------------------------------
// Domain Value Objects — Runtime Values
// -----------------------------------------------------------------------------

import {
  FinancialPaymentChannel as FinancialPaymentChannelValue,
  FinancialPaymentMethodPublicId as FinancialPaymentMethodPublicIdValue,
  FinancialPaymentStatus as FinancialPaymentStatusValue,
  FinancialReferencePublicId as FinancialReferencePublicIdValue,
  FinancialReferenceType as FinancialReferenceTypeValue,
  Money as MoneyValue,
} from '../value-objects';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

export class FinancialPaymentCreatedEvent extends FinancialDomainEvent {
  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    accountId: PublicEntityId,
    amount: Money,
    channel: FinancialPaymentChannel,
    status: FinancialPaymentStatus,
    methodId: FinancialPaymentMethodPublicId | undefined,
    referenceType: FinancialReferenceType | undefined,
    referencePublicId: FinancialReferencePublicId | undefined,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.1.0',
    restoredMetadata?: EventMetadata,
  ) {
    super(
      aggregateId,
      'FinancialPayment',
      'FinancialPaymentCreated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
      restoredMetadata,
    );

    this.publicId = publicId;
    this.accountId = accountId;
    this.amount = amount;
    this.channel = channel;
    this.status = status;
    this.methodId = methodId;
    this.referenceType = referenceType;
    this.referencePublicId = referencePublicId;
  }

  public readonly publicId: PublicEntityId;
  public readonly accountId: PublicEntityId;
  public readonly amount: Money;
  public readonly channel: FinancialPaymentChannel;
  public readonly status: FinancialPaymentStatus;
  public readonly methodId: FinancialPaymentMethodPublicId | undefined;
  public readonly referenceType: FinancialReferenceType | undefined;
  public readonly referencePublicId: FinancialReferencePublicId | undefined;

  // ===========================================================================
  // Rehydrate
  // ===========================================================================

  public static rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): FinancialPaymentCreatedEvent {
    const {
      publicId,
      accountId,
      amount,
      currency,
      channel,
      status,
      methodId,
      referenceType,
      referencePublicId,
    } = payload;

    if (
      typeof publicId !== 'string' ||
      typeof accountId !== 'string' ||
      typeof amount !== 'number' ||
      typeof currency !== 'string' ||
      (channel !== undefined && typeof channel !== 'string') ||
      typeof status !== 'string' ||
      (methodId !== undefined && typeof methodId !== 'string') ||
      (referenceType !== undefined && typeof referenceType !== 'string') ||
      (referencePublicId !== undefined && typeof referencePublicId !== 'string')
    ) {
      throw new Error('Invalid payload for FinancialPaymentCreated event');
    }

    if ((referenceType === undefined) !== (referencePublicId === undefined)) {
      throw new Error(
        'FinancialPaymentCreated reference type and public ID must both be present or absent',
      );
    }

    // Older persisted events were created before payment channels existed.
    // Those payments used the original STK Push workflow.
    const paymentChannel =
      typeof channel === 'string'
        ? FinancialPaymentChannelValue.create(channel)
        : FinancialPaymentChannelValue.create('STK_PUSH');

    return new FinancialPaymentCreatedEvent(
      metadata.aggregateId,
      new PublicEntityIdValue(publicId),
      new PublicEntityIdValue(accountId),
      MoneyValue.fromCode(amount, currency),
      paymentChannel,
      FinancialPaymentStatusValue.create(status),
      typeof methodId === 'string'
        ? new FinancialPaymentMethodPublicIdValue(methodId)
        : undefined,
      typeof referenceType === 'string'
        ? FinancialReferenceTypeValue.create(referenceType)
        : undefined,
      typeof referencePublicId === 'string'
        ? FinancialReferencePublicIdValue.create(referencePublicId)
        : undefined,
      metadata.correlationId ?? '',
      metadata.causationId,
      metadata.eventVersion,
      metadata.eventSchemaVersion,
      metadata,
    );
  }

  // ===========================================================================
  // Payload
  // ===========================================================================

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      publicId: this.publicId.toString(),
      accountId: this.accountId.toString(),
      amount: this.amount.amount,
      currency: this.amount.currency.toString(),
      channel: this.channel.toString(),
      status: this.status.toString(),
      methodId: this.methodId?.toString(),
      referenceType: this.referenceType?.toString(),
      referencePublicId: this.referencePublicId?.toString(),
    };
  }
}
