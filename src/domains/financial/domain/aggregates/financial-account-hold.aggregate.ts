// -----------------------------------------------------------------------------
// Financial Account Hold Aggregate
// -----------------------------------------------------------------------------
//
// Aggregate root for a Financial Account Hold.
//
// Responsibilities:
// - Own the Financial Account Hold entity.
// - Enforce Financial Account Hold aggregate invariants.
// - Coordinate hold lifecycle transitions.
// - Emit Financial Account Hold domain events.
//
// This aggregate does NOT:
// - Modify Financial Account balances.
// - Create or execute Financial Transactions.
// - Communicate with payment providers.
// - Coordinate Financial Account state.
// - Coordinate other Financial Account Holds.
// - Move money.
// - Persist itself.
//
// Financial Account balance mutations and Financial Transaction creation are
// coordinated by the appropriate application/domain workflow.
//
// Lifecycle:
//
//     ACTIVE
//        │
//        ├── RELEASED
//        ├── CAPTURED
//        └── CANCELLED
//
// RELEASED, CAPTURED and CANCELLED are terminal states.
//
// Cancellation is a business invalidation of the hold. Because a cancelled
// hold must no longer reserve funds, the corresponding financial workflow
// resolves the reservation through a RELEASE transaction.
//
// The RELEASE transaction is identified by releaseTransactionPublicId.
//
// Important:
//
// - The entity owns lifecycle state mutation and lifecycle invariants.
// - The aggregate coordinates the operation and emits domain events.
// - Financial Transactions are separate aggregates.
// - Financial Account balance mutation occurs outside this aggregate.
// - Domain event publication occurs outside this aggregate.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { FinancialAccountHoldEntity } from '../entities/financial-account-hold.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import { FinancialAccountHoldCreatedEvent } from '../events/financial-account-hold-created.event';

import { FinancialAccountHoldReleasedEvent } from '../events/financial-account-hold-released.event';

import { FinancialAccountHoldCapturedEvent } from '../events/financial-account-hold-captured.event';

import { FinancialAccountHoldCancelledEvent } from '../events/financial-account-hold-cancelled.event';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialAccountHoldException } from '../exceptions';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { FinancialAccountHoldPublicId } from '../value-objects/financial-account-hold-public-id.vo';

import type { FinancialAccountPublicId } from '../value-objects/financial-account-public-id.vo';

import type { FinancialAccountHeldAmount } from '../value-objects/financial-account-held-amount.vo';

import type { FinancialAccountHoldStatus } from '../value-objects/financial-account-hold-status.vo';

import type { FinancialHoldReference } from '../value-objects/financial-hold-reference.vo';

import type { FinancialHoldExpiry } from '../value-objects/financial-hold-expiry.vo';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialAccountHoldAggregateProps {
  hold: FinancialAccountHoldEntity;
}

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

export class FinancialAccountHoldAggregate extends AggregateRoot<FinancialAccountHoldAggregateProps> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(props: FinancialAccountHoldAggregateProps) {
    super(props);
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates a brand-new Financial Account Hold aggregate.
   *
   * The supplied entity is expected to already contain the complete initial
   * state established by FinancialAccountHoldEntity.create().
   *
   * Creation does not automatically emit the Created event.
   *
   * The application boundary explicitly calls recordCreated() after the
   * creation workflow has successfully established the hold.
   */
  public static create(
    hold: FinancialAccountHoldEntity,
  ): FinancialAccountHoldAggregate {
    return new FinancialAccountHoldAggregate({
      hold,
    });
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  /**
   * Rehydrates a Financial Account Hold aggregate from persistence.
   *
   * Rehydration never emits historical domain events.
   */
  public static rehydrate(
    hold: FinancialAccountHoldEntity,
  ): FinancialAccountHoldAggregate {
    return new FinancialAccountHoldAggregate({
      hold,
    });
  }

  // ===========================================================================
  // Aggregate State
  // ===========================================================================

  /**
   * Returns the Financial Account Hold entity owned by this aggregate.
   *
   * Consumers should prefer aggregate behavior methods over directly mutating
   * the entity.
   */
  public get hold(): FinancialAccountHoldEntity {
    return this.props.hold;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Internal aggregate identity.
   *
   * Used by persistence and DomainEvent.metadata.aggregateId.
   */
  public override get id() {
    return this.hold.id;
  }

  /**
   * Public identity of the Financial Account Hold.
   */
  public override get publicId(): FinancialAccountHoldPublicId {
    return this.hold.publicId;
  }

  // ===========================================================================
  // Account Reference
  // ===========================================================================

  /**
   * Internal identity of the owning Financial Account.
   *
   * The Financial Account aggregate is never embedded inside this aggregate.
   */
  public get accountId() {
    return this.hold.accountId;
  }

  /**
   * Public identity of the owning Financial Account.
   *
   * This is the stable opaque cross-aggregate reference.
   */
  public get accountPublicId(): FinancialAccountPublicId {
    return this.hold.accountPublicId;
  }

  // ===========================================================================
  // Hold State
  // ===========================================================================

  /**
   * Amount reserved by the hold.
   *
   * The hold aggregate intentionally exposes its specialized
   * FinancialAccountHeldAmount value object.
   */
  public get amount(): FinancialAccountHeldAmount {
    return this.hold.amount;
  }

  /**
   * Numeric value of the held amount.
   *
   * Expressed in the smallest monetary unit supported by the Financial
   * domain.
   */
  public get amountValue(): number {
    return this.hold.amountValue;
  }

  /**
   * Currency of the held funds.
   */
  public get currency(): string {
    return this.hold.currency;
  }

  /**
   * Current lifecycle status of the hold.
   */
  public get status(): FinancialAccountHoldStatus {
    return this.hold.status;
  }

  // ===========================================================================
  // Reference
  // ===========================================================================

  /**
   * Optional business reference associated with the hold.
   */
  public get reference(): FinancialHoldReference | undefined {
    return this.hold.reference;
  }

  /**
   * Whether the hold has an associated business reference.
   */
  public get hasReference(): boolean {
    return this.hold.hasReference();
  }

  /**
   * Determines whether this hold belongs to the supplied business reference.
   */
  public isForReference(type: string, publicId: string): boolean {
    return this.hold.isForReference(type, publicId);
  }

  // ===========================================================================
  // Expiry
  // ===========================================================================

  /**
   * Optional hold expiry.
   */
  public get expiresAt(): FinancialHoldExpiry | undefined {
    return this.hold.expiresAt;
  }

  /**
   * Whether the hold has an expiry.
   */
  public get hasExpiry(): boolean {
    return this.hold.hasExpiry();
  }

  /**
   * Determines whether the hold has expired at the supplied point in time.
   */
  public isExpired(at: Date = new Date()): boolean {
    return this.hold.isExpired(at);
  }

  /**
   * Determines whether the hold is ACTIVE and has not expired.
   */
  public isCurrentlyActive(at: Date = new Date()): boolean {
    return this.hold.isCurrentlyActive(at);
  }

  // ===========================================================================
  // Lifecycle State
  // ===========================================================================

  /**
   * Whether the hold is ACTIVE.
   */
  public get isActive(): boolean {
    return this.hold.isActive();
  }

  /**
   * Whether the hold has been RELEASED.
   */
  public get isReleased(): boolean {
    return this.hold.isReleased();
  }

  /**
   * Whether the hold has been CAPTURED.
   */
  public get isCaptured(): boolean {
    return this.hold.isCaptured();
  }

  /**
   * Whether the hold has been CANCELLED.
   */
  public get isCancelled(): boolean {
    return this.hold.isCancelled();
  }

  /**
   * Whether the hold is in a terminal state.
   */
  public get isTerminal(): boolean {
    return this.hold.isTerminal();
  }

  // ===========================================================================
  // Transaction References
  // ===========================================================================

  /**
   * Public ID of the Financial Transaction that established the hold.
   */
  public get holdTransactionPublicId(): string | undefined {
    return this.hold.holdTransactionPublicId;
  }

  /**
   * Public ID of the Financial RELEASE transaction associated with resolving
   * the reserved funds.
   *
   * This may be populated for:
   *
   * - normal RELEASE;
   * - CANCELLED + RELEASE workflows.
   */
  public get releaseTransactionPublicId(): string | undefined {
    return this.hold.releaseTransactionPublicId;
  }

  /**
   * Public ID of the Financial CAPTURE transaction that resolved the hold.
   */
  public get captureTransactionPublicId(): string | undefined {
    return this.hold.captureTransactionPublicId;
  }

  /**
   * Whether the hold-establishing transaction has been recorded.
   */
  public get hasHoldTransaction(): boolean {
    return this.hold.hasHoldTransaction();
  }

  /**
   * Whether a RELEASE transaction has been recorded.
   */
  public get hasReleaseTransaction(): boolean {
    return this.hold.hasReleaseTransaction();
  }

  /**
   * Whether a CAPTURE transaction has been recorded.
   */
  public get hasCaptureTransaction(): boolean {
    return this.hold.hasCaptureTransaction();
  }

  // ===========================================================================
  // Lifecycle Eligibility
  // ===========================================================================

  /**
   * Determines whether the hold can currently be released.
   */
  public canRelease(at: Date = new Date()): boolean {
    return this.hold.canRelease(at);
  }

  /**
   * Determines whether the hold can currently be captured.
   */
  public canCapture(at: Date = new Date()): boolean {
    return this.hold.canCapture(at);
  }

  /**
   * Determines whether the hold can currently be cancelled.
   */
  public canCancel(): boolean {
    return this.hold.canCancel();
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Timestamp at which the hold entered RELEASED state.
   */
  public get releasedAt(): Date | undefined {
    return this.hold.releasedAt;
  }

  /**
   * Timestamp at which the hold entered CAPTURED state.
   */
  public get capturedAt(): Date | undefined {
    return this.hold.capturedAt;
  }

  /**
   * Timestamp at which the hold entered CANCELLED state.
   */
  public get cancelledAt(): Date | undefined {
    return this.hold.cancelledAt;
  }

  /**
   * Entity creation timestamp.
   */
  public get createdAt(): Date {
    return this.hold.createdAt;
  }

  /**
   * Entity last-update timestamp.
   */
  public get updatedAt(): Date {
    return this.hold.updatedAt;
  }

  // ===========================================================================
  // Creation
  // ===========================================================================

  /**
   * Records creation of the Financial Account Hold.
   *
   * The entity already contains the initial ACTIVE state.
   *
   * This method only emits the domain event.
   *
   * It does NOT:
   *
   * - modify Financial Account balances;
   * - create a Financial Transaction;
   * - execute a Financial Transaction.
   */
  public recordCreated(correlationId: string, causationId?: string): void {
    this.addDomainEvent(
      new FinancialAccountHoldCreatedEvent(
        this.id.value,
        this.publicId,
        this.accountPublicId,
        this.amount,
        this.currency,
        this.status,
        this.reference,
        this.expiresAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Release
  // ===========================================================================

  /**
   * Releases the Financial Account Hold.
   *
   * Lifecycle:
   *
   *     ACTIVE -> RELEASED
   *
   * The entity enforces:
   *
   * - ACTIVE status;
   * - non-expired hold;
   * - valid RELEASE transaction public ID;
   * - no previously recorded RELEASE transaction.
   *
   * The aggregate delegates lifecycle mutation to the entity and then emits
   * the corresponding domain event.
   *
   * This aggregate does NOT:
   *
   * - create the RELEASE transaction;
   * - execute the RELEASE transaction;
   * - modify Financial Account balances;
   * - communicate with payment providers.
   */
  public release(
    releaseTransactionPublicId: string,
    releasedAt: Date,
    correlationId: string,
    causationId?: string,
  ): void {
    // -------------------------------------------------------------------------
    // State Mutation
    // -------------------------------------------------------------------------

    this.hold.release(releaseTransactionPublicId, releasedAt);

    // -------------------------------------------------------------------------
    // Required Transaction Reference
    // -------------------------------------------------------------------------

    const recordedReleaseTransactionPublicId =
      this.requireReleaseTransactionPublicId();

    // -------------------------------------------------------------------------
    // Domain Event
    // -------------------------------------------------------------------------

    this.addDomainEvent(
      new FinancialAccountHoldReleasedEvent(
        this.id.value,
        this.publicId,
        this.accountPublicId,
        this.amount,
        this.currency,
        this.status,
        recordedReleaseTransactionPublicId,
        this.reference,
        releasedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Capture
  // ===========================================================================

  /**
   * Captures the Financial Account Hold.
   *
   * Lifecycle:
   *
   *     ACTIVE -> CAPTURED
   *
   * The entity enforces:
   *
   * - ACTIVE status;
   * - non-expired hold;
   * - valid CAPTURE transaction public ID;
   * - no previously recorded CAPTURE transaction.
   *
   * The aggregate delegates lifecycle mutation to the entity and then emits
   * the corresponding domain event.
   *
   * This aggregate does NOT:
   *
   * - create the CAPTURE transaction;
   * - execute the CAPTURE transaction;
   * - modify Financial Account balances;
   * - communicate with payment providers.
   */
  public capture(
    captureTransactionPublicId: string,
    capturedAt: Date,
    correlationId: string,
    causationId?: string,
  ): void {
    // -------------------------------------------------------------------------
    // State Mutation
    // -------------------------------------------------------------------------

    this.hold.capture(captureTransactionPublicId, capturedAt);

    // -------------------------------------------------------------------------
    // Required Transaction Reference
    // -------------------------------------------------------------------------

    const recordedCaptureTransactionPublicId =
      this.requireCaptureTransactionPublicId();

    // -------------------------------------------------------------------------
    // Domain Event
    // -------------------------------------------------------------------------

    this.addDomainEvent(
      new FinancialAccountHoldCapturedEvent(
        this.id.value,
        this.publicId,
        this.accountPublicId,
        this.amount,
        this.currency,
        this.status,
        recordedCaptureTransactionPublicId,
        this.reference,
        capturedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Cancellation
  // ===========================================================================

  /**
   * Cancels the Financial Account Hold.
   *
   * Lifecycle:
   *
   *     ACTIVE -> CANCELLED
   *
   * Cancellation represents business invalidation of the hold.
   *
   * Because a cancelled hold must no longer reserve funds, the cancellation
   * requires the RELEASE transaction that resolves the reservation.
   *
   * The entity operation atomically performs:
   *
   *     ACTIVE
   *       │
   *       └──> CANCELLED
   *
   * while recording:
   *
   *     releaseTransactionPublicId
   *
   * The aggregate therefore delegates the complete cancellation invariant to
   * FinancialAccountHoldEntity.cancel().
   *
   * This aggregate does NOT:
   *
   * - create the RELEASE transaction;
   * - execute the RELEASE transaction;
   * - modify Financial Account balances;
   * - move money;
   * - communicate with payment providers.
   */
  public cancel(
    releaseTransactionPublicId: string,
    cancelledAt: Date,
    correlationId: string,
    causationId?: string,
  ): void {
    // -------------------------------------------------------------------------
    // State Mutation
    // -------------------------------------------------------------------------

    /**
     * The entity owns the complete cancellation invariant:
     *
     * - hold must be ACTIVE;
     * - release transaction ID must be valid;
     * - release transaction must not already be recorded;
     * - lifecycle becomes CANCELLED;
     * - release transaction reference is recorded;
     * - cancellation timestamp is recorded.
     */
    this.hold.cancel(releaseTransactionPublicId, cancelledAt);

    // -------------------------------------------------------------------------
    // Required Transaction Reference
    // -------------------------------------------------------------------------

    const recordedReleaseTransactionPublicId =
      this.requireReleaseTransactionPublicId();

    // -------------------------------------------------------------------------
    // Domain Event
    // -------------------------------------------------------------------------

    this.addDomainEvent(
      new FinancialAccountHoldCancelledEvent(
        this.id.value,
        this.publicId,
        this.accountPublicId,
        this.amount,
        this.currency,
        this.status,
        recordedReleaseTransactionPublicId,
        this.reference,
        cancelledAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Internal Invariant Guards
  // ===========================================================================

  /**
   * Returns the recorded RELEASE transaction public ID.
   *
   * RELEASED and CANCELLED events require a RELEASE transaction reference.
   *
   * This guard protects the aggregate from emitting an inconsistent event if
   * the entity contract is ever changed or rehydrated incorrectly.
   */
  private requireReleaseTransactionPublicId(): string {
    const transactionPublicId = this.hold.releaseTransactionPublicId;

    if (transactionPublicId === undefined) {
      throw new FinancialAccountHoldException(
        `Financial Account Hold "${this.publicId.value}" does not have a recorded release transaction public ID`,
      );
    }

    return transactionPublicId;
  }

  /**
   * Returns the recorded CAPTURE transaction public ID.
   *
   * A CAPTURED hold event must always contain the transaction that resolved
   * the hold through capture.
   */
  private requireCaptureTransactionPublicId(): string {
    const transactionPublicId = this.hold.captureTransactionPublicId;

    if (transactionPublicId === undefined) {
      throw new FinancialAccountHoldException(
        `Financial Account Hold "${this.publicId.value}" does not have a recorded capture transaction public ID`,
      );
    }

    return transactionPublicId;
  }

  // ===========================================================================
  // Event State Protection
  // ===========================================================================

  /**
   * The aggregate intentionally does not expose arbitrary event registration.
   *
   * Domain events can only be generated through meaningful aggregate
   * operations:
   *
   * - recordCreated()
   * - release()
   * - capture()
   * - cancel()
   *
   * Rehydration never emits historical domain events.
   */
}
