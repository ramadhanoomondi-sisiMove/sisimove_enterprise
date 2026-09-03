// -----------------------------------------------------------------------------
// Session — Aggregate
// -----------------------------------------------------------------------------
//
// Aggregate:
//
// SessionAggregate
// └── SessionEntity
//
// Session is an independent aggregate responsible for the lifecycle and
// security state of one authenticated Session.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Own the SessionEntity.
// - Expose Session state through the aggregate boundary.
// - Coordinate Session lifecycle transitions.
// - Record Session domain events.
// - Preserve correlation/causation metadata for domain events.
// - Coordinate refresh-token rotation state.
// - Coordinate Session expiry.
// - Coordinate Session revocation.
// - Record refresh-token reuse detection.
// - Enforce aggregate-level structural consistency.
//
// -----------------------------------------------------------------------------
//
// This aggregate does NOT:
//
// - Generate raw refresh tokens.
// - Hash refresh tokens.
// - Compare raw refresh tokens.
// - Sign JWTs.
// - Verify JWTs.
// - Validate Identity domain state.
// - Validate Device aggregate state.
// - Revoke other Sessions directly.
// - Revoke an entire token family directly.
// - Persist itself.
// - Access Prisma.
// - Communicate with external systems.
// - Send notifications.
// - Decide token-reuse security policy.
//
// Token generation, hashing, comparison, and security policy belong to the
// appropriate application/infrastructure security boundaries.
//
// Cross-aggregate orchestration belongs to the application layer.
//
// -----------------------------------------------------------------------------
//
// Aggregate identity:
//
// Internal identity:
// - SessionEntity.id
//
// Public identity:
// - SessionEntity.publicId
//
// Cross-domain references:
// - SessionIdentityPublicId
// - SessionDevicePublicId
//
// -----------------------------------------------------------------------------
//
// Domain events:
//
// - SessionCreatedEvent
// - SessionRefreshedEvent
// - SessionRevokedEvent
// - SessionExpiredEvent
// - SessionTokenReuseDetectedEvent
//
// correlationId is required.
// causationId is optional.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { SessionEntity } from '../entities/session.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import { SessionCreatedEvent } from '../events/session-created.event';

import { SessionRefreshedEvent } from '../events/session-refreshed.event';

import { SessionRevokedEvent } from '../events/session-revoked.event';

import { SessionExpiredEvent } from '../events/session-expired.event';

import { SessionTokenReuseDetectedEvent } from '../events/session-token-reuse-detected.event';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { SessionException } from '../exceptions/session.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { SessionIdentityPublicId } from '../value-objects/session-identity-public-id.vo';

import type { SessionDevicePublicId } from '../value-objects/session-device-public-id.vo';

import type { SessionRefreshTokenHash } from '../value-objects/session-refresh-token-hash.vo';

import type { SessionTokenFamilyPublicId } from '../value-objects/session-token-family-public-id.vo';

import type { SessionReplacedByPublicId } from '../value-objects/session-replaced-by-public-id.vo';

import type { SessionIpAddress } from '../value-objects/session-ip-address.vo';

import type { SessionUserAgent } from '../value-objects/session-user-agent.vo';

import type { SessionCountryCode } from '../value-objects/session-country-code.vo';

import type { SessionCity } from '../value-objects/session-city.vo';

import type { SessionAuthenticatedAt } from '../value-objects/session-authenticated-at.vo';

import type { SessionLastActivityAt } from '../value-objects/session-last-activity-at.vo';

import type { SessionExpiresAt } from '../value-objects/session-expires-at.vo';

import type { SessionRevokedAt } from '../value-objects/session-revoked-at.vo';

import type { SessionRevocationReason } from '../value-objects/session-revocation-reason.vo';

import type { SessionStatus } from '../value-objects/session-status.vo';

// =============================================================================
// Props
// =============================================================================

interface SessionAggregateProps {
  /**
   * Root entity owned by the Session aggregate.
   */
  session: SessionEntity;
}

// =============================================================================
// Aggregate
// =============================================================================

/**
 * Session aggregate root.
 *
 * Owns exactly one SessionEntity representing one authenticated Session.
 */
export class SessionAggregate extends AggregateRoot<SessionAggregateProps> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(props: SessionAggregateProps) {
    if (props === undefined) {
      throw new SessionException('Session aggregate properties are required.');
    }

    if (props.session === undefined) {
      throw new SessionException('Session aggregate root is required.');
    }

    super(props, props.session.id, props.session.publicId);
  }

  // ===========================================================================
  // Factory — Create
  // ===========================================================================

  /**
   * Creates a new Session aggregate around an existing SessionEntity.
   *
   * Entity creation and domain-event recording remain separate operations.
   */
  public static create(session: SessionEntity): SessionAggregate {
    if (session === undefined) {
      throw new SessionException('Session entity is required.');
    }

    const aggregate = new SessionAggregate({
      session,
    });

    aggregate.ensureAggregateConsistency();

    return aggregate;
  }

  // ===========================================================================
  // Factory — Rehydrate
  // ===========================================================================

  /**
   * Rehydrates a persisted Session aggregate.
   *
   * Rehydration never emits domain events.
   */
  public static rehydrate(session: SessionEntity): SessionAggregate {
    if (session === undefined) {
      throw new SessionException(
        'Session aggregate root is required for rehydration.',
      );
    }

    const aggregate = new SessionAggregate({
      session,
    });

    aggregate.ensureAggregateConsistency();

    return aggregate;
  }

  // ===========================================================================
  // Aggregate State
  // ===========================================================================

  /**
   * Returns the Session aggregate root entity.
   */
  public get session(): SessionEntity {
    return this.props.session;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Internal persistence identity of the aggregate.
   */
  public override get id(): typeof this.session.id {
    return this.session.id;
  }

  /**
   * Public identity of the Session aggregate.
   */
  public override get publicId(): typeof this.session.publicId {
    return this.session.publicId;
  }

  /**
   * Opaque public reference to the Identity aggregate.
   */
  public get identityPublicId(): SessionIdentityPublicId {
    return this.session.identityPublicId;
  }

  /**
   * Determines whether this Session belongs to the supplied Identity.
   */
  public belongsToIdentity(identityPublicId: SessionIdentityPublicId): boolean {
    return this.session.belongsToIdentity(identityPublicId);
  }

  // ===========================================================================
  // Device
  // ===========================================================================

  /**
   * Optional opaque public reference to the Device aggregate.
   */
  public get devicePublicId(): SessionDevicePublicId | undefined {
    return this.session.devicePublicId;
  }

  /**
   * Determines whether this Session is associated with a Device.
   */
  public hasDevice(): boolean {
    return this.session.hasDevice();
  }

  /**
   * Determines whether this Session belongs to the supplied Device.
   */
  public belongsToDevice(devicePublicId: SessionDevicePublicId): boolean {
    return this.session.belongsToDevice(devicePublicId);
  }

  // ===========================================================================
  // Status
  // ===========================================================================

  /**
   * Current Session lifecycle status.
   */
  public get status(): SessionStatus {
    return this.session.status;
  }

  /**
   * Determines whether the Session is active.
   */
  public isActive(): boolean {
    return this.session.isActive();
  }

  /**
   * Determines whether the Session has an expired status.
   */
  public isExpiredStatus(): boolean {
    return this.session.isExpiredStatus();
  }

  /**
   * Determines whether the Session is revoked.
   */
  public isRevoked(): boolean {
    return this.session.isRevoked();
  }

  /**
   * Determines whether the Session is currently usable.
   */
  public isUsable(referenceDate: Date = new Date()): boolean {
    return this.session.isUsable(referenceDate);
  }

  /**
   * Determines whether the Session is currently unusable.
   */
  public isNotUsable(referenceDate: Date = new Date()): boolean {
    return this.session.isNotUsable(referenceDate);
  }

  // ===========================================================================
  // Creation Event
  // ===========================================================================

  /**
   * Records creation of the Session aggregate.
   *
   * The entity is created separately through SessionEntity.create().
   *
   * Security-sensitive refresh-token material is never published.
   */
  public recordCreated(correlationId: string, causationId?: string): void {
    this.ensureCorrelationId(correlationId);

    this.addDomainEvent(
      new SessionCreatedEvent(
        this.id.value,
        this.publicId.value,
        this.identityPublicId.value,
        this.devicePublicId?.value,
        this.status.value,
        this.authenticatedAt.value,
        this.expiresAt.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Refresh Token
  // ===========================================================================

  /**
   * Refreshes the Session using a security-infrastructure-produced refresh
   * token hash and records the resulting Session state.
   *
   * The aggregate never receives or exposes the raw refresh token.
   */
  public refresh(
    refreshTokenHash: SessionRefreshTokenHash,
    lastActivityAt: SessionLastActivityAt,
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureCorrelationId(correlationId);

    this.session.replaceRefreshTokenHash(refreshTokenHash);

    this.session.recordActivity(lastActivityAt);

    this.addDomainEvent(
      new SessionRefreshedEvent(
        this.id.value,
        this.publicId.value,
        this.identityPublicId.value,
        this.status.value,
        this.lastActivityAt.value,
        this.expiresAt.value,
        this.replacedBySessionPublicId?.value,
        correlationId,
        causationId,
      ),
    );
  }

  /**
   * Marks this Session as replaced by another Session during refresh-token
   * rotation.
   *
   * The replacement Session is a separate aggregate and is therefore not
   * owned by this aggregate.
   */
  public markAsReplaced(
    replacementSessionPublicId: SessionReplacedByPublicId,
  ): void {
    this.session.markAsReplaced(replacementSessionPublicId);
  }

  /**
   * Determines whether this Session has been replaced.
   */
  public hasBeenReplaced(): boolean {
    return this.session.hasBeenReplaced();
  }

  /**
   * Public identifier of the Session that replaced this Session.
   */
  public get replacedBySessionPublicId():
    SessionReplacedByPublicId | undefined {
    return this.session.replacedBySessionPublicId;
  }

  // ===========================================================================
  // Token Family
  // ===========================================================================

  /**
   * Public identifier of the refresh-token family.
   */
  public get tokenFamilyPublicId(): SessionTokenFamilyPublicId {
    return this.session.tokenFamilyPublicId;
  }

  /**
   * Determines whether this Session belongs to the supplied token family.
   */
  public belongsToTokenFamily(
    tokenFamilyPublicId: SessionTokenFamilyPublicId,
  ): boolean {
    return this.session.belongsToTokenFamily(tokenFamilyPublicId);
  }

  // ===========================================================================
  // Token Reuse Detection
  // ===========================================================================

  /**
   * Records detection of refresh-token reuse.
   *
   * Token reuse detection does not itself decide whether this Session or the
   * entire token family should be revoked.
   *
   * No raw token, token hash, or token secret is included in the event.
   */
  public recordTokenReuseDetected(
    detectedAt: Date,
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureCorrelationId(correlationId);

    SessionAggregate.ensureValidDate(
      detectedAt,
      'Session token-reuse detection timestamp must be valid.',
    );

    this.addDomainEvent(
      new SessionTokenReuseDetectedEvent(
        this.id.value,
        this.publicId.value,
        this.identityPublicId.value,
        this.tokenFamilyPublicId.value,
        this.status.value,
        new Date(detectedAt.getTime()),
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Activity
  // ===========================================================================

  /**
   * Timestamp of the most recent Session activity.
   */
  public get lastActivityAt(): SessionLastActivityAt {
    return this.session.lastActivityAt;
  }

  /**
   * Records Session activity.
   *
   * Activity cannot move backwards.
   */
  public recordActivity(lastActivityAt: SessionLastActivityAt): void {
    this.session.recordActivity(lastActivityAt);
  }

  // ===========================================================================
  // Authentication
  // ===========================================================================

  /**
   * Timestamp at which this Session was authenticated.
   */
  public get authenticatedAt(): SessionAuthenticatedAt {
    return this.session.authenticatedAt;
  }

  // ===========================================================================
  // Expiry
  // ===========================================================================

  /**
   * Session expiry timestamp.
   */
  public get expiresAt(): SessionExpiresAt {
    return this.session.expiresAt;
  }

  /**
   * Determines whether the Session has expired relative to the supplied date.
   */
  public isExpired(referenceDate: Date = new Date()): boolean {
    return this.session.isExpired(referenceDate);
  }

  /**
   * Marks the Session as expired and records SessionExpiredEvent.
   *
   * The Session must already have passed its expiry timestamp.
   */
  public expire(
    correlationId: string,
    referenceDate: Date = new Date(),
    causationId?: string,
  ): void {
    this.ensureCorrelationId(correlationId);

    SessionAggregate.ensureValidDate(
      referenceDate,
      'Session expiry reference timestamp must be valid.',
    );

    const wasExpired = this.session.isExpiredStatus();

    this.session.expire(referenceDate);

    if (wasExpired || !this.session.isExpiredStatus()) {
      return;
    }

    this.addDomainEvent(
      new SessionExpiredEvent(
        this.id.value,
        this.publicId.value,
        this.identityPublicId.value,
        this.status.value,
        this.expiresAt.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Revocation
  // ===========================================================================

  /**
   * Timestamp at which this Session was revoked.
   */
  public get revokedAt(): SessionRevokedAt | undefined {
    return this.session.revokedAt;
  }

  /**
   * Reason associated with Session revocation.
   */
  public get revokedReason(): SessionRevocationReason | undefined {
    return this.session.revokedReason;
  }

  /**
   * Revokes this Session and records SessionRevokedEvent.
   *
   * Revocation is terminal for the Session.
   */
  public revoke(
    revokedAt: SessionRevokedAt,
    reason: SessionRevocationReason,
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureCorrelationId(correlationId);

    const wasRevoked = this.session.isRevoked();

    this.session.revoke(revokedAt, reason);

    if (wasRevoked) {
      return;
    }

    this.addDomainEvent(
      new SessionRevokedEvent(
        this.id.value,
        this.publicId.value,
        this.identityPublicId.value,
        this.status.value,
        revokedAt.value,
        reason,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Refresh Token Hash
  // ===========================================================================

  /**
   * Persisted refresh-token hash.
   *
   * This is intentionally exposed only through the trusted domain boundary.
   *
   * It must never be published through domain events or API response models.
   */
  public get refreshTokenHash(): SessionRefreshTokenHash {
    return this.session.refreshTokenHash;
  }

  // ===========================================================================
  // Session Context
  // ===========================================================================

  /**
   * Optional IP address associated with the Session.
   */
  public get ipAddress(): SessionIpAddress | undefined {
    return this.session.ipAddress;
  }

  /**
   * Optional user-agent associated with the Session.
   */
  public get userAgent(): SessionUserAgent | undefined {
    return this.session.userAgent;
  }

  /**
   * Optional ISO 3166-1 alpha-2 country code.
   */
  public get countryCode(): SessionCountryCode | undefined {
    return this.session.countryCode;
  }

  /**
   * Optional city associated with the Session.
   */
  public get city(): SessionCity | undefined {
    return this.session.city;
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Session creation timestamp.
   */
  public get createdAt(): Date {
    return this.session.createdAt;
  }

  /**
   * Session last-update timestamp.
   */
  public get updatedAt(): Date {
    return this.session.updatedAt;
  }

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Updates the aggregate persistence timestamp.
   *
   * This does not emit a domain event.
   */
  public setUpdatedAt(updatedAt: Date): void {
    SessionAggregate.ensureValidDate(
      updatedAt,
      'Session update timestamp must be valid.',
    );

    this.session.setUpdatedAt(updatedAt);
  }

  // ===========================================================================
  // Aggregate Consistency
  // ===========================================================================

  /**
   * Validates structural consistency of the Session aggregate.
   *
   * Entity-level invariants remain the responsibility of SessionEntity.
   *
   * Cross-domain Identity and Device validation remains outside this
   * aggregate.
   */
  private ensureAggregateConsistency(): void {
    if (this.session === undefined) {
      throw new SessionException('Session aggregate root is required.');
    }

    if (this.session.id === undefined) {
      throw new SessionException(
        'Session aggregate internal identity is required.',
      );
    }

    if (this.session.publicId === undefined) {
      throw new SessionException(
        'Session aggregate public identity is required.',
      );
    }

    if (this.identityPublicId === undefined) {
      throw new SessionException(
        'Session Identity public identity is required.',
      );
    }

    if (this.status === undefined) {
      throw new SessionException('Session lifecycle status is required.');
    }

    if (this.tokenFamilyPublicId === undefined) {
      throw new SessionException(
        'Session token-family public identity is required.',
      );
    }

    if (this.refreshTokenHash === undefined) {
      throw new SessionException('Session refresh-token hash is required.');
    }

    SessionAggregate.ensureValidDate(
      this.authenticatedAt.value,
      'Session authentication timestamp must be valid.',
    );

    SessionAggregate.ensureValidDate(
      this.lastActivityAt.value,
      'Session last-activity timestamp must be valid.',
    );

    SessionAggregate.ensureValidDate(
      this.expiresAt.value,
      'Session expiry timestamp must be valid.',
    );

    SessionAggregate.ensureValidDate(
      this.createdAt,
      'Session creation timestamp must be valid.',
    );

    SessionAggregate.ensureValidDate(
      this.updatedAt,
      'Session update timestamp must be valid.',
    );

    if (this.updatedAt.getTime() < this.createdAt.getTime()) {
      throw new SessionException(
        'Session updated timestamp cannot be before its creation timestamp.',
      );
    }

    if (
      this.lastActivityAt.value.getTime() < this.authenticatedAt.value.getTime()
    ) {
      throw new SessionException(
        'Session last-activity timestamp cannot be before authentication timestamp.',
      );
    }

    if (
      this.expiresAt.value.getTime() <= this.authenticatedAt.value.getTime()
    ) {
      throw new SessionException(
        'Session expiry timestamp must be after authentication timestamp.',
      );
    }

    if (this.isRevoked()) {
      if (this.revokedAt === undefined) {
        throw new SessionException(
          'Revoked Session must have a revoked-at timestamp.',
        );
      }

      if (this.revokedReason === undefined) {
        throw new SessionException(
          'Revoked Session must have a revocation reason.',
        );
      }
    }

    if (!this.isRevoked()) {
      if (this.revokedAt !== undefined) {
        throw new SessionException(
          'Only a revoked Session may have a revoked-at timestamp.',
        );
      }

      if (this.revokedReason !== undefined) {
        throw new SessionException(
          'Only a revoked Session may have a revocation reason.',
        );
      }
    }

    if (
      this.revokedAt !== undefined &&
      this.revokedAt.value.getTime() < this.authenticatedAt.value.getTime()
    ) {
      throw new SessionException(
        'Session revocation timestamp cannot be before authentication timestamp.',
      );
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
      throw new SessionException(
        'Session operation correlation ID is required.',
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
      throw new SessionException(message);
    }
  }
}
