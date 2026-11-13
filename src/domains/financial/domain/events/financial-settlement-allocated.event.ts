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
// Domain Event Metadata
// -----------------------------------------------------------------------------

import type { EventMetadata } from '../../../../foundation/kernel/domain/domain-event';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
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
    restoredMetadata?: EventMetadata,
  ) {
    super(
      aggregateId,
      'FinancialSettlement',
      'FinancialSettlementAllocated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
      restoredMetadata,
    );

    this.ensureValidDate(allocatedAt);

    this.publicId = publicId;
    this.status = status;
    this.currency = currency;
    this.totalAmount = totalAmount;
    this.allocatedAt = new Date(allocatedAt.getTime());
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

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  /**
   * Reconstructs a FinancialSettlementAllocatedEvent from persisted event
   * metadata and payload.
   *
   * Rehydration restores the original event and does not execute settlement
   * allocation or move funds.
   */
  public static rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): FinancialSettlementAllocatedEvent {
    const publicIdValue = payload['publicId'];
    const statusValue = payload['status'];
    const currencyValue = payload['currency'];
    const totalAmountValue = payload['totalAmount'];
    const allocatedAtValue = payload['allocatedAt'];

    if (
      typeof publicIdValue !== 'string' ||
      publicIdValue.trim().length === 0
    ) {
      throw new Error(
        'Invalid FinancialSettlementAllocated event payload: publicId is required',
      );
    }

    if (typeof statusValue !== 'string' || statusValue.trim().length === 0) {
      throw new Error(
        'Invalid FinancialSettlementAllocated event payload: status is required',
      );
    }

    if (
      typeof currencyValue !== 'string' ||
      currencyValue.trim().length === 0
    ) {
      throw new Error(
        'Invalid FinancialSettlementAllocated event payload: currency is required',
      );
    }

    if (
      typeof totalAmountValue !== 'string' ||
      totalAmountValue.trim().length === 0
    ) {
      throw new Error(
        'Invalid FinancialSettlementAllocated event payload: totalAmount is required',
      );
    }

    if (
      typeof allocatedAtValue !== 'string' ||
      allocatedAtValue.trim().length === 0
    ) {
      throw new Error(
        'Invalid FinancialSettlementAllocated event payload: allocatedAt is required',
      );
    }

    const status = this.getStatus(statusValue);

    const currency = Currency.create(currencyValue);

    const totalAmountNumber = Number(totalAmountValue);

    if (!Number.isFinite(totalAmountNumber) || totalAmountNumber < 0) {
      throw new Error(
        'Invalid FinancialSettlementAllocated event payload: totalAmount must be a non-negative number',
      );
    }

    const totalAmount = Money.fromCode(totalAmountNumber, currencyValue);
    const allocatedAt = new Date(allocatedAtValue);

    if (Number.isNaN(allocatedAt.getTime())) {
      throw new Error(
        'Invalid FinancialSettlementAllocated event payload: allocatedAt must be a valid date',
      );
    }

    return new FinancialSettlementAllocatedEvent(
      metadata.aggregateId,
      new FinancialSettlementPublicId(publicIdValue),
      status,
      currency,
      totalAmount,
      allocatedAt,
      metadata.correlationId ?? '',
      metadata.causationId,
      metadata.eventVersion,
      metadata.eventSchemaVersion,
      metadata,
    );
  }

  // ---------------------------------------------------------------------------
  // Rehydration Helpers
  // ---------------------------------------------------------------------------

  /**
   * Restores the settlement lifecycle status.
   */
  private static getStatus(value: string): FinancialSettlementStatus {
    switch (value) {
      case 'PENDING':
        return FinancialSettlementStatus.pending();

      case 'PROCESSING':
        return FinancialSettlementStatus.processing();

      case 'COMPLETED':
        return FinancialSettlementStatus.completed();

      case 'FAILED':
        return FinancialSettlementStatus.failed();

      case 'CANCELLED':
        return FinancialSettlementStatus.cancelled();

      default:
        throw new Error(
          `Invalid FinancialSettlementAllocated event payload: unsupported status ${value}`,
        );
    }
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  /**
   * Ensures the allocation lifecycle timestamp is valid.
   */
  private ensureValidDate(value: Date): void {
    if (Number.isNaN(value.getTime())) {
      throw new Error('Financial Settlement allocatedAt must be a valid date');
    }
  }
}
