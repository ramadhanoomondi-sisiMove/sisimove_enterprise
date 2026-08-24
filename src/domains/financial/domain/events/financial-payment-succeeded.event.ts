// -----------------------------------------------------------------------------
// Financial Payment Succeeded Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Financial Payment successfully completes.
//
// Aggregate:
// - FinancialPaymentAggregate
//
// The aggregate identity is stored in DomainEvent.metadata.aggregateId.
// The payment public identity and resulting financial references are included
// in the payload because they are meaningful to event consumers.
//
// This event does NOT:
// - Post the Financial Transaction.
// - Modify Financial Account balances.
// - Perform provider communication.
// - Execute settlement or disbursement.
//
// Those responsibilities belong to the appropriate transaction, application,
// integration, and settlement boundaries.
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

import type { Money } from '../value-objects/money.vo';

import type { FinancialPaymentMethodPublicId } from '../value-objects/financial-payment-method-public-id.vo';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

export class FinancialPaymentSucceededEvent extends FinancialDomainEvent {
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
     * Final payment amount and currency.
     */
    amount: Money,

    /**
     * Final payment lifecycle status.
     *
     * This should be SUCCEEDED.
     */
    status: FinancialPaymentStatus,

    /**
     * Payment method used to successfully execute the payment.
     */
    methodId: FinancialPaymentMethodPublicId | undefined,

    /**
     * Public identity of the successful provider attempt.
     */
    attemptPublicId: PublicEntityId,

    /**
     * Financial Transaction created to represent the financial effect,
     * when already established by the application/transaction boundary.
     */
    transactionPublicId: string | undefined,

    /**
     * Time at which the payment was completed.
     */
    completedAt: Date,

    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialPayment',
      'FinancialPaymentSucceeded',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.amount = amount;
    this.status = status;
    this.methodId = methodId;
    this.attemptPublicId = attemptPublicId;
    this.transactionPublicId = transactionPublicId;
    this.completedAt = completedAt;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Financial Payment aggregate.
   */
  public readonly publicId: PublicEntityId;

  /**
   * Successfully received payment amount.
   */
  public readonly amount: Money;

  /**
   * Final payment status.
   */
  public readonly status: FinancialPaymentStatus;

  /**
   * Payment method used for the successful payment.
   */
  public readonly methodId: FinancialPaymentMethodPublicId | undefined;

  /**
   * Provider attempt that successfully executed the payment.
   */
  public readonly attemptPublicId: PublicEntityId;

  /**
   * Financial Transaction associated with the successful payment.
   *
   * This remains an opaque reference rather than embedding the transaction
   * aggregate inside the payment aggregate.
   */
  public readonly transactionPublicId: string | undefined;

  /**
   * Completion timestamp.
   */
  public readonly completedAt: Date;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId.toString(),

      amount: {
        amount: this.amount.amount,
        currency: this.amount.currency.toString(),
      },

      status: this.status.toString(),

      methodId:
        this.methodId !== undefined ? this.methodId.toString() : undefined,

      attemptPublicId: this.attemptPublicId.toString(),

      transactionPublicId: this.transactionPublicId,

      completedAt: this.completedAt.toISOString(),
    };
  }
}
