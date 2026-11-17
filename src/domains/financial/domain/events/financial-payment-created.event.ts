// -----------------------------------------------------------------------------
// Financial Payment — Created Event
// -----------------------------------------------------------------------------
//
// Domain event raised when a Financial Payment aggregate is created.
//
// The event carries the payment channel so downstream subscribers can
// distinguish STK Push from customer-initiated C2B payments.
//
// Channel requirements:
//
// STK_PUSH:
// - Requires a selected Financial Payment Method.
//
// C2B:
// - Must not contain a saved Financial Payment Method.
//
// Backward compatibility:
// - Historical events without a channel default to STK_PUSH.
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
  // ===========================================================================
  // Constructor
  // ===========================================================================

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

  // ===========================================================================
  // Properties
  // ===========================================================================

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

    // -------------------------------------------------------------------------
    // 1. Validate required payload fields
    // -------------------------------------------------------------------------

    if (
      typeof publicId !== 'string' ||
      typeof accountId !== 'string' ||
      typeof amount !== 'number' ||
      !Number.isSafeInteger(amount) ||
      typeof currency !== 'string' ||
      typeof status !== 'string'
    ) {
      throw new Error('Invalid payload for FinancialPaymentCreated event');
    }

    // -------------------------------------------------------------------------
    // 2. Validate optional payload fields
    // -------------------------------------------------------------------------

    if (
      (channel !== undefined &&
        channel !== null &&
        typeof channel !== 'string') ||
      (methodId !== undefined &&
        methodId !== null &&
        typeof methodId !== 'string') ||
      (referenceType !== undefined &&
        referenceType !== null &&
        typeof referenceType !== 'string') ||
      (referencePublicId !== undefined &&
        referencePublicId !== null &&
        typeof referencePublicId !== 'string')
    ) {
      throw new Error(
        'Invalid optional fields in FinancialPaymentCreated event',
      );
    }

    // -------------------------------------------------------------------------
    // 3. Normalize optional fields
    // -------------------------------------------------------------------------

    const normalizedMethodId = methodId == null ? undefined : methodId;

    const normalizedReferenceType =
      referenceType == null ? undefined : referenceType;

    const normalizedReferencePublicId =
      referencePublicId == null ? undefined : referencePublicId;

    // -------------------------------------------------------------------------
    // 4. Validate business-reference completeness
    // -------------------------------------------------------------------------

    if (
      (normalizedReferenceType === undefined) !==
      (normalizedReferencePublicId === undefined)
    ) {
      throw new Error(
        'FinancialPaymentCreated reference type and public ID must both be present or absent',
      );
    }

    // -------------------------------------------------------------------------
    // 5. Restore payment channel
    // -------------------------------------------------------------------------

    // Historical events created before channel support used STK Push.
    const paymentChannel =
      channel == null
        ? FinancialPaymentChannelValue.create('STK_PUSH')
        : FinancialPaymentChannelValue.create(channel);

    // -------------------------------------------------------------------------
    // 6. Validate channel-specific payment method requirements
    // -------------------------------------------------------------------------

    if (paymentChannel.isStkPush() && normalizedMethodId === undefined) {
      throw new Error(
        'STK Push FinancialPaymentCreated event requires a payment method',
      );
    }

    if (paymentChannel.isC2B() && normalizedMethodId !== undefined) {
      throw new Error(
        'C2B FinancialPaymentCreated event must not contain a payment method',
      );
    }

    // -------------------------------------------------------------------------
    // 7. Reconstruct event
    // -------------------------------------------------------------------------

    return new FinancialPaymentCreatedEvent(
      metadata.aggregateId,

      new PublicEntityIdValue(publicId),

      new PublicEntityIdValue(accountId),

      MoneyValue.fromCode(amount, currency),

      paymentChannel,

      FinancialPaymentStatusValue.create(status),

      normalizedMethodId !== undefined
        ? new FinancialPaymentMethodPublicIdValue(normalizedMethodId)
        : undefined,

      normalizedReferenceType !== undefined
        ? FinancialReferenceTypeValue.create(normalizedReferenceType)
        : undefined,

      normalizedReferencePublicId !== undefined
        ? FinancialReferencePublicIdValue.create(normalizedReferencePublicId)
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
