// -----------------------------------------------------------------------------
// Financial Transaction Failed Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a pending Financial Transaction fails.
//
// Failure is terminal for the transaction aggregate.
//
// Provider-specific failure details belong to Payment, Settlement,
// Disbursement, or another appropriate financial workflow aggregate.
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

export class FinancialTransactionFailedEvent extends FinancialDomainEvent {
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
    failedAt: Date,
    reason: string | undefined,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialTransaction',
      'FinancialTransactionFailed',
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
    this.failedAt = failedAt;
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

  public readonly failedAt: Date;

  /**
   * Domain-level explanation for the failure.
   *
   * Provider-specific failure information must remain inside the aggregate
   * responsible for the provider interaction.
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

      failedAt: this.failedAt.toISOString(),

      reason: this.reason,
    };
  }
}
