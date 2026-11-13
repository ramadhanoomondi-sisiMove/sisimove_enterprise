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
// Domain Event Metadata
// -----------------------------------------------------------------------------

import type { EventMetadata } from '../../../../foundation/kernel/domain/domain-event';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  FinancialSettlementPublicId,
  FinancialSettlementStatus,
  Currency,
  Money,
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
    restoredMetadata?: EventMetadata,
  ) {
    super(
      aggregateId,
      'FinancialSettlement',
      'FinancialSettlementCompleted',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
      restoredMetadata,
    );

    this.ensureValidDate(completedAt);

    this.publicId = publicId;
    this.status = status;
    this.currency = currency;
    this.totalAmount = totalAmount;
    this.completedAt = new Date(completedAt.getTime());
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

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  /**
   * Reconstructs a FinancialSettlementCompletedEvent from persisted event
   * metadata and payload.
   *
   * Rehydration restores the original completion event without executing
   * settlement processing or modifying Financial Account balances.
   */
  public static rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): FinancialSettlementCompletedEvent {
    const publicIdValue = payload['publicId'];
    const statusValue = payload['status'];
    const currencyValue = payload['currency'];
    const totalAmountValue = payload['totalAmount'];
    const completedAtValue = payload['completedAt'];

    if (
      typeof publicIdValue !== 'string' ||
      publicIdValue.trim().length === 0
    ) {
      throw new Error(
        'Invalid FinancialSettlementCompleted event payload: publicId is required',
      );
    }

    if (typeof statusValue !== 'string' || statusValue.trim().length === 0) {
      throw new Error(
        'Invalid FinancialSettlementCompleted event payload: status is required',
      );
    }

    if (
      typeof currencyValue !== 'string' ||
      currencyValue.trim().length === 0
    ) {
      throw new Error(
        'Invalid FinancialSettlementCompleted event payload: currency is required',
      );
    }

    if (
      typeof totalAmountValue !== 'string' ||
      totalAmountValue.trim().length === 0
    ) {
      throw new Error(
        'Invalid FinancialSettlementCompleted event payload: totalAmount is required',
      );
    }

    if (
      typeof completedAtValue !== 'string' ||
      completedAtValue.trim().length === 0
    ) {
      throw new Error(
        'Invalid FinancialSettlementCompleted event payload: completedAt is required',
      );
    }

    const totalAmountNumber = Number(totalAmountValue);

    if (!Number.isFinite(totalAmountNumber) || totalAmountNumber < 0) {
      throw new Error(
        'Invalid FinancialSettlementCompleted event payload: totalAmount must be a non-negative number',
      );
    }

    const completedAt = new Date(completedAtValue);

    if (Number.isNaN(completedAt.getTime())) {
      throw new Error(
        'Invalid FinancialSettlementCompleted event payload: completedAt must be a valid date',
      );
    }

    const status = this.getStatus(statusValue);

    const currency = Currency.create(currencyValue);

    const totalAmount = Money.fromCode(totalAmountNumber, currencyValue);

    return new FinancialSettlementCompletedEvent(
      metadata.aggregateId,
      new FinancialSettlementPublicId(publicIdValue),
      status,
      currency,
      totalAmount,
      completedAt,
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
          `Invalid FinancialSettlementCompleted event payload: unsupported status ${value}`,
        );
    }
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  /**
   * Ensures the completion lifecycle timestamp is valid.
   */
  private ensureValidDate(value: Date): void {
    if (Number.isNaN(value.getTime())) {
      throw new Error('Financial Settlement completedAt must be a valid date');
    }
  }
}
