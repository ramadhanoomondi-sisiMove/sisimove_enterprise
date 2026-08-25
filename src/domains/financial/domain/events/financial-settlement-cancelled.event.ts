// -----------------------------------------------------------------------------
// Financial Settlement Cancelled Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Financial Settlement is cancelled.
//
// A Financial Settlement represents the orchestration of settlement items
// and their allocations. This event represents the lifecycle fact that the
// settlement has entered the CANCELLED state.
//
// This event does NOT:
// - Execute settlement processing.
// - Modify Financial Account balances.
// - Create Financial Transactions.
// - Create settlement allocations.
// - Communicate with external providers.
//
// Those responsibilities belong to the Financial Settlement aggregate and
// application/integration layers respectively.
//
// The aggregate identity is stored in DomainEvent.metadata.aggregateId.
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
  Currency,
} from '../value-objects';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

/**
 * Emitted when a Financial Settlement is cancelled.
 *
 * The event carries the public settlement identity, final lifecycle status,
 * settlement currency, total amount, cancellation timestamp, and optional
 * safe cancellation information.
 *
 * Cancellation information must never contain credentials, secrets, tokens,
 * or other sensitive provider information.
 */
export class FinancialSettlementCancelledEvent extends FinancialDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,
    publicId: FinancialSettlementPublicId,
    status: FinancialSettlementStatus,
    currency: Currency,
    totalAmount: number,
    cancellationReason: string | undefined,
    cancelledAt: Date | undefined,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialSettlement',
      'FinancialSettlementCancelled',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    if (!status.isCancelled()) {
      throw new Error(
        'Financial Settlement cancelled event requires CANCELLED status',
      );
    }

    FinancialSettlementCancelledEvent.ensureValidTotalAmount(totalAmount);

    if (cancelledAt !== undefined && Number.isNaN(cancelledAt.getTime())) {
      throw new Error(
        'Financial Settlement cancelled event cancelledAt must be a valid date',
      );
    }

    this.publicId = publicId;
    this.status = status;
    this.currency = currency;
    this.totalAmount = totalAmount;

    this.cancellationReason =
      cancellationReason !== undefined && cancellationReason.trim().length > 0
        ? cancellationReason.trim()
        : undefined;

    this.cancelledAt = cancelledAt;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Financial Settlement.
   */
  public readonly publicId: FinancialSettlementPublicId;

  /**
   * Final lifecycle status of the settlement.
   *
   * Expected value:
   *
   *     CANCELLED
   */
  public readonly status: FinancialSettlementStatus;

  /**
   * Settlement currency.
   */
  public readonly currency: Currency;

  /**
   * Total monetary amount represented by the settlement.
   */
  public readonly totalAmount: number;

  /**
   * Optional safe cancellation reason.
   */
  public readonly cancellationReason: string | undefined;

  /**
   * Timestamp at which the settlement was cancelled.
   */
  public readonly cancelledAt: Date | undefined;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId.toString(),

      status: this.status.toString(),

      currency: this.currency.toString(),

      totalAmount: this.totalAmount,

      cancellationReason: this.cancellationReason,

      cancelledAt: this.cancelledAt?.toISOString(),
    };
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  /**
   * Ensures that the settlement amount carried by the event is valid.
   *
   * Zero is permitted because a settlement may legitimately represent a
   * settlement whose final allocated total is zero.
   */
  private static ensureValidTotalAmount(value: number): void {
    if (!Number.isInteger(value)) {
      throw new Error(
        'Financial Settlement cancelled event totalAmount must be an integer',
      );
    }

    if (value < 0) {
      throw new Error(
        'Financial Settlement cancelled event totalAmount must not be negative',
      );
    }
  }
}
