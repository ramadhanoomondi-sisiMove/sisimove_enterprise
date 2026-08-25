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
  ) {
    super(
      aggregateId,
      'FinancialAccountHold',
      'FinancialAccountHoldReleased',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
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
