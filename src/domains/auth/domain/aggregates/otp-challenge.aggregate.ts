// -----------------------------------------------------------------------------
// OTP Challenge — Aggregate
// -----------------------------------------------------------------------------
//
// Aggregate:
//
// OtpChallengeAggregate
// └── OtpChallengeEntity
//
// OtpChallenge is an independent aggregate responsible for the lifecycle of
// one OTP verification challenge associated with an Identity.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Own the OtpChallengeEntity.
// - Expose OTP Challenge state through the aggregate boundary.
// - Coordinate OTP Challenge lifecycle transitions.
// - Record OTP Challenge domain events.
// - Preserve correlation/causation metadata for domain events.
// - Coordinate verification attempts.
// - Coordinate OTP Challenge expiry.
// - Coordinate OTP Challenge cancellation.
// - Coordinate OTP Challenge failure.
// - Coordinate OTP Challenge verification.
// - Enforce aggregate-level structural consistency.
//
// -----------------------------------------------------------------------------
//
// This aggregate does NOT:
//
// - Validate Identity domain state.
// - Generate OTPs.
// - Hash OTPs.
// - Compare raw OTP values.
// - Persist itself.
// - Access Prisma.
// - Send OTPs.
// - Send notifications.
// - Communicate with external systems.
// - Authenticate users.
// - Modify Authentication directly.
// - Modify Recovery directly.
// - Manage Sessions directly.
// - Resolve external security policy.
//
// OTP generation, hashing, comparison, notification delivery, persistence,
// authentication orchestration, recovery orchestration, and external security
// services belong to the appropriate application/infrastructure boundaries.
//
// Cross-aggregate orchestration belongs to the application layer.
//
// -----------------------------------------------------------------------------
//
// Aggregate identity:
//
// Internal identity:
// - OtpChallengeEntity.id
//
// Public identity:
// - OtpChallengeEntity.publicId
//
// Cross-domain reference:
//
// - OtpChallengeIdentityPublicId
//
// -----------------------------------------------------------------------------
//
// Domain events:
//
// - OtpChallengeCreatedEvent
// - OtpChallengeVerifiedEvent
// - OtpChallengeFailedEvent
// - OtpChallengeExpiredEvent
// - OtpChallengeCancelledEvent
//
// correlationId is required.
// causationId is optional.
//
// -----------------------------------------------------------------------------
//
// Security boundary:
//
// OTP material is intentionally excluded from domain events.
//
// In particular:
//
// - raw OTP values are never published;
// - OTP hashes are never published;
// - authentication credentials are never published;
// - passwords are never published;
// - password hashes are never published;
// - recovery tokens are never published;
// - recovery-token hashes are never published;
// - session credentials are never published.
//
// Destination values are also not published by this aggregate because the
// destination may contain sensitive contact information such as an email
// address or phone number.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { OtpChallengeEntity } from '../entities/otp-challenge.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import { OtpChallengeCreatedEvent } from '../events/otp-challenge-created.event';

import { OtpChallengeVerifiedEvent } from '../events/otp-challenge-verified.event';

import { OtpChallengeFailedEvent } from '../events/otp-challenge-failed.event';

import { OtpChallengeExpiredEvent } from '../events/otp-challenge-expired.event';

import { OtpChallengeCancelledEvent } from '../events/otp-challenge-cancelled.event';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { OtpChallengeException } from '../exceptions/otp-challenge.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { OtpChallengeIdentityPublicId } from '../value-objects/otp-challenge-identity-public-id.vo';

import type { OtpChallengePurpose } from '../value-objects/otp-challenge-purpose.vo';

import type { OtpChallengeStatus } from '../value-objects/otp-challenge-status.vo';

import type { OtpChallengeDestination } from '../value-objects/otp-challenge-destination.vo';

import type { OtpChallengeOtpHash } from '../value-objects/otp-challenge-otp-hash.vo';

import type { OtpChallengeAttempts } from '../value-objects/otp-challenge-attempts.vo';

import type { OtpChallengeMaxAttempts } from '../value-objects/otp-challenge-max-attempts.vo';

import type { OtpChallengeExpiresAt } from '../value-objects/otp-challenge-expires-at.vo';

import type { OtpChallengeVerifiedAt } from '../value-objects/otp-challenge-verified-at.vo';

// =============================================================================
// Props
// =============================================================================

interface OtpChallengeAggregateProps {
  /**
   * Root entity owned by the OTP Challenge aggregate.
   */
  otpChallenge: OtpChallengeEntity;
}

// =============================================================================
// Aggregate
// =============================================================================

/**
 * OTP Challenge aggregate root.
 *
 * Owns exactly one OtpChallengeEntity representing one OTP verification
 * challenge.
 */
export class OtpChallengeAggregate extends AggregateRoot<OtpChallengeAggregateProps> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(props: OtpChallengeAggregateProps) {
    if (props === undefined) {
      throw new OtpChallengeException(
        'OTP Challenge aggregate properties are required.',
      );
    }

    if (props.otpChallenge === undefined) {
      throw new OtpChallengeException(
        'OTP Challenge aggregate root is required.',
      );
    }

    super(props, props.otpChallenge.id, props.otpChallenge.publicId);
  }

  // ===========================================================================
  // Factory — Create
  // ===========================================================================

  /**
   * Creates an OTP Challenge aggregate around an already-created entity.
   *
   * Entity construction and creation-event recording are intentionally
   * separate operations.
   */
  public static create(
    otpChallenge: OtpChallengeEntity,
  ): OtpChallengeAggregate {
    if (otpChallenge === undefined) {
      throw new OtpChallengeException('OTP Challenge entity is required.');
    }

    const aggregate = new OtpChallengeAggregate({
      otpChallenge,
    });

    aggregate.ensureAggregateConsistency();

    return aggregate;
  }

  // ===========================================================================
  // Factory — Rehydrate
  // ===========================================================================

  /**
   * Rehydrates a persisted OTP Challenge aggregate.
   *
   * Rehydration never emits domain events.
   */
  public static rehydrate(
    otpChallenge: OtpChallengeEntity,
  ): OtpChallengeAggregate {
    if (otpChallenge === undefined) {
      throw new OtpChallengeException(
        'OTP Challenge aggregate root is required for rehydration.',
      );
    }

    const aggregate = new OtpChallengeAggregate({
      otpChallenge,
    });

    aggregate.ensureAggregateConsistency();

    return aggregate;
  }

  // ===========================================================================
  // Aggregate State
  // ===========================================================================

  /**
   * Returns the OTP Challenge aggregate root entity.
   */
  public get otpChallenge(): OtpChallengeEntity {
    return this.props.otpChallenge;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Internal persistence identity of the aggregate.
   */
  public override get id(): typeof this.otpChallenge.id {
    return this.otpChallenge.id;
  }

  /**
   * Public identity of the aggregate.
   */
  public override get publicId(): typeof this.otpChallenge.publicId {
    return this.otpChallenge.publicId;
  }

  /**
   * Opaque public reference to the associated Identity.
   */
  public get identityPublicId(): OtpChallengeIdentityPublicId {
    return this.otpChallenge.identityPublicId;
  }

  /**
   * Determines whether this Challenge belongs to the supplied Identity.
   */
  public belongsToIdentity(
    identityPublicId: OtpChallengeIdentityPublicId,
  ): boolean {
    return this.otpChallenge.belongsToIdentity(identityPublicId);
  }

  // ===========================================================================
  // Purpose
  // ===========================================================================

  /**
   * Business purpose of the OTP Challenge.
   */
  public get purpose(): OtpChallengePurpose {
    return this.otpChallenge.purpose;
  }

  // ===========================================================================
  // Status
  // ===========================================================================

  /**
   * Current OTP Challenge lifecycle status.
   */
  public get status(): OtpChallengeStatus {
    return this.otpChallenge.status;
  }

  /**
   * Determines whether the Challenge is pending.
   */
  public isPending(): boolean {
    return this.otpChallenge.isPending();
  }

  /**
   * Determines whether the Challenge has been verified.
   */
  public isVerified(): boolean {
    return this.otpChallenge.isVerified();
  }

  /**
   * Determines whether the Challenge is expired.
   */
  public isExpiredStatus(): boolean {
    return this.otpChallenge.isExpiredStatus();
  }

  /**
   * Determines whether the Challenge has been cancelled.
   */
  public isCancelled(): boolean {
    return this.otpChallenge.isCancelled();
  }

  /**
   * Determines whether the Challenge has failed.
   */
  public isFailed(): boolean {
    return this.otpChallenge.isFailed();
  }

  /**
   * Determines whether the Challenge is terminal.
   */
  public isTerminal(): boolean {
    return this.otpChallenge.isTerminal();
  }

  // ===========================================================================
  // Destination
  // ===========================================================================

  /**
   * Snapshot of the destination being challenged.
   *
   * The value remains inside the aggregate boundary and is not published
   * through domain events.
   */
  public get destination(): OtpChallengeDestination {
    return this.otpChallenge.destination;
  }

  // ===========================================================================
  // OTP Hash
  // ===========================================================================

  /**
   * Persisted OTP hash.
   *
   * The hash is intentionally exposed only to trusted application/domain
   * collaborators that require it for verification. It is never published
   * through domain events.
   */
  public get otpHash(): OtpChallengeOtpHash {
    return this.otpChallenge.otpHash;
  }

  // ===========================================================================
  // Attempts
  // ===========================================================================

  /**
   * Number of verification attempts already consumed.
   */
  public get attempts(): OtpChallengeAttempts {
    return this.otpChallenge.attempts;
  }

  /**
   * Maximum number of verification attempts permitted.
   */
  public get maxAttempts(): OtpChallengeMaxAttempts {
    return this.otpChallenge.maxAttempts;
  }

  /**
   * Determines whether the maximum number of attempts has been reached.
   */
  public hasExceededMaximumAttempts(): boolean {
    return this.otpChallenge.hasExceededMaximumAttempts();
  }

  /**
   * Determines whether another verification attempt remains.
   */
  public hasAttemptsRemaining(): boolean {
    return this.otpChallenge.hasAttemptsRemaining();
  }

  /**
   * Determines whether the Challenge can currently be verified.
   */
  public canVerify(referenceDate: Date = new Date()): boolean {
    return this.otpChallenge.canVerify(referenceDate);
  }

  /**
   * Determines whether the Challenge cannot currently be verified.
   */
  public cannotVerify(referenceDate: Date = new Date()): boolean {
    return this.otpChallenge.cannotVerify(referenceDate);
  }

  // ===========================================================================
  // Creation Event
  // ===========================================================================

  /**
 * Records creation of the OTP Challenge aggregate.
 *
 * Entity creation remains separate through OtpChallengeEntity.create().
 *
 * The event contains only security-approved, non-sensitive information.
 *
 * Sensitive OTP material and the challenged destination are intentionally
 * excluded from the event payload.
 *
 * Specifically, the event does not publish:
 *
 * - raw OTP values;
// * OTP hashes;
// * email addresses;
// * phone numbers;
// * challenged destinations;
// * authentication secrets.
 *
 * The aggregate internal identity remains available through the
 * domain-event metadata.
 */
  public recordCreated(correlationId: string, causationId?: string): void {
    this.ensureCorrelationId(correlationId);

    this.addDomainEvent(
      new OtpChallengeCreatedEvent(
        this.id.value,
        this.publicId.value,
        this.identityPublicId.value,
        this.purpose.value,
        this.status.value,
        this.createdAt,
        this.expiresAt.value,
        this.createdAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Expiry
  // ===========================================================================

  /**
   * OTP Challenge expiration timestamp.
   */
  public get expiresAt(): OtpChallengeExpiresAt {
    return this.otpChallenge.expiresAt;
  }

  /**
   * Determines whether the Challenge is expired relative to the supplied
   * reference date.
   */
  public isExpired(referenceDate: Date = new Date()): boolean {
    return this.otpChallenge.isExpired(referenceDate);
  }

  /**
   * Marks the Challenge as expired and records OtpChallengeExpiredEvent.
   *
   * The entity owns the expiry transition.
   */
  public expire(
    referenceDate: Date = new Date(),
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureCorrelationId(correlationId);

    const wasExpired = this.otpChallenge.isExpiredStatus();

    this.otpChallenge.expire(referenceDate);

    if (wasExpired || !this.otpChallenge.isExpiredStatus()) {
      return;
    }

    this.addDomainEvent(
      new OtpChallengeExpiredEvent(
        this.id.value,
        this.publicId.value,
        this.identityPublicId.value,
        this.purpose.value,
        this.status.value,
        this.expiresAt.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Verification
  // ===========================================================================

  /**
   * Timestamp at which the Challenge was successfully verified.
   */
  public get verifiedAt(): OtpChallengeVerifiedAt | undefined {
    return this.otpChallenge.verifiedAt;
  }

  /**
   * Marks the Challenge as successfully verified and records
   * OtpChallengeVerifiedEvent.
   *
   * Raw OTP comparison remains outside the aggregate.
   *
   * The application/security boundary is responsible for comparing the
   * supplied plaintext OTP against the persisted OTP hash before invoking
   * this operation.
   */
  public verify(
    verifiedAt: OtpChallengeVerifiedAt,
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureCorrelationId(correlationId);

    if (verifiedAt === undefined) {
      throw new OtpChallengeException(
        'OTP Challenge verification timestamp is required.',
      );
    }

    const wasVerified = this.otpChallenge.isVerified();

    this.otpChallenge.verify(verifiedAt);

    if (wasVerified || !this.otpChallenge.isVerified()) {
      return;
    }

    const verificationTimestamp = this.otpChallenge.verifiedAt;

    if (verificationTimestamp === undefined) {
      throw new OtpChallengeException(
        'Verified OTP Challenge must have a verified-at timestamp.',
      );
    }

    this.addDomainEvent(
      new OtpChallengeVerifiedEvent(
        this.id.value,
        this.publicId.value,
        this.identityPublicId.value,
        this.purpose.value,
        this.status.value,
        verificationTimestamp.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Failed Verification
  // ===========================================================================

  /**
   * Records one failed OTP verification attempt.
   *
   * The entity owns the attempt counter and increments it internally.
   *
   * OtpChallengeFailedEvent is emitted only when the final permitted attempt
   * is consumed and the Challenge transitions to FAILED.
   *
   * Individual failed attempts are not represented as
   * OtpChallengeFailedEvent because a failed verification attempt does not
   * necessarily mean that the Challenge itself has failed.
   */
  public recordFailedAttempt(
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureCorrelationId(correlationId);

    const wasFailed = this.otpChallenge.isFailed();

    this.otpChallenge.recordFailedAttempt();

    const isFailed = this.otpChallenge.isFailed();

    if (wasFailed || !isFailed) {
      return;
    }

    this.addDomainEvent(
      new OtpChallengeFailedEvent(
        this.id.value,
        this.publicId.value,
        this.identityPublicId.value,
        this.purpose.value,
        this.status.value,
        this.updatedAt,
        this.attempts.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Cancellation
  // ===========================================================================

  /**
   * Cancels the OTP Challenge and records OtpChallengeCancelledEvent.
   *
   * The entity owns the actual cancellation transition.
   *
   * The current model does not contain cancelledAt, therefore updatedAt is
   * used as the lifecycle timestamp for the cancellation event.
   */
  public cancel(correlationId: string, causationId?: string): void {
    this.ensureCorrelationId(correlationId);

    const wasCancelled = this.otpChallenge.isCancelled();

    this.otpChallenge.cancel();

    if (wasCancelled || !this.otpChallenge.isCancelled()) {
      return;
    }

    this.addDomainEvent(
      new OtpChallengeCancelledEvent(
        this.id.value,
        this.publicId.value,
        this.identityPublicId.value,
        this.purpose.value,
        this.status.value,
        this.updatedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * OTP Challenge creation timestamp.
   *
   * Returns a defensive copy through the entity.
   */
  public get createdAt(): Date {
    return this.otpChallenge.createdAt;
  }

  /**
   * OTP Challenge last-update timestamp.
   *
   * Returns a defensive copy through the entity.
   */
  public get updatedAt(): Date {
    return this.otpChallenge.updatedAt;
  }

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Updates the aggregate persistence timestamp.
   *
   * This operation does not emit a domain event because persistence metadata
   * is not itself a business lifecycle transition.
   */
  public setUpdatedAt(updatedAt: Date): void {
    OtpChallengeAggregate.ensureValidDate(
      updatedAt,
      'OTP Challenge update timestamp must be valid.',
    );

    this.otpChallenge.setUpdatedAt(updatedAt);
  }

  // ===========================================================================
  // Aggregate Consistency
  // ===========================================================================

  /**
   * Validates structural consistency of the aggregate.
   *
   * Business invariants remain owned by OtpChallengeEntity.
   *
   * Cross-domain Identity state is intentionally not resolved or validated.
   */
  private ensureAggregateConsistency(): void {
    const challenge = this.otpChallenge;

    if (challenge === undefined) {
      throw new OtpChallengeException(
        'OTP Challenge aggregate root is required.',
      );
    }

    if (challenge.id === undefined) {
      throw new OtpChallengeException(
        'OTP Challenge aggregate internal identity is required.',
      );
    }

    if (challenge.publicId === undefined) {
      throw new OtpChallengeException(
        'OTP Challenge aggregate public identity is required.',
      );
    }

    if (challenge.identityPublicId === undefined) {
      throw new OtpChallengeException(
        'OTP Challenge Identity public identity is required.',
      );
    }

    if (challenge.purpose === undefined) {
      throw new OtpChallengeException('OTP Challenge purpose is required.');
    }

    if (challenge.status === undefined) {
      throw new OtpChallengeException('OTP Challenge status is required.');
    }

    if (challenge.destination === undefined) {
      throw new OtpChallengeException('OTP Challenge destination is required.');
    }

    if (challenge.otpHash === undefined) {
      throw new OtpChallengeException('OTP Challenge hash is required.');
    }

    if (challenge.attempts === undefined) {
      throw new OtpChallengeException(
        'OTP Challenge attempts value is required.',
      );
    }

    if (challenge.maxAttempts === undefined) {
      throw new OtpChallengeException(
        'OTP Challenge maximum attempts value is required.',
      );
    }

    if (challenge.expiresAt === undefined) {
      throw new OtpChallengeException(
        'OTP Challenge expiry timestamp is required.',
      );
    }

    OtpChallengeAggregate.ensureValidDate(
      challenge.createdAt,
      'OTP Challenge creation timestamp must be valid.',
    );

    OtpChallengeAggregate.ensureValidDate(
      challenge.updatedAt,
      'OTP Challenge update timestamp must be valid.',
    );

    if (challenge.updatedAt.getTime() < challenge.createdAt.getTime()) {
      throw new OtpChallengeException(
        'OTP Challenge updated timestamp cannot be before its creation timestamp.',
      );
    }

    OtpChallengeAggregate.ensureValidDate(
      challenge.expiresAt.value,
      'OTP Challenge expiry timestamp must be valid.',
    );
  }

  // ===========================================================================
  // Correlation Guard
  // ===========================================================================

  /**
   * Ensures that a valid correlation identifier exists before a domain event
   * is recorded.
   */
  private ensureCorrelationId(correlationId: string): void {
    if (
      typeof correlationId !== 'string' ||
      correlationId.trim().length === 0
    ) {
      throw new OtpChallengeException(
        'OTP Challenge operation correlation ID is required.',
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
      throw new OtpChallengeException(message);
    }
  }
}
