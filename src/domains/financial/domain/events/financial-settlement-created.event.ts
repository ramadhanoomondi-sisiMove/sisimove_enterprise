// -----------------------------------------------------------------------------
// Financial Settlement Created Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Financial Settlement aggregate is created.
//
// A Financial Settlement represents a settlement batch within the Financial
// bounded context.
//
// The event represents the lifecycle fact that the settlement aggregate has
// been created. It does not begin settlement processing, allocate funds,
// create Financial Transactions, or modify Financial Account balances.
//
// Those responsibilities belong to the settlement application orchestration
// and Financial Transaction aggregates.
//
// -----------------------------------------------------------------------------
//
// Aggregate:
//
// FinancialSettlementAggregate
// ├── FinancialSettlementEntity
// └── FinancialSettlementItemEntity[]
//
// -----------------------------------------------------------------------------
//
// Event:
//
// FinancialSettlementCreated
//
// -----------------------------------------------------------------------------
//
// The aggregate identity is stored in DomainEvent.metadata.aggregateId.
//
// The public settlement identity, currency, total amount, and lifecycle status
// are included because they are meaningful to consumers of the Financial
// domain event.
//
// A newly created settlement is expected to have:
//
// - status = PENDING;
// - totalAmount = zero;
// - no settlement items yet.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Financial
// -----------------------------------------------------------------------------

import { FinancialDomainEvent } from './financial-domain.event';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type {
  FinancialSettlementPublicId,
  FinancialSettlementStatus,
  Money,
  Currency,
} from '../value-objects';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

/**
 * Emitted when a Financial Settlement aggregate is created.
 *
 * The aggregate identity is stored in DomainEvent.metadata.aggregateId.
 *
 * The public settlement identity, lifecycle status, currency, and initial
 * total amount are included because they are meaningful to consumers of the
 * Financial domain event.
 *
 * This event does NOT:
 *
 * - Begin settlement processing.
 * - Allocate settlement amounts.
 * - Create Financial Transactions.
 * - Modify Financial Account balances.
 * - Execute disbursements.
 * - Communicate with external financial providers.
 *
 * Settlement processing is represented by subsequent settlement lifecycle
 * events.
 */
export class FinancialSettlementCreatedEvent extends FinancialDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,
    publicId: FinancialSettlementPublicId,
    status: FinancialSettlementStatus,
    currency: Currency,
    totalAmount: Money,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialSettlement',
      'FinancialSettlementCreated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.status = status;
    this.currency = currency;
    this.totalAmount = totalAmount;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Financial Settlement.
   */
  public readonly publicId: FinancialSettlementPublicId;

  /**
   * Lifecycle status immediately after creation.
   *
   * Expected value:
   *
   *     PENDING
   */
  public readonly status: FinancialSettlementStatus;

  /**
   * Currency of the settlement.
   *
   * A Financial Settlement is intentionally single-currency.
   */
  public readonly currency: Currency;

  /**
   * Initial settlement total.
   *
   * A newly created settlement normally has a zero total because settlement
   * items are added after aggregate creation.
   */
  public readonly totalAmount: Money;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId.toString(),

      status: this.status.toString(),

      currency: this.currency.toString(),

      totalAmount: this.totalAmount.toString(),
    };
  }
}
