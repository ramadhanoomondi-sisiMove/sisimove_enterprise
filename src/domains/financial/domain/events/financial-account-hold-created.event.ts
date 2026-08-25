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
// Value Objects
// -----------------------------------------------------------------------------

import type {
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
  ) {
    super(
      aggregateId,
      'FinancialAccountHold',
      'FinancialAccountHoldCreated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
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
