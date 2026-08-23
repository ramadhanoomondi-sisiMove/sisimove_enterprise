// -----------------------------------------------------------------------------
// Financial Transaction Cancelled Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a pending Financial Transaction is cancelled.
//
// Cancellation is terminal. A cancelled transaction cannot later complete.
//
// Cancellation does not represent a reversal of an already-completed
// financial movement. Reversal has its own lifecycle and event.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Financial
// -----------------------------------------------------------------------------

import { FinancialDomainEvent } from './financial-domain.event';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type {
  FinancialTransactionType,
  FinancialAccountReference,
  FinancialTransactionReference,
  Money,
} from '../value-objects';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

export class FinancialTransactionCancelledEvent extends FinancialDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    type: FinancialTransactionType,
    amount: Money,
    sourceAccount: FinancialAccountReference | undefined,
    destinationAccount: FinancialAccountReference | undefined,
    reference: FinancialTransactionReference | undefined,
    cancelledAt: Date,
    reason: string | undefined,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialTransaction',
      'FinancialTransactionCancelled',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.type = type;
    this.amount = amount;
    this.sourceAccount = sourceAccount;
    this.destinationAccount = destinationAccount;
    this.reference = reference;
    this.cancelledAt = cancelledAt;
    this.reason = reason;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  public readonly publicId: PublicEntityId;

  public readonly type: FinancialTransactionType;

  public readonly amount: Money;

  public readonly sourceAccount: FinancialAccountReference | undefined;

  public readonly destinationAccount: FinancialAccountReference | undefined;

  public readonly reference: FinancialTransactionReference | undefined;

  public readonly cancelledAt: Date;

  /**
   * Optional domain-level explanation for the cancellation.
   *
   * Provider-specific cancellation details belong to the appropriate
   * Payment, Settlement, or Disbursement aggregate.
   */
  public readonly reason: string | undefined;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId.toString(),

      type: this.type.toString(),

      amount: this.amount.amount,

      currency: this.amount.currency.toString(),

      sourceAccount:
        this.sourceAccount !== undefined
          ? this.sourceAccount.toString()
          : undefined,

      destinationAccount:
        this.destinationAccount !== undefined
          ? this.destinationAccount.toString()
          : undefined,

      reference:
        this.reference !== undefined ? this.reference.toString() : undefined,

      cancelledAt: this.cancelledAt.toISOString(),

      reason: this.reason,
    };
  }
}
