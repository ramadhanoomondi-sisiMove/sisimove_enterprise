import type { EventMetadata } from '../../../../foundation/kernel/domain/domain-event';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import { PublicEntityId as PublicEntityIdValue } from '../../../../foundation/kernel/domain/public-entity-id';

import { FinancialDomainEvent } from './financial-domain.event';

import type { Money } from '../value-objects';
import { Money as MoneyValue } from '../value-objects';

// =============================================================================
// Event
// =============================================================================

export class FinancialDisbursementAttemptSucceededEvent extends FinancialDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    aggregateId: string,
    disbursementPublicId: PublicEntityId,
    attemptPublicId: PublicEntityId,
    providerTransactionId: string,
    amount: Money,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '2.0.0',
    restoredMetadata?: EventMetadata,
  ) {
    super(
      aggregateId,
      'FinancialDisbursement',
      'FinancialDisbursementAttemptSucceeded',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
      restoredMetadata,
    );

    if (providerTransactionId.trim().length === 0) {
      throw new Error(
        'Provider transaction ID is required for a successful disbursement attempt',
      );
    }

    this.disbursementPublicId = disbursementPublicId;
    this.attemptPublicId = attemptPublicId;
    this.providerTransactionId = providerTransactionId;
    this.amount = amount;
  }

  // ===========================================================================
  // Properties
  // ===========================================================================

  public readonly disbursementPublicId: PublicEntityId;

  public readonly attemptPublicId: PublicEntityId;

  public readonly providerTransactionId: string;

  public readonly amount: Money;

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  public static rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): FinancialDisbursementAttemptSucceededEvent {
    const disbursementPublicId = payload.disbursementPublicId;
    const attemptPublicId = payload.attemptPublicId;
    const providerTransactionId = payload.providerTransactionId;
    const amount = payload.amount;
    const currency = payload.currency;

    if (
      typeof disbursementPublicId !== 'string' ||
      disbursementPublicId.trim().length === 0 ||
      typeof attemptPublicId !== 'string' ||
      attemptPublicId.trim().length === 0 ||
      typeof providerTransactionId !== 'string' ||
      providerTransactionId.trim().length === 0 ||
      typeof amount !== 'number' ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      typeof currency !== 'string' ||
      currency.trim().length === 0
    ) {
      throw new Error(
        'Invalid payload for FinancialDisbursementAttemptSucceeded event',
      );
    }

    return new FinancialDisbursementAttemptSucceededEvent(
      metadata.aggregateId,
      new PublicEntityIdValue(disbursementPublicId),
      new PublicEntityIdValue(attemptPublicId),
      providerTransactionId,
      MoneyValue.fromCode(amount, currency),
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

      disbursementPublicId: this.disbursementPublicId.toString(),

      attemptPublicId: this.attemptPublicId.toString(),

      providerTransactionId: this.providerTransactionId,

      amount: this.amount.amount,

      currency: this.amount.currency.toString(),
    };
  }
}
