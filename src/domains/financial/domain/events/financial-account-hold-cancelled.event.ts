// -----------------------------------------------------------------------------
// Financial Account Hold Cancelled Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when an active Financial Account Hold is cancelled.
//
// Cancellation represents the termination of a hold before normal resolution
// through capture or ordinary release.
//
// Lifecycle transition:
//
// ACTIVE -> CANCELLED
//
// Cancellation itself does not perform money movement.
//
// Because the held funds must no longer remain reserved, the corresponding
// Financial RELEASE transaction returns the held funds to the Financial
// Account's available balance.
//
// The associated RELEASE transaction is identified by
// releaseTransactionPublicId.
//
// This keeps:
//
// - hold lifecycle;
// - business outcome; and
// - financial money movement
//
// explicitly separate.
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
  FinancialAccountHoldStatusValue,
  FinancialAccountPublicId,
  FinancialAccountHeldAmount,
  FinancialHoldReference,
} from '../value-objects';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

/**
 * Emitted when an active Financial Account Hold is cancelled.
 *
 * Cancellation indicates that the hold is no longer valid or required
 * before it reaches its normal resolution path.
 *
 * Typical causes may include:
 *
 * - the originating business operation being abandoned;
 * - the originating operation being rejected;
 * - a payment attempt being invalidated;
 * - an application workflow being explicitly cancelled;
 * - an upstream business process no longer requiring the reservation.
 *
 * Cancellation does not itself move money.
 *
 * The held funds are returned to the Financial Account's available balance
 * through the associated Financial RELEASE transaction identified by
 * releaseTransactionPublicId.
 *
 * The event therefore represents the lifecycle transition:
 *
 * ACTIVE -> CANCELLED
 *
 * while the corresponding Financial Transaction represents:
 *
 * Held Balance -> Available Balance
 */
export class FinancialAccountHoldCancelledEvent extends FinancialDomainEvent {
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
    releaseTransactionPublicId: string,
    reference: FinancialHoldReference | undefined,
    cancelledAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
    restoredMetadata?: EventMetadata,
  ) {
    super(
      aggregateId,
      'FinancialAccountHold',
      'FinancialAccountHoldCancelled',
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
    this.releaseTransactionPublicId = releaseTransactionPublicId;
    this.reference = reference;
    this.cancelledAt = new Date(cancelledAt.getTime());
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
   * This intentionally uses FinancialAccountHeldAmount rather than Money,
   * matching the FinancialAccountHoldEntity domain model.
   */
  public readonly amount: FinancialAccountHeldAmount;

  /**
   * Currency of the held funds.
   */
  public readonly currency: string;

  /**
   * Lifecycle status after cancellation.
   *
   * Expected value:
   *
   * CANCELLED
   */
  public readonly status: FinancialAccountHoldStatus;

  /**
   * Public identity of the Financial RELEASE transaction responsible for
   * returning the cancelled hold's funds to the account's available balance.
   *
   * The transaction performs the financial movement.
   * This event only identifies it.
   */
  public readonly releaseTransactionPublicId: string;

  /**
   * Optional business reference that caused the hold.
   */
  public readonly reference: FinancialHoldReference | undefined;

  /**
   * Timestamp at which the hold was cancelled.
   */
  public readonly cancelledAt: Date;

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  public static rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): FinancialAccountHoldCancelledEvent {
    const publicId = this.getRequiredString(payload, 'publicId');

    const accountPublicId = this.getRequiredString(payload, 'accountPublicId');

    const amountValue = this.getRequiredString(payload, 'amount');

    const currency = this.getRequiredString(payload, 'currency');

    const statusValue = this.getRequiredString(payload, 'status');

    const releaseTransactionPublicId = this.getRequiredString(
      payload,
      'releaseTransactionPublicId',
    );

    const cancelledAtValue = this.getRequiredString(payload, 'cancelledAt');

    const amountNumber = Number(amountValue);

    if (!Number.isSafeInteger(amountNumber)) {
      throw new Error(
        'Invalid FinancialAccountHoldCancelled event payload: amount must be a safe integer',
      );
    }

    const status = this.getStatus(statusValue);

    const cancelledAt = new Date(cancelledAtValue);

    if (Number.isNaN(cancelledAt.getTime())) {
      throw new Error(
        'Invalid FinancialAccountHoldCancelled event payload: cancelledAt must be a valid date',
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
          'Invalid FinancialAccountHoldCancelled event payload: reference must be an object when provided',
        );
      }

      if (!('type' in referenceValue) || !('publicId' in referenceValue)) {
        throw new Error(
          'Invalid FinancialAccountHoldCancelled event payload: reference must contain type and publicId',
        );
      }

      const referenceType = referenceValue.type;

      const referencePublicId = referenceValue.publicId;

      if (
        typeof referenceType !== 'string' ||
        referenceType.trim().length === 0
      ) {
        throw new Error(
          'Invalid FinancialAccountHoldCancelled event payload: reference.type must be a non-empty string',
        );
      }

      if (
        typeof referencePublicId !== 'string' ||
        referencePublicId.trim().length === 0
      ) {
        throw new Error(
          'Invalid FinancialAccountHoldCancelled event payload: reference.publicId must be a non-empty string',
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

    return new FinancialAccountHoldCancelledEvent(
      metadata.aggregateId,
      new FinancialAccountHoldPublicId(publicId),
      new FinancialAccountPublicId(accountPublicId),
      FinancialAccountHeldAmount.create(amountNumber),
      currency,
      status,
      releaseTransactionPublicId,
      reference,
      cancelledAt,
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
          `Invalid FinancialAccountHoldCancelled event payload: unsupported status ${value}`,
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
        `Invalid FinancialAccountHoldCancelled event payload: ${field} must be a non-empty string`,
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

      releaseTransactionPublicId: this.releaseTransactionPublicId,

      reference:
        this.reference !== undefined
          ? {
              type: this.reference.type,
              publicId: this.reference.publicId,
            }
          : undefined,

      cancelledAt: this.cancelledAt.toISOString(),
    };
  }
}
