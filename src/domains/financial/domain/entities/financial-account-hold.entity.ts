// -----------------------------------------------------------------------------
// Financial Account Hold Entity
// -----------------------------------------------------------------------------
//
// Represents a reservation of funds against a Financial Account.
//
// Aggregate:
// - FinancialAccountHoldAggregate
//
// Responsibilities:
// - Financial Account Hold identity.
// - Owning Financial Account reference.
// - Held amount.
// - Currency.
// - Hold lifecycle.
// - Optional business reference.
// - Optional expiry.
// - Hold/release/capture transaction references.
// - Lifecycle invariants.
// - Lifecycle timestamps.
//
// This entity does NOT:
// - Modify Financial Account balances.
// - Create or execute Financial Transactions.
// - Execute payment provider calls.
// - Communicate with external providers.
// - Coordinate Financial Account state.
// - Coordinate other Financial Account Holds.
// - Persist itself.
//
// Financial Account balance mutations and Financial Transaction creation
// are coordinated by the appropriate application/domain workflow.
//
// Lifecycle:
//
//   ACTIVE
//      ├── RELEASED
//      ├── CAPTURED
//      └── CANCELLED
//
// RELEASED, CAPTURED and CANCELLED are terminal states.
//
// Important:
//
// - RELEASED means the hold was normally released.
// - CAPTURED means the held funds were consumed through capture.
// - CANCELLED means the hold itself was invalidated.
// - Cancellation is associated with a RELEASE transaction because any
//   financially reserved funds must be returned to available balance.
//
// The entity records lifecycle state and transaction references only.
// It does not perform the financial movement itself.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialAccountHoldException } from '../exceptions/financial-account-hold.exception';

import { FinancialAccountHoldExpiredException } from '../exceptions/financial-account-hold-expired.exception';

import { FinancialAccountHoldInvalidStatusException } from '../exceptions/financial-account-hold-invalid-status.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { FinancialAccountHoldPublicId } from '../value-objects/financial-account-hold-public-id.vo';

import type { FinancialAccountPublicId } from '../value-objects/financial-account-public-id.vo';

import type { FinancialAccountHeldAmount } from '../value-objects/financial-account-held-amount.vo';

import { FinancialAccountHoldStatus } from '../value-objects/financial-account-hold-status.vo';

import type { FinancialHoldReference } from '../value-objects/financial-hold-reference.vo';

import type { FinancialHoldExpiry } from '../value-objects/financial-hold-expiry.vo';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface FinancialAccountHoldProps {
  /**
   * Internal identity of the owning Financial Account.
   *
   * This is the persistence-oriented aggregate relationship.
   *
   * IMPORTANT:
   *
   * This is intentionally NOT a FinancialAccountPublicId.
   *
   * The internal Financial Account entity ID and the public Financial Account
   * identifier are separate concepts.
   */
  accountId: UniqueEntityId;

  /**
   * Public identity of the owning Financial Account.
   *
   * This is the opaque cross-aggregate reference used by the domain and
   * application layers.
   */
  accountPublicId: FinancialAccountPublicId;

  /**
   * Amount reserved by the hold.
   *
   * This is intentionally represented by the hold-specific
   * FinancialAccountHeldAmount value object.
   */
  amount: FinancialAccountHeldAmount;

  /**
   * Currency of the held funds.
   *
   * Stored as a normalized uppercase string.
   */
  currency: string;

  /**
   * Current lifecycle state of the hold.
   */
  status: FinancialAccountHoldStatus;

  /**
   * Optional business reference associated with the hold.
   */
  reference: FinancialHoldReference | undefined;

  /**
   * Public ID of the Financial Transaction that established the hold.
   */
  holdTransactionPublicId: string | undefined;

  /**
   * Public ID of the Financial RELEASE transaction associated with
   * resolving the reserved funds.
   *
   * Used by:
   *
   * - RELEASED holds;
   * - CANCELLED holds whose reserved funds must be returned.
   */
  releaseTransactionPublicId: string | undefined;

  /**
   * Public ID of the Financial CAPTURE transaction that resolved the hold.
   */
  captureTransactionPublicId: string | undefined;

  /**
   * Optional expiry point for the hold.
   */
  expiresAt: FinancialHoldExpiry | undefined;

  /**
   * Timestamp at which the hold entered RELEASED state.
   */
  releasedAt: Date | undefined;

  /**
   * Timestamp at which the hold entered CAPTURED state.
   */
  capturedAt: Date | undefined;

  /**
   * Timestamp at which the hold entered CANCELLED state.
   */
  cancelledAt: Date | undefined;

  /**
   * Entity creation timestamp.
   */
  createdAt: Date;

  /**
   * Entity last-update timestamp.
   */
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class FinancialAccountHoldEntity extends Entity<
  FinancialAccountHoldProps,
  FinancialAccountHoldPublicId
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    props: FinancialAccountHoldProps,
    id?: UniqueEntityId,
    publicId?: FinancialAccountHoldPublicId,
  ) {
    super(props, id, publicId);
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates a new Financial Account Hold.
   *
   * Newly created holds always begin in ACTIVE status.
   *
   * IMPORTANT:
   *
   * The internal Financial Account ID and the public Financial Account ID
   * are intentionally supplied separately.
   *
   * accountId:
   * - internal aggregate/entity identity;
   * - used by persistence relationships.
   *
   * accountPublicId:
   * - public aggregate identity;
   * - used as the opaque cross-aggregate reference.
   *
   * No Financial Account balance is modified by this factory.
   *
   * The corresponding financial reservation is coordinated by the
   * application/domain workflow.
   */
  public static create(
    accountId: UniqueEntityId,
    accountPublicId: FinancialAccountPublicId,
    amount: FinancialAccountHeldAmount,
    currency: string,
    reference?: FinancialHoldReference,
    expiresAt?: FinancialHoldExpiry,
  ): FinancialAccountHoldEntity {
    const now = new Date();

    return new FinancialAccountHoldEntity(
      {
        // ---------------------------------------------------------------------
        // Owning Financial Account
        // ---------------------------------------------------------------------

        accountId,

        accountPublicId,

        // ---------------------------------------------------------------------
        // Amount
        // ---------------------------------------------------------------------

        amount,

        // ---------------------------------------------------------------------
        // Currency
        // ---------------------------------------------------------------------

        currency: FinancialAccountHoldEntity.normalizeCurrency(currency),

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        status: FinancialAccountHoldStatus.active(),

        // ---------------------------------------------------------------------
        // Business Reference
        // ---------------------------------------------------------------------

        reference: reference ?? undefined,

        // ---------------------------------------------------------------------
        // Transaction References
        // ---------------------------------------------------------------------

        holdTransactionPublicId: undefined,

        releaseTransactionPublicId: undefined,

        captureTransactionPublicId: undefined,

        // ---------------------------------------------------------------------
        // Expiry
        // ---------------------------------------------------------------------

        expiresAt: expiresAt ?? undefined,

        // ---------------------------------------------------------------------
        // Lifecycle Timestamps
        // ---------------------------------------------------------------------

        releasedAt: undefined,

        capturedAt: undefined,

        cancelledAt: undefined,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: FinancialAccountHoldEntity.cloneDate(now),

        updatedAt: FinancialAccountHoldEntity.cloneDate(now),
      },

      // -----------------------------------------------------------------------
      // Internal Hold Identity
      // -----------------------------------------------------------------------

      new UniqueEntityId(),

      // -----------------------------------------------------------------------
      // Public Hold Identity
      // -----------------------------------------------------------------------

      new FinancialAccountHoldPublicId(),
    );
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of the Financial Account Hold.
   */
  public override get publicId(): FinancialAccountHoldPublicId {
    return super.publicId;
  }

  // ===========================================================================
  // Account Reference
  // ===========================================================================

  /**
   * Internal identity of the owning Financial Account.
   *
   * This value is intentionally an internal UniqueEntityId.
   *
   * It must NOT be replaced with FinancialAccountPublicId.
   */
  public get accountId(): UniqueEntityId {
    return this.props.accountId;
  }

  /**
   * Public identity of the owning Financial Account.
   *
   * This is an opaque cross-aggregate reference.
   */
  public get accountPublicId(): FinancialAccountPublicId {
    return this.props.accountPublicId;
  }

  // ===========================================================================
  // Amount
  // ===========================================================================

  /**
   * Amount reserved by the hold.
   */
  public get amount(): FinancialAccountHeldAmount {
    return this.props.amount;
  }

  /**
   * Numeric value of the held amount.
   *
   * Expressed using the representation defined by
   * FinancialAccountHeldAmount.
   */
  public get amountValue(): number {
    return this.props.amount.value;
  }

  // ===========================================================================
  // Currency
  // ===========================================================================

  /**
   * Currency of the held funds.
   */
  public get currency(): string {
    return this.props.currency;
  }

  // ===========================================================================
  // Status
  // ===========================================================================

  /**
   * Current lifecycle status.
   */
  public get status(): FinancialAccountHoldStatus {
    return this.props.status;
  }

  /**
   * Whether the hold is ACTIVE.
   */
  public isActive(): boolean {
    return this.props.status.isActive();
  }

  /**
   * Whether the hold is RELEASED.
   */
  public isReleased(): boolean {
    return this.props.status.isReleased();
  }

  /**
   * Whether the hold is CAPTURED.
   */
  public isCaptured(): boolean {
    return this.props.status.isCaptured();
  }

  /**
   * Whether the hold is CANCELLED.
   */
  public isCancelled(): boolean {
    return this.props.status.isCancelled();
  }

  /**
   * Whether the hold is in a terminal state.
   */
  public isTerminal(): boolean {
    return this.props.status.isTerminal();
  }

  // ===========================================================================
  // Reference
  // ===========================================================================

  /**
   * Optional business reference associated with the hold.
   */
  public get reference(): FinancialHoldReference | undefined {
    return this.props.reference;
  }

  /**
   * Whether a business reference exists.
   */
  public hasReference(): boolean {
    return this.props.reference !== undefined;
  }

  /**
   * Determines whether this hold belongs to the supplied business reference.
   */
  public isForReference(type: string, publicId: string): boolean {
    const reference = this.props.reference;

    if (reference === undefined) {
      return false;
    }

    return reference.isOfType(type) && reference.hasPublicId(publicId);
  }

  // ===========================================================================
  // Expiry
  // ===========================================================================

  /**
   * Optional expiry point for the hold.
   */
  public get expiresAt(): FinancialHoldExpiry | undefined {
    return this.props.expiresAt;
  }

  /**
   * Whether an expiry has been configured.
   */
  public hasExpiry(): boolean {
    return this.props.expiresAt !== undefined;
  }

  /**
   * Determines whether the hold has expired at the supplied point in time.
   */
  public isExpired(at: Date = new Date()): boolean {
    FinancialAccountHoldEntity.ensureValidDate(at, 'expiry evaluation date');

    const expiresAt = this.props.expiresAt;

    if (expiresAt === undefined) {
      return false;
    }

    return expiresAt.isExpired(at);
  }

  /**
   * Determines whether the hold is currently usable.
   *
   * A hold is currently active only when:
   *
   * - its lifecycle status is ACTIVE; and
   * - it has not expired.
   */
  public isCurrentlyActive(at: Date = new Date()): boolean {
    return this.isActive() && !this.isExpired(at);
  }

  // ===========================================================================
  // Transaction References
  // ===========================================================================

  /**
   * Public ID of the transaction that established the hold.
   */
  public get holdTransactionPublicId(): string | undefined {
    return this.props.holdTransactionPublicId;
  }

  /**
   * Public ID of the RELEASE transaction associated with resolving
   * the reserved funds.
   */
  public get releaseTransactionPublicId(): string | undefined {
    return this.props.releaseTransactionPublicId;
  }

  /**
   * Public ID of the CAPTURE transaction that resolved the hold.
   */
  public get captureTransactionPublicId(): string | undefined {
    return this.props.captureTransactionPublicId;
  }

  /**
   * Whether the hold transaction has been recorded.
   */
  public hasHoldTransaction(): boolean {
    return this.props.holdTransactionPublicId !== undefined;
  }

  /**
   * Whether a RELEASE transaction has been recorded.
   */
  public hasReleaseTransaction(): boolean {
    return this.props.releaseTransactionPublicId !== undefined;
  }

  /**
   * Whether a CAPTURE transaction has been recorded.
   */
  public hasCaptureTransaction(): boolean {
    return this.props.captureTransactionPublicId !== undefined;
  }

  // ===========================================================================
  // Hold Transaction
  // ===========================================================================

  /**
   * Records the Financial Transaction that established the hold.
   *
   * This method does not create or execute the transaction.
   *
   * Intended for application, persistence, reconciliation, and recovery
   * workflows.
   */
  public setHoldTransactionPublicId(transactionPublicId: string): void {
    const normalizedId = this.normalizeTransactionPublicId(
      transactionPublicId,
      'hold transaction public ID',
    );

    if (this.props.holdTransactionPublicId !== undefined) {
      throw new FinancialAccountHoldException(
        'Financial Account Hold creation transaction has already been recorded',
      );
    }

    this.props.holdTransactionPublicId = normalizedId;

    this.touch();
  }

  // ===========================================================================
  // Release
  // ===========================================================================

  /**
   * Releases the active Financial Account Hold.
   *
   * Lifecycle:
   *
   *     ACTIVE -> RELEASED
   *
   * Release requires:
   *
   * - ACTIVE status;
   * - non-expired hold;
   * - valid RELEASE transaction public ID;
   * - no previously recorded RELEASE transaction.
   *
   * The entity records the lifecycle result and transaction reference.
   *
   * It does not create or execute the Financial RELEASE transaction.
   */
  public release(
    releaseTransactionPublicId: string,
    releasedAt: Date = new Date(),
  ): void {
    this.ensureActive();

    this.ensureNotExpired(releasedAt);

    const normalizedTransactionId = this.normalizeTransactionPublicId(
      releaseTransactionPublicId,
      'release transaction public ID',
    );

    this.ensureReleaseTransactionNotRecorded();

    const timestamp = FinancialAccountHoldEntity.cloneDate(releasedAt);

    this.props.status = FinancialAccountHoldStatus.released();

    this.props.releaseTransactionPublicId = normalizedTransactionId;

    this.props.releasedAt = timestamp;

    this.touch();
  }

  // ===========================================================================
  // Capture
  // ===========================================================================

  /**
   * Captures the active Financial Account Hold.
   *
   * Lifecycle:
   *
   *     ACTIVE -> CAPTURED
   *
   * Capture requires:
   *
   * - ACTIVE status;
   * - non-expired hold;
   * - valid CAPTURE transaction public ID;
   * - no previously recorded CAPTURE transaction.
   *
   * The entity records the lifecycle result and transaction reference.
   *
   * It does not perform the corresponding financial movement.
   */
  public capture(
    captureTransactionPublicId: string,
    capturedAt: Date = new Date(),
  ): void {
    this.ensureActive();

    this.ensureNotExpired(capturedAt);

    const normalizedTransactionId = this.normalizeTransactionPublicId(
      captureTransactionPublicId,
      'capture transaction public ID',
    );

    this.ensureCaptureTransactionNotRecorded();

    const timestamp = FinancialAccountHoldEntity.cloneDate(capturedAt);

    this.props.status = FinancialAccountHoldStatus.captured();

    this.props.captureTransactionPublicId = normalizedTransactionId;

    this.props.capturedAt = timestamp;

    this.touch();
  }

  // ===========================================================================
  // Cancellation
  // ===========================================================================

  /**
   * Cancels the active Financial Account Hold.
   *
   * Lifecycle:
   *
   *     ACTIVE -> CANCELLED
   *
   * Cancellation is intentionally distinct from normal RELEASE.
   *
   * Cancellation invalidates the hold itself. Because a cancelled hold must
   * no longer reserve funds, the corresponding RELEASE transaction is
   * recorded as part of the cancellation lifecycle.
   *
   * The financial workflow is:
   *
   *     Held Balance -> Available Balance
   *
   * through the RELEASE transaction identified by
   * releaseTransactionPublicId.
   *
   * This entity:
   *
   * - validates the ACTIVE lifecycle;
   * - validates the RELEASE transaction reference;
   * - records the RELEASE transaction reference;
   * - transitions the hold to CANCELLED;
   * - records cancelledAt.
   *
   * This entity does NOT:
   *
   * - create the RELEASE transaction;
   * - execute the RELEASE transaction;
   * - modify Financial Account balances;
   * - move money;
   * - communicate with external providers.
   */
  public cancel(
    releaseTransactionPublicId: string,
    cancelledAt: Date = new Date(),
  ): void {
    this.ensureActive();

    const normalizedTransactionId = this.normalizeTransactionPublicId(
      releaseTransactionPublicId,
      'release transaction public ID',
    );

    this.ensureReleaseTransactionNotRecorded();

    const timestamp = FinancialAccountHoldEntity.cloneDate(cancelledAt);

    this.props.status = FinancialAccountHoldStatus.cancelled();

    this.props.releaseTransactionPublicId = normalizedTransactionId;

    this.props.cancelledAt = timestamp;

    this.touch();
  }

  // ===========================================================================
  // Release Transaction Reference
  // ===========================================================================

  /**
   * Records the Financial RELEASE transaction associated with this hold.
   *
   * Intended primarily for persistence, reconciliation, and recovery
   * workflows.
   *
   * Normal lifecycle operations should prefer:
   *
   * - release()
   * - cancel()
   */
  public setReleaseTransactionPublicId(transactionPublicId: string): void {
    const normalizedId = this.normalizeTransactionPublicId(
      transactionPublicId,
      'release transaction public ID',
    );

    this.ensureReleaseTransactionNotRecorded();

    this.props.releaseTransactionPublicId = normalizedId;

    this.touch();
  }

  // ===========================================================================
  // Capture Transaction Reference
  // ===========================================================================

  /**
   * Records the Financial CAPTURE transaction associated with this hold.
   *
   * Intended primarily for persistence, reconciliation, and recovery
   * workflows.
   *
   * Normal lifecycle operations should prefer capture().
   */
  public setCaptureTransactionPublicId(transactionPublicId: string): void {
    const normalizedId = this.normalizeTransactionPublicId(
      transactionPublicId,
      'capture transaction public ID',
    );

    this.ensureCaptureTransactionNotRecorded();

    this.props.captureTransactionPublicId = normalizedId;

    this.touch();
  }

  // ===========================================================================
  // Lifecycle Eligibility
  // ===========================================================================

  /**
   * Determines whether the hold can currently be released.
   */
  public canRelease(at: Date = new Date()): boolean {
    return (
      this.props.status.canRelease() &&
      !this.isExpired(at) &&
      !this.hasReleaseTransaction()
    );
  }

  /**
   * Determines whether the hold can currently be captured.
   */
  public canCapture(at: Date = new Date()): boolean {
    return (
      this.props.status.canCapture() &&
      !this.isExpired(at) &&
      !this.hasCaptureTransaction()
    );
  }

  /**
   * Determines whether the hold can currently be cancelled.
   *
   * Cancellation is only valid while ACTIVE and requires an associated
   * RELEASE transaction.
   */
  public canCancel(): boolean {
    return this.props.status.canCancel() && !this.hasReleaseTransaction();
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Timestamp at which the hold was released.
   */
  public get releasedAt(): Date | undefined {
    return this.props.releasedAt !== undefined
      ? FinancialAccountHoldEntity.cloneDate(this.props.releasedAt)
      : undefined;
  }

  /**
   * Timestamp at which the hold was captured.
   */
  public get capturedAt(): Date | undefined {
    return this.props.capturedAt !== undefined
      ? FinancialAccountHoldEntity.cloneDate(this.props.capturedAt)
      : undefined;
  }

  /**
   * Timestamp at which the hold was cancelled.
   */
  public get cancelledAt(): Date | undefined {
    return this.props.cancelledAt !== undefined
      ? FinancialAccountHoldEntity.cloneDate(this.props.cancelledAt)
      : undefined;
  }

  /**
   * Entity creation timestamp.
   */
  public get createdAt(): Date {
    return FinancialAccountHoldEntity.cloneDate(this.props.createdAt);
  }

  /**
   * Entity last-update timestamp.
   */
  public get updatedAt(): Date {
    return FinancialAccountHoldEntity.cloneDate(this.props.updatedAt);
  }

  // ===========================================================================
  // Validation
  // ===========================================================================

  /**
   * Ensures the hold is currently ACTIVE.
   */
  private ensureActive(): void {
    if (!this.props.status.isActive()) {
      throw new FinancialAccountHoldInvalidStatusException(
        `Financial Account Hold "${this.publicId.value}" is not active`,
      );
    }
  }

  /**
   * Ensures the hold has not expired at the supplied point in time.
   */
  private ensureNotExpired(at: Date): void {
    if (this.isExpired(at)) {
      throw new FinancialAccountHoldExpiredException(
        `Financial Account Hold "${this.publicId.value}" has expired`,
      );
    }
  }

  /**
   * Prevents multiple RELEASE transaction associations.
   */
  private ensureReleaseTransactionNotRecorded(): void {
    if (this.props.releaseTransactionPublicId !== undefined) {
      throw new FinancialAccountHoldException(
        'Financial Account Hold release transaction has already been recorded',
      );
    }
  }

  /**
   * Prevents multiple CAPTURE transaction associations.
   */
  private ensureCaptureTransactionNotRecorded(): void {
    if (this.props.captureTransactionPublicId !== undefined) {
      throw new FinancialAccountHoldException(
        'Financial Account Hold capture transaction has already been recorded',
      );
    }
  }

  /**
   * Validates and normalizes a Financial Transaction public ID.
   */
  private normalizeTransactionPublicId(
    value: string,
    fieldName: string,
  ): string {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new FinancialAccountHoldException(
        `Financial Account Hold ${fieldName} must not be empty`,
      );
    }

    return normalized;
  }

  /**
   * Normalizes and validates the currency.
   *
   * Currency remains a primitive string at this entity level because the
   * current model intentionally keeps the held amount and currency as
   * separate concepts.
   */
  private static normalizeCurrency(value: string): string {
    const normalized = value.trim().toUpperCase();

    if (normalized.length === 0) {
      throw new FinancialAccountHoldException(
        'Financial Account Hold currency must not be empty',
      );
    }

    if (normalized.length > 10) {
      throw new FinancialAccountHoldException(
        'Financial Account Hold currency must not exceed 10 characters',
      );
    }

    return normalized;
  }

  /**
   * Validates a Date and returns a defensive copy.
   */
  private static cloneDate(value: Date): Date {
    FinancialAccountHoldEntity.ensureValidDate(value, 'date');

    return new Date(value.getTime());
  }

  /**
   * Ensures a supplied Date is valid.
   */
  private static ensureValidDate(value: Date, fieldName: string): void {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      throw new FinancialAccountHoldException(
        `Financial Account Hold ${fieldName} must be a valid date`,
      );
    }
  }

  // ===========================================================================
  // Persistence / Rehydration
  // ===========================================================================

  /**
   * Explicitly sets the updated timestamp.
   *
   * Primarily intended for persistence rehydration/mapping.
   *
   * This method does not emit a domain event.
   */
  public setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = FinancialAccountHoldEntity.cloneDate(updatedAt);
  }
}
