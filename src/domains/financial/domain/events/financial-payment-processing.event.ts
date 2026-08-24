// -----------------------------------------------------------------------------
// Financial Payment Processing Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Financial Payment transitions into PROCESSING.
//
// Aggregate:
// - FinancialPaymentAggregate
//
// Aggregate Root:
// - FinancialPaymentEntity
//
// The aggregate identity is stored in:
// - DomainEvent.metadata.aggregateId
//
// The payment public identity is included in the payload because it is the
// externally meaningful identity consumed by other bounded contexts.
//
// This event does NOT:
// - Execute provider APIs.
// - Communicate with an external provider.
// - Move funds.
// - Create ledger entries.
// - Modify Financial Account balances.
//
// Those responsibilities belong to the appropriate application,
// integration, and transaction boundaries.
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

import type { FinancialPaymentStatus, Money } from '../value-objects';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

/**
 * Emitted when a Financial Payment begins processing.
 *
 * The aggregate identity is stored in DomainEvent.metadata.aggregateId.
 *
 * The payment public identity, receiving account identity, monetary amount,
 * currency, and resulting status are included in the event payload.
 */
export class FinancialPaymentProcessingEvent extends FinancialDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    accountId: PublicEntityId,
    amount: Money,
    status: FinancialPaymentStatus,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialPayment',
      'FinancialPaymentProcessing',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.accountId = accountId;
    this.amount = amount;
    this.status = status;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Financial Payment.
   */
  public readonly publicId: PublicEntityId;

  /**
   * Public identity of the Financial Account receiving the payment.
   */
  public readonly accountId: PublicEntityId;

  /**
   * Monetary amount of the Financial Payment.
   */
  public readonly amount: Money;

  /**
   * Resulting lifecycle status.
   *
   * This should be PROCESSING when the event is emitted.
   */
  public readonly status: FinancialPaymentStatus;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId.toString(),

      accountId: this.accountId.toString(),

      amount: this.amount.amount,

      currency: this.amount.currency.toString(),

      status: this.status.toString(),
    };
  }
}
