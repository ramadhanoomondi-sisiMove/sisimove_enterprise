// -----------------------------------------------------------------------------
// Financial Transaction Completed Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a pending Financial Transaction successfully completes.
//
// Completion means the Financial Transaction aggregate has passed its
// double-entry and monetary integrity invariants.
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
  FinancialTransactionReference,
  FinancialAccountReference,
  Money,
} from '../value-objects';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

export class FinancialTransactionCompletedEvent extends FinancialDomainEvent {
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
    completedAt: Date,
    accountingJournalPublicId: string | undefined,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialTransaction',
      'FinancialTransactionCompleted',
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
    this.completedAt = completedAt;
    this.accountingJournalPublicId = accountingJournalPublicId;
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

  public readonly completedAt: Date;

  /**
   * Opaque reference to the Accounting Domain journal.
   */
  public readonly accountingJournalPublicId: string | undefined;

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

      completedAt: this.completedAt.toISOString(),

      accountingJournalPublicId: this.accountingJournalPublicId,
    };
  }
}
