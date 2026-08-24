// -----------------------------------------------------------------------------
// Financial Payment Failed Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Financial Payment reaches the FAILED terminal state.
//
// Aggregate:
// - FinancialPaymentAggregate
//
// The aggregate identity is stored in DomainEvent.metadata.aggregateId.
// The payment public identity and failure information are included in the
// payload because they are meaningful to event consumers.
//
// This event does NOT:
// - Communicate with an external provider.
// - Modify Financial Account balances.
// - Create or post a Financial Transaction.
// - Perform retries.
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

export class FinancialPaymentFailedEvent extends FinancialDomainEvent {
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
     * This should be FAILED.
     */
    status: FinancialPaymentStatus,

    /**
     * Provider attempt responsible for the failure, when available.
     */
    attemptPublicId: PublicEntityId | undefined,

    /**
     * Provider/domain failure code, when available.
     */
    failureCode: string | undefined,

    /**
     * Human-readable failure description, when available.
     *
     * This should contain safe diagnostic information and must not expose
     * provider credentials or other sensitive data.
     */
    failureMessage: string | undefined,

    /**
     * Time at which the payment entered the FAILED state.
     */
    failedAt: Date,

    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialPayment',
      'FinancialPaymentFailed',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.amount = amount;
    this.status = status;
    this.attemptPublicId = attemptPublicId;
    this.failureCode = failureCode;
    this.failureMessage = failureMessage;
    this.failedAt = failedAt;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Financial Payment aggregate.
   */
  public readonly publicId: PublicEntityId;

  /**
   * Payment amount that could not be successfully completed.
   */
  public readonly amount: Money;

  /**
   * Final payment status.
   */
  public readonly status: FinancialPaymentStatus;

  /**
   * Provider attempt associated with the failure.
   */
  public readonly attemptPublicId: PublicEntityId | undefined;

  /**
   * Failure code.
   */
  public readonly failureCode: string | undefined;

  /**
   * Safe failure description.
   */
  public readonly failureMessage: string | undefined;

  /**
   * Failure timestamp.
   */
  public readonly failedAt: Date;

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

      attemptPublicId:
        this.attemptPublicId !== undefined
          ? this.attemptPublicId.toString()
          : undefined,

      failureCode: this.failureCode,

      failureMessage: this.failureMessage,

      failedAt: this.failedAt.toISOString(),
    };
  }
}
