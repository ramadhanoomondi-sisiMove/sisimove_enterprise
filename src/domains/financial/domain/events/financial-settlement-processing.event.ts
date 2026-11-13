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
    restoredMetadata?: EventMetadata,
  ) {
    super(
      aggregateId,
      'FinancialSettlement',
      'FinancialSettlementProcessing',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
      restoredMetadata,
    );

    this.ensureValidDate(startedAt);

    this.publicId = publicId;
    this.status = status;
    this.currency = currency;
    this.totalAmount = totalAmount;
    this.startedAt = new Date(startedAt.getTime());
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

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  /**
   * Reconstructs a FinancialSettlementProcessingEvent from persisted event
   * metadata and payload.
   *
   * Rehydration restores the original processing event without allocating
   * settlement amounts, creating transactions, or modifying balances.
   */
  public static rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): FinancialSettlementProcessingEvent {
    const publicIdValue = payload['publicId'];
    const statusValue = payload['status'];
    const currencyValue = payload['currency'];
    const totalAmountValue = payload['totalAmount'];
    const startedAtValue = payload['startedAt'];

    if (
      typeof publicIdValue !== 'string' ||
      publicIdValue.trim().length === 0
    ) {
      throw new Error(
        'Invalid FinancialSettlementProcessing event payload: publicId is required',
      );
    }

    if (typeof statusValue !== 'string' || statusValue.trim().length === 0) {
      throw new Error(
        'Invalid FinancialSettlementProcessing event payload: status is required',
      );
    }

    if (
      typeof currencyValue !== 'string' ||
      currencyValue.trim().length === 0
    ) {
      throw new Error(
        'Invalid FinancialSettlementProcessing event payload: currency is required',
      );
    }

    if (
      typeof totalAmountValue !== 'string' ||
      totalAmountValue.trim().length === 0
    ) {
      throw new Error(
        'Invalid FinancialSettlementProcessing event payload: totalAmount is required',
      );
    }

    if (
      typeof startedAtValue !== 'string' ||
      startedAtValue.trim().length === 0
    ) {
      throw new Error(
        'Invalid FinancialSettlementProcessing event payload: startedAt is required',
      );
    }

    const totalAmountNumber = Number(totalAmountValue);

    if (!Number.isFinite(totalAmountNumber) || totalAmountNumber < 0) {
      throw new Error(
        'Invalid FinancialSettlementProcessing event payload: totalAmount must be a non-negative number',
      );
    }

    const startedAt = new Date(startedAtValue);

    if (Number.isNaN(startedAt.getTime())) {
      throw new Error(
        'Invalid FinancialSettlementProcessing event payload: startedAt must be a valid date',
      );
    }

    const status = this.getStatus(statusValue);

    const currency = Currency.create(currencyValue);

    const totalAmount = Money.fromCode(totalAmountNumber, currencyValue);

    return new FinancialSettlementProcessingEvent(
      metadata.aggregateId,
      new FinancialSettlementPublicId(publicIdValue),
      status,
      currency,
      totalAmount,
      startedAt,
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
          `Invalid FinancialSettlementProcessing event payload: unsupported status ${value}`,
        );
    }
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  /**
   * Ensures the processing lifecycle timestamp is valid.
   */
  private ensureValidDate(value: Date): void {
    if (Number.isNaN(value.getTime())) {
      throw new Error('Financial Settlement startedAt must be a valid date');
    }
  }
}
