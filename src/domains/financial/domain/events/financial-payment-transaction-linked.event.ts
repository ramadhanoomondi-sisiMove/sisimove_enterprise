// -----------------------------------------------------------------------------
// Financial Payment Transaction Linked Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Financial Payment is linked to the Financial Transaction
// that represents its resulting financial effect.
//
// Aggregate:
// - FinancialPaymentAggregate
//
// The Financial Payment remains the aggregate root.
// FinancialTransaction is a separate aggregate and is referenced only through
// its opaque public identity.
//
// This event does NOT:
// - Create the Financial Transaction.
// - Post the Financial Transaction.
// - Modify account balances.
// - Perform accounting.
//
// Those responsibilities belong to the Financial Transaction and Accounting
// boundaries respectively.
//
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

import type { FinancialPaymentStatus } from '../value-objects/financial-payment-status.vo';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

export class FinancialPaymentTransactionLinkedEvent extends FinancialDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    /**
     * Persistence/domain identity of the Financial Payment aggregate.
     *
     * This becomes DomainEvent.metadata.aggregateId.
     */
    aggregateId: string,

    /**
     * Public identity of the Financial Payment.
     */
    publicId: PublicEntityId,

    /**
     * Public identity of the Financial Transaction linked to the payment.
     *
     * The transaction remains outside the Financial Payment aggregate.
     */
    transactionPublicId: string,

    /**
     * Current payment status when the transaction is linked.
     */
    status: FinancialPaymentStatus,

    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialPayment',
      'FinancialPaymentTransactionLinked',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    const normalizedTransactionPublicId = transactionPublicId.trim();

    if (!normalizedTransactionPublicId) {
      throw new Error(
        'Financial Payment transaction public ID must not be empty',
      );
    }

    this.publicId = publicId;
    this.transactionPublicId = normalizedTransactionPublicId;
    this.status = status;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Financial Payment aggregate.
   */
  public readonly publicId: PublicEntityId;

  /**
   * Public identity of the linked Financial Transaction.
   *
   * This is intentionally an opaque reference.
   */
  public readonly transactionPublicId: string;

  /**
   * Payment status at the time of linking.
   */
  public readonly status: FinancialPaymentStatus;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId.toString(),

      transactionPublicId: this.transactionPublicId,

      status: this.status.toString(),
    };
  }
}
