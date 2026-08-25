// -----------------------------------------------------------------------------
// Financial Settlement Processing Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Financial Settlement transitions from PENDING into
// PROCESSING.
//
// The event represents the lifecycle fact that settlement processing has
// started.
//
// This event does NOT:
// - Allocate settlement amounts.
// - Create Financial Transactions.
// - Modify Financial Account balances.
// - Execute disbursements.
// - Communicate with external financial providers.
//
// Settlement orchestration and actual financial movement remain separate
// responsibilities.
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
// FinancialSettlementProcessing
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
 * Emitted when a Financial Settlement begins processing.
 *
 * The aggregate identity is stored in DomainEvent.metadata.aggregateId.
 *
 * The public settlement identity, lifecycle status, currency, and current
 * settlement total are included because they are meaningful to consumers of
 * the Financial domain event.
 *
 * Expected lifecycle transition:
 *
 *     PENDING -> PROCESSING
 *
 * This event does NOT:
 *
 * - Allocate settlement amounts.
 * - Create Financial Transactions.
 * - Modify Financial Account balances.
 * - Execute disbursements.
 * - Communicate with external financial providers.
 *
 * Those responsibilities belong to the appropriate application,
 * transaction, and integration boundaries.
 */
export class FinancialSettlementProcessingEvent extends FinancialDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,
    publicId: FinancialSettlementPublicId,
    status: FinancialSettlementStatus,
    currency: Currency,
    totalAmount: Money,
    startedAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialSettlement',
      'FinancialSettlementProcessing',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.status = status;
    this.currency = currency;
    this.totalAmount = totalAmount;
    this.startedAt = startedAt;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Financial Settlement.
   */
  public readonly publicId: FinancialSettlementPublicId;

  /**
   * Settlement lifecycle status after processing begins.
   *
   * Expected value:
   *
   *     PROCESSING
   */
  public readonly status: FinancialSettlementStatus;

  /**
   * Currency of the settlement.
   */
  public readonly currency: Currency;

  /**
   * Current total amount being processed by the settlement.
   */
  public readonly totalAmount: Money;

  /**
   * Timestamp at which settlement processing began.
   */
  public readonly startedAt: Date;

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

      startedAt: this.startedAt.toISOString(),
    };
  }
}
