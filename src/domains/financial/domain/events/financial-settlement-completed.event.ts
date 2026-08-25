// -----------------------------------------------------------------------------
// Financial Settlement Completed Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Financial Settlement has successfully completed.
//
// Completion represents the successful conclusion of the settlement
// lifecycle. All required settlement allocations and associated financial
// processing must have been successfully completed before the aggregate may
// transition to COMPLETED.
//
// This event does NOT:
// - Modify Financial Account balances.
// - Create Financial Transactions.
// - Execute disbursements.
// - Communicate with external financial providers.
//
// Those responsibilities belong to the appropriate Financial application,
// transaction, disbursement, and integration boundaries.
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
// FinancialSettlementCompleted
//
// -----------------------------------------------------------------------------
//
// The aggregate identity is stored in DomainEvent.metadata.aggregateId.
//
// The public settlement identity, status, currency, total amount, and
// completion timestamp are included because they are meaningful to consumers
// of the Financial domain event.
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
 * Emitted when a Financial Settlement successfully completes.
 *
 * Completion represents the successful conclusion of the settlement
 * lifecycle.
 *
 * Expected lifecycle transition:
 *
 *     ALLOCATED -> COMPLETED
 *
 * A settlement must not be completed until its required settlement processing
 * has successfully concluded.
 *
 * The event represents a domain fact. It does not itself perform any
 * financial movement.
 *
 * Financial Transactions are responsible for actual account balance
 * mutations and transaction entries.
 *
 * The aggregate identity is stored in
 * DomainEvent.metadata.aggregateId.
 *
 * The public settlement identity, lifecycle status, currency, total amount,
 * and completion timestamp are included because they are meaningful to
 * consumers of the Financial domain event.
 */
export class FinancialSettlementCompletedEvent extends FinancialDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,
    publicId: FinancialSettlementPublicId,
    status: FinancialSettlementStatus,
    currency: Currency,
    totalAmount: Money,
    completedAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialSettlement',
      'FinancialSettlementCompleted',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.status = status;
    this.currency = currency;
    this.totalAmount = totalAmount;
    this.completedAt = completedAt;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Financial Settlement.
   */
  public readonly publicId: FinancialSettlementPublicId;

  /**
   * Settlement lifecycle status after successful completion.
   *
   * Expected value:
   *
   *     COMPLETED
   */
  public readonly status: FinancialSettlementStatus;

  /**
   * Currency of the settlement.
   */
  public readonly currency: Currency;

  /**
   * Final settlement amount.
   */
  public readonly totalAmount: Money;

  /**
   * Timestamp at which the settlement successfully completed.
   */
  public readonly completedAt: Date;

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

      completedAt: this.completedAt.toISOString(),
    };
  }
}
