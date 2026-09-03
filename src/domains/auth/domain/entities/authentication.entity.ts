// -----------------------------------------------------------------------------
// Authentication — Entity
// -----------------------------------------------------------------------------
//
// Represents the Authentication entity within the Authentication domain.
//
// Aggregate context:
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// The Authentication entity is the authoritative owner of:
//
// - Authentication identity;
// - opaque Identity public reference;
// - Authentication lifecycle status;
// - password credential state;
// - password version;
// - password-change requirement;
// - authentication failure tracking;
// - authentication lock state;
// - authentication timestamps.
//
// Cross-domain Identity references remain opaque and are represented by
// AuthenticationIdentityPublicId.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - maintain Authentication identity;
// - maintain the opaque Identity public reference;
// - maintain Authentication lifecycle status;
// - maintain password credential state;
// - track password changes;
// - track password-change requirements;
// - track failed authentication attempts;
// - manage Authentication lock state;
// - record successful authentication;
// - enforce Authentication-level invariants;
// - provide security-safe predicates.
//
// -----------------------------------------------------------------------------
//
// This entity does NOT:
//
// - validate Identity domain state;
// - load or mutate Identity;
// - hash passwords;
// - compare plaintext passwords;
// - generate sessions;
// - manage devices;
// - execute account recovery;
// - generate OTPs;
// - persist itself;
// - access Prisma;
// - communicate with external systems;
// - send notifications;
// - perform authorization checks;
// - determine authentication-failure thresholds;
// - determine lock duration.
//
// Password hashing and comparison belong behind the PasswordHasher security
// abstraction.
//
// Workflow orchestration belongs to the application layer.
//
// Cross-aggregate Identity validation belongs to the appropriate application
// workflow or domain policy.
//
// Lock-threshold and lock-duration policies belong outside this entity.
//
// -----------------------------------------------------------------------------
//
// Password creation:
//
// Authentication creation is password-backed.
//
// Therefore:
//
//     AuthenticationEntity.create(
//       identityPublicId,
//       passwordHash,
//     )
//
// requires an already-hashed AuthenticationPasswordHash.
//
// Plaintext passwords MUST NEVER enter this entity.
//
// passwordChangedAt is established at creation because the initial password
// credential is being created at the same time as the Authentication entity.
//
// -----------------------------------------------------------------------------
//
// Initial state:
//
// A newly created Authentication starts as:
//
// - status = PENDING;
// - passwordHash = supplied cryptographic hash;
// - passwordVersion = 1;
// - passwordChangedAt = creation timestamp;
// - passwordMustChange = false;
// - failedAuthenticationCount = 0;
// - lastFailedAuthenticationAt = undefined;
// - lockedAt = undefined;
// - lockedUntil = undefined;
// - lockReason = undefined;
// - lastAuthenticatedAt = undefined.
//
// Authentication activation remains a separate lifecycle operation.
//
// -----------------------------------------------------------------------------
//
// Failure semantics:
//
// A failed authentication attempt is NOT a lock.
//
// A failed attempt records:
//
// - failedAuthenticationCount;
// - lastFailedAuthenticationAt.
//
// It does NOT establish lockReason.
//
// lockReason describes the reason for the CURRENT LOCKED state.
//
// Therefore:
//
//     status = ACTIVE
//     failedAuthenticationCount = 3
//     lastFailedAuthenticationAt = <timestamp>
//     lockReason = undefined
//
// is valid.
//
// Whereas:
//
//     status = LOCKED
//     failedAuthenticationCount = 3
//     lastFailedAuthenticationAt = <timestamp>
//     lockedAt = <timestamp>
//     lockedUntil = <timestamp | undefined>
//     lockReason = INVALID_CREDENTIALS
//
// is valid.
//
// No authentication-failure threshold is encoded in this entity.
//
// -----------------------------------------------------------------------------
//
// Legacy persistence repair:
//
// Older versions of the Authentication failure logic may have persisted a
// failure reason into lockReason while Authentication remained ACTIVE.
//
// Example:
//
//     status = ACTIVE
//     lockReason = INVALID_CREDENTIALS
//
// That state is no longer valid.
//
// Rehydration therefore normalizes lock metadata for non-locked records:
//
//     non-LOCKED
//         lockedAt      -> undefined
//         lockedUntil   -> undefined
//         lockReason    -> undefined
//
// This is a compatibility repair for previously persisted state.
//
// New domain mutations cannot create this state.
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

import { AuthenticationException } from '../exceptions/authentication.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { AuthenticationPublicId } from '../value-objects/authentication-public-id.vo';

import type { AuthenticationIdentityPublicId } from '../value-objects/authentication-identity-public-id.vo';

import { AuthenticationStatus } from '../value-objects/authentication-status.vo';

import type { AuthenticationPasswordHash } from '../value-objects/authentication-password-hash.vo';

import { AuthenticationPasswordVersion } from '../value-objects/authentication-password-version.vo';

import { AuthenticationPasswordChangedAt } from '../value-objects/authentication-password-changed-at.vo';

import { AuthenticationPasswordMustChange } from '../value-objects/authentication-password-must-change.vo';

import { AuthenticationFailureCount } from '../value-objects/authentication-failure-count.vo';

import type { AuthenticationFailureReason } from '../value-objects/authentication-failure-reason.vo';

import type { AuthenticationLastFailedAt } from '../value-objects/authentication-last-failed-at.vo';

import type { AuthenticationLockedAt } from '../value-objects/authentication-locked-at.vo';

import type { AuthenticationLockedUntil } from '../value-objects/authentication-locked-until.vo';

import type { AuthenticationLastAuthenticatedAt } from '../value-objects/authentication-last-authenticated-at.vo';

// =============================================================================
// Props
// =============================================================================

export interface AuthenticationProps {
  /**
   * Opaque public reference to the Identity aggregate.
   */
  identityPublicId: AuthenticationIdentityPublicId;

  /**
   * Authentication lifecycle status.
   */
  status: AuthenticationStatus;

  /**
   * Persisted cryptographic password hash.
   *
   * Plaintext passwords must never be stored in the entity.
   */
  passwordHash: AuthenticationPasswordHash;

  /**
   * Version of the current password credential.
   */
  passwordVersion: AuthenticationPasswordVersion;

  /**
   * Timestamp of the most recent password change.
   *
   * For a newly created password-backed Authentication, this is the
   * Authentication creation timestamp.
   */
  passwordChangedAt: AuthenticationPasswordChangedAt;

  /**
   * Indicates whether the password must be changed.
   */
  passwordMustChange: AuthenticationPasswordMustChange;

  /**
   * Number of failed authentication attempts.
   *
   * This records authentication history.
   *
   * It does NOT itself imply that Authentication is locked.
   */
  failedAuthenticationCount: AuthenticationFailureCount;

  /**
   * Timestamp of the most recent failed authentication attempt.
   */
  lastFailedAuthenticationAt: AuthenticationLastFailedAt | undefined;

  /**
   * Timestamp at which Authentication was locked.
   *
   * Only meaningful when status = LOCKED.
   */
  lockedAt: AuthenticationLockedAt | undefined;

  /**
   * Timestamp until which Authentication remains locked.
   *
   * Undefined represents a lock without an expiration timestamp.
   */
  lockedUntil: AuthenticationLockedUntil | undefined;

  /**
   * Reason for the current Authentication lock.
   *
   * This is NOT the reason for the most recent failed authentication attempt.
   *
   * It is only meaningful while Authentication is LOCKED.
   */
  lockReason: AuthenticationFailureReason | undefined;

  /**
   * Timestamp of the most recent successful authentication.
   */
  lastAuthenticatedAt: AuthenticationLastAuthenticatedAt | undefined;

  /**
   * Authentication creation timestamp.
   */
  createdAt: Date;

  /**
   * Authentication last-update timestamp.
   */
  updatedAt: Date;
}

// =============================================================================
// Entity
// =============================================================================

export class AuthenticationEntity extends Entity<
  AuthenticationProps,
  AuthenticationPublicId
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    props: AuthenticationProps,
    id?: UniqueEntityId,
    publicId?: AuthenticationPublicId,
  ) {
    super(props, id, publicId);
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates a new password-backed Authentication entity.
   *
   * The supplied passwordHash MUST already contain a cryptographic password
   * hash produced by the application's PasswordHasher abstraction.
   *
   * A newly created Authentication begins in PENDING state.
   */
  public static create(
    identityPublicId: AuthenticationIdentityPublicId,
    passwordHash: AuthenticationPasswordHash,
    createdAt: Date = new Date(),
  ): AuthenticationEntity {
    AuthenticationEntity.ensureIdentityPublicId(identityPublicId);

    AuthenticationEntity.ensurePasswordHash(passwordHash);

    AuthenticationEntity.ensureValidDate(createdAt, 'creation date');

    const timestamp = AuthenticationEntity.cloneDate(createdAt);

    const entity = new AuthenticationEntity(
      {
        identityPublicId,

        status: AuthenticationStatus.create('PENDING'),

        passwordHash,

        passwordVersion: AuthenticationPasswordVersion.create(1),

        passwordChangedAt: AuthenticationPasswordChangedAt.create(timestamp),

        passwordMustChange: AuthenticationPasswordMustChange.create(false),

        failedAuthenticationCount: AuthenticationFailureCount.create(0),

        lastFailedAuthenticationAt: undefined,

        lockedAt: undefined,

        lockedUntil: undefined,

        lockReason: undefined,

        lastAuthenticatedAt: undefined,

        createdAt: timestamp,

        updatedAt: AuthenticationEntity.cloneDate(timestamp),
      },

      new UniqueEntityId(),

      new AuthenticationPublicId(),
    );

    entity.validateInvariants();

    return entity;
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  /**
   * Rehydrates a persisted Authentication entity.
   *
   * Rehydration never emits domain events.
   *
   * Legacy lock metadata is normalized when the persisted Authentication is
   * not actually LOCKED.
   *
   * This prevents historical invalid data from blocking otherwise valid
   * authentication attempts.
   */
  public static rehydrate(
    props: AuthenticationProps,
    id: UniqueEntityId,
    publicId: AuthenticationPublicId,
  ): AuthenticationEntity {
    if (props === undefined) {
      throw new AuthenticationException(
        'Authentication properties are required for rehydration.',
      );
    }

    if (id === undefined) {
      throw new AuthenticationException(
        'Authentication internal identity is required for rehydration.',
      );
    }

    if (publicId === undefined) {
      throw new AuthenticationException(
        'Authentication public identity is required for rehydration.',
      );
    }

    AuthenticationEntity.ensureIdentityPublicId(props.identityPublicId);

    AuthenticationEntity.ensurePasswordHash(props.passwordHash);

    AuthenticationEntity.ensureValidDate(props.createdAt, 'creation date');

    AuthenticationEntity.ensureValidDate(props.updatedAt, 'updated date');

    if (props.updatedAt.getTime() < props.createdAt.getTime()) {
      throw new AuthenticationException(
        'Authentication updated date cannot be before creation date.',
      );
    }

    AuthenticationEntity.validatePasswordState(props);

    // -------------------------------------------------------------------------
    // Normalize legacy lock metadata.
    // -------------------------------------------------------------------------
    //
    // Older persistence may contain:
    //
    //     status = ACTIVE
    //     lockReason = INVALID_CREDENTIALS
    //
    // That is no longer a valid domain state.
    //
    // A non-locked Authentication cannot retain lock metadata.
    //
    const isLocked = props.status.equals(AuthenticationStatus.create('LOCKED'));

    const normalizedLockedAt = isLocked ? props.lockedAt : undefined;

    const normalizedLockedUntil = isLocked ? props.lockedUntil : undefined;

    const normalizedLockReason = isLocked ? props.lockReason : undefined;

    const entity = new AuthenticationEntity(
      {
        identityPublicId: props.identityPublicId,

        status: props.status,

        passwordHash: props.passwordHash,

        passwordVersion: props.passwordVersion,

        passwordChangedAt: props.passwordChangedAt,

        passwordMustChange: props.passwordMustChange,

        failedAuthenticationCount: props.failedAuthenticationCount,

        lastFailedAuthenticationAt: props.lastFailedAuthenticationAt,

        lockedAt: normalizedLockedAt,

        lockedUntil: normalizedLockedUntil,

        lockReason: normalizedLockReason,

        lastAuthenticatedAt: props.lastAuthenticatedAt,

        createdAt: AuthenticationEntity.cloneDate(props.createdAt),

        updatedAt: AuthenticationEntity.cloneDate(props.updatedAt),
      },

      id,

      publicId,
    );

    entity.validateInvariants();

    return entity;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of the Authentication entity.
   */
  public override get publicId(): AuthenticationPublicId {
    return super.publicId;
  }

  /**
   * Opaque public reference to the Identity aggregate.
   */
  public get identityPublicId(): AuthenticationIdentityPublicId {
    return this.props.identityPublicId;
  }

  /**
   * Determines whether this Authentication belongs to the supplied Identity.
   */
  public belongsToIdentity(
    identityPublicId: AuthenticationIdentityPublicId,
  ): boolean {
    AuthenticationEntity.ensureIdentityPublicId(identityPublicId);

    return this.props.identityPublicId.equals(identityPublicId);
  }

  // ===========================================================================
  // Status
  // ===========================================================================

  /**
   * Current Authentication status.
   */
  public get status(): AuthenticationStatus {
    return this.props.status;
  }

  /**
   * Determines whether Authentication is pending.
   */
  public isPending(): boolean {
    return this.props.status.equals(AuthenticationStatus.create('PENDING'));
  }

  /**
   * Determines whether Authentication is active.
   */
  public isActive(): boolean {
    return this.props.status.equals(AuthenticationStatus.create('ACTIVE'));
  }

  /**
   * Determines whether Authentication is locked.
   */
  public isLocked(): boolean {
    return this.props.status.equals(AuthenticationStatus.create('LOCKED'));
  }

  /**
   * Determines whether Authentication is disabled.
   */
  public isDisabled(): boolean {
    return this.props.status.equals(AuthenticationStatus.create('DISABLED'));
  }

  /**
   * Determines whether Authentication can currently authenticate.
   *
   * This predicate does not validate credentials.
   */
  public canAuthenticate(): boolean {
    return (
      this.isActive() &&
      this.hasPassword() &&
      !this.isPasswordChangeRequired() &&
      !this.isCurrentlyLocked()
    );
  }

  // ===========================================================================
  // Activation
  // ===========================================================================

  /**
   * Activates a pending Authentication.
   */
  public activate(): void {
    if (this.isActive()) {
      return;
    }

    if (!this.isPending()) {
      throw new AuthenticationException(
        'Only a pending Authentication can be activated.',
      );
    }

    this.props.status = AuthenticationStatus.create('ACTIVE');

    this.touch();
  }

  // ===========================================================================
  // Disable
  // ===========================================================================

  /**
   * Disables Authentication.
   *
   * Disabling clears all lock metadata because a disabled Authentication is
   * not currently locked.
   *
   * The optional reason parameter is retained for API compatibility.
   *
   * It is intentionally not stored in lockReason because lockReason belongs
   * exclusively to the LOCKED state.
   */
  public disable(reason?: AuthenticationFailureReason): void {
    if (this.isDisabled()) {
      return;
    }

    this.props.status = AuthenticationStatus.create('DISABLED');

    this.props.lockedAt = undefined;

    this.props.lockedUntil = undefined;

    this.props.lockReason = undefined;

    // The reason is intentionally not persisted as lockReason.
    void reason;

    this.touch();
  }

  // ===========================================================================
  // Password
  // ===========================================================================

  /**
   * Current password hash.
   */
  public get passwordHash(): AuthenticationPasswordHash {
    return this.props.passwordHash;
  }

  /**
   * Determines whether a password has been established.
   */
  public hasPassword(): boolean {
    return this.props.passwordHash !== undefined;
  }

  /**
   * Current password version.
   */
  public get passwordVersion(): AuthenticationPasswordVersion {
    return this.props.passwordVersion;
  }

  /**
   * Timestamp of the most recent password change.
   */
  public get passwordChangedAt(): AuthenticationPasswordChangedAt {
    return this.props.passwordChangedAt;
  }

  /**
   * Indicates whether a password change is required.
   */
  public get passwordMustChange(): AuthenticationPasswordMustChange {
    return this.props.passwordMustChange;
  }

  /**
   * Determines whether a password change is required.
   */
  public isPasswordChangeRequired(): boolean {
    return this.props.passwordMustChange.value;
  }

  /**
   * Replaces the current password credential.
   *
   * The supplied password hash must already have been generated by the
   * PasswordHasher infrastructure.
   */
  public changePassword(
    passwordHash: AuthenticationPasswordHash,
    passwordVersion: AuthenticationPasswordVersion,
    changedAt: AuthenticationPasswordChangedAt,
  ): void {
    AuthenticationEntity.ensurePasswordHash(passwordHash);

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

    AuthenticationEntity.ensureValidDate(
      changedAt.value,
      'password changed date',
    );

    this.props.passwordHash = passwordHash;

    this.props.passwordVersion = passwordVersion;

    this.props.passwordChangedAt = changedAt;

    this.props.passwordMustChange =
      AuthenticationPasswordMustChange.create(false);

    this.touch();
  }

  /**
   * Marks the password as requiring a change.
   */
  public requirePasswordChange(): void {
    if (this.isPasswordChangeRequired()) {
      return;
    }

    this.props.passwordMustChange =
      AuthenticationPasswordMustChange.create(true);

    this.touch();
  }

  /**
   * Clears the password-change requirement.
   */
  public clearPasswordChangeRequirement(): void {
    if (!this.isPasswordChangeRequired()) {
      return;
    }

    this.props.passwordMustChange =
      AuthenticationPasswordMustChange.create(false);

    this.touch();
  }

  // ===========================================================================
  // Authentication Failures
  // ===========================================================================

  /**
   * Current failed authentication count.
   */
  public get failedAuthenticationCount(): AuthenticationFailureCount {
    return this.props.failedAuthenticationCount;
  }

  /**
   * Most recent failed authentication timestamp.
   */
  public get lastFailedAuthenticationAt():
    AuthenticationLastFailedAt | undefined {
    return this.props.lastFailedAuthenticationAt;
  }

  /**
   * Records an authentication failure.
   *
   * IMPORTANT:
   *
   * A failed authentication is NOT a lock.
   *
   * This method updates only:
   *
   * - failedAuthenticationCount;
   * - lastFailedAuthenticationAt.
   *
   * The failure reason is deliberately NOT stored in lockReason.
   *
   * lockReason describes the reason for the current LOCKED state and is
   * therefore assigned only by lock().
   *
   * No failure threshold is evaluated here.
   */
  public recordAuthenticationFailure(
    count: AuthenticationFailureCount,
    failedAt: AuthenticationLastFailedAt,
    reason: AuthenticationFailureReason,
  ): void {
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

    this.props.failedAuthenticationCount = count;

    this.props.lastFailedAuthenticationAt = failedAt;

    // -------------------------------------------------------------------------
    // IMPORTANT
    // -------------------------------------------------------------------------
    //
    // Never do:
    //
    //     this.props.lockReason = reason;
    //
    // A failed authentication does not mean Authentication is locked.
    //
    // lockReason belongs exclusively to lock().
    //
    void reason;

    this.touch();
  }

  /**
   * Resets authentication failure tracking.
   *
   * Failure tracking can be cleared independently of the lock lifecycle.
   *
   * If the Authentication is locked, the lock itself remains untouched.
   */
  public resetAuthenticationFailures(): void {
    if (
      this.props.failedAuthenticationCount.value === 0 &&
      this.props.lastFailedAuthenticationAt === undefined
    ) {
      return;
    }

    this.props.failedAuthenticationCount = AuthenticationFailureCount.create(0);

    this.props.lastFailedAuthenticationAt = undefined;

    this.touch();
  }

  // ===========================================================================
  // Lock
  // ===========================================================================

  /**
   * Timestamp when Authentication was locked.
   */
  public get lockedAt(): AuthenticationLockedAt | undefined {
    return this.props.lockedAt;
  }

  /**
   * Timestamp until which Authentication remains locked.
   */
  public get lockedUntil(): AuthenticationLockedUntil | undefined {
    return this.props.lockedUntil;
  }

  /**
   * Current lock reason.
   *
   * Undefined when Authentication is not locked.
   */
  public get lockReason(): AuthenticationFailureReason | undefined {
    return this.props.lockReason;
  }

  /**
   * Locks Authentication.
   *
   * This method performs the state transition only.
   *
   * The application/security policy decides:
   *
   * - whether Authentication should be locked;
   * - when it should be locked;
   * - how long it should remain locked;
   * - why it should be locked.
   *
   * This entity does not calculate those decisions.
   */
  public lock(
    lockedAt: AuthenticationLockedAt,
    lockedUntil?: AuthenticationLockedUntil,
    reason?: AuthenticationFailureReason,
  ): void {
    if (this.isDisabled()) {
      throw new AuthenticationException(
        'A disabled Authentication cannot be locked.',
      );
    }

    if (lockedAt === undefined) {
      throw new AuthenticationException(
        'Authentication locked-at timestamp is required.',
      );
    }

    if (
      lockedUntil !== undefined &&
      lockedUntil.value.getTime() < lockedAt.value.getTime()
    ) {
      throw new AuthenticationException(
        'Authentication locked-until date cannot be before locked-at date.',
      );
    }

    this.props.status = AuthenticationStatus.create('LOCKED');

    this.props.lockedAt = lockedAt;

    this.props.lockedUntil = lockedUntil;

    this.props.lockReason = reason;

    this.touch();
  }

  /**
   * Unlocks Authentication.
   *
   * Unlocking restores Authentication to ACTIVE and clears:
   *
   * - lock state;
   * - lock reason;
   * - accumulated authentication failures.
   */
  public unlock(): void {
    if (!this.isLocked()) {
      return;
    }

    this.props.status = AuthenticationStatus.create('ACTIVE');

    this.props.lockedAt = undefined;

    this.props.lockedUntil = undefined;

    this.props.lockReason = undefined;

    this.props.failedAuthenticationCount = AuthenticationFailureCount.create(0);

    this.props.lastFailedAuthenticationAt = undefined;

    this.touch();
  }

  /**
   * Determines whether the current temporary lock has expired.
   */
  public isLockExpired(referenceDate: Date = new Date()): boolean {
    AuthenticationEntity.ensureValidDate(referenceDate, 'reference date');

    if (!this.isLocked()) {
      return false;
    }

    if (this.props.lockedUntil === undefined) {
      return false;
    }

    return this.props.lockedUntil.isExpired(referenceDate);
  }

  /**
   * Determines whether Authentication is currently locked.
   *
   * A permanent lock remains locked until explicitly unlocked.
   *
   * A temporary lock remains locked until its lockedUntil timestamp expires.
   */
  public isCurrentlyLocked(referenceDate: Date = new Date()): boolean {
    AuthenticationEntity.ensureValidDate(referenceDate, 'reference date');

    if (!this.isLocked()) {
      return false;
    }

    if (this.props.lockedUntil === undefined) {
      return true;
    }

    return !this.props.lockedUntil.isExpired(referenceDate);
  }

  // ===========================================================================
  // Successful Authentication
  // ===========================================================================

  /**
   * Records a successful authentication.
   *
   * Credential verification must already have succeeded before this method
   * is called.
   *
   * Successful authentication clears accumulated failure tracking and any
   * lock reason that may have survived from legacy persistence.
   */
  public recordSuccessfulAuthentication(
    authenticatedAt: AuthenticationLastAuthenticatedAt,
  ): void {
    if (!this.isActive()) {
      throw new AuthenticationException(
        'Only an active Authentication can record successful authentication.',
      );
    }

    if (authenticatedAt === undefined) {
      throw new AuthenticationException(
        'Authentication timestamp is required.',
      );
    }

    this.props.lastAuthenticatedAt = authenticatedAt;

    this.props.failedAuthenticationCount = AuthenticationFailureCount.create(0);

    this.props.lastFailedAuthenticationAt = undefined;

    this.props.lockReason = undefined;

    this.touch();
  }

  /**
   * Most recent successful authentication timestamp.
   */
  public get lastAuthenticatedAt():
    AuthenticationLastAuthenticatedAt | undefined {
    return this.props.lastAuthenticatedAt;
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Authentication creation timestamp.
   *
   * Returns a defensive copy.
   */
  public get createdAt(): Date {
    return AuthenticationEntity.cloneDate(this.props.createdAt);
  }

  /**
   * Authentication last-update timestamp.
   *
   * Returns a defensive copy.
   */
  public get updatedAt(): Date {
    return AuthenticationEntity.cloneDate(this.props.updatedAt);
  }

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Updates the persistence timestamp.
   *
   * This is not a business state transition.
   */
  public setUpdatedAt(updatedAt: Date): void {
    AuthenticationEntity.ensureValidDate(updatedAt, 'updated date');

    const timestamp = AuthenticationEntity.cloneDate(updatedAt);

    if (timestamp.getTime() < this.props.createdAt.getTime()) {
      throw new AuthenticationException(
        'Authentication updated date cannot be before creation date.',
      );
    }

    this.props.updatedAt = timestamp;
  }

  // ===========================================================================
  // Invariants
  // ===========================================================================

  /**
   * Validates all entity-level invariants.
   */
  private validateInvariants(): void {
    AuthenticationEntity.ensureIdentityPublicId(this.props.identityPublicId);

    AuthenticationEntity.ensurePasswordHash(this.props.passwordHash);

    AuthenticationEntity.ensureValidDate(this.props.createdAt, 'creation date');

    AuthenticationEntity.ensureValidDate(this.props.updatedAt, 'updated date');

    if (this.props.updatedAt.getTime() < this.props.createdAt.getTime()) {
      throw new AuthenticationException(
        'Authentication updated date cannot be before creation date.',
      );
    }

    AuthenticationEntity.validatePasswordState(this.props);

    AuthenticationEntity.validateLockState(this.props);
  }

  // ===========================================================================
  // Password Invariants
  // ===========================================================================

  /**
   * Validates password-related entity invariants.
   */
  private static validatePasswordState(props: AuthenticationProps): void {
    AuthenticationEntity.ensurePasswordHash(props.passwordHash);

    if (props.passwordVersion === undefined) {
      throw new AuthenticationException(
        'Authentication password version is required.',
      );
    }

    if (props.passwordChangedAt === undefined) {
      throw new AuthenticationException(
        'Authentication password changed timestamp is required.',
      );
    }

    AuthenticationEntity.ensureValidDate(
      props.passwordChangedAt.value,
      'password changed date',
    );

    if (props.passwordChangedAt.value.getTime() < props.createdAt.getTime()) {
      throw new AuthenticationException(
        'Authentication password changed date cannot be before creation date.',
      );
    }
  }

  // ===========================================================================
  // Lock Invariants
  // ===========================================================================

  /**
   * Validates lock-related entity invariants.
   *
   * LOCKED:
   *
   * - lockedAt is required;
   * - lockedUntil is optional;
   * - lockReason is optional.
   *
   * NON-LOCKED:
   *
   * - lockedAt must be undefined;
   * - lockedUntil must be undefined;
   * - lockReason must be undefined.
   *
   * Rehydration normalizes legacy non-locked lock metadata before this
   * validation executes.
   */
  private static validateLockState(props: AuthenticationProps): void {
    const lockedStatus = AuthenticationStatus.create('LOCKED');

    const isLocked = props.status.equals(lockedStatus);

    // -------------------------------------------------------------------------
    // LOCKED invariants
    // -------------------------------------------------------------------------

    if (isLocked && props.lockedAt === undefined) {
      throw new AuthenticationException(
        'Locked Authentication must have a locked-at timestamp.',
      );
    }

    if (props.lockedUntil !== undefined && props.lockedAt === undefined) {
      throw new AuthenticationException(
        'Authentication locked-until requires a locked-at timestamp.',
      );
    }

    if (
      props.lockedUntil !== undefined &&
      props.lockedAt !== undefined &&
      props.lockedUntil.value.getTime() < props.lockedAt.value.getTime()
    ) {
      throw new AuthenticationException(
        'Authentication locked-until date cannot be before locked-at date.',
      );
    }

    // -------------------------------------------------------------------------
    // NON-LOCKED invariants
    // -------------------------------------------------------------------------

    if (!isLocked && props.lockedAt !== undefined) {
      throw new AuthenticationException(
        'Only a locked Authentication may have a locked-at timestamp.',
      );
    }

    if (!isLocked && props.lockedUntil !== undefined) {
      throw new AuthenticationException(
        'Only a locked Authentication may have a locked-until timestamp.',
      );
    }

    if (!isLocked && props.lockReason !== undefined) {
      throw new AuthenticationException(
        'Only a locked Authentication may have a lock reason.',
      );
    }
  }

  // ===========================================================================
  // Identity Guard
  // ===========================================================================

  /**
   * Ensures the opaque Identity public reference exists.
   */
  private static ensureIdentityPublicId(
    identityPublicId: AuthenticationIdentityPublicId,
  ): void {
    if (identityPublicId === undefined) {
      throw new AuthenticationException(
        'Authentication Identity public identity is required.',
      );
    }
  }

  // ===========================================================================
  // Password Guard
  // ===========================================================================

  /**
   * Ensures an opaque password hash exists.
   *
   * This guard does not inspect or interpret the cryptographic format.
   */
  private static ensurePasswordHash(
    passwordHash: AuthenticationPasswordHash,
  ): void {
    if (passwordHash === undefined) {
      throw new AuthenticationException(
        'Authentication password hash is required.',
      );
    }
  }

  // ===========================================================================
  // Date Guard
  // ===========================================================================

  /**
   * Validates a Date.
   */
  private static ensureValidDate(value: Date, fieldName: string): void {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new AuthenticationException(
        `Authentication ${fieldName} must be a valid date.`,
      );
    }
  }

  // ===========================================================================
  // Date Clone
  // ===========================================================================

  /**
   * Creates a defensive Date copy.
   */
  private static cloneDate(value: Date): Date {
    AuthenticationEntity.ensureValidDate(value, 'date');

    return new Date(value.getTime());
  }
}
