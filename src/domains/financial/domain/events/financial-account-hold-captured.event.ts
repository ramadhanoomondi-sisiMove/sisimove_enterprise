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
// Foundation
// -----------------------------------------------------------------------------

import type { EventMetadata } from '../../../../foundation/kernel/domain/domain-event';

// -----------------------------------------------------------------------------
// Financial
// -----------------------------------------------------------------------------

import { FinancialDomainEvent } from './financial-domain.event';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
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
    restoredMetadata?: EventMetadata,
  ) {
    super(
      aggregateId,
      'FinancialAccountHold',
      'FinancialAccountHoldCaptured',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
      restoredMetadata,
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
  // Rehydration
  // ---------------------------------------------------------------------------

  public static rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): FinancialAccountHoldCapturedEvent {
    const publicId = this.getRequiredString(payload, 'publicId');

    const accountPublicId = this.getRequiredString(payload, 'accountPublicId');

    const amountValue = this.getRequiredString(payload, 'amount');

    const currency = this.getRequiredString(payload, 'currency');

    const statusValue = this.getRequiredString(payload, 'status');

    const captureTransactionPublicId = this.getRequiredString(
      payload,
      'captureTransactionPublicId',
    );

    const capturedAtValue = this.getRequiredString(payload, 'capturedAt');

    const amountNumber = Number(amountValue);

    if (!Number.isSafeInteger(amountNumber)) {
      throw new Error(
        'Invalid FinancialAccountHoldCaptured event payload: amount must be a safe integer',
      );
    }

    const status = this.getStatus(statusValue);

    const capturedAt = new Date(capturedAtValue);

    if (Number.isNaN(capturedAt.getTime())) {
      throw new Error(
        'Invalid FinancialAccountHoldCaptured event payload: capturedAt must be a valid date',
      );
    }

    // -------------------------------------------------------------------------
    // Optional Business Reference
    // -------------------------------------------------------------------------

    const referenceValue = payload.reference;

    let reference: FinancialHoldReference | undefined;

    if (referenceValue !== undefined) {
      if (
        typeof referenceValue !== 'object' ||
        referenceValue === null ||
        Array.isArray(referenceValue)
      ) {
        throw new Error(
          'Invalid FinancialAccountHoldCaptured event payload: reference must be an object when provided',
        );
      }

      if (!('type' in referenceValue) || !('publicId' in referenceValue)) {
        throw new Error(
          'Invalid FinancialAccountHoldCaptured event payload: reference must contain type and publicId',
        );
      }

      const referenceType = referenceValue.type;

      const referencePublicId = referenceValue.publicId;

      if (
        typeof referenceType !== 'string' ||
        referenceType.trim().length === 0
      ) {
        throw new Error(
          'Invalid FinancialAccountHoldCaptured event payload: reference.type must be a non-empty string',
        );
      }

      if (
        typeof referencePublicId !== 'string' ||
        referencePublicId.trim().length === 0
      ) {
        throw new Error(
          'Invalid FinancialAccountHoldCaptured event payload: reference.publicId must be a non-empty string',
        );
      }

      reference = FinancialHoldReference.create(
        referenceType,
        referencePublicId,
      );
    }

    // -------------------------------------------------------------------------
    // Restore Event
    // -------------------------------------------------------------------------

    return new FinancialAccountHoldCapturedEvent(
      metadata.aggregateId,
      new FinancialAccountHoldPublicId(publicId),
      new FinancialAccountPublicId(accountPublicId),
      FinancialAccountHeldAmount.create(amountNumber),
      currency,
      status,
      captureTransactionPublicId,
      reference,
      capturedAt,
      metadata.correlationId ?? '',
      metadata.causationId,
      metadata.eventVersion,
      metadata.eventSchemaVersion,
      metadata,
    );
  }

  // ---------------------------------------------------------------------------
  // Status Reconstruction
  // ---------------------------------------------------------------------------

  private static getStatus(value: string): FinancialAccountHoldStatus {
    switch (value) {
      case 'ACTIVE':
        return FinancialAccountHoldStatus.active();

      case 'RELEASED':
        return FinancialAccountHoldStatus.released();

      case 'CAPTURED':
        return FinancialAccountHoldStatus.captured();

      case 'CANCELLED':
        return FinancialAccountHoldStatus.cancelled();

      default:
        throw new Error(
          `Invalid FinancialAccountHoldCaptured event payload: unsupported status ${value}`,
        );
    }
  }

  // ---------------------------------------------------------------------------
  // Payload Validation
  // ---------------------------------------------------------------------------

  private static getRequiredString(
    payload: Record<string, unknown>,
    field: string,
  ): string {
    const value = payload[field];

    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new Error(
        `Invalid FinancialAccountHoldCaptured event payload: ${field} must be a non-empty string`,
      );
    }

    return value;
  }

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
