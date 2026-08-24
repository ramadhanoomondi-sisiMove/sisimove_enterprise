// -----------------------------------------------------------------------------
// Financial Payment Cancelled Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Financial Payment is cancelled.
//
// Aggregate:
// - FinancialPaymentAggregate
//
// The aggregate identity is stored in DomainEvent.metadata.aggregateId.
// The payment public identity and cancellation information are included in
// the payload because they are meaningful to event consumers.
//
// This event does NOT:
// - Communicate with external providers.
// - Modify Financial Account balances.
// - Create or post a Financial Transaction.
// - Cancel provider-side operations directly.
//
// Those responsibilities belong to the appropriate application,
// integration, transaction, and orchestration boundaries.
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

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

export class FinancialPaymentCancelledEvent extends FinancialDomainEvent {
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
     * Payment amount and currency.
     */
    amount: Money,

    /**
     * Final payment lifecycle status.
     *
     * This should be CANCELLED.
     */
    status: FinancialPaymentStatus,

    /**
     * Time at which the payment entered the CANCELLED state.
     */
    cancelledAt: Date,

    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialPayment',
      'FinancialPaymentCancelled',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.amount = amount;
    this.status = status;
    this.cancelledAt = cancelledAt;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Financial Payment aggregate.
   */
  public readonly publicId: PublicEntityId;

  /**
   * Payment amount that was cancelled.
   */
  public readonly amount: Money;

  /**
   * Final payment status.
   */
  public readonly status: FinancialPaymentStatus;

  /**
   * Cancellation timestamp.
   */
  public readonly cancelledAt: Date;

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

      cancelledAt: this.cancelledAt.toISOString(),
    };
  }
}
