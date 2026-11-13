// -----------------------------------------------------------------------------
// Financial Settlement Failed Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Financial Settlement fails.
//
// A Financial Settlement represents the orchestration of settlement items
// and their allocations. This event represents the lifecycle fact that the
// settlement has entered the FAILED state.
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
 * Emitted when a Financial Settlement fails.
 *
 * The event carries the public settlement identity, final lifecycle status,
 * settlement currency, and safe failure information.
 *
 * Failure information is intentionally limited to safe domain/application
 * diagnostics. Provider credentials, secrets, tokens, or other sensitive
 * information must never be included in the event.
 */
export class FinancialSettlementFailedEvent extends FinancialDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,
    publicId: FinancialSettlementPublicId,
    status: FinancialSettlementStatus,
    currency: Currency,
    totalAmount: number,
    failureCode: string | undefined,
    failureMessage: string | undefined,
    failedAt: Date | undefined,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
    restoredMetadata?: EventMetadata,
  ) {
    super(
      aggregateId,
      'FinancialSettlement',
      'FinancialSettlementFailed',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
      restoredMetadata,
    );

    if (!status.isFailed()) {
      throw new Error(
        'Financial Settlement failed event requires FAILED status',
      );
    }

    FinancialSettlementFailedEvent.ensureValidTotalAmount(totalAmount);

    if (failedAt !== undefined && Number.isNaN(failedAt.getTime())) {
      throw new Error(
        'Financial Settlement failed event failedAt must be a valid date',
      );
    }

    this.publicId = publicId;
    this.status = status;
    this.currency = currency;
    this.totalAmount = totalAmount;

    this.failureCode =
      failureCode !== undefined && failureCode.trim().length > 0
        ? failureCode.trim()
        : undefined;

    this.failureMessage =
      failureMessage !== undefined && failureMessage.trim().length > 0
        ? failureMessage.trim()
        : undefined;

    this.failedAt =
      failedAt !== undefined ? new Date(failedAt.getTime()) : undefined;
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
   *     FAILED
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
   * Safe domain/application failure code.
   */
  public readonly failureCode: string | undefined;

  /**
   * Safe domain/application failure message.
   */
  public readonly failureMessage: string | undefined;

  /**
   * Timestamp at which the settlement failed.
   */
  public readonly failedAt: Date | undefined;

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

      failureCode: this.failureCode,

      failureMessage: this.failureMessage,

      failedAt: this.failedAt?.toISOString(),
    };
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  /**
   * Reconstructs a FinancialSettlementFailedEvent from persisted event
   * metadata and payload.
   *
   * Rehydration restores the original failure event without executing
   * settlement processing or modifying Financial Account balances.
   */
  public static rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): FinancialSettlementFailedEvent {
    const publicIdValue = payload['publicId'];
    const statusValue = payload['status'];
    const currencyValue = payload['currency'];
    const totalAmountValue = payload['totalAmount'];
    const failureCodeValue = payload['failureCode'];
    const failureMessageValue = payload['failureMessage'];
    const failedAtValue = payload['failedAt'];

    if (
      typeof publicIdValue !== 'string' ||
      publicIdValue.trim().length === 0
    ) {
      throw new Error(
        'Invalid FinancialSettlementFailed event payload: publicId is required',
      );
    }

    if (statusValue !== 'FAILED') {
      throw new Error(
        'Invalid FinancialSettlementFailed event payload: status must be FAILED',
      );
    }

    if (
      typeof currencyValue !== 'string' ||
      currencyValue.trim().length === 0
    ) {
      throw new Error(
        'Invalid FinancialSettlementFailed event payload: currency is required',
      );
    }

    if (
      typeof totalAmountValue !== 'number' ||
      !Number.isSafeInteger(totalAmountValue) ||
      totalAmountValue < 0
    ) {
      throw new Error(
        'Invalid FinancialSettlementFailed event payload: totalAmount must be a non-negative safe integer',
      );
    }

    if (
      failureCodeValue !== undefined &&
      failureCodeValue !== null &&
      typeof failureCodeValue !== 'string'
    ) {
      throw new Error(
        'Invalid FinancialSettlementFailed event payload: failureCode must be a string',
      );
    }

    if (
      failureMessageValue !== undefined &&
      failureMessageValue !== null &&
      typeof failureMessageValue !== 'string'
    ) {
      throw new Error(
        'Invalid FinancialSettlementFailed event payload: failureMessage must be a string',
      );
    }

    let failedAt: Date | undefined;

    if (failedAtValue !== undefined && failedAtValue !== null) {
      if (
        typeof failedAtValue !== 'string' ||
        failedAtValue.trim().length === 0
      ) {
        throw new Error(
          'Invalid FinancialSettlementFailed event payload: failedAt must be a valid date string',
        );
      }

      failedAt = new Date(failedAtValue);

      if (Number.isNaN(failedAt.getTime())) {
        throw new Error(
          'Invalid FinancialSettlementFailed event payload: failedAt must be a valid date',
        );
      }
    }

    return new FinancialSettlementFailedEvent(
      metadata.aggregateId,
      new FinancialSettlementPublicId(publicIdValue),
      FinancialSettlementStatus.failed(),
      Currency.create(currencyValue),
      totalAmountValue,
      typeof failureCodeValue === 'string' ? failureCodeValue : undefined,
      typeof failureMessageValue === 'string' ? failureMessageValue : undefined,
      failedAt,
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
   * Zero is permitted because a settlement aggregate may legitimately
   * represent a settlement whose final allocated total is zero.
   */
  private static ensureValidTotalAmount(value: number): void {
    if (!Number.isInteger(value)) {
      throw new Error(
        'Financial Settlement failed event totalAmount must be an integer',
      );
    }

    if (value < 0) {
      throw new Error(
        'Financial Settlement failed event totalAmount must not be negative',
      );
    }
  }
}
