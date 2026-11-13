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
    restoredMetadata?: EventMetadata,
  ) {
    super(
      aggregateId,
      'FinancialSettlement',
      'FinancialSettlementCancelled',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
      restoredMetadata,
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

    this.cancelledAt =
      cancelledAt !== undefined ? new Date(cancelledAt.getTime()) : undefined;
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
  // Rehydration
  // ---------------------------------------------------------------------------

  /**
   * Reconstructs a FinancialSettlementCancelledEvent from persisted event
   * metadata and payload.
   *
   * Rehydration restores the original cancellation event without executing
   * settlement processing or modifying Financial Account balances.
   */
  public static rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): FinancialSettlementCancelledEvent {
    const publicIdValue = payload['publicId'];
    const statusValue = payload['status'];
    const currencyValue = payload['currency'];
    const totalAmountValue = payload['totalAmount'];
    const cancellationReasonValue = payload['cancellationReason'];
    const cancelledAtValue = payload['cancelledAt'];

    if (
      typeof publicIdValue !== 'string' ||
      publicIdValue.trim().length === 0
    ) {
      throw new Error(
        'Invalid FinancialSettlementCancelled event payload: publicId is required',
      );
    }

    if (typeof statusValue !== 'string' || statusValue !== 'CANCELLED') {
      throw new Error(
        'Invalid FinancialSettlementCancelled event payload: status must be CANCELLED',
      );
    }

    if (
      typeof currencyValue !== 'string' ||
      currencyValue.trim().length === 0
    ) {
      throw new Error(
        'Invalid FinancialSettlementCancelled event payload: currency is required',
      );
    }

    if (
      typeof totalAmountValue !== 'number' ||
      !Number.isInteger(totalAmountValue)
    ) {
      throw new Error(
        'Invalid FinancialSettlementCancelled event payload: totalAmount must be an integer',
      );
    }

    if (
      cancellationReasonValue !== undefined &&
      cancellationReasonValue !== null &&
      typeof cancellationReasonValue !== 'string'
    ) {
      throw new Error(
        'Invalid FinancialSettlementCancelled event payload: cancellationReason must be a string',
      );
    }

    if (
      cancelledAtValue !== undefined &&
      cancelledAtValue !== null &&
      typeof cancelledAtValue !== 'string'
    ) {
      throw new Error(
        'Invalid FinancialSettlementCancelled event payload: cancelledAt must be a date string',
      );
    }

    let cancelledAt: Date | undefined;

    if (typeof cancelledAtValue === 'string') {
      if (cancelledAtValue.trim().length === 0) {
        throw new Error(
          'Invalid FinancialSettlementCancelled event payload: cancelledAt must be a valid date',
        );
      }

      cancelledAt = new Date(cancelledAtValue);

      if (Number.isNaN(cancelledAt.getTime())) {
        throw new Error(
          'Invalid FinancialSettlementCancelled event payload: cancelledAt must be a valid date',
        );
      }
    }

    return new FinancialSettlementCancelledEvent(
      metadata.aggregateId,
      new FinancialSettlementPublicId(publicIdValue),
      FinancialSettlementStatus.cancelled(),
      Currency.create(currencyValue),
      totalAmountValue,
      typeof cancellationReasonValue === 'string'
        ? cancellationReasonValue
        : undefined,
      cancelledAt,
      metadata.correlationId ?? '',
      metadata.causationId,
      metadata.eventVersion,
      metadata.eventSchemaVersion,
      metadata,
    );
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
