// -----------------------------------------------------------------------------
// OTP Challenge — Entity
// -----------------------------------------------------------------------------
//
// Represents an OTP Challenge within the Authentication domain.
//
// Aggregate context:
//
// OtpChallengeAggregate
// └── OtpChallengeEntity
//
// The OtpChallenge entity is the authoritative owner of:
//
// - OTP Challenge identity;
// - opaque Identity reference;
// - OTP purpose;
// - challenged destination snapshot;
// - hashed OTP credential;
// - OTP lifecycle status;
// - verification attempt tracking;
// - maximum verification attempts;
// - expiration state;
// - verification lifecycle;
// - creation and update timestamps.
//
// Cross-domain Identity references remain opaque and are represented by
// OtpChallengeIdentityPublicId.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Maintain OTP Challenge identity.
// - Maintain the opaque Identity public reference.
// - Maintain OTP purpose.
// - Maintain the challenged destination snapshot.
// - Maintain the persisted OTP hash.
// - Track verification attempts.
// - Enforce maximum verification attempts.
// - Record successful verification.
// - Manage OTP expiration.
// - Manage cancellation.
// - Enforce OTP Challenge invariants.
// - Provide security-safe lifecycle predicates.
//
// -----------------------------------------------------------------------------
//
// This entity does NOT:
//
// - Validate Identity domain state.
// - Generate OTP codes.
// - Hash OTP codes.
// - Compare plaintext OTP codes.
// - Send OTPs.
// - Persist itself.
// - Access Prisma.
// - Communicate with external systems.
// - Resolve destination ownership.
// - Perform rate limiting.
// - Decide OTP generation policy.
// - Manage Recovery state.
//
// OTP generation, hashing, comparison, delivery, rate limiting, persistence,
// and workflow orchestration belong to the appropriate application and
// infrastructure boundaries.
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

import { OtpChallengeException } from '../exceptions/otp-challenge.exception';

import { OtpChallengeExpiredException } from '../exceptions/otp-challenge-expired.exception';

import { OtpChallengeInvalidStatusException } from '../exceptions/otp-challenge-invalid-status.exception';

import { OtpChallengeMaxAttemptsExceededException } from '../exceptions/otp-challenge-max-attempts-exceeded.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { OtpChallengePublicId } from '../value-objects/otp-challenge-public-id.vo';

import type { OtpChallengeIdentityPublicId } from '../value-objects/otp-challenge-identity-public-id.vo';

import type { OtpChallengePurpose } from '../value-objects/otp-challenge-purpose.vo';

import { OtpChallengeStatus } from '../value-objects/otp-challenge-status.vo';

import type { OtpChallengeDestination } from '../value-objects/otp-challenge-destination.vo';

import type { OtpChallengeOtpHash } from '../value-objects/otp-challenge-otp-hash.vo';

import { OtpChallengeAttempts } from '../value-objects/otp-challenge-attempts.vo';

import { OtpChallengeMaxAttempts } from '../value-objects/otp-challenge-max-attempts.vo';

import type { OtpChallengeExpiresAt } from '../value-objects/otp-challenge-expires-at.vo';

import type { OtpChallengeVerifiedAt } from '../value-objects/otp-challenge-verified-at.vo';

// =============================================================================
// Props
// =============================================================================

export interface OtpChallengeProps {
  /**
   * Opaque public reference to the Identity associated with this
   * OTP Challenge.
   */
  identityPublicId: OtpChallengeIdentityPublicId;

  /**
   * Business purpose for which the OTP Challenge was created.
   */
  purpose: OtpChallengePurpose;

  /**
   * Current OTP Challenge lifecycle status.
   */
  status: OtpChallengeStatus;

  /**
   * Snapshot of the destination being challenged.
   *
   * The destination is captured when the Challenge is created. Subsequent
   * changes to the Identity do not alter the meaning of an already-issued
   * Challenge.
   */
  destination: OtpChallengeDestination;

  /**
   * Persisted hash of the OTP credential.
   *
   * Plaintext OTP values must never be stored in the entity.
   */
  otpHash: OtpChallengeOtpHash;

  /**
   * Number of verification attempts already consumed.
   */
  attempts: OtpChallengeAttempts;

  /**
   * Maximum number of verification attempts permitted.
   */
  maxAttempts: OtpChallengeMaxAttempts;

  /**
   * Timestamp at which the OTP Challenge expires.
   */
  expiresAt: OtpChallengeExpiresAt;

  /**
   * Timestamp at which the Challenge was successfully verified.
   *
   * Only VERIFIED Challenges may contain this value.
   */
  verifiedAt: OtpChallengeVerifiedAt | undefined;

  /**
   * OTP Challenge creation timestamp.
   */
  createdAt: Date;

  /**
   * OTP Challenge last-update timestamp.
   */
  updatedAt: Date;
}

// =============================================================================
// Entity
// =============================================================================

export class OtpChallengeEntity extends Entity<
  OtpChallengeProps,
  OtpChallengePublicId
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    props: OtpChallengeProps,
    id?: UniqueEntityId,
    publicId?: OtpChallengePublicId,
  ) {
    super(props, id, publicId);
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates a new pending OTP Challenge.
   *
   * OTP generation and hashing must already have been performed by the
   * appropriate application/security boundary.
   *
   * The entity receives only the resulting hashed credential.
   */
  public static create(
    identityPublicId: OtpChallengeIdentityPublicId,
    purpose: OtpChallengePurpose,
    destination: OtpChallengeDestination,
    otpHash: OtpChallengeOtpHash,
    expiresAt: OtpChallengeExpiresAt,
    options?: {
      maxAttempts?: OtpChallengeMaxAttempts;
      createdAt?: Date;
    },
  ): OtpChallengeEntity {
    const createdAt = options?.createdAt ?? new Date();

    OtpChallengeEntity.ensureValidDate(createdAt, 'creation date');

    OtpChallengeEntity.validateExpiry(createdAt, expiresAt);

    const maxAttempts =
      options?.maxAttempts ?? OtpChallengeMaxAttempts.create(5);

    OtpChallengeEntity.validateMaxAttempts(maxAttempts);

    const timestamp = OtpChallengeEntity.cloneDate(createdAt);

    return new OtpChallengeEntity(
      {
        identityPublicId,

        purpose,

        status: OtpChallengeEntity.pendingStatus(),

        destination,

        otpHash,

        attempts: OtpChallengeAttempts.create(0),

        maxAttempts,

        expiresAt,

        verifiedAt: undefined,

        createdAt: timestamp,

        updatedAt: OtpChallengeEntity.cloneDate(timestamp),
      },

      new UniqueEntityId(),

      new OtpChallengePublicId(),
    );
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  /**
   * Rehydrates a persisted OTP Challenge.
   *
   * Rehydration validates entity-level invariants only.
   *
   * No cross-domain Identity state is resolved or validated.
   */
  public static rehydrate(
    props: OtpChallengeProps,
    id: UniqueEntityId,
    publicId: OtpChallengePublicId,
  ): OtpChallengeEntity {
    OtpChallengeEntity.ensureValidDate(props.createdAt, 'creation date');

    OtpChallengeEntity.ensureValidDate(props.updatedAt, 'updated date');

    if (props.updatedAt.getTime() < props.createdAt.getTime()) {
      throw new OtpChallengeException(
        'OTP Challenge updated date cannot be before creation date',
      );
    }

    OtpChallengeEntity.validateExpiry(props.createdAt, props.expiresAt);

    OtpChallengeEntity.validateMaxAttempts(props.maxAttempts);

    OtpChallengeEntity.validateAttemptState(props);

    OtpChallengeEntity.validateLifecycleState(props);

    return new OtpChallengeEntity(
      {
        identityPublicId: props.identityPublicId,

        purpose: props.purpose,

        status: props.status,

        destination: props.destination,

        otpHash: props.otpHash,

        attempts: props.attempts,

        maxAttempts: props.maxAttempts,

        expiresAt: props.expiresAt,

        verifiedAt: props.verifiedAt,

        createdAt: OtpChallengeEntity.cloneDate(props.createdAt),

        updatedAt: OtpChallengeEntity.cloneDate(props.updatedAt),
      },

      id,

      publicId,
    );
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of this OTP Challenge.
   */
  public override get publicId(): OtpChallengePublicId {
    return super.publicId;
  }

  /**
   * Opaque public reference to the associated Identity.
   */
  public get identityPublicId(): OtpChallengeIdentityPublicId {
    return this.props.identityPublicId;
  }

  /**
   * Determines whether this Challenge belongs to the supplied Identity.
   */
  public belongsToIdentity(
    identityPublicId: OtpChallengeIdentityPublicId,
  ): boolean {
    return this.props.identityPublicId.equals(identityPublicId);
  }

  // ===========================================================================
  // Purpose
  // ===========================================================================

  /**
   * Business purpose of this OTP Challenge.
   */
  public get purpose(): OtpChallengePurpose {
    return this.props.purpose;
  }

  // ===========================================================================
  // Status
  // ===========================================================================

  /**
   * Current OTP Challenge lifecycle status.
   */
  public get status(): OtpChallengeStatus {
    return this.props.status;
  }

  /**
   * Determines whether the Challenge is pending.
   */
  public isPending(): boolean {
    return this.props.status.equals(OtpChallengeEntity.pendingStatus());
  }

  /**
   * Determines whether the Challenge has been successfully verified.
   */
  public isVerified(): boolean {
    return this.props.status.equals(OtpChallengeEntity.verifiedStatus());
  }

  /**
   * Determines whether the Challenge has expired.
   */
  public isExpiredStatus(): boolean {
    return this.props.status.equals(OtpChallengeEntity.expiredStatus());
  }

  /**
   * Determines whether the Challenge has been cancelled.
   */
  public isCancelled(): boolean {
    return this.props.status.equals(OtpChallengeEntity.cancelledStatus());
  }

  /**
   * Determines whether the Challenge has failed because its maximum
   * verification attempts were exhausted.
   */
  public isFailed(): boolean {
    return this.props.status.equals(OtpChallengeEntity.failedStatus());
  }

  /**
   * Determines whether the Challenge is in a terminal state.
   */
  public isTerminal(): boolean {
    return (
      this.isVerified() ||
      this.isExpiredStatus() ||
      this.isCancelled() ||
      this.isFailed()
    );
  }

  /**
   * Determines whether the Challenge can currently be verified.
   */
  public canVerify(referenceDate: Date = new Date()): boolean {
    OtpChallengeEntity.ensureValidDate(referenceDate, 'reference date');

    return (
      this.isPending() &&
      !this.isExpired(referenceDate) &&
      this.hasAttemptsRemaining()
    );
  }

  /**
   * Determines whether the Challenge cannot currently be verified.
   */
  public cannotVerify(referenceDate: Date = new Date()): boolean {
    return !this.canVerify(referenceDate);
  }

  // ===========================================================================
  // Destination
  // ===========================================================================

  /**
   * Snapshot of the destination that was challenged.
   */
  public get destination(): OtpChallengeDestination {
    return this.props.destination;
  }

  // ===========================================================================
  // OTP Hash
  // ===========================================================================

  /**
   * Persisted OTP hash.
   *
   * The plaintext OTP is never exposed by the entity.
   */
  public get otpHash(): OtpChallengeOtpHash {
    return this.props.otpHash;
  }

  // ===========================================================================
  // Attempts
  // ===========================================================================

  /**
   * Number of verification attempts already consumed.
   */
  public get attempts(): OtpChallengeAttempts {
    return this.props.attempts;
  }

  /**
   * Maximum number of verification attempts permitted.
   */
  public get maxAttempts(): OtpChallengeMaxAttempts {
    return this.props.maxAttempts;
  }

  /**
   * Determines whether the maximum number of attempts has been reached.
   */
  public hasExceededMaximumAttempts(): boolean {
    return this.props.attempts.value >= this.props.maxAttempts.value;
  }

  /**
   * Determines whether at least one verification attempt remains.
   */
  public hasAttemptsRemaining(): boolean {
    return this.props.attempts.value < this.props.maxAttempts.value;
  }

  /**
   * Records one failed OTP verification attempt.
   *
   * The entity owns the attempt counter and therefore increments it itself.
   * This prevents application services from supplying an arbitrary attempt
   * count and bypassing the entity invariant.
   *
   * When the final permitted attempt is consumed, the Challenge becomes
   * FAILED.
   */
  public recordFailedAttempt(): void {
    this.ensurePendingForVerification();

    const nextAttempts = this.props.attempts.value + 1;

    this.props.attempts = OtpChallengeAttempts.create(nextAttempts);

    if (!this.hasAttemptsRemaining()) {
      this.props.status = OtpChallengeEntity.failedStatus();
    }

    this.touch();
  }

  // ===========================================================================
  // Verification
  // ===========================================================================

  /**
   * Marks the OTP Challenge as successfully verified.
   *
   * OTP generation, hashing, and plaintext comparison must already have
   * succeeded before this method is called.
   */
  public verify(verifiedAt: OtpChallengeVerifiedAt): void {
    this.ensurePendingForVerification(verifiedAt.value);

    if (verifiedAt.value.getTime() < this.props.createdAt.getTime()) {
      throw new OtpChallengeException(
        'OTP Challenge verification date cannot be before creation date',
      );
    }

    if (verifiedAt.value.getTime() >= this.props.expiresAt.value.getTime()) {
      throw new OtpChallengeExpiredException();
    }

    this.props.status = OtpChallengeEntity.verifiedStatus();

    this.props.verifiedAt = verifiedAt;

    this.touch();
  }

  /**
   * Timestamp at which the Challenge was successfully verified.
   */
  public get verifiedAt(): OtpChallengeVerifiedAt | undefined {
    return this.props.verifiedAt;
  }

  // ===========================================================================
  // Expiry
  // ===========================================================================

  /**
   * OTP Challenge expiration timestamp.
   */
  public get expiresAt(): OtpChallengeExpiresAt {
    return this.props.expiresAt;
  }

  /**
   * Determines whether the Challenge is expired relative to the supplied
   * reference date.
   */
  public isExpired(referenceDate: Date = new Date()): boolean {
    OtpChallengeEntity.ensureValidDate(referenceDate, 'reference date');

    return this.props.expiresAt.isExpired(referenceDate);
  }

  /**
   * Marks the Challenge as expired.
   *
   * Terminal states are never transitioned to EXPIRED.
   */
  public expire(referenceDate: Date = new Date()): void {
    OtpChallengeEntity.ensureValidDate(referenceDate, 'reference date');

    if (this.isTerminal()) {
      return;
    }

    if (!this.isExpired(referenceDate)) {
      throw new OtpChallengeException(
        'An unexpired OTP Challenge cannot be marked as expired',
      );
    }

    this.props.status = OtpChallengeEntity.expiredStatus();

    this.touch();
  }

  // ===========================================================================
  // Cancellation
  // ===========================================================================

  /**
   * Cancels the OTP Challenge.
   *
   * Only a pending Challenge may be cancelled.
   */
  public cancel(): void {
    if (this.isCancelled()) {
      return;
    }

    if (this.isVerified()) {
      throw new OtpChallengeInvalidStatusException(
        'A verified OTP Challenge cannot be cancelled.',
      );
    }

    if (this.isExpiredStatus()) {
      throw new OtpChallengeInvalidStatusException(
        'An expired OTP Challenge cannot be cancelled.',
      );
    }

    if (this.isFailed()) {
      throw new OtpChallengeInvalidStatusException(
        'A failed OTP Challenge cannot be cancelled.',
      );
    }

    if (!this.isPending()) {
      throw new OtpChallengeInvalidStatusException(
        'Only a pending OTP Challenge can be cancelled.',
      );
    }

    this.props.status = OtpChallengeEntity.cancelledStatus();

    this.touch();
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * OTP Challenge creation timestamp.
   *
   * Returns a defensive copy.
   */
  public get createdAt(): Date {
    return OtpChallengeEntity.cloneDate(this.props.createdAt);
  }

  /**
   * OTP Challenge last-update timestamp.
   *
   * Returns a defensive copy.
   */
  public get updatedAt(): Date {
    return OtpChallengeEntity.cloneDate(this.props.updatedAt);
  }

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Updates the persistence timestamp.
   *
   * This is an infrastructure-oriented timestamp operation and does not
   * represent a business lifecycle transition.
   */
  public setUpdatedAt(updatedAt: Date): void {
    OtpChallengeEntity.ensureValidDate(updatedAt, 'updated date');

    const timestamp = OtpChallengeEntity.cloneDate(updatedAt);

    if (timestamp.getTime() < this.props.createdAt.getTime()) {
      throw new OtpChallengeException(
        'OTP Challenge updated date cannot be before creation date',
      );
    }

    this.props.updatedAt = timestamp;
  }

  // ===========================================================================
  // Guards
  // ===========================================================================

  /**
   * Ensures that the Challenge is pending, unexpired, and has a remaining
   * verification attempt.
   */
  private ensurePendingForVerification(referenceDate: Date = new Date()): void {
    OtpChallengeEntity.ensureValidDate(referenceDate, 'reference date');

    if (!this.isPending()) {
      throw new OtpChallengeInvalidStatusException(
        'Only a pending OTP Challenge can be verified.',
      );
    }

    if (this.isExpired(referenceDate)) {
      throw new OtpChallengeExpiredException();
    }

    if (!this.hasAttemptsRemaining()) {
      throw new OtpChallengeMaxAttemptsExceededException();
    }
  }

  // ===========================================================================
  // Validation
  // ===========================================================================

  /**
   * Validates Challenge expiry.
   */
  private static validateExpiry(
    createdAt: Date,
    expiresAt: OtpChallengeExpiresAt,
  ): void {
    if (expiresAt.value.getTime() <= createdAt.getTime()) {
      throw new OtpChallengeException(
        'OTP Challenge expiry date must be after creation date',
      );
    }
  }

  /**
   * Validates maximum verification attempts.
   */
  private static validateMaxAttempts(
    maxAttempts: OtpChallengeMaxAttempts,
  ): void {
    if (maxAttempts.value <= 0) {
      throw new OtpChallengeException(
        'OTP Challenge maximum attempts must be greater than zero',
      );
    }
  }

  /**
   * Validates attempt-related invariants.
   */
  private static validateAttemptState(props: OtpChallengeProps): void {
    if (props.attempts.value < 0) {
      throw new OtpChallengeException(
        'OTP Challenge attempts cannot be negative',
      );
    }

    if (props.attempts.value > props.maxAttempts.value) {
      throw new OtpChallengeException(
        'OTP Challenge attempts cannot exceed maximum attempts',
      );
    }

    if (
      props.status.equals(OtpChallengeEntity.failedStatus()) &&
      props.attempts.value !== props.maxAttempts.value
    ) {
      throw new OtpChallengeException(
        'A failed OTP Challenge must have exhausted its maximum attempts',
      );
    }
  }

  /**
   * Validates lifecycle and verification invariants.
   */
  private static validateLifecycleState(props: OtpChallengeProps): void {
    const isVerified = props.status.equals(OtpChallengeEntity.verifiedStatus());

    if (isVerified && props.verifiedAt === undefined) {
      throw new OtpChallengeException(
        'A verified OTP Challenge must have a verified-at timestamp',
      );
    }

    if (!isVerified && props.verifiedAt !== undefined) {
      throw new OtpChallengeException(
        'Only a verified OTP Challenge may have a verified-at timestamp',
      );
    }

    if (props.verifiedAt === undefined) {
      return;
    }

    const verifiedAt = props.verifiedAt.value.getTime();
    const createdAt = props.createdAt.getTime();
    const expiresAt = props.expiresAt.value.getTime();

    if (verifiedAt < createdAt) {
      throw new OtpChallengeException(
        'OTP Challenge verification date cannot be before creation date',
      );
    }

    if (verifiedAt >= expiresAt) {
      throw new OtpChallengeException(
        'OTP Challenge verification date must be before expiration date',
      );
    }
  }

  /**
   * Validates a Date.
   */
  private static ensureValidDate(value: Date, fieldName: string): void {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      throw new OtpChallengeException(
        `OTP Challenge ${fieldName} must be a valid date`,
      );
    }
  }

  /**
   * Creates a defensive Date copy.
   */
  private static cloneDate(value: Date): Date {
    OtpChallengeEntity.ensureValidDate(value, 'date');

    return new Date(value.getTime());
  }

  // ===========================================================================
  // Status Factories
  // ===========================================================================

  private static pendingStatus(): OtpChallengeStatus {
    return OtpChallengeStatus.create('PENDING');
  }

  private static verifiedStatus(): OtpChallengeStatus {
    return OtpChallengeStatus.create('VERIFIED');
  }

  private static expiredStatus(): OtpChallengeStatus {
    return OtpChallengeStatus.create('EXPIRED');
  }

  private static cancelledStatus(): OtpChallengeStatus {
    return OtpChallengeStatus.create('CANCELLED');
  }

  private static failedStatus(): OtpChallengeStatus {
    return OtpChallengeStatus.create('FAILED');
  }
}
