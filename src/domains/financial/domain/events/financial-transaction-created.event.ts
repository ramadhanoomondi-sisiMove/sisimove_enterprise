// -----------------------------------------------------------------------------
// Financial Transaction Created Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Financial Transaction aggregate is created.
//
// This event represents the creation of the financial transaction itself.
// Transaction entries are intentionally excluded because entry mutations are
// internal aggregate concerns.
//
// Accounting remains outside the Financial bounded context and is referenced
// only through an opaque accounting journal public identifier when applicable.
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
  FinancialTransactionStatus,
  FinancialTransactionReference,
  FinancialAccountReference,
  Money,
} from '../value-objects';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

export class FinancialTransactionCreatedEvent extends FinancialDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    type: FinancialTransactionType,
    status: FinancialTransactionStatus,
    amount: Money,
    sourceAccount: FinancialAccountReference | undefined,
    destinationAccount: FinancialAccountReference | undefined,
    reference: FinancialTransactionReference | undefined,
    accountingJournalPublicId: string | undefined,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialTransaction',
      'FinancialTransactionCreated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.type = type;
    this.status = status;
    this.amount = amount;
    this.sourceAccount = sourceAccount;
    this.destinationAccount = destinationAccount;
    this.reference = reference;
    this.accountingJournalPublicId = accountingJournalPublicId;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  public readonly publicId: PublicEntityId;

  public readonly type: FinancialTransactionType;

  public readonly status: FinancialTransactionStatus;

  public readonly amount: Money;

  public readonly sourceAccount: FinancialAccountReference | undefined;

  public readonly destinationAccount: FinancialAccountReference | undefined;

  public readonly reference: FinancialTransactionReference | undefined;

  /**
   * Opaque cross-domain reference to the Accounting Domain journal.
   *
   * The Financial Domain does not depend on Accounting Domain models.
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

      status: this.status.toString(),

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

      accountingJournalPublicId: this.accountingJournalPublicId,
    };
  }
}
