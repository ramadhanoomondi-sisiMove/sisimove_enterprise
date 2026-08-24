// -----------------------------------------------------------------------------
// Financial Payment Expired Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Financial Payment reaches the EXPIRED terminal state.
//
// Aggregate:
// - FinancialPaymentAggregate
//
// The aggregate identity is stored in DomainEvent.metadata.aggregateId.
// The payment public identity and expiration information are included in
// the payload because they are meaningful to event consumers.
//
// This event does NOT:
// - Communicate with external providers.
// - Modify Financial Account balances.
// - Create or post a Financial Transaction.
// - Perform provider-side cancellation.
// - Retry the payment.
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

export class FinancialPaymentExpiredEvent extends FinancialDomainEvent {
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
     * This should be EXPIRED.
     */
    status: FinancialPaymentStatus,

    /**
     * Time at which the payment entered the EXPIRED state.
     */
    expiredAt: Date,

    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialPayment',
      'FinancialPaymentExpired',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.amount = amount;
    this.status = status;
    this.expiredAt = expiredAt;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Financial Payment aggregate.
   */
  public readonly publicId: PublicEntityId;

  /**
   * Payment amount that expired without successful completion.
   */
  public readonly amount: Money;

  /**
   * Final payment status.
   */
  public readonly status: FinancialPaymentStatus;

  /**
   * Expiration timestamp.
   */
  public readonly expiredAt: Date;

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

      expiredAt: this.expiredAt.toISOString(),
    };
  }
}
