// -----------------------------------------------------------------------------
// Financial Account Hold Released Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when an active Financial Account Hold is normally released.
//
// Release represents an intentional resolution of the reservation without
// capture:
//
// ACTIVE -> RELEASED
//
// The associated Financial RELEASE transaction is responsible for the actual
// balance movement. This event represents the completed lifecycle transition
// of the Financial Account Hold and identifies the transaction that performed
// the financial operation.
//
// This event does NOT:
// - Move money.
// - Modify Financial Account balances.
// - Execute a Financial Transaction.
// - Communicate with an external provider.
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
 * Emitted when an active Financial Account Hold is normally released.
 *
 * Release means the reservation is intentionally resolved without capture.
 *
 * The associated Financial RELEASE transaction returns the reserved funds
 * from the held balance to the account's available balance.
 *
 * The event represents the hold lifecycle transition:
 *
 *     ACTIVE -> RELEASED
 *
 * The actual balance mutation is represented by the associated Financial
 * Transaction identified by releaseTransactionPublicId.
 */
export class FinancialAccountHoldReleasedEvent extends FinancialDomainEvent {
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
    releasedAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
    restoredMetadata?: EventMetadata,
  ) {
    super(
      aggregateId,
      'FinancialAccountHold',
      'FinancialAccountHoldReleased',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
      restoredMetadata,
    );

    this.ensureValidTransactionPublicId(releaseTransactionPublicId);
    this.ensureValidDate(releasedAt);

    this.publicId = publicId;
    this.accountPublicId = accountPublicId;
    this.amount = amount;
    this.currency = currency;
    this.status = status;
    this.releaseTransactionPublicId = releaseTransactionPublicId.trim();
    this.reference = reference;
    this.releasedAt = new Date(releasedAt.getTime());
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Financial Account Hold.
   */
  public readonly publicId: FinancialAccountHoldPublicId;

  /**
   * Public identity of the Financial Account that owns the hold.
   */
  public readonly accountPublicId: FinancialAccountPublicId;

  /**
   * Amount that was reserved by the hold.
   */
  public readonly amount: FinancialAccountHeldAmount;

  /**
   * Currency of the held funds.
   */
  public readonly currency: string;

  /**
   * Lifecycle state after release.
   *
   * Expected value:
   *
   *     RELEASED
   */
  public readonly status: FinancialAccountHoldStatus;

  /**
   * Public identity of the Financial RELEASE transaction associated with
   * the release operation.
   *
   * This identifies the financial operation responsible for returning the
   * held amount to the account's available balance.
   */
  public readonly releaseTransactionPublicId: string;

  /**
   * Optional business reference that originally caused the hold.
   */
  public readonly reference: FinancialHoldReference | undefined;

  /**
   * Timestamp at which the hold transitioned to RELEASED.
   */
  public readonly releasedAt: Date;

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

      releasedAt: this.releasedAt.toISOString(),
    };
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  /**
   * Reconstructs a FinancialAccountHoldReleasedEvent from persisted event
   * metadata and payload.
   *
   * Rehydration restores the event's original lifecycle data. It does not
   * execute the associated Financial RELEASE transaction or modify balances.
   */
  public static rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): FinancialAccountHoldReleasedEvent {
    const publicIdValue = payload['publicId'];
    const accountPublicIdValue = payload['accountPublicId'];
    const amountValue = payload['amount'];
    const currencyValue = payload['currency'];
    const statusValue = payload['status'];
    const releaseTransactionPublicIdValue =
      payload['releaseTransactionPublicId'];
    const referenceValue = payload['reference'];
    const releasedAtValue = payload['releasedAt'];

    if (
      typeof publicIdValue !== 'string' ||
      publicIdValue.trim().length === 0
    ) {
      throw new Error(
        'Invalid FinancialAccountHoldReleased event payload: publicId is required',
      );
    }

    if (
      typeof accountPublicIdValue !== 'string' ||
      accountPublicIdValue.trim().length === 0
    ) {
      throw new Error(
        'Invalid FinancialAccountHoldReleased event payload: accountPublicId is required',
      );
    }

    if (typeof amountValue !== 'string' || amountValue.trim().length === 0) {
      throw new Error(
        'Invalid FinancialAccountHoldReleased event payload: amount is required',
      );
    }

    if (
      typeof currencyValue !== 'string' ||
      currencyValue.trim().length === 0
    ) {
      throw new Error(
        'Invalid FinancialAccountHoldReleased event payload: currency is required',
      );
    }

    if (typeof statusValue !== 'string' || statusValue.trim().length === 0) {
      throw new Error(
        'Invalid FinancialAccountHoldReleased event payload: status is required',
      );
    }

    if (
      typeof releaseTransactionPublicIdValue !== 'string' ||
      releaseTransactionPublicIdValue.trim().length === 0
    ) {
      throw new Error(
        'Invalid FinancialAccountHoldReleased event payload: releaseTransactionPublicId is required',
      );
    }

    if (
      typeof releasedAtValue !== 'string' ||
      releasedAtValue.trim().length === 0
    ) {
      throw new Error(
        'Invalid FinancialAccountHoldReleased event payload: releasedAt is required',
      );
    }

    const amountNumber = Number(amountValue);

    if (!Number.isSafeInteger(amountNumber) || amountNumber < 0) {
      throw new Error(
        'Invalid FinancialAccountHoldReleased event payload: amount must be a non-negative safe integer',
      );
    }

    const releasedAt = new Date(releasedAtValue);

    if (Number.isNaN(releasedAt.getTime())) {
      throw new Error(
        'Invalid FinancialAccountHoldReleased event payload: releasedAt must be a valid date',
      );
    }

    const amount = FinancialAccountHeldAmount.create(amountNumber);

    const status = this.getStatus(statusValue);

    const reference = this.rehydrateReference(referenceValue);

    return new FinancialAccountHoldReleasedEvent(
      metadata.aggregateId,
      new FinancialAccountHoldPublicId(publicIdValue),
      new FinancialAccountPublicId(accountPublicIdValue),
      amount,
      currencyValue,
      status,
      releaseTransactionPublicIdValue,
      reference,
      releasedAt,
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
   * Restores the hold lifecycle status.
   */
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
          `Invalid FinancialAccountHoldReleased event payload: unsupported status ${value}`,
        );
    }
  }

  /**
   * Restores the optional business reference.
   */
  private static rehydrateReference(
    value: unknown,
  ): FinancialHoldReference | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    if (
      typeof value !== 'object' ||
      Array.isArray(value) ||
      !('type' in value) ||
      !('publicId' in value)
    ) {
      throw new Error(
        'Invalid FinancialAccountHoldReleased event payload: reference must contain type and publicId',
      );
    }

    const typeValue = value.type;
    const publicIdValue = value.publicId;

    if (
      typeof typeValue !== 'string' ||
      typeValue.trim().length === 0 ||
      typeof publicIdValue !== 'string' ||
      publicIdValue.trim().length === 0
    ) {
      throw new Error(
        'Invalid FinancialAccountHoldReleased event payload: reference type and publicId must be non-empty strings',
      );
    }

    return FinancialHoldReference.create(typeValue, publicIdValue);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  /**
   * Ensures the associated Financial Transaction identity is usable.
   */
  private static validateTransactionPublicId(value: string): void {
    if (value.trim().length === 0) {
      throw new Error(
        'Financial Account Hold release transaction public ID must not be empty',
      );
    }
  }

  private ensureValidTransactionPublicId(value: string): void {
    FinancialAccountHoldReleasedEvent.validateTransactionPublicId(value);
  }

  /**
   * Ensures the lifecycle timestamp is valid.
   */
  private ensureValidDate(value: Date): void {
    if (Number.isNaN(value.getTime())) {
      throw new Error('Financial Account Hold releasedAt must be a valid date');
    }
  }
}
