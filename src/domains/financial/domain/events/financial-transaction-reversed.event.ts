// -----------------------------------------------------------------------------
// Financial Transaction Reversed Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a completed Financial Transaction is reversed.
//
// A reversal does not mutate or delete the historical transaction entries.
// It represents a new lifecycle state applied to the existing transaction.
//
// The compensating financial movement should be represented by the appropriate
// financial transaction workflow rather than rewriting historical entries.
//
// Accounting remains outside the Financial bounded context.
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

export class FinancialTransactionReversedEvent extends FinancialDomainEvent {
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
    reversedAt: Date,
    accountingJournalPublicId: string | undefined,
    reason: string | undefined,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialTransaction',
      'FinancialTransactionReversed',
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
    this.reversedAt = reversedAt;
    this.accountingJournalPublicId = accountingJournalPublicId;
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

  public readonly reversedAt: Date;

  /**
   * Opaque reference to the Accounting Domain journal created for the
   * reversal, when applicable.
   */
  public readonly accountingJournalPublicId: string | undefined;

  /**
   * Optional domain-level explanation for the reversal.
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

      reversedAt: this.reversedAt.toISOString(),

      accountingJournalPublicId: this.accountingJournalPublicId,

      reason: this.reason,
    };
  }
}
