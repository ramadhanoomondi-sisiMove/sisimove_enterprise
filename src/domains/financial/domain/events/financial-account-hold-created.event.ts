// -----------------------------------------------------------------------------
// Financial Account Hold Created Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Financial Account Hold is created.
//
// A Financial Account Hold represents a reservation of funds against a
// Financial Account.
//
// The event represents the lifecycle fact that the hold has been established.
// It does not itself perform the balance reservation.
//
// The associated Financial HOLD transaction is responsible for the actual
// balance mutation.
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
  FinancialHoldExpiry,
  FinancialHoldReference,
} from '../value-objects';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

/**
 * Emitted when a Financial Account Hold is created.
 *
 * A Financial Account Hold represents a reservation of funds against a
 * Financial Account.
 *
 * The aggregate identity is stored in DomainEvent.metadata.aggregateId.
 *
 * The public hold identity, owning account, reserved amount, currency,
 * lifecycle status, business reference, and optional expiry are included
 * because they are meaningful to consumers of the Financial domain event.
 *
 * This event does NOT:
 *
 * - Modify Financial Account balances.
 * - Execute a Financial Transaction.
 * - Communicate with an external provider.
 *
 * The associated Financial HOLD transaction performs the actual financial
 * balance mutation.
 */
export class FinancialAccountHoldCreatedEvent extends FinancialDomainEvent {
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
    reference: FinancialHoldReference | undefined,
    expiresAt: FinancialHoldExpiry | undefined,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
    restoredMetadata?: EventMetadata,
  ) {
    super(
      aggregateId,
      'FinancialAccountHold',
      'FinancialAccountHoldCreated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
      restoredMetadata,
    );

    FinancialAccountHoldCreatedEvent.ensureValidCurrency(currency);

    this.publicId = publicId;
    this.accountPublicId = accountPublicId;
    this.amount = amount;
    this.currency = currency.trim().toUpperCase();
    this.status = status;
    this.reference = reference;
    this.expiresAt = expiresAt;
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
   * Amount reserved by the hold.
   *
   * This is intentionally FinancialAccountHeldAmount rather than the generic
   * Money value object because the hold entity models the amount and currency
   * as separate domain concepts.
   */
  public readonly amount: FinancialAccountHeldAmount;

  /**
   * Currency of the held funds.
   */
  public readonly currency: string;

  /**
   * Lifecycle status immediately after creation.
   *
   * Expected value:
   *
   *     ACTIVE
   */
  public readonly status: FinancialAccountHoldStatus;

  /**
   * Optional business reference that caused the hold.
   */
  public readonly reference: FinancialHoldReference | undefined;

  /**
   * Optional expiry of the hold.
   */
  public readonly expiresAt: FinancialHoldExpiry | undefined;

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

      reference:
        this.reference !== undefined
          ? {
              type: this.reference.type,
              publicId: this.reference.publicId,
            }
          : undefined,

      expiresAt:
        this.expiresAt !== undefined ? this.expiresAt.toString() : undefined,
    };
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  /**
   * Reconstructs a FinancialAccountHoldCreatedEvent from persisted event
   * metadata and payload.
   *
   * This method restores the original event without executing domain
   * operations or modifying Financial Account balances.
   */
  public static rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): FinancialAccountHoldCreatedEvent {
    const publicIdValue = payload['publicId'];
    const accountPublicIdValue = payload['accountPublicId'];
    const amountValue = payload['amount'];
    const currencyValue = payload['currency'];
    const statusValue = payload['status'];
    const referenceValue = payload['reference'];
    const expiresAtValue = payload['expiresAt'];

    if (
      typeof publicIdValue !== 'string' ||
      publicIdValue.trim().length === 0
    ) {
      throw new Error(
        'Invalid FinancialAccountHoldCreated event payload: publicId is required',
      );
    }

    if (
      typeof accountPublicIdValue !== 'string' ||
      accountPublicIdValue.trim().length === 0
    ) {
      throw new Error(
        'Invalid FinancialAccountHoldCreated event payload: accountPublicId is required',
      );
    }

    if (typeof amountValue !== 'string' || amountValue.trim().length === 0) {
      throw new Error(
        'Invalid FinancialAccountHoldCreated event payload: amount is required',
      );
    }

    if (
      typeof currencyValue !== 'string' ||
      currencyValue.trim().length === 0
    ) {
      throw new Error(
        'Invalid FinancialAccountHoldCreated event payload: currency is required',
      );
    }

    if (typeof statusValue !== 'string' || statusValue.trim().length === 0) {
      throw new Error(
        'Invalid FinancialAccountHoldCreated event payload: status is required',
      );
    }

    const amountNumber = Number(amountValue);

    if (!Number.isSafeInteger(amountNumber) || amountNumber < 0) {
      throw new Error(
        'Invalid FinancialAccountHoldCreated event payload: amount must be a non-negative safe integer',
      );
    }

    const amount = FinancialAccountHeldAmount.create(amountNumber);

    const status = this.getStatus(statusValue);

    const reference = this.rehydrateReference(referenceValue);

    const expiresAt = this.rehydrateExpiry(expiresAtValue);

    return new FinancialAccountHoldCreatedEvent(
      metadata.aggregateId,
      new FinancialAccountHoldPublicId(publicIdValue),
      new FinancialAccountPublicId(accountPublicIdValue),
      amount,
      currencyValue,
      status,
      reference,
      expiresAt,
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
          `Invalid FinancialAccountHoldCreated event payload: unsupported status ${value}`,
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
        'Invalid FinancialAccountHoldCreated event payload: reference must contain type and publicId',
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
        'Invalid FinancialAccountHoldCreated event payload: reference type and publicId must be non-empty strings',
      );
    }

    return FinancialHoldReference.create(typeValue, publicIdValue);
  }

  /**
   * Restores the optional hold expiry.
   */
  private static rehydrateExpiry(
    value: unknown,
  ): FinancialHoldExpiry | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new Error(
        'Invalid FinancialAccountHoldCreated event payload: expiresAt must be a valid date string',
      );
    }

    const expiryDate = new Date(value);

    if (Number.isNaN(expiryDate.getTime())) {
      throw new Error(
        'Invalid FinancialAccountHoldCreated event payload: expiresAt must be a valid date',
      );
    }

    return FinancialHoldExpiry.create(expiryDate);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  /**
   * Validates the currency carried by the event.
   *
   * Currency is already validated by the FinancialAccountHoldEntity.
   * This validation protects the event boundary from receiving an invalid
   * value independently of the entity.
   */
  private static ensureValidCurrency(value: string): void {
    const normalized = value.trim().toUpperCase();

    if (normalized.length === 0) {
      throw new Error(
        'Financial Account Hold created event currency must not be empty',
      );
    }

    if (normalized.length > 10) {
      throw new Error(
        'Financial Account Hold created event currency must not exceed 10 characters',
      );
    }
  }
}
