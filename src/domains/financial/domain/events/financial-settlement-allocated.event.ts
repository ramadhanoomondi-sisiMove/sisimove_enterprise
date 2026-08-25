// -----------------------------------------------------------------------------
// Financial Settlement Allocated Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Financial Settlement has been fully allocated.
//
// Allocation represents the domain decision describing how the settlement
// amount is assigned across its settlement items and target Financial
// Accounts.
//
// This event does NOT:
// - Move money.
// - Modify Financial Account balances.
// - Create Financial Transactions.
// - Execute disbursements.
// - Communicate with external financial providers.
//
// Actual movement of funds is represented by Financial Transactions.
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
// FinancialSettlementAllocated
//
// -----------------------------------------------------------------------------
//
// The aggregate identity is stored in DomainEvent.metadata.aggregateId.
//
// The public settlement identity, status, currency, and total amount are
// included because they are meaningful to consumers of the Financial domain
// event.
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
 * Emitted when a Financial Settlement has been fully allocated.
 *
 * Allocation means that the settlement's financial obligations have been
 * deterministically assigned to their target Financial Accounts through
 * Financial Settlement Allocations.
 *
 * Expected lifecycle transition:
 *
 *     PROCESSING -> ALLOCATED
 *
 * This event represents allocation of settlement obligations. It does not
 * represent movement of money.
 *
 * Actual financial movement is performed through Financial Transactions,
 * which are responsible for modifying Financial Account balances and creating
 * transaction entries.
 *
 * The aggregate identity is stored in
 * DomainEvent.metadata.aggregateId.
 *
 * The public settlement identity, lifecycle status, currency, and total
 * settlement amount are included because they are meaningful to consumers of
 * the Financial domain event.
 */
export class FinancialSettlementAllocatedEvent extends FinancialDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,
    publicId: FinancialSettlementPublicId,
    status: FinancialSettlementStatus,
    currency: Currency,
    totalAmount: Money,
    allocatedAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialSettlement',
      'FinancialSettlementAllocated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.status = status;
    this.currency = currency;
    this.totalAmount = totalAmount;
    this.allocatedAt = allocatedAt;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Financial Settlement.
   */
  public readonly publicId: FinancialSettlementPublicId;

  /**
   * Settlement lifecycle status after allocation.
   *
   * Expected value:
   *
   *     ALLOCATED
   */
  public readonly status: FinancialSettlementStatus;

  /**
   * Currency of the settlement.
   */
  public readonly currency: Currency;

  /**
   * Total amount allocated by the settlement.
   */
  public readonly totalAmount: Money;

  /**
   * Timestamp at which the settlement became fully allocated.
   */
  public readonly allocatedAt: Date;

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

      allocatedAt: this.allocatedAt.toISOString(),
    };
  }
}
