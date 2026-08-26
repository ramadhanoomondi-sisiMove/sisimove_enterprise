// -----------------------------------------------------------------------------
// Financial Account Withdrawal Entity
// -----------------------------------------------------------------------------
//
// Represents a request by a Financial Account owner to withdraw available
// funds to an external destination.
//
// Aggregate:
// - FinancialAccountWithdrawalAggregate
//
// Responsibilities:
// - Withdrawal identity.
// - Owning Financial Account reference.
// - Withdrawal amount and currency.
// - Immutable withdrawal destination snapshot.
// - Optional immutable business reference.
// - Withdrawal lifecycle.
// - Optional Financial Disbursement reference.
// - Lifecycle invariants.
// - Lifecycle timestamps.
//
// -----------------------------------------------------------------------------
// Aggregate Boundary
// -----------------------------------------------------------------------------
//
// This entity belongs exclusively to:
//
//     FinancialAccountWithdrawalAggregate
//
// It does NOT own:
//
// - FinancialAccount;
// - FinancialTransaction;
// - FinancialDisbursement;
// - FinancialDisbursementDestination.
//
// The Financial Account is represented only by:
// - its internal persistence ID;
// - its opaque public ID.
//
// The Financial Disbursement is represented only by its opaque public ID once
// the downstream disbursement workflow associates it with this withdrawal.
//
// -----------------------------------------------------------------------------
// Destination
// -----------------------------------------------------------------------------
//
// The withdrawal owns an immutable:
//
//     FinancialAccountWithdrawalDestination
//
// snapshot.
//
// The destination is NOT:
//
// - another aggregate;
// - a repository reference;
// - FinancialDisbursementDestinationPublicId;
// - FinancialDisbursementDestination;
// - a live configured destination;
// - a mutable external destination.
//
// The application layer may resolve and select a configured destination before
// creating the withdrawal.
//
// Once captured, the destination belongs permanently to the withdrawal.
//
// This guarantees that changes to a configured FinancialDisbursementDestination
// cannot alter the historical destination of an existing withdrawal.
//
// The Financial Disbursement workflow later consumes this snapshot when
// creating/executing the external payout.
//
// -----------------------------------------------------------------------------
// Lifecycle
// -----------------------------------------------------------------------------
//
//   PENDING
//      ├── PROCESSING
//      │      ├── COMPLETED
//      │      ├── FAILED
//      │      └── CANCELLED
//      │
//      └── CANCELLED
//
// COMPLETED, FAILED and CANCELLED are terminal states.
//
// -----------------------------------------------------------------------------
// Immutability
// -----------------------------------------------------------------------------
//
// Immutable after creation:
//
// - accountId;
// - accountPublicId;
// - amount;
// - destination;
// - referenceType;
// - referencePublicId;
// - requestedAt;
// - createdAt.
//
// Mutable:
//
// - status;
// - disbursementPublicId;
// - completedAt;
// - failedAt;
// - cancelledAt;
// - updatedAt.
//
// -----------------------------------------------------------------------------
// Responsibilities NOT owned by this entity
// -----------------------------------------------------------------------------
//
// This entity does NOT:
//
// - modify Financial Account balances;
// - reserve or release Financial Account funds;
// - create Financial Transactions;
// - create Financial Disbursements;
// - execute Financial Disbursements;
// - communicate with external providers;
// - coordinate Financial Account state;
// - coordinate Financial Disbursement state;
// - persist itself;
// - publish domain events.
//
// Those responsibilities belong to the appropriate aggregate, application
// workflow, repository, and integration boundaries.
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

import { FinancialAccountWithdrawalException } from '../exceptions/financial-account-withdrawal.exception';

import { FinancialAccountWithdrawalInvalidStatusException } from '../exceptions/financial-account-withdrawal-invalid-status.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { FinancialAccountWithdrawalPublicId } from '../value-objects/financial-account-withdrawal-public-id.vo';

import { FinancialAccountWithdrawalStatus } from '../value-objects/financial-account-withdrawal-status.vo';

import type { FinancialAccountWithdrawalDestination } from '../value-objects/financial-account-withdrawal-destination.vo';

import type { FinancialAccountPublicId } from '../value-objects/financial-account-public-id.vo';

import type { FinancialReferenceType } from '../value-objects/financial-reference-type.vo';

import type { FinancialReferencePublicId } from '../value-objects/financial-reference-public-id.vo';

import type { Money } from '../value-objects/money.vo';

// =============================================================================
// Props
// =============================================================================

export interface FinancialAccountWithdrawalProps {
  // ---------------------------------------------------------------------------
  // Account
  // ---------------------------------------------------------------------------

  /**
   * Internal identity of the owning Financial Account.
   *
   * Used for persistence relationships only.
   *
   * The Financial Account aggregate is never embedded here.
   */
  readonly accountId: UniqueEntityId;

  /**
   * Public identity of the owning Financial Account.
   *
   * Opaque cross-aggregate reference.
   */
  readonly accountPublicId: FinancialAccountPublicId;

  // ---------------------------------------------------------------------------
  // Amount
  // ---------------------------------------------------------------------------

  /**
   * Requested withdrawal amount.
   */
  readonly amount: Money;

  // ---------------------------------------------------------------------------
  // Destination
  // ---------------------------------------------------------------------------

  /**
   * Immutable snapshot of the selected external withdrawal destination.
   *
   * This is request-level domain data and is not an aggregate reference.
   */
  readonly destination: FinancialAccountWithdrawalDestination;

  // ---------------------------------------------------------------------------
  // Business Reference
  // ---------------------------------------------------------------------------

  /**
   * Optional originating business reference type.
   *
   * Must be supplied together with referencePublicId.
   *
   * Immutable for the lifetime of the withdrawal.
   */
  readonly referenceType: FinancialReferenceType | undefined;

  /**
   * Optional originating business reference public ID.
   *
   * Must be supplied together with referenceType.
   *
   * Immutable for the lifetime of the withdrawal.
   */
  readonly referencePublicId: FinancialReferencePublicId | undefined;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Current withdrawal lifecycle status.
   *
   * Mutable because the entity owns lifecycle transitions.
   */
  status: FinancialAccountWithdrawalStatus;

  // ---------------------------------------------------------------------------
  // Disbursement
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Financial Disbursement associated with this
   * withdrawal.
   *
   * Opaque cross-aggregate reference.
   *
   * Undefined until a disbursement is associated.
   */
  disbursementPublicId: string | undefined;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the withdrawal was requested.
   *
   * Immutable historical fact.
   */
  readonly requestedAt: Date;

  /**
   * Timestamp at which the withdrawal completed.
   */
  completedAt: Date | undefined;

  /**
   * Timestamp at which the withdrawal failed.
   */
  failedAt: Date | undefined;

  /**
   * Timestamp at which the withdrawal was cancelled.
   */
  cancelledAt: Date | undefined;

  /**
   * Entity creation timestamp.
   *
   * Immutable historical fact.
   */
  readonly createdAt: Date;

  /**
   * Entity last-update timestamp.
   */
  updatedAt: Date;
}

// =============================================================================
// Entity
// =============================================================================

export class FinancialAccountWithdrawalEntity extends Entity<
  FinancialAccountWithdrawalProps,
  FinancialAccountWithdrawalPublicId
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    props: FinancialAccountWithdrawalProps,
    id?: UniqueEntityId,
    publicId?: FinancialAccountWithdrawalPublicId,
  ) {
    super(props, id, publicId);
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates a new Financial Account Withdrawal entity.
   *
   * The selected destination is captured as an immutable snapshot.
   *
   * No destination aggregate is retained or resolved by this entity.
   *
   * The withdrawal starts in PENDING state.
   */
  public static create(
    accountId: UniqueEntityId,
    accountPublicId: FinancialAccountPublicId,
    amount: Money,
    destination: FinancialAccountWithdrawalDestination,
    referenceType: FinancialReferenceType | undefined = undefined,
    referencePublicId: FinancialReferencePublicId | undefined = undefined,
    requestedAt: Date = new Date(),
  ): FinancialAccountWithdrawalEntity {
    FinancialAccountWithdrawalEntity.ensureValidDate(
      requestedAt,
      'requested date',
    );

    FinancialAccountWithdrawalEntity.ensurePositiveAmount(amount);

    FinancialAccountWithdrawalEntity.ensureReferencePair(
      referenceType,
      referencePublicId,
    );

    const requestedTimestamp =
      FinancialAccountWithdrawalEntity.cloneDate(requestedAt);

    return new FinancialAccountWithdrawalEntity(
      {
        accountId,
        accountPublicId,
        amount,
        destination,

        referenceType,
        referencePublicId,

        status: FinancialAccountWithdrawalStatus.pending(),

        disbursementPublicId: undefined,

        requestedAt: requestedTimestamp,

        completedAt: undefined,
        failedAt: undefined,
        cancelledAt: undefined,

        createdAt:
          FinancialAccountWithdrawalEntity.cloneDate(requestedTimestamp),

        updatedAt:
          FinancialAccountWithdrawalEntity.cloneDate(requestedTimestamp),
      },

      new UniqueEntityId(),

      new FinancialAccountWithdrawalPublicId(),
    );
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  /**
   * Rehydrates a persisted Financial Account Withdrawal entity.
   *
   * Rehydration validates the complete aggregate state but does not emit
   * domain events.
   */
  public static rehydrate(
    props: FinancialAccountWithdrawalProps,
    id: UniqueEntityId,
    publicId: FinancialAccountWithdrawalPublicId,
  ): FinancialAccountWithdrawalEntity {
    FinancialAccountWithdrawalEntity.ensureValidDate(
      props.requestedAt,
      'requested date',
    );

    FinancialAccountWithdrawalEntity.ensureValidDate(
      props.createdAt,
      'creation date',
    );

    FinancialAccountWithdrawalEntity.ensureValidDate(
      props.updatedAt,
      'updated date',
    );

    if (props.completedAt !== undefined) {
      FinancialAccountWithdrawalEntity.ensureValidDate(
        props.completedAt,
        'completion date',
      );
    }

    if (props.failedAt !== undefined) {
      FinancialAccountWithdrawalEntity.ensureValidDate(
        props.failedAt,
        'failure date',
      );
    }

    if (props.cancelledAt !== undefined) {
      FinancialAccountWithdrawalEntity.ensureValidDate(
        props.cancelledAt,
        'cancellation date',
      );
    }

    FinancialAccountWithdrawalEntity.ensurePositiveAmount(props.amount);

    FinancialAccountWithdrawalEntity.ensureReferencePair(
      props.referenceType,
      props.referencePublicId,
    );

    FinancialAccountWithdrawalEntity.ensureLifecycleConsistency(props);

    const normalizedDisbursementPublicId =
      props.disbursementPublicId !== undefined
        ? FinancialAccountWithdrawalEntity.normalizeDisbursementPublicId(
            props.disbursementPublicId,
          )
        : undefined;

    return new FinancialAccountWithdrawalEntity(
      {
        accountId: props.accountId,
        accountPublicId: props.accountPublicId,
        amount: props.amount,
        destination: props.destination,

        referenceType: props.referenceType,
        referencePublicId: props.referencePublicId,

        status: props.status,

        disbursementPublicId: normalizedDisbursementPublicId,

        requestedAt: FinancialAccountWithdrawalEntity.cloneDate(
          props.requestedAt,
        ),

        completedAt:
          props.completedAt !== undefined
            ? FinancialAccountWithdrawalEntity.cloneDate(props.completedAt)
            : undefined,

        failedAt:
          props.failedAt !== undefined
            ? FinancialAccountWithdrawalEntity.cloneDate(props.failedAt)
            : undefined,

        cancelledAt:
          props.cancelledAt !== undefined
            ? FinancialAccountWithdrawalEntity.cloneDate(props.cancelledAt)
            : undefined,

        createdAt: FinancialAccountWithdrawalEntity.cloneDate(props.createdAt),

        updatedAt: FinancialAccountWithdrawalEntity.cloneDate(props.updatedAt),
      },

      id,

      publicId,
    );
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  public override get publicId(): FinancialAccountWithdrawalPublicId {
    return super.publicId;
  }

  // ===========================================================================
  // Account
  // ===========================================================================

  /**
   * Internal Financial Account identity used for persistence.
   */
  public get accountId(): UniqueEntityId {
    return this.props.accountId;
  }

  /**
   * Public Financial Account identity used as an opaque cross-aggregate
   * reference.
   */
  public get accountPublicId(): FinancialAccountPublicId {
    return this.props.accountPublicId;
  }

  // ===========================================================================
  // Amount
  // ===========================================================================

  /**
   * Requested withdrawal amount.
   */
  public get amount(): Money {
    return this.props.amount;
  }

  /**
   * Numeric withdrawal amount.
   */
  public get amountValue(): number {
    return this.props.amount.amount;
  }

  /**
   * Withdrawal currency.
   */
  public get currency(): string {
    return this.props.amount.currency.value;
  }

  // ===========================================================================
  // Destination
  // ===========================================================================

  /**
   * Immutable destination snapshot captured by this withdrawal.
   *
   * This is a value object, not an aggregate reference.
   */
  public get destination(): FinancialAccountWithdrawalDestination {
    return this.props.destination;
  }

  /**
   * Destination type.
   *
   * Examples:
   *
   * - MOBILE_MONEY
   * - BANK_ACCOUNT
   * - OTHER
   */
  public get destinationType(): string {
    return this.props.destination.type;
  }

  /**
   * Destination value captured in the withdrawal snapshot.
   */
  public get destinationValue(): string {
    return this.props.destination.value;
  }

  /**
   * Determines whether the withdrawal targets the supplied destination value.
   *
   * Comparison is made against the immutable snapshot owned by this
   * withdrawal.
   */
  public isForDestination(destinationValue: string): boolean {
    const normalized = destinationValue.trim();

    if (normalized.length === 0) {
      return false;
    }

    return this.props.destination.value === normalized;
  }

  // ===========================================================================
  // Business Reference
  // ===========================================================================

  /**
   * Optional originating business reference type.
   *
   * Immutable for the lifetime of the withdrawal.
   */
  public get referenceType(): FinancialReferenceType | undefined {
    return this.props.referenceType;
  }

  /**
   * Optional originating business reference public ID.
   *
   * Immutable for the lifetime of the withdrawal.
   */
  public get referencePublicId(): FinancialReferencePublicId | undefined {
    return this.props.referencePublicId;
  }

  /**
   * Determines whether the withdrawal has a complete business reference.
   */
  public hasReference(): boolean {
    return (
      this.props.referenceType !== undefined &&
      this.props.referencePublicId !== undefined
    );
  }

  // ===========================================================================
  // Status
  // ===========================================================================

  /**
   * Current withdrawal lifecycle status.
   */
  public get status(): FinancialAccountWithdrawalStatus {
    return this.props.status;
  }

  public isPending(): boolean {
    return this.props.status.isPending();
  }

  public isProcessing(): boolean {
    return this.props.status.isProcessing();
  }

  public isCompleted(): boolean {
    return this.props.status.isCompleted();
  }

  public isFailed(): boolean {
    return this.props.status.isFailed();
  }

  public isCancelled(): boolean {
    return this.props.status.isCancelled();
  }

  public isTerminal(): boolean {
    return this.props.status.isTerminal();
  }

  // ===========================================================================
  // Lifecycle Eligibility
  // ===========================================================================

  /**
   * Determines whether the withdrawal may enter PROCESSING.
   *
   * A withdrawal may only be processed from PENDING and must not already have
   * a Financial Disbursement associated with it.
   */
  public canProcess(): boolean {
    return this.props.status.canProcess() && !this.hasDisbursement();
  }

  /**
   * Determines whether the withdrawal may complete.
   */
  public canComplete(): boolean {
    return this.props.status.canComplete();
  }

  /**
   * Determines whether the withdrawal may fail.
   */
  public canFail(): boolean {
    return this.props.status.canFail();
  }

  /**
   * Determines whether the withdrawal may be cancelled.
   */
  public canCancel(): boolean {
    return this.props.status.canCancel();
  }

  // ===========================================================================
  // Processing
  // ===========================================================================

  /**
   * Transitions:
   *
   *     PENDING -> PROCESSING
   *
   * The entity does not create or execute the Financial Disbursement.
   */
  public process(): void {
    if (!this.props.status.canProcess()) {
      throw new FinancialAccountWithdrawalInvalidStatusException(
        `Financial Account Withdrawal "${this.publicId.value}" cannot be processed from status "${this.status.value}"`,
      );
    }

    if (this.hasDisbursement()) {
      throw new FinancialAccountWithdrawalException(
        `Financial Account Withdrawal "${this.publicId.value}" already has a Financial Disbursement`,
      );
    }

    this.props.status = FinancialAccountWithdrawalStatus.processing();

    this.touch();
  }

  // ===========================================================================
  // Completion
  // ===========================================================================

  /**
   * Transitions:
   *
   *     PROCESSING -> COMPLETED
   *
   * Completion represents successful completion of the withdrawal lifecycle.
   *
   * It does not itself:
   *
   * - mutate Financial Account balances;
   * - create a Financial Transaction;
   * - execute a Financial Disbursement.
   */
  public complete(completedAt: Date = new Date()): void {
    this.ensureProcessing();

    FinancialAccountWithdrawalEntity.ensureValidDate(
      completedAt,
      'completion date',
    );

    const timestamp = FinancialAccountWithdrawalEntity.cloneDate(completedAt);

    FinancialAccountWithdrawalEntity.ensureNotBefore(
      timestamp,
      this.props.requestedAt,
      'completion date',
    );

    this.props.status = FinancialAccountWithdrawalStatus.completed();

    this.props.completedAt = timestamp;

    this.touch(timestamp);
  }

  // ===========================================================================
  // Failure
  // ===========================================================================

  /**
   * Transitions:
   *
   *     PROCESSING -> FAILED
   *
   * Failure details are supplied by the surrounding application/domain
   * workflow and failure event.
   */
  public fail(failedAt: Date = new Date()): void {
    this.ensureProcessing();

    FinancialAccountWithdrawalEntity.ensureValidDate(failedAt, 'failure date');

    const timestamp = FinancialAccountWithdrawalEntity.cloneDate(failedAt);

    FinancialAccountWithdrawalEntity.ensureNotBefore(
      timestamp,
      this.props.requestedAt,
      'failure date',
    );

    this.props.status = FinancialAccountWithdrawalStatus.failed();

    this.props.failedAt = timestamp;

    this.touch(timestamp);
  }

  // ===========================================================================
  // Cancellation
  // ===========================================================================

  /**
   * Transitions:
   *
   *     PENDING    -> CANCELLED
   *     PROCESSING -> CANCELLED
   */
  public cancel(cancelledAt: Date = new Date()): void {
    if (!this.props.status.canCancel()) {
      throw new FinancialAccountWithdrawalInvalidStatusException(
        `Financial Account Withdrawal "${this.publicId.value}" cannot be cancelled from status "${this.status.value}"`,
      );
    }

    FinancialAccountWithdrawalEntity.ensureValidDate(
      cancelledAt,
      'cancellation date',
    );

    const timestamp = FinancialAccountWithdrawalEntity.cloneDate(cancelledAt);

    FinancialAccountWithdrawalEntity.ensureNotBefore(
      timestamp,
      this.props.requestedAt,
      'cancellation date',
    );

    this.props.status = FinancialAccountWithdrawalStatus.cancelled();

    this.props.cancelledAt = timestamp;

    this.touch(timestamp);
  }

  // ===========================================================================
  // Disbursement Reference
  // ===========================================================================

  /**
   * Public identity of the associated Financial Disbursement.
   *
   * This is an opaque cross-aggregate reference.
   */
  public get disbursementPublicId(): string | undefined {
    return this.props.disbursementPublicId;
  }

  /**
   * Determines whether a Financial Disbursement has been associated.
   */
  public hasDisbursement(): boolean {
    return this.props.disbursementPublicId !== undefined;
  }

  /**
   * Associates the Financial Disbursement responsible for executing this
   * withdrawal.
   *
   * This method does not create or execute the disbursement.
   *
   * The same public ID may be assigned repeatedly as an idempotent operation.
   * A different public ID cannot replace an existing association.
   *
   * Association is allowed only while the withdrawal is non-terminal.
   */
  public setDisbursementPublicId(disbursementPublicId: string): void {
    if (this.props.status.isTerminal()) {
      throw new FinancialAccountWithdrawalInvalidStatusException(
        `Financial Account Withdrawal "${this.publicId.value}" cannot associate a Financial Disbursement after reaching terminal status "${this.status.value}"`,
      );
    }

    const normalized =
      FinancialAccountWithdrawalEntity.normalizeDisbursementPublicId(
        disbursementPublicId,
      );

    if (this.props.disbursementPublicId !== undefined) {
      if (this.props.disbursementPublicId === normalized) {
        return;
      }

      throw new FinancialAccountWithdrawalException(
        `Financial Account Withdrawal "${this.publicId.value}" is already associated with another Financial Disbursement`,
      );
    }

    this.props.disbursementPublicId = normalized;

    this.touch();
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Timestamp at which the withdrawal was requested.
   */
  public get requestedAt(): Date {
    return FinancialAccountWithdrawalEntity.cloneDate(this.props.requestedAt);
  }

  /**
   * Timestamp at which the withdrawal completed.
   */
  public get completedAt(): Date | undefined {
    return this.props.completedAt !== undefined
      ? FinancialAccountWithdrawalEntity.cloneDate(this.props.completedAt)
      : undefined;
  }

  /**
   * Timestamp at which the withdrawal failed.
   */
  public get failedAt(): Date | undefined {
    return this.props.failedAt !== undefined
      ? FinancialAccountWithdrawalEntity.cloneDate(this.props.failedAt)
      : undefined;
  }

  /**
   * Timestamp at which the withdrawal was cancelled.
   */
  public get cancelledAt(): Date | undefined {
    return this.props.cancelledAt !== undefined
      ? FinancialAccountWithdrawalEntity.cloneDate(this.props.cancelledAt)
      : undefined;
  }

  /**
   * Entity creation timestamp.
   */
  public get createdAt(): Date {
    return FinancialAccountWithdrawalEntity.cloneDate(this.props.createdAt);
  }

  /**
   * Entity last-update timestamp.
   */
  public get updatedAt(): Date {
    return FinancialAccountWithdrawalEntity.cloneDate(this.props.updatedAt);
  }

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Updates the persistence timestamp.
   *
   * This is infrastructure-facing state and does not represent a domain
   * transition.
   */
  public setUpdatedAt(updatedAt: Date): void {
    FinancialAccountWithdrawalEntity.ensureValidDate(updatedAt, 'updated date');

    this.props.updatedAt =
      FinancialAccountWithdrawalEntity.cloneDate(updatedAt);
  }

  // ===========================================================================
  // Validation
  // ===========================================================================

  /**
   * Ensures the withdrawal amount is strictly positive.
   */
  private static ensurePositiveAmount(amount: Money): void {
    if (!amount.isPositive()) {
      throw new FinancialAccountWithdrawalException(
        'Financial Account Withdrawal amount must be greater than zero',
      );
    }
  }

  /**
   * Ensures the withdrawal is currently PROCESSING.
   */
  private ensureProcessing(): void {
    if (!this.props.status.isProcessing()) {
      throw new FinancialAccountWithdrawalInvalidStatusException(
        `Financial Account Withdrawal "${this.publicId.value}" is not processing`,
      );
    }
  }

  /**
   * Ensures the optional business reference is complete.
   *
   * Either both values must be present or neither may be present.
   */
  private static ensureReferencePair(
    referenceType: FinancialReferenceType | undefined,
    referencePublicId: FinancialReferencePublicId | undefined,
  ): void {
    const hasType = referenceType !== undefined;
    const hasPublicId = referencePublicId !== undefined;

    if (hasType !== hasPublicId) {
      throw new FinancialAccountWithdrawalException(
        'Financial Account Withdrawal business reference must contain both reference type and reference public ID',
      );
    }
  }

  /**
   * Normalizes and validates a Financial Disbursement public ID.
   */
  private static normalizeDisbursementPublicId(value: string): string {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new FinancialAccountWithdrawalException(
        'Financial Account Withdrawal disbursement public ID must not be empty',
      );
    }

    return normalized;
  }

  /**
   * Validates lifecycle state against lifecycle timestamps during
   * rehydration.
   */
  private static ensureLifecycleConsistency(
    props: FinancialAccountWithdrawalProps,
  ): void {
    // -------------------------------------------------------------------------
    // COMPLETED
    // -------------------------------------------------------------------------

    if (props.status.isCompleted()) {
      if (props.completedAt === undefined) {
        throw new FinancialAccountWithdrawalException(
          'Financial Account Withdrawal in COMPLETED state must have a completion date',
        );
      }

      if (props.failedAt !== undefined || props.cancelledAt !== undefined) {
        throw new FinancialAccountWithdrawalException(
          'Financial Account Withdrawal in COMPLETED state cannot have failure or cancellation dates',
        );
      }
    }

    // -------------------------------------------------------------------------
    // FAILED
    // -------------------------------------------------------------------------

    if (props.status.isFailed()) {
      if (props.failedAt === undefined) {
        throw new FinancialAccountWithdrawalException(
          'Financial Account Withdrawal in FAILED state must have a failure date',
        );
      }

      if (props.completedAt !== undefined || props.cancelledAt !== undefined) {
        throw new FinancialAccountWithdrawalException(
          'Financial Account Withdrawal in FAILED state cannot have completion or cancellation dates',
        );
      }
    }

    // -------------------------------------------------------------------------
    // CANCELLED
    // -------------------------------------------------------------------------

    if (props.status.isCancelled()) {
      if (props.cancelledAt === undefined) {
        throw new FinancialAccountWithdrawalException(
          'Financial Account Withdrawal in CANCELLED state must have a cancellation date',
        );
      }

      if (props.completedAt !== undefined || props.failedAt !== undefined) {
        throw new FinancialAccountWithdrawalException(
          'Financial Account Withdrawal in CANCELLED state cannot have completion or failure dates',
        );
      }
    }

    // -------------------------------------------------------------------------
    // Non-terminal states
    // -------------------------------------------------------------------------

    if (!props.status.isCompleted() && props.completedAt !== undefined) {
      throw new FinancialAccountWithdrawalException(
        `Financial Account Withdrawal in "${props.status.value}" state cannot have a completion date`,
      );
    }

    if (!props.status.isFailed() && props.failedAt !== undefined) {
      throw new FinancialAccountWithdrawalException(
        `Financial Account Withdrawal in "${props.status.value}" state cannot have a failure date`,
      );
    }

    if (!props.status.isCancelled() && props.cancelledAt !== undefined) {
      throw new FinancialAccountWithdrawalException(
        `Financial Account Withdrawal in "${props.status.value}" state cannot have a cancellation date`,
      );
    }

    // -------------------------------------------------------------------------
    // Timestamp ordering
    // -------------------------------------------------------------------------

    if (props.completedAt !== undefined) {
      FinancialAccountWithdrawalEntity.ensureNotBefore(
        props.completedAt,
        props.requestedAt,
        'completion date',
      );
    }

    if (props.failedAt !== undefined) {
      FinancialAccountWithdrawalEntity.ensureNotBefore(
        props.failedAt,
        props.requestedAt,
        'failure date',
      );
    }

    if (props.cancelledAt !== undefined) {
      FinancialAccountWithdrawalEntity.ensureNotBefore(
        props.cancelledAt,
        props.requestedAt,
        'cancellation date',
      );
    }
  }

  /**
   * Clones a Date to prevent external mutation of entity state.
   */
  private static cloneDate(value: Date): Date {
    FinancialAccountWithdrawalEntity.ensureValidDate(value, 'date');

    return new Date(value.getTime());
  }

  /**
   * Ensures a Date is valid.
   */
  private static ensureValidDate(value: Date, fieldName: string): void {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      throw new FinancialAccountWithdrawalException(
        `Financial Account Withdrawal ${fieldName} must be a valid date`,
      );
    }
  }

  /**
   * Ensures a lifecycle timestamp does not precede the withdrawal request
   * timestamp.
   */
  private static ensureNotBefore(
    value: Date,
    reference: Date,
    fieldName: string,
  ): void {
    if (value.getTime() < reference.getTime()) {
      throw new FinancialAccountWithdrawalException(
        `Financial Account Withdrawal ${fieldName} cannot occur before the withdrawal request date`,
      );
    }
  }
}
