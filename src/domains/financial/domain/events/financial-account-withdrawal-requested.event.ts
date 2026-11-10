import type { EventMetadata } from '../../../../foundation/kernel/domain/domain-event';

import { FinancialDomainEvent } from './financial-domain.event';

import type {
  FinancialAccountWithdrawalDestination,
  FinancialAccountWithdrawalPublicId,
  FinancialAccountPublicId,
  FinancialReferenceType,
  FinancialReferencePublicId,
  Money,
} from '../value-objects';

import {
  FinancialAccountWithdrawalDestination as FinancialAccountWithdrawalDestinationValue,
  FinancialAccountWithdrawalPublicId as FinancialAccountWithdrawalPublicIdValue,
  FinancialAccountPublicId as FinancialAccountPublicIdValue,
  FinancialReferenceType as FinancialReferenceTypeValue,
  FinancialReferencePublicId as FinancialReferencePublicIdValue,
  Money as MoneyValue,
} from '../value-objects';

// =============================================================================
// Event
// =============================================================================

export class FinancialAccountWithdrawalRequestedEvent extends FinancialDomainEvent {
  public constructor(
    aggregateId: string,
    withdrawalPublicId: FinancialAccountWithdrawalPublicId,
    accountPublicId: FinancialAccountPublicId,
    amount: Money,
    destination: FinancialAccountWithdrawalDestination,
    referenceType: FinancialReferenceType | undefined,
    referencePublicId: FinancialReferencePublicId | undefined,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
    restoredMetadata?: EventMetadata,
  ) {
    super(
      aggregateId,
      'FinancialAccountWithdrawal',
      'FinancialAccountWithdrawalRequested',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
      restoredMetadata,
    );

    this.withdrawalPublicId = withdrawalPublicId;
    this.accountPublicId = accountPublicId;
    this.amount = amount;
    this.destination = destination;
    this.referenceType = referenceType;
    this.referencePublicId = referencePublicId;
  }

  // ===========================================================================
  // Properties
  // ===========================================================================

  public readonly withdrawalPublicId: FinancialAccountWithdrawalPublicId;

  public readonly accountPublicId: FinancialAccountPublicId;

  public readonly amount: Money;

  public readonly destination: FinancialAccountWithdrawalDestination;

  public readonly referenceType: FinancialReferenceType | undefined;

  public readonly referencePublicId: FinancialReferencePublicId | undefined;

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  public static rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): FinancialAccountWithdrawalRequestedEvent {
    const withdrawalPublicId = payload.withdrawalPublicId;
    const accountPublicId = payload.accountPublicId;
    const amount = payload.amount;
    const currency = payload.currency;
    const destination = payload.destination;
    const referenceType = payload.referenceType;
    const referencePublicId = payload.referencePublicId;

    if (
      typeof withdrawalPublicId !== 'string' ||
      typeof accountPublicId !== 'string' ||
      typeof amount !== 'number' ||
      !Number.isFinite(amount) ||
      typeof currency !== 'string' ||
      typeof destination !== 'object' ||
      destination === null ||
      Array.isArray(destination)
    ) {
      throw new Error(
        'Invalid payload for FinancialAccountWithdrawalRequested event',
      );
    }

    const destinationPayload = destination as Record<string, unknown>;

    if (
      typeof destinationPayload.type !== 'string' ||
      typeof destinationPayload.value !== 'string'
    ) {
      throw new Error(
        'Invalid destination payload for FinancialAccountWithdrawalRequested event',
      );
    }

    if (referenceType !== undefined && typeof referenceType !== 'string') {
      throw new Error(
        'Invalid reference type for FinancialAccountWithdrawalRequested event',
      );
    }

    if (
      referencePublicId !== undefined &&
      typeof referencePublicId !== 'string'
    ) {
      throw new Error(
        'Invalid reference public ID for FinancialAccountWithdrawalRequested event',
      );
    }

    if ((referenceType === undefined) !== (referencePublicId === undefined)) {
      throw new Error(
        'Reference type and reference public ID must either both be present or both be absent',
      );
    }

    return new FinancialAccountWithdrawalRequestedEvent(
      metadata.aggregateId,

      new FinancialAccountWithdrawalPublicIdValue(withdrawalPublicId),

      new FinancialAccountPublicIdValue(accountPublicId),

      MoneyValue.fromCode(amount, currency),

      FinancialAccountWithdrawalDestinationValue.create(
        destinationPayload.type,
        destinationPayload.value,
      ),

      referenceType !== undefined
        ? FinancialReferenceTypeValue.create(referenceType)
        : undefined,

      referencePublicId !== undefined
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

      withdrawalPublicId: this.withdrawalPublicId.toString(),

      accountPublicId: this.accountPublicId.toString(),

      amount: this.amount.amount,

      currency: this.amount.currency.toString(),

      destination: {
        type: this.destination.type,
        value: this.destination.value,
      },

      referenceType:
        this.referenceType !== undefined
          ? this.referenceType.toString()
          : undefined,

      referencePublicId:
        this.referencePublicId !== undefined
          ? this.referencePublicId.toString()
          : undefined,
    };
  }
}
