import type { EventMetadata } from '../../../../foundation/kernel/domain/domain-event';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import { PublicEntityId as PublicEntityIdValue } from '../../../../foundation/kernel/domain/public-entity-id';

import { FinancialDomainEvent } from './financial-domain.event';

import type {
  FinancialDisbursementStatus,
  FinancialReferencePublicId,
  FinancialReferenceType,
  Money,
} from '../value-objects';

import {
  FinancialDisbursementStatus as FinancialDisbursementStatusValueObject,
  FinancialDisbursementStatusValue,
  FinancialReferencePublicId as FinancialReferencePublicIdValue,
  FinancialReferenceType as FinancialReferenceTypeValue,
  Money as MoneyValue,
} from '../value-objects';

// =============================================================================
// Event
// =============================================================================

export class FinancialDisbursementCompletedEvent extends FinancialDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    sourceAccountId: PublicEntityId,
    destinationType: string,
    destinationValue: string,
    amount: Money,
    status: FinancialDisbursementStatus,
    transactionPublicId: FinancialReferencePublicId,
    referenceType: FinancialReferenceType | undefined,
    referencePublicId: FinancialReferencePublicId | undefined,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '2.0.0',
    restoredMetadata?: EventMetadata,
  ) {
    super(
      aggregateId,
      'FinancialDisbursement',
      'FinancialDisbursementCompleted',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
      restoredMetadata,
    );

    this.publicId = publicId;
    this.sourceAccountId = sourceAccountId;
    this.destinationType = destinationType;
    this.destinationValue = destinationValue;
    this.amount = amount;
    this.status = status;
    this.transactionPublicId = transactionPublicId;
    this.referenceType = referenceType;
    this.referencePublicId = referencePublicId;
  }

  // ===========================================================================
  // Properties
  // ===========================================================================

  public readonly publicId: PublicEntityId;

  public readonly sourceAccountId: PublicEntityId;

  public readonly destinationType: string;

  public readonly destinationValue: string;

  public readonly amount: Money;

  public readonly status: FinancialDisbursementStatus;

  public readonly transactionPublicId: FinancialReferencePublicId;

  public readonly referenceType: FinancialReferenceType | undefined;

  public readonly referencePublicId: FinancialReferencePublicId | undefined;

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  public static rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): FinancialDisbursementCompletedEvent {
    const publicId = payload.publicId;
    const sourceAccountId = payload.sourceAccountId;
    const destinationType = payload.destinationType;
    const destinationValue = payload.destinationValue;
    const amount = payload.amount;
    const currency = payload.currency;
    const status = payload.status;
    const transactionPublicId = payload.transactionPublicId;
    const referenceType = payload.referenceType;
    const referencePublicId = payload.referencePublicId;

    if (
      typeof publicId !== 'string' ||
      typeof sourceAccountId !== 'string' ||
      typeof destinationType !== 'string' ||
      destinationType.trim().length === 0 ||
      typeof destinationValue !== 'string' ||
      destinationValue.trim().length === 0 ||
      typeof amount !== 'number' ||
      !Number.isFinite(amount) ||
      typeof currency !== 'string' ||
      typeof status !== 'string' ||
      typeof transactionPublicId !== 'string'
    ) {
      throw new Error(
        'Invalid payload for FinancialDisbursementCompleted event',
      );
    }

    if (
      !Object.values(FinancialDisbursementStatusValue).includes(
        status as FinancialDisbursementStatusValue,
      )
    ) {
      throw new Error(
        'Invalid status for FinancialDisbursementCompleted event',
      );
    }

    if (referenceType !== undefined && typeof referenceType !== 'string') {
      throw new Error(
        'Invalid reference type for FinancialDisbursementCompleted event',
      );
    }

    if (
      referencePublicId !== undefined &&
      typeof referencePublicId !== 'string'
    ) {
      throw new Error(
        'Invalid reference public ID for FinancialDisbursementCompleted event',
      );
    }

    if ((referenceType === undefined) !== (referencePublicId === undefined)) {
      throw new Error(
        'Reference type and reference public ID must either both be present or both be absent',
      );
    }

    return new FinancialDisbursementCompletedEvent(
      metadata.aggregateId,

      new PublicEntityIdValue(publicId),

      new PublicEntityIdValue(sourceAccountId),

      destinationType,
      destinationValue,

      MoneyValue.fromCode(amount, currency),

      FinancialDisbursementStatusValueObject.create(
        status as FinancialDisbursementStatusValue,
      ),

      FinancialReferencePublicIdValue.create(transactionPublicId),

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

      publicId: this.publicId.toString(),

      sourceAccountId: this.sourceAccountId.toString(),

      destinationType: this.destinationType,
      destinationValue: this.destinationValue,

      amount: this.amount.amount,

      currency: this.amount.currency.toString(),

      status: this.status.toString(),

      transactionPublicId: this.transactionPublicId.toString(),

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
