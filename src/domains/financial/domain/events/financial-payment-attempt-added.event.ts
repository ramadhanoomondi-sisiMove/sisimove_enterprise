// -----------------------------------------------------------------------------
// Financial Payment Attempt Added Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a new Financial Payment Attempt is added to a
// FinancialPaymentAggregate.
//
// Aggregate:
// - FinancialPaymentAggregate
//
// The aggregate identity is stored in DomainEvent.metadata.aggregateId.
// The payment and attempt public identities are included in the payload
// because they are meaningful to event consumers.
//
// This event does NOT:
// - Execute the payment attempt.
// - Communicate with an external provider.
// - Modify account balances.
// - Create a Financial Transaction.
//
// Those responsibilities belong to the appropriate application,
// integration, and transaction boundaries.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Financial
// -----------------------------------------------------------------------------

import { FinancialDomainEvent } from './financial-domain.event';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

import type { FinancialPaymentAttemptStatus } from '../value-objects/financial-payment-attempt-status.vo';

import type { FinancialProvider } from '../value-objects/financial-provider.vo';

import type { Money } from '../value-objects/money.vo';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

export class FinancialPaymentAttemptAddedEvent extends FinancialDomainEvent {
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
     * Public identity of the newly created Financial Payment Attempt.
     */
    attemptPublicId: PublicEntityId,

    /**
     * Attempt lifecycle status.
     *
     * Newly added attempts normally begin in PENDING state.
     */
    status: FinancialPaymentAttemptStatus,

    /**
     * External provider responsible for executing the attempt.
     */
    provider: FinancialProvider,

    /**
     * Monetary amount being attempted.
     *
     * This must correspond exactly to the parent Financial Payment amount.
     */
    amount: Money,

    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialPayment',
      'FinancialPaymentAttemptAdded',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.attemptPublicId = attemptPublicId;
    this.status = status;
    this.provider = provider;
    this.amount = amount;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Financial Payment aggregate.
   */
  public readonly publicId: PublicEntityId;

  /**
   * Public identity of the newly added Financial Payment Attempt.
   */
  public readonly attemptPublicId: PublicEntityId;

  /**
   * Initial lifecycle status of the attempt.
   */
  public readonly status: FinancialPaymentAttemptStatus;

  /**
   * Provider through which the attempt will be executed.
   */
  public readonly provider: FinancialProvider;

  /**
   * Amount and currency of the attempt.
   */
  public readonly amount: Money;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId.toString(),

      attemptPublicId: this.attemptPublicId.toString(),

      status: this.status.toString(),

      provider: this.provider.toString(),

      amount: {
        amount: this.amount.amount,
        currency: this.amount.currency.toString(),
      },
    };
  }
}
