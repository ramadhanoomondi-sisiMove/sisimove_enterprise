// -----------------------------------------------------------------------------
// Financial Account Hold Captured Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when an active Financial Account Hold is captured.
//
// Capture represents the successful resolution of the reservation through the
// associated Financial CAPTURE transaction.
//
// Lifecycle transition:
//
// ACTIVE -> CAPTURED
//
// The event does not perform or represent the financial movement itself.
// The associated Financial Transaction is identified by
// captureTransactionPublicId.
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
  FinancialAccountHoldPublicId,
  FinancialAccountHoldStatus,
  FinancialAccountPublicId,
  FinancialAccountHeldAmount,
  FinancialHoldReference,
} from '../value-objects';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

/**
 * Emitted when an active Financial Account Hold is captured.
 *
 * A captured hold represents a reservation that has been resolved through
 * the associated Financial CAPTURE transaction.
 *
 * The aggregate identity is stored in DomainEvent.metadata.aggregateId.
 *
 * The event payload contains the public hold identity, owning account,
 * reserved amount, currency, resulting status, capture transaction,
 * business reference, and capture timestamp.
 *
 * The event does not execute or coordinate the Financial Transaction.
 */
export class FinancialAccountHoldCapturedEvent extends FinancialDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,
    publicId: FinancialAccountHoldPublicId,
    accountPublicId: FinancialAccountPublicId,
    amount: FinancialAccountHeldAmount,
    currency: string,
    status: FinancialAccountHoldStatus,
    captureTransactionPublicId: string,
    reference: FinancialHoldReference | undefined,
    capturedAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialAccountHold',
      'FinancialAccountHoldCaptured',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.accountPublicId = accountPublicId;
    this.amount = amount;
    this.currency = currency;
    this.status = status;
    this.captureTransactionPublicId = captureTransactionPublicId;
    this.reference = reference;
    this.capturedAt = new Date(capturedAt.getTime());
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Financial Account Hold.
   */
  public readonly publicId: FinancialAccountHoldPublicId;

  /**
   * Public identity of the owning Financial Account.
   */
  public readonly accountPublicId: FinancialAccountPublicId;

  /**
   * Amount originally reserved by the hold.
   *
   * This intentionally uses FinancialAccountHeldAmount rather than Money.
   */
  public readonly amount: FinancialAccountHeldAmount;

  /**
   * Currency of the held funds.
   */
  public readonly currency: string;

  /**
   * Lifecycle status after capture.
   *
   * Expected value:
   *
   * CAPTURED
   */
  public readonly status: FinancialAccountHoldStatus;

  /**
   * Public identity of the Financial CAPTURE transaction that resolved
   * the held funds.
   */
  public readonly captureTransactionPublicId: string;

  /**
   * Optional business reference that caused the hold.
   */
  public readonly reference: FinancialHoldReference | undefined;

  /**
   * Timestamp at which the hold was captured.
   */
  public readonly capturedAt: Date;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId.toString(),

      accountPublicId: this.accountPublicId.toString(),

      amount: this.amount.toString(),

      currency: this.currency,

      status: this.status.toString(),

      captureTransactionPublicId: this.captureTransactionPublicId,

      reference:
        this.reference !== undefined
          ? {
              type: this.reference.type,
              publicId: this.reference.publicId,
            }
          : undefined,

      capturedAt: this.capturedAt.toISOString(),
    };
  }
}
