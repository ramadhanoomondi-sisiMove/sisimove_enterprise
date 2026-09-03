// -----------------------------------------------------------------------------
// Recovery — Aggregate
// -----------------------------------------------------------------------------
//
// Aggregate:
//
// RecoveryAggregate
// └── RecoveryEntity
//
// Recovery is an independent aggregate responsible for the lifecycle of one
// recovery workflow associated with an Identity.
//
// The aggregate owns the RecoveryEntity and coordinates:
// - lifecycle transitions;
// - aggregate-level behavior;
// - domain-event recording;
// - correlation/causation metadata.
//
// Business rules that belong specifically to the Recovery entity remain in
// RecoveryEntity.
//
// Cross-aggregate orchestration belongs to the application layer.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { RecoveryEntity } from '../entities/recovery.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import { RecoveryCreatedEvent } from '../events/recovery-created.event';
import { RecoveryCompletedEvent } from '../events/recovery-completed.event';
import { RecoveryCancelledEvent } from '../events/recovery-cancelled.event';
import { RecoveryExpiredEvent } from '../events/recovery-expired.event';

// -----------------------------------------------------------------------------
// Domain Exception
// -----------------------------------------------------------------------------

import { RecoveryException } from '../exceptions/recovery.exception';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { RecoveryIdentityPublicId } from '../value-objects/recovery-identity-public-id.vo';
import type { RecoveryType } from '../value-objects/recovery-type.vo';
import type { RecoveryStatus } from '../value-objects/recovery-status.vo';
import type { RecoveryTokenHash } from '../value-objects/recovery-token-hash.vo';
import type { RecoveryRequestedAt } from '../value-objects/recovery-requested-at.vo';
import type { RecoveryExpiresAt } from '../value-objects/recovery-expires-at.vo';
import type { RecoveryCompletedAt } from '../value-objects/recovery-completed-at.vo';
import type { RecoveryCancelledAt } from '../value-objects/recovery-cancelled-at.vo';

// =============================================================================
// Props
// =============================================================================

interface RecoveryAggregateProps {
  /**
   * Root entity owned by this aggregate.
   */
  recovery: RecoveryEntity;
}

// =============================================================================
// Aggregate
// =============================================================================

/**
 * Recovery aggregate root.
 *
 * Owns exactly one RecoveryEntity representing one recovery workflow.
 */
export class RecoveryAggregate extends AggregateRoot<RecoveryAggregateProps> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(props: RecoveryAggregateProps) {
    if (props === undefined) {
      throw new RecoveryException(
        'Recovery aggregate properties are required.',
      );
    }

    if (props.recovery === undefined) {
      throw new RecoveryException('Recovery aggregate root is required.');
    }

    super(props, props.recovery.id, props.recovery.publicId);
  }

  // ===========================================================================
  // Factory — Create
  // ===========================================================================

  /**
   * Creates a new Recovery aggregate around an existing RecoveryEntity.
   *
   * Entity creation and domain-event recording are intentionally separate.
   */
  public static create(recovery: RecoveryEntity): RecoveryAggregate {
    if (recovery === undefined) {
      throw new RecoveryException('Recovery entity is required.');
    }

    const aggregate = new RecoveryAggregate({
      recovery,
    });

    aggregate.ensureAggregateConsistency();

    return aggregate;
  }

  // ===========================================================================
  // Factory — Rehydrate
  // ===========================================================================

  /**
   * Rehydrates a persisted Recovery aggregate.
   *
   * Rehydration never records domain events.
   */
  public static rehydrate(recovery: RecoveryEntity): RecoveryAggregate {
    if (recovery === undefined) {
      throw new RecoveryException(
        'Recovery entity is required for rehydration.',
      );
    }

    const aggregate = new RecoveryAggregate({
      recovery,
    });

    aggregate.ensureAggregateConsistency();

    return aggregate;
  }

  // ===========================================================================
  // State
  // ===========================================================================

  /**
   * Returns the Recovery aggregate root.
   */
  public get recovery(): RecoveryEntity {
    return this.props.recovery;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Internal persistence identity.
   */
  public override get id(): typeof this.recovery.id {
    return this.recovery.id;
  }

  /**
   * Public Recovery identity.
   */
  public override get publicId(): typeof this.recovery.publicId {
    return this.recovery.publicId;
  }

  /**
   * Opaque public reference to the associated Identity.
   */
  public get identityPublicId(): RecoveryIdentityPublicId {
    return this.recovery.identityPublicId;
  }

  /**
   * Determines whether this Recovery belongs to the supplied Identity.
   */
  public belongsToIdentity(
    identityPublicId: RecoveryIdentityPublicId,
  ): boolean {
    return this.recovery.belongsToIdentity(identityPublicId);
  }

  // ===========================================================================
  // Type
  // ===========================================================================

  /**
   * Current Recovery type.
   */
  public get type(): RecoveryType {
    return this.recovery.type;
  }

  /**
   * Determines whether this is a password-reset Recovery.
   */
  public isPasswordReset(): boolean {
    return this.recovery.isPasswordReset();
  }

  /**
   * Determines whether this is an account-recovery Recovery.
   */
  public isAccountRecovery(): boolean {
    return this.recovery.isAccountRecovery();
  }

  // ===========================================================================
  // Status
  // ===========================================================================

  /**
   * Current persisted Recovery lifecycle status.
   */
  public get status(): RecoveryStatus {
    return this.recovery.status;
  }

  public isPending(): boolean {
    return this.recovery.isPending();
  }

  public isCompleted(): boolean {
    return this.recovery.isCompleted();
  }

  public isCancelled(): boolean {
    return this.recovery.isCancelled();
  }

  public isExpiredStatus(): boolean {
    return this.recovery.isExpiredStatus();
  }

  public isTerminal(): boolean {
    return this.recovery.isTerminal();
  }

  /**
   * Determines whether the Recovery is currently usable.
   *
   * This evaluates the persisted status together with dynamic expiry.
   */
  public isUsable(referenceDate: Date = new Date()): boolean {
    return this.recovery.isUsable(referenceDate);
  }

  /**
   * Determines whether the Recovery is not currently usable.
   */
  public isNotUsable(referenceDate: Date = new Date()): boolean {
    return this.recovery.isNotUsable(referenceDate);
  }

  // ===========================================================================
  // Creation
  // ===========================================================================

  /**
   * Records creation of the Recovery aggregate.
   *
   * The aggregate constructs the domain event.
   *
   * Security-sensitive recovery-token material is intentionally excluded.
   */
  public recordCreated(correlationId: string, causationId?: string): void {
    this.ensureCorrelationId(correlationId);

    this.addDomainEvent(
      new RecoveryCreatedEvent(
        this.id.value,
        this.publicId.value,
        this.identityPublicId.value,
        this.type.value,
        this.status.value,
        this.requestedAt.value,
        this.expiresAt.value,
        this.createdAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Recovery Token
  // ===========================================================================

  /**
   * Persisted recovery-token hash.
   *
   * The raw token is never part of the aggregate.
   */
  public get recoveryTokenHash(): RecoveryTokenHash | undefined {
    return this.recovery.recoveryTokenHash;
  }

  /**
   * Determines whether a recovery-token hash exists.
   */
  public hasRecoveryToken(): boolean {
    return this.recovery.hasRecoveryToken();
  }

  /**
   * Sets an already-generated and already-hashed recovery-token value.
   */
  public setRecoveryTokenHash(recoveryTokenHash: RecoveryTokenHash): void {
    this.recovery.setRecoveryTokenHash(recoveryTokenHash);
  }

  /**
   * Removes the persisted recovery-token hash.
   */
  public clearRecoveryTokenHash(): void {
    this.recovery.clearRecoveryTokenHash();
  }

  // ===========================================================================
  // Request
  // ===========================================================================

  /**
   * Timestamp at which the Recovery was requested.
   */
  public get requestedAt(): RecoveryRequestedAt {
    return this.recovery.requestedAt;
  }

  // ===========================================================================
  // Expiry
  // ===========================================================================

  /**
   * Recovery expiry timestamp.
   */
  public get expiresAt(): RecoveryExpiresAt {
    return this.recovery.expiresAt;
  }

  /**
   * Determines whether the Recovery has expired relative to a reference date.
   */
  public isExpired(referenceDate: Date = new Date()): boolean {
    return this.recovery.isExpired(referenceDate);
  }

  /**
   * Expires the Recovery when the entity determines that expiration is valid.
   *
   * The aggregate records RecoveryExpiredEvent only when the entity actually
   * transitions into the EXPIRED state.
   *
   * Parameter order intentionally places required operation metadata before
   * the optional reference date.
   */
  public expire(
    correlationId: string,
    causationId?: string,
    referenceDate: Date = new Date(),
  ): void {
    this.ensureCorrelationId(correlationId);

    const wasExpired = this.recovery.isExpiredStatus();

    this.recovery.expire(referenceDate);

    const becameExpired = !wasExpired && this.recovery.isExpiredStatus();

    if (!becameExpired) {
      return;
    }

    this.addDomainEvent(
      new RecoveryExpiredEvent(
        this.id.value,
        this.publicId.value,
        this.identityPublicId.value,
        this.type.value,
        this.status.value,
        this.expiresAt.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Completion
  // ===========================================================================

  /**
   * Timestamp at which the Recovery was completed.
   */
  public get completedAt(): RecoveryCompletedAt | undefined {
    return this.recovery.completedAt;
  }

  /**
   * Determines whether the Recovery can currently be completed.
   */
  public canComplete(referenceDate: Date = new Date()): boolean {
    return this.recovery.canComplete(referenceDate);
  }

  /**
   * Completes the Recovery and records RecoveryCompletedEvent.
   */
  public complete(
    completedAt: RecoveryCompletedAt,
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureCorrelationId(correlationId);

    const wasCompleted = this.recovery.isCompleted();

    this.recovery.complete(completedAt);

    const becameCompleted = !wasCompleted && this.recovery.isCompleted();

    if (!becameCompleted) {
      return;
    }

    this.addDomainEvent(
      new RecoveryCompletedEvent(
        this.id.value,
        this.publicId.value,
        this.identityPublicId.value,
        this.type.value,
        this.status.value,
        this.completedAt!.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Cancellation
  // ===========================================================================

  /**
   * Timestamp at which the Recovery was cancelled.
   */
  public get cancelledAt(): RecoveryCancelledAt | undefined {
    return this.recovery.cancelledAt;
  }

  /**
   * Determines whether the Recovery can be cancelled.
   */
  public canCancel(): boolean {
    return this.recovery.canCancel();
  }

  /**
   * Cancels the Recovery and records RecoveryCancelledEvent.
   */
  public cancel(
    cancelledAt: RecoveryCancelledAt,
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureCorrelationId(correlationId);

    const wasCancelled = this.recovery.isCancelled();

    this.recovery.cancel(cancelledAt);

    const becameCancelled = !wasCancelled && this.recovery.isCancelled();

    if (!becameCancelled) {
      return;
    }

    this.addDomainEvent(
      new RecoveryCancelledEvent(
        this.id.value,
        this.publicId.value,
        this.identityPublicId.value,
        this.type.value,
        this.status.value,
        this.cancelledAt!.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Recovery creation timestamp.
   */
  public get createdAt(): Date {
    return this.recovery.createdAt;
  }

  /**
   * Recovery last-update timestamp.
   */
  public get updatedAt(): Date {
    return this.recovery.updatedAt;
  }

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Updates the persistence timestamp.
   *
   * This is infrastructure-oriented state and does not emit a domain event.
   */
  public setUpdatedAt(updatedAt: Date): void {
    RecoveryAggregate.ensureValidDate(
      updatedAt,
      'Recovery update timestamp must be valid.',
    );

    this.recovery.setUpdatedAt(updatedAt);
  }

  // ===========================================================================
  // Aggregate Consistency
  // ===========================================================================

  /**
   * Validates structural aggregate consistency.
   *
   * Detailed Recovery lifecycle invariants remain owned by RecoveryEntity.
   */
  private ensureAggregateConsistency(): void {
    if (this.recovery === undefined) {
      throw new RecoveryException('Recovery aggregate root is required.');
    }

    if (this.recovery.id === undefined) {
      throw new RecoveryException(
        'Recovery aggregate internal identity is required.',
      );
    }

    if (this.recovery.publicId === undefined) {
      throw new RecoveryException(
        'Recovery aggregate public identity is required.',
      );
    }

    if (this.identityPublicId === undefined) {
      throw new RecoveryException(
        'Recovery Identity public identity is required.',
      );
    }

    if (this.type === undefined) {
      throw new RecoveryException('Recovery type is required.');
    }

    if (this.status === undefined) {
      throw new RecoveryException('Recovery status is required.');
    }

    if (this.requestedAt === undefined) {
      throw new RecoveryException(
        'Recovery requested-at timestamp is required.',
      );
    }

    if (this.expiresAt === undefined) {
      throw new RecoveryException('Recovery expires-at timestamp is required.');
    }

    RecoveryAggregate.ensureValidDate(
      this.createdAt,
      'Recovery creation timestamp must be valid.',
    );

    RecoveryAggregate.ensureValidDate(
      this.updatedAt,
      'Recovery update timestamp must be valid.',
    );

    if (this.updatedAt.getTime() < this.createdAt.getTime()) {
      throw new RecoveryException(
        'Recovery updated timestamp cannot be before its creation timestamp.',
      );
    }
  }

  // ===========================================================================
  // Guards
  // ===========================================================================

  private ensureCorrelationId(correlationId: string): void {
    if (
      typeof correlationId !== 'string' ||
      correlationId.trim().length === 0
    ) {
      throw new RecoveryException(
        'Recovery operation correlation ID is required.',
      );
    }
  }

  private static ensureValidDate(value: Date, message: string): void {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new RecoveryException(message);
    }
  }
}
