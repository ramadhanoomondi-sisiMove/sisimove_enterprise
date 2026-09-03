// -----------------------------------------------------------------------------
// Recovery — Entity
// -----------------------------------------------------------------------------
//
// Represents a Recovery within the Authentication domain.
//
// Aggregate context:
//
// Recovery Aggregate
// └── RecoveryEntity
//
// The Recovery entity is the authoritative owner of:
//
// - recovery identity;
// - opaque Identity reference;
// - recovery type;
// - recovery lifecycle status;
// - recovery-token security state;
// - recovery request timestamp;
// - recovery expiry timestamp;
// - completion lifecycle;
// - cancellation lifecycle;
//
// Cross-domain Identity references remain opaque and are represented by
// RecoveryIdentityPublicId.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Maintain Recovery identity.
// - Maintain the opaque Identity public reference.
// - Maintain Recovery type.
// - Maintain Recovery lifecycle status.
// - Maintain recovery-token hash state.
// - Track recovery request time.
// - Manage recovery expiry.
// - Record recovery completion.
// - Record recovery cancellation.
// - Enforce Recovery-level invariants.
// - Provide security-safe lifecycle predicates.
//
// -----------------------------------------------------------------------------
//
// This entity does NOT:
//
// - Validate Identity domain state.
// - Generate recovery tokens.
// - Hash recovery tokens.
// - Compare raw recovery tokens.
// - Reset passwords directly.
// - Authenticate users.
// - Generate OTPs.
// - Persist itself.
// - Access Prisma.
// - Communicate with external systems.
// - Send notifications.
// - Revoke Sessions directly.
// - Modify Authentication directly.
//
// Token generation, hashing, comparison, password reset execution, OTP
// orchestration, persistence, and notification delivery belong to the
// appropriate application/infrastructure boundaries.
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

import { RecoveryException } from '../exceptions/recovery.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { RecoveryPublicId } from '../value-objects/recovery-public-id.vo';

import type { RecoveryIdentityPublicId } from '../value-objects/recovery-identity-public-id.vo';

import { RecoveryType } from '../value-objects/recovery-type.vo';

import { RecoveryStatus } from '../value-objects/recovery-status.vo';

import type { RecoveryTokenHash } from '../value-objects/recovery-token-hash.vo';

import type { RecoveryRequestedAt } from '../value-objects/recovery-requested-at.vo';

import type { RecoveryExpiresAt } from '../value-objects/recovery-expires-at.vo';

import type { RecoveryCompletedAt } from '../value-objects/recovery-completed-at.vo';

import type { RecoveryCancelledAt } from '../value-objects/recovery-cancelled-at.vo';

// =============================================================================
// Props
// =============================================================================

export interface RecoveryProps {
  /**
   * Opaque public reference to the Identity aggregate that owns this Recovery.
   */
  identityPublicId: RecoveryIdentityPublicId;

  /**
   * Purpose/type of the Recovery workflow.
   */
  type: RecoveryType;

  /**
   * Current Recovery lifecycle status.
   */
  status: RecoveryStatus;

  /**
   * Persisted hash of the recovery token.
   *
   * Raw recovery tokens must never be stored in the entity.
   */
  recoveryTokenHash: RecoveryTokenHash | undefined;

  /**
   * Timestamp at which the Recovery was requested.
   */
  requestedAt: RecoveryRequestedAt;

  /**
   * Timestamp at which the Recovery expires.
   */
  expiresAt: RecoveryExpiresAt;

  /**
   * Timestamp at which the Recovery was completed.
   */
  completedAt: RecoveryCompletedAt | undefined;

  /**
   * Timestamp at which the Recovery was cancelled.
   */
  cancelledAt: RecoveryCancelledAt | undefined;

  /**
   * Recovery creation timestamp.
   */
  createdAt: Date;

  /**
   * Recovery last-update timestamp.
   */
  updatedAt: Date;
}

// =============================================================================
// Entity
// =============================================================================

export class RecoveryEntity extends Entity<RecoveryProps, RecoveryPublicId> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    props: RecoveryProps,
    id?: UniqueEntityId,
    publicId?: RecoveryPublicId,
  ) {
    super(props, id, publicId);
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates a new pending Recovery.
   *
   * The recovery token hash may be supplied when the recovery token has
   * already been generated and hashed by the appropriate security
   * infrastructure.
   */
  public static create(
    identityPublicId: RecoveryIdentityPublicId,
    type: RecoveryType,
    requestedAt: RecoveryRequestedAt,
    expiresAt: RecoveryExpiresAt,
    options?: {
      recoveryTokenHash?: RecoveryTokenHash;
      createdAt?: Date;
    },
  ): RecoveryEntity {
    const createdAt = options?.createdAt ?? new Date();

    RecoveryEntity.ensureValidDate(createdAt, 'creation date');

    RecoveryEntity.validateChronology(requestedAt, expiresAt);

    const timestamp = RecoveryEntity.cloneDate(createdAt);

    return new RecoveryEntity(
      {
        identityPublicId,

        type,

        status: RecoveryStatus.create('PENDING'),

        recoveryTokenHash: options?.recoveryTokenHash,

        requestedAt,

        expiresAt,

        completedAt: undefined,

        cancelledAt: undefined,

        createdAt: timestamp,

        updatedAt: RecoveryEntity.cloneDate(timestamp),
      },

      new UniqueEntityId(),

      new RecoveryPublicId(),
    );
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  /**
   * Rehydrates a persisted Recovery.
   *
   * Only Recovery-level invariants are validated.
   *
   * Cross-domain Identity state is intentionally not validated.
   */
  public static rehydrate(
    props: RecoveryProps,
    id: UniqueEntityId,
    publicId: RecoveryPublicId,
  ): RecoveryEntity {
    RecoveryEntity.ensureValidDate(props.createdAt, 'creation date');

    RecoveryEntity.ensureValidDate(props.updatedAt, 'updated date');

    if (props.updatedAt.getTime() < props.createdAt.getTime()) {
      throw new RecoveryException(
        'Recovery updated date cannot be before creation date',
      );
    }

    RecoveryEntity.validateChronology(props.requestedAt, props.expiresAt);

    RecoveryEntity.validateLifecycleState(props);

    return new RecoveryEntity(
      {
        identityPublicId: props.identityPublicId,

        type: props.type,

        status: props.status,

        recoveryTokenHash: props.recoveryTokenHash,

        requestedAt: props.requestedAt,

        expiresAt: props.expiresAt,

        completedAt: props.completedAt,

        cancelledAt: props.cancelledAt,

        createdAt: RecoveryEntity.cloneDate(props.createdAt),

        updatedAt: RecoveryEntity.cloneDate(props.updatedAt),
      },

      id,

      publicId,
    );
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of the Recovery entity.
   */
  public override get publicId(): RecoveryPublicId {
    return super.publicId;
  }

  /**
   * Opaque public reference to the Identity that owns this Recovery.
   */
  public get identityPublicId(): RecoveryIdentityPublicId {
    return this.props.identityPublicId;
  }

  /**
   * Determines whether this Recovery belongs to the supplied Identity.
   */
  public belongsToIdentity(
    identityPublicId: RecoveryIdentityPublicId,
  ): boolean {
    return this.props.identityPublicId.equals(identityPublicId);
  }

  // ===========================================================================
  // Type
  // ===========================================================================

  /**
   * Recovery type.
   */
  public get type(): RecoveryType {
    return this.props.type;
  }

  /**
   * Determines whether this is a password-reset Recovery.
   */
  public isPasswordReset(): boolean {
    return this.props.type.equals(RecoveryType.create('PASSWORD_RESET'));
  }

  /**
   * Determines whether this is an account-recovery Recovery.
   */
  public isAccountRecovery(): boolean {
    return this.props.type.equals(RecoveryType.create('ACCOUNT_RECOVERY'));
  }

  // ===========================================================================
  // Status
  // ===========================================================================

  /**
   * Current Recovery lifecycle status.
   */
  public get status(): RecoveryStatus {
    return this.props.status;
  }

  /**
   * Determines whether the Recovery is pending.
   */
  public isPending(): boolean {
    return this.props.status.equals(RecoveryStatus.create('PENDING'));
  }

  /**
   * Determines whether the Recovery is completed.
   */
  public isCompleted(): boolean {
    return this.props.status.equals(RecoveryStatus.create('COMPLETED'));
  }

  /**
   * Determines whether the Recovery is cancelled.
   */
  public isCancelled(): boolean {
    return this.props.status.equals(RecoveryStatus.create('CANCELLED'));
  }

  /**
   * Determines whether the Recovery is expired.
   */
  public isExpiredStatus(): boolean {
    return this.props.status.equals(RecoveryStatus.create('EXPIRED'));
  }

  /**
   * Determines whether the Recovery is terminal.
   */
  public isTerminal(): boolean {
    return this.isCompleted() || this.isCancelled() || this.isExpiredStatus();
  }

  /**
   * Determines whether the Recovery can currently be used.
   *
   * Expiry is evaluated dynamically against the supplied reference date.
   */
  public isUsable(referenceDate: Date = new Date()): boolean {
    RecoveryEntity.ensureValidDate(referenceDate, 'reference date');

    return this.isPending() && !this.isExpired(referenceDate);
  }

  /**
   * Determines whether the Recovery cannot currently be used.
   */
  public isNotUsable(referenceDate: Date = new Date()): boolean {
    return !this.isUsable(referenceDate);
  }

  // ===========================================================================
  // Recovery Token
  // ===========================================================================

  /**
   * Persisted recovery-token hash.
   */
  public get recoveryTokenHash(): RecoveryTokenHash | undefined {
    return this.props.recoveryTokenHash;
  }

  /**
   * Determines whether a recovery token hash exists.
   */
  public hasRecoveryToken(): boolean {
    return this.props.recoveryTokenHash !== undefined;
  }

  /**
   * Replaces the recovery-token hash.
   *
   * The supplied hash must already have been produced by the
   * appropriate security infrastructure.
   */
  public setRecoveryTokenHash(recoveryTokenHash: RecoveryTokenHash): void {
    if (!this.isPending()) {
      throw new RecoveryException(
        'Only a pending Recovery can have its recovery token changed',
      );
    }

    this.props.recoveryTokenHash = recoveryTokenHash;

    this.touch();
  }

  /**
   * Clears the persisted recovery-token hash.
   *
   * This is useful after terminal completion/cancellation when the
   * application workflow requires token material to be removed.
   */
  public clearRecoveryTokenHash(): void {
    if (this.props.recoveryTokenHash === undefined) {
      return;
    }

    this.props.recoveryTokenHash = undefined;

    this.touch();
  }

  // ===========================================================================
  // Request
  // ===========================================================================

  /**
   * Timestamp at which the Recovery was requested.
   */
  public get requestedAt(): RecoveryRequestedAt {
    return this.props.requestedAt;
  }

  // ===========================================================================
  // Expiry
  // ===========================================================================

  /**
   * Recovery expiry timestamp.
   */
  public get expiresAt(): RecoveryExpiresAt {
    return this.props.expiresAt;
  }

  /**
   * Determines whether the Recovery has expired relative to the supplied date.
   */
  public isExpired(referenceDate: Date = new Date()): boolean {
    RecoveryEntity.ensureValidDate(referenceDate, 'reference date');

    return this.props.expiresAt.isExpired(referenceDate);
  }

  /**
   * Marks a pending Recovery as expired.
   *
   * An already completed, cancelled, or expired Recovery is left unchanged.
   */
  public expire(referenceDate: Date = new Date()): void {
    RecoveryEntity.ensureValidDate(referenceDate, 'reference date');

    if (this.isCompleted() || this.isCancelled()) {
      return;
    }

    if (this.isExpiredStatus()) {
      return;
    }

    if (!this.isExpired(referenceDate)) {
      throw new RecoveryException(
        'An unexpired Recovery cannot be marked as expired',
      );
    }

    if (!this.isPending()) {
      throw new RecoveryException(
        'Only a pending Recovery can be marked as expired',
      );
    }

    this.props.status = RecoveryStatus.create('EXPIRED');

    this.touch();
  }

  // ===========================================================================
  // Completion
  // ===========================================================================

  /**
   * Timestamp at which the Recovery was completed.
   */
  public get completedAt(): RecoveryCompletedAt | undefined {
    return this.props.completedAt;
  }

  /**
   * Determines whether the Recovery can be completed.
   */
  public canComplete(referenceDate: Date = new Date()): boolean {
    return this.isUsable(referenceDate);
  }

  /**
   * Completes the Recovery.
   *
   * The actual recovery operation, such as password reset or account
   * recovery, is orchestrated outside the entity.
   */
  public complete(completedAt: RecoveryCompletedAt): void {
    if (this.isCompleted()) {
      return;
    }

    if (this.isCancelled()) {
      throw new RecoveryException('A cancelled Recovery cannot be completed');
    }

    if (this.isExpiredStatus()) {
      throw new RecoveryException('An expired Recovery cannot be completed');
    }

    if (!this.isPending()) {
      throw new RecoveryException('Only a pending Recovery can be completed');
    }

    if (completedAt.value.getTime() < this.props.requestedAt.value.getTime()) {
      throw new RecoveryException(
        'Recovery completion date cannot be before request date',
      );
    }

    if (completedAt.value.getTime() > this.props.expiresAt.value.getTime()) {
      throw new RecoveryException(
        'Recovery cannot be completed after its expiry date',
      );
    }

    this.props.status = RecoveryStatus.create('COMPLETED');

    this.props.completedAt = completedAt;

    this.touch();
  }

  // ===========================================================================
  // Cancellation
  // ===========================================================================

  /**
   * Timestamp at which the Recovery was cancelled.
   */
  public get cancelledAt(): RecoveryCancelledAt | undefined {
    return this.props.cancelledAt;
  }

  /**
   * Determines whether the Recovery can be cancelled.
   */
  public canCancel(): boolean {
    return this.isPending();
  }

  /**
   * Cancels the Recovery.
   */
  public cancel(cancelledAt: RecoveryCancelledAt): void {
    if (this.isCancelled()) {
      return;
    }

    if (this.isCompleted()) {
      throw new RecoveryException('A completed Recovery cannot be cancelled');
    }

    if (this.isExpiredStatus()) {
      throw new RecoveryException('An expired Recovery cannot be cancelled');
    }

    if (!this.isPending()) {
      throw new RecoveryException('Only a pending Recovery can be cancelled');
    }

    if (cancelledAt.value.getTime() < this.props.requestedAt.value.getTime()) {
      throw new RecoveryException(
        'Recovery cancellation date cannot be before request date',
      );
    }

    this.props.status = RecoveryStatus.create('CANCELLED');

    this.props.cancelledAt = cancelledAt;

    this.touch();
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Recovery creation timestamp.
   *
   * Returns a defensive copy.
   */
  public get createdAt(): Date {
    return RecoveryEntity.cloneDate(this.props.createdAt);
  }

  /**
   * Recovery last-update timestamp.
   *
   * Returns a defensive copy.
   */
  public get updatedAt(): Date {
    return RecoveryEntity.cloneDate(this.props.updatedAt);
  }

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Updates the persistence timestamp.
   *
   * This does not represent a business lifecycle transition.
   */
  public setUpdatedAt(updatedAt: Date): void {
    RecoveryEntity.ensureValidDate(updatedAt, 'updated date');

    const timestamp = RecoveryEntity.cloneDate(updatedAt);

    if (timestamp.getTime() < this.props.createdAt.getTime()) {
      throw new RecoveryException(
        'Recovery updated date cannot be before creation date',
      );
    }

    this.props.updatedAt = timestamp;
  }

  // ===========================================================================
  // Validation
  // ===========================================================================

  /**
   * Validates Recovery chronology.
   */
  private static validateChronology(
    requestedAt: RecoveryRequestedAt,
    expiresAt: RecoveryExpiresAt,
  ): void {
    if (expiresAt.value.getTime() <= requestedAt.value.getTime()) {
      throw new RecoveryException(
        'Recovery expiry date must be after request date',
      );
    }
  }

  /**
   * Validates lifecycle-related invariants.
   */
  private static validateLifecycleState(props: RecoveryProps): void {
    const isCompleted = props.status.equals(RecoveryStatus.create('COMPLETED'));

    const isCancelled = props.status.equals(RecoveryStatus.create('CANCELLED'));

    const isExpired = props.status.equals(RecoveryStatus.create('EXPIRED'));

    const isPending = props.status.equals(RecoveryStatus.create('PENDING'));

    // -------------------------------------------------------------------------
    // Completed
    // -------------------------------------------------------------------------

    if (isCompleted && props.completedAt === undefined) {
      throw new RecoveryException(
        'A completed Recovery must have a completed-at timestamp',
      );
    }

    if (!isCompleted && props.completedAt !== undefined) {
      throw new RecoveryException(
        'Only a completed Recovery may have a completed-at timestamp',
      );
    }

    // -------------------------------------------------------------------------
    // Cancelled
    // -------------------------------------------------------------------------

    if (isCancelled && props.cancelledAt === undefined) {
      throw new RecoveryException(
        'A cancelled Recovery must have a cancelled-at timestamp',
      );
    }

    if (!isCancelled && props.cancelledAt !== undefined) {
      throw new RecoveryException(
        'Only a cancelled Recovery may have a cancelled-at timestamp',
      );
    }

    // -------------------------------------------------------------------------
    // Expired
    // -------------------------------------------------------------------------

    if (isExpired && props.completedAt !== undefined) {
      throw new RecoveryException(
        'An expired Recovery cannot have a completed-at timestamp',
      );
    }

    if (isExpired && props.cancelledAt !== undefined) {
      throw new RecoveryException(
        'An expired Recovery cannot have a cancelled-at timestamp',
      );
    }

    // -------------------------------------------------------------------------
    // Pending
    // -------------------------------------------------------------------------

    if (isPending && props.completedAt !== undefined) {
      throw new RecoveryException(
        'A pending Recovery cannot have a completed-at timestamp',
      );
    }

    if (isPending && props.cancelledAt !== undefined) {
      throw new RecoveryException(
        'A pending Recovery cannot have a cancelled-at timestamp',
      );
    }

    // -------------------------------------------------------------------------
    // Completed chronology
    // -------------------------------------------------------------------------

    if (
      props.completedAt !== undefined &&
      props.completedAt.value.getTime() < props.requestedAt.value.getTime()
    ) {
      throw new RecoveryException(
        'Recovery completion date cannot be before request date',
      );
    }

    if (
      props.completedAt !== undefined &&
      props.completedAt.value.getTime() > props.expiresAt.value.getTime()
    ) {
      throw new RecoveryException(
        'Recovery completion date cannot be after expiry date',
      );
    }

    // -------------------------------------------------------------------------
    // Cancelled chronology
    // -------------------------------------------------------------------------

    if (
      props.cancelledAt !== undefined &&
      props.cancelledAt.value.getTime() < props.requestedAt.value.getTime()
    ) {
      throw new RecoveryException(
        'Recovery cancellation date cannot be before request date',
      );
    }

    // -------------------------------------------------------------------------
    // Mutually exclusive terminal timestamps
    // -------------------------------------------------------------------------

    if (props.completedAt !== undefined && props.cancelledAt !== undefined) {
      throw new RecoveryException(
        'A Recovery cannot be both completed and cancelled',
      );
    }
  }

  /**
   * Validates a Date.
   */
  private static ensureValidDate(value: Date, fieldName: string): void {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      throw new RecoveryException(`Recovery ${fieldName} must be a valid date`);
    }
  }

  /**
   * Creates a defensive Date copy.
   */
  private static cloneDate(value: Date): Date {
    RecoveryEntity.ensureValidDate(value, 'date');

    return new Date(value.getTime());
  }
}
