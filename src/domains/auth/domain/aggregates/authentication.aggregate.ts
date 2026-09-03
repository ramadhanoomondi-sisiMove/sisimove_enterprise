// -----------------------------------------------------------------------------
// Authentication — Aggregate
// -----------------------------------------------------------------------------
//
// Aggregate:
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// Authentication is an independent aggregate responsible for the authentication
// state and credential lifecycle associated with exactly one Identity.
//
// -----------------------------------------------------------------------------
//
// Aggregate responsibilities:
//
// - own exactly one AuthenticationEntity;
// - expose Authentication state through the aggregate boundary;
// - coordinate Authentication state transitions;
// - record Authentication lifecycle domain events;
// - preserve correlation/causation metadata for domain events;
// - enforce aggregate-level structural consistency;
// - prevent aggregate operations from bypassing the AuthenticationEntity.
//
// -----------------------------------------------------------------------------
//
// This aggregate does NOT:
//
// - validate Identity domain state;
// - load the Identity aggregate;
// - hash passwords;
// - compare plaintext passwords;
// - select password hashing algorithms;
// - generate sessions;
// - manage devices;
// - execute account recovery;
// - generate OTP challenges;
// - persist itself;
// - access Prisma;
// - communicate with external systems;
// - send notifications;
// - perform authorization checks;
// - determine authentication lock thresholds.
//
// Security operations belong behind security abstractions and infrastructure
// implementations.
//
// Application orchestration belongs to application handlers/workflows.
//
// Cross-aggregate rules belong to the appropriate application or domain
// boundary.
//
// -----------------------------------------------------------------------------
//
// Aggregate identity:
//
// Internal identity:
// - AuthenticationEntity.id
//
// Public identity:
// - AuthenticationEntity.publicId
//
// Cross-domain reference:
// - AuthenticationIdentityPublicId
//
// -----------------------------------------------------------------------------
//
// Domain events:
//
// - AuthenticationCreatedEvent
// - AuthenticationActivatedEvent
// - AuthenticationLockedEvent
// - AuthenticationUnlockedEvent
// - AuthenticationDisabledEvent
// - AuthenticationPasswordChangedEvent
// - AuthenticationAuthenticatedEvent
// - AuthenticationFailedEvent
//
// correlationId is required for every state-changing event.
//
// causationId is optional.
//
// -----------------------------------------------------------------------------
//
// Creation:
//
// AuthenticationEntity.create() establishes the initial Authentication state.
//
// AuthenticationAggregate.create() wraps the entity and validates aggregate
// structural consistency.
//
// Creation does NOT implicitly activate Authentication.
//
// Authentication therefore remains PENDING until the explicit activation
// workflow transitions it to ACTIVE.
//
// -----------------------------------------------------------------------------
//
// Rehydration:
//
// AuthenticationAggregate.rehydrate() reconstructs the aggregate from
// persistence without recording domain events.
//
// -----------------------------------------------------------------------------
//
// Password:
//
// Password credentials enter the aggregate only as AuthenticationPasswordHash.
//
// Plaintext passwords never enter the domain aggregate.
//
// Password hashing is performed before the CreateAuthenticationCommand is
// constructed by the appropriate application/security workflow.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { AuthenticationEntity } from '../entities/authentication.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import { AuthenticationCreatedEvent } from '../events/authentication-created.event';

import { AuthenticationActivatedEvent } from '../events/authentication-activated.event';

import { AuthenticationLockedEvent } from '../events/authentication-locked.event';

import { AuthenticationUnlockedEvent } from '../events/authentication-unlocked.event';

import { AuthenticationDisabledEvent } from '../events/authentication-disabled.event';

import { AuthenticationPasswordChangedEvent } from '../events/authentication-password-changed.event';

import { AuthenticationAuthenticatedEvent } from '../events/authentication-authenticated.event';

import { AuthenticationFailedEvent } from '../events/authentication-failed.event';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { AuthenticationException } from '../exceptions/authentication.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { AuthenticationIdentityPublicId } from '../value-objects/authentication-identity-public-id.vo';

import type { AuthenticationPasswordHash } from '../value-objects/authentication-password-hash.vo';

import type { AuthenticationPasswordVersion } from '../value-objects/authentication-password-version.vo';

import type { AuthenticationPasswordChangedAt } from '../value-objects/authentication-password-changed-at.vo';

import type { AuthenticationLockedAt } from '../value-objects/authentication-locked-at.vo';

import type { AuthenticationLockedUntil } from '../value-objects/authentication-locked-until.vo';

import type { AuthenticationFailureReason } from '../value-objects/authentication-failure-reason.vo';

import type { AuthenticationFailureCount } from '../value-objects/authentication-failure-count.vo';

import type { AuthenticationLastFailedAt } from '../value-objects/authentication-last-failed-at.vo';

import type { AuthenticationLastAuthenticatedAt } from '../value-objects/authentication-last-authenticated-at.vo';

// =============================================================================
// Props
// =============================================================================

interface AuthenticationAggregateProps {
  /**
   * Root entity owned by the Authentication aggregate.
   */
  authentication: AuthenticationEntity;
}

// =============================================================================
// Aggregate
// =============================================================================

/**
 * Authentication aggregate root.
 *
 * Owns exactly one AuthenticationEntity representing the authentication state
 * and credential lifecycle of one Identity.
 */
export class AuthenticationAggregate extends AggregateRoot<AuthenticationAggregateProps> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(props: AuthenticationAggregateProps) {
    if (props === undefined) {
      throw new AuthenticationException(
        'Authentication aggregate properties are required.',
      );
    }

    if (props.authentication === undefined) {
      throw new AuthenticationException(
        'Authentication aggregate root is required.',
      );
    }

    super(props, props.authentication.id, props.authentication.publicId);
  }

  // ===========================================================================
  // Factory — Create
  // ===========================================================================

  /**
   * Creates a new Authentication aggregate around a newly created
   * AuthenticationEntity.
   *
   * Entity creation and creation-event recording are intentionally separate
   * operations.
   *
   * The caller is responsible for invoking recordCreated() as part of the
   * application command workflow.
   */
  public static create(
    authentication: AuthenticationEntity,
  ): AuthenticationAggregate {
    AuthenticationAggregate.ensureEntity(authentication);

    const aggregate = new AuthenticationAggregate({
      authentication,
    });

    aggregate.ensureAggregateConsistency();

    return aggregate;
  }

  // ===========================================================================
  // Factory — Rehydrate
  // ===========================================================================

  /**
   * Rehydrates a persisted Authentication aggregate.
   *
   * Rehydration never emits domain events.
   */
  public static rehydrate(
    authentication: AuthenticationEntity,
  ): AuthenticationAggregate {
    AuthenticationAggregate.ensureEntity(authentication);

    const aggregate = new AuthenticationAggregate({
      authentication,
    });

    aggregate.ensureAggregateConsistency();

    return aggregate;
  }

  // ===========================================================================
  // Aggregate State
  // ===========================================================================

  /**
   * Returns the Authentication aggregate root entity.
   */
  public get authentication(): AuthenticationEntity {
    return this.props.authentication;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Internal persistence identity of the aggregate.
   */
  public override get id(): typeof this.authentication.id {
    return this.authentication.id;
  }

  /**
   * Public identity of the Authentication aggregate.
   */
  public override get publicId(): typeof this.authentication.publicId {
    return this.authentication.publicId;
  }

  /**
   * Opaque public reference to the Identity associated with this
   * Authentication.
   */
  public get identityPublicId(): AuthenticationIdentityPublicId {
    return this.authentication.identityPublicId;
  }

  /**
   * Determines whether this Authentication belongs to the supplied Identity.
   */
  public belongsToIdentity(
    identityPublicId: AuthenticationIdentityPublicId,
  ): boolean {
    return this.authentication.belongsToIdentity(identityPublicId);
  }

  // ===========================================================================
  // Status
  // ===========================================================================

  /**
   * Current Authentication status.
   */
  public get status(): typeof this.authentication.status {
    return this.authentication.status;
  }

  /**
   * Determines whether Authentication is pending.
   */
  public isPending(): boolean {
    return this.authentication.isPending();
  }

  /**
   * Determines whether Authentication is active.
   */
  public isActive(): boolean {
    return this.authentication.isActive();
  }

  /**
   * Determines whether Authentication is locked.
   */
  public isLocked(): boolean {
    return this.authentication.isLocked();
  }

  /**
   * Determines whether Authentication is disabled.
   */
  public isDisabled(): boolean {
    return this.authentication.isDisabled();
  }

  /**
   * Determines whether Authentication can currently authenticate.
   *
   * Credential verification itself remains outside the aggregate.
   */
  public canAuthenticate(): boolean {
    return this.authentication.canAuthenticate();
  }

  // ===========================================================================
  // Creation Event
  // ===========================================================================

  /**
   * Records creation of the Authentication aggregate.
   *
   * The entity and aggregate are created separately from event recording so
   * that aggregate construction remains free of application-event metadata.
   */
  public recordCreated(correlationId: string, causationId?: string): void {
    this.ensureCorrelationId(correlationId);

    this.addDomainEvent(
      new AuthenticationCreatedEvent(
        this.id.value,
        this.publicId.value,
        this.identityPublicId.value,
        this.status.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Activation
  // ===========================================================================

  /**
   * Activates Authentication and records AuthenticationActivatedEvent.
   *
   * The AuthenticationEntity owns the actual lifecycle transition.
   */
  public activate(correlationId: string, causationId?: string): void {
    this.ensureCorrelationId(correlationId);

    this.authentication.activate();

    this.addDomainEvent(
      new AuthenticationActivatedEvent(
        this.id.value,
        this.publicId.value,
        this.identityPublicId.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Disable
  // ===========================================================================

  /**
   * Disables Authentication and records AuthenticationDisabledEvent.
   *
   * The optional reason is retained by the entity as domain state but is not
   * currently included in AuthenticationDisabledEvent.
   */
  public disable(
    reason?: AuthenticationFailureReason,
    correlationId?: string,
    causationId?: string,
  ): void {
    if (correlationId === undefined) {
      throw new AuthenticationException(
        'Authentication disable operation correlation ID is required.',
      );
    }

    this.ensureCorrelationId(correlationId);

    this.authentication.disable(reason);

    this.addDomainEvent(
      new AuthenticationDisabledEvent(
        this.id.value,
        this.publicId.value,
        this.identityPublicId.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Lock
  // ===========================================================================

  /**
   * Locks Authentication and records AuthenticationLockedEvent.
   *
   * Lock-threshold policy is intentionally evaluated outside the aggregate.
   */
  public lock(
    lockedAt: AuthenticationLockedAt,
    lockedUntil: AuthenticationLockedUntil | undefined,
    reason: AuthenticationFailureReason | undefined,
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureCorrelationId(correlationId);

    this.authentication.lock(lockedAt, lockedUntil, reason);

    this.addDomainEvent(
      new AuthenticationLockedEvent(
        this.id.value,
        this.publicId.value,
        this.identityPublicId.value,
        reason?.value ?? '',
        lockedAt.value,
        lockedUntil?.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Unlock
  // ===========================================================================

  /**
   * Unlocks Authentication and records AuthenticationUnlockedEvent.
   *
   * Unlock is idempotent when Authentication is not currently locked.
   */
  public unlock(correlationId: string, causationId?: string): void {
    this.ensureCorrelationId(correlationId);

    if (!this.authentication.isLocked()) {
      return;
    }

    this.authentication.unlock();

    this.addDomainEvent(
      new AuthenticationUnlockedEvent(
        this.id.value,
        this.publicId.value,
        this.identityPublicId.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Password
  // ===========================================================================

  /**
   * Replaces the current password credential and records
   * AuthenticationPasswordChangedEvent.
   *
   * passwordHash must already contain a cryptographic password hash.
   *
   * Plaintext passwords are never accepted by the aggregate.
   */
  public changePassword(
    passwordHash: AuthenticationPasswordHash,
    passwordVersion: AuthenticationPasswordVersion,
    changedAt: AuthenticationPasswordChangedAt,
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureCorrelationId(correlationId);

    if (passwordHash === undefined) {
      throw new AuthenticationException(
        'Authentication password hash is required.',
      );
    }

    if (passwordVersion === undefined) {
      throw new AuthenticationException(
        'Authentication password version is required.',
      );
    }

    if (changedAt === undefined) {
      throw new AuthenticationException(
        'Authentication password changed timestamp is required.',
      );
    }

    this.authentication.changePassword(
      passwordHash,
      passwordVersion,
      changedAt,
    );

    this.addDomainEvent(
      new AuthenticationPasswordChangedEvent(
        this.id.value,
        this.publicId.value,
        this.identityPublicId.value,
        passwordVersion.value,
        changedAt.value,
        correlationId,
        causationId,
      ),
    );
  }

  /**
   * Marks the Authentication password as requiring a change.
   *
   * No dedicated domain event currently exists for this state transition.
   */
  public requirePasswordChange(): void {
    this.authentication.requirePasswordChange();
  }

  /**
   * Clears the password-change requirement.
   *
   * No dedicated domain event currently exists for this state transition.
   */
  public clearPasswordChangeRequirement(): void {
    this.authentication.clearPasswordChangeRequirement();
  }

  // ===========================================================================
  // Authentication Failure
  // ===========================================================================

  /**
   * Records an authentication failure and emits AuthenticationFailedEvent.
   *
   * Lock-threshold evaluation remains outside the aggregate.
   */
  public recordAuthenticationFailure(
    count: AuthenticationFailureCount,
    failedAt: AuthenticationLastFailedAt,
    reason: AuthenticationFailureReason,
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureCorrelationId(correlationId);

    if (count === undefined) {
      throw new AuthenticationException(
        'Authentication failure count is required.',
      );
    }

    if (failedAt === undefined) {
      throw new AuthenticationException(
        'Authentication failure timestamp is required.',
      );
    }

    if (reason === undefined) {
      throw new AuthenticationException(
        'Authentication failure reason is required.',
      );
    }

    this.authentication.recordAuthenticationFailure(count, failedAt, reason);

    this.addDomainEvent(
      new AuthenticationFailedEvent(
        this.id.value,
        this.publicId.value,
        this.identityPublicId.value,
        reason,
        count.value,
        failedAt.value,
        correlationId,
        causationId,
      ),
    );
  }

  /**
   * Resets authentication failure tracking.
   *
   * No event is emitted because the current event model does not define a
   * dedicated AuthenticationFailuresResetEvent.
   */
  public resetAuthenticationFailures(): void {
    this.authentication.resetAuthenticationFailures();
  }

  // ===========================================================================
  // Successful Authentication
  // ===========================================================================

  /**
   * Records successful authentication and emits
   * AuthenticationAuthenticatedEvent.
   *
   * Credential verification must already have succeeded before this method is
   * invoked.
   */
  public recordSuccessfulAuthentication(
    authenticatedAt: AuthenticationLastAuthenticatedAt,
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureCorrelationId(correlationId);

    if (authenticatedAt === undefined) {
      throw new AuthenticationException(
        'Authentication success timestamp is required.',
      );
    }

    this.authentication.recordSuccessfulAuthentication(authenticatedAt);

    this.addDomainEvent(
      new AuthenticationAuthenticatedEvent(
        this.id.value,
        this.publicId.value,
        this.identityPublicId.value,
        authenticatedAt.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Password State
  // ===========================================================================

  /**
   * Current password hash.
   *
   * This accessor is intended for trusted application/security workflows and
   * must never be mapped into an API response or written to logs.
   */
  public get passwordHash(): AuthenticationPasswordHash | undefined {
    return this.authentication.passwordHash;
  }

  /**
   * Determines whether a password credential has been established.
   */
  public hasPassword(): boolean {
    return this.authentication.hasPassword();
  }

  /**
   * Current password version.
   */
  public get passwordVersion(): AuthenticationPasswordVersion {
    return this.authentication.passwordVersion;
  }

  /**
   * Timestamp of the most recent password change.
   */
  public get passwordChangedAt(): AuthenticationPasswordChangedAt | undefined {
    return this.authentication.passwordChangedAt;
  }

  /**
   * Indicates whether a password change is required.
   */
  public get passwordMustChange(): boolean {
    return this.authentication.isPasswordChangeRequired();
  }

  // ===========================================================================
  // Failure State
  // ===========================================================================

  /**
   * Current failed authentication count.
   */
  public get failedAuthenticationCount(): AuthenticationFailureCount {
    return this.authentication.failedAuthenticationCount;
  }

  /**
   * Most recent failed authentication timestamp.
   */
  public get lastFailedAuthenticationAt():
    AuthenticationLastFailedAt | undefined {
    return this.authentication.lastFailedAuthenticationAt;
  }

  /**
   * Current authentication lock/failure reason.
   */
  public get lockReason(): AuthenticationFailureReason | undefined {
    return this.authentication.lockReason;
  }

  // ===========================================================================
  // Lock State
  // ===========================================================================

  /**
   * Timestamp when Authentication was locked.
   */
  public get lockedAt(): AuthenticationLockedAt | undefined {
    return this.authentication.lockedAt;
  }

  /**
   * Timestamp until which Authentication remains locked.
   */
  public get lockedUntil(): AuthenticationLockedUntil | undefined {
    return this.authentication.lockedUntil;
  }

  /**
   * Determines whether Authentication is currently locked.
   */
  public isCurrentlyLocked(referenceDate: Date = new Date()): boolean {
    return this.authentication.isCurrentlyLocked(referenceDate);
  }

  /**
   * Determines whether the current temporary lock has expired.
   */
  public isLockExpired(referenceDate: Date = new Date()): boolean {
    return this.authentication.isLockExpired(referenceDate);
  }

  // ===========================================================================
  // Authentication Audit
  // ===========================================================================

  /**
   * Most recent successful authentication timestamp.
   */
  public get lastAuthenticatedAt():
    AuthenticationLastAuthenticatedAt | undefined {
    return this.authentication.lastAuthenticatedAt;
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Authentication creation timestamp.
   */
  public get createdAt(): Date {
    return this.authentication.createdAt;
  }

  /**
   * Authentication last-update timestamp.
   */
  public get updatedAt(): Date {
    return this.authentication.updatedAt;
  }

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Updates the aggregate persistence audit timestamp.
   *
   * This is a persistence-support operation and does not emit a domain event.
   */
  public setUpdatedAt(updatedAt: Date): void {
    AuthenticationAggregate.ensureValidDate(
      updatedAt,
      'Authentication update timestamp must be valid.',
    );

    this.authentication.setUpdatedAt(updatedAt);
  }

  // ===========================================================================
  // Aggregate Consistency
  // ===========================================================================

  /**
   * Validates structural consistency of the Authentication aggregate.
   *
   * Entity-level business invariants remain owned by AuthenticationEntity.
   *
   * Cross-domain Identity validation remains outside this aggregate.
   */
  private ensureAggregateConsistency(): void {
    AuthenticationAggregate.ensureEntity(this.authentication);

    if (this.authentication.id === undefined) {
      throw new AuthenticationException(
        'Authentication aggregate internal identity is required.',
      );
    }

    if (this.authentication.publicId === undefined) {
      throw new AuthenticationException(
        'Authentication aggregate public identity is required.',
      );
    }

    if (this.identityPublicId === undefined) {
      throw new AuthenticationException(
        'Authentication Identity public identity is required.',
      );
    }

    AuthenticationAggregate.ensureValidDate(
      this.createdAt,
      'Authentication creation timestamp must be valid.',
    );

    AuthenticationAggregate.ensureValidDate(
      this.updatedAt,
      'Authentication update timestamp must be valid.',
    );

    if (this.updatedAt.getTime() < this.createdAt.getTime()) {
      throw new AuthenticationException(
        'Authentication updated timestamp cannot be before its creation timestamp.',
      );
    }

    if (this.isLocked() && this.lockedAt === undefined) {
      throw new AuthenticationException(
        'Locked Authentication must have a locked-at timestamp.',
      );
    }

    if (
      this.lockedUntil !== undefined &&
      this.lockedAt !== undefined &&
      this.lockedUntil.value.getTime() < this.lockedAt.value.getTime()
    ) {
      throw new AuthenticationException(
        'Authentication locked-until timestamp cannot be before locked-at timestamp.',
      );
    }

    if (!this.isLocked() && this.lockedUntil !== undefined) {
      throw new AuthenticationException(
        'Only a locked Authentication may have a locked-until timestamp.',
      );
    }
  }

  // ===========================================================================
  // Entity Guard
  // ===========================================================================

  /**
   * Ensures an AuthenticationEntity exists before it can become the aggregate
   * root.
   */
  private static ensureEntity(
    authentication: AuthenticationEntity | undefined,
  ): asserts authentication is AuthenticationEntity {
    if (authentication === undefined) {
      throw new AuthenticationException('Authentication entity is required.');
    }
  }

  // ===========================================================================
  // Correlation Guard
  // ===========================================================================

  /**
   * Ensures a correlation identifier exists before recording a domain event.
   */
  private ensureCorrelationId(correlationId: string): void {
    if (
      typeof correlationId !== 'string' ||
      correlationId.trim().length === 0
    ) {
      throw new AuthenticationException(
        'Authentication operation correlation ID is required.',
      );
    }
  }

  // ===========================================================================
  // Date Guard
  // ===========================================================================

  /**
   * Validates a Date value.
   */
  private static ensureValidDate(value: Date, message: string): void {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new AuthenticationException(message);
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AuthenticationAggregate;
