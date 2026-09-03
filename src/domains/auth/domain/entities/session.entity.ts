// -----------------------------------------------------------------------------
// Session — Entity
// -----------------------------------------------------------------------------
//
// Represents a Session within the Authentication domain.
//
// Aggregate context:
//
// Session Aggregate
// └── SessionEntity
//
// The Session entity is the authoritative owner of:
//
// - session identity;
// - opaque Identity reference;
// - optional opaque Device reference;
// - session lifecycle status;
// - refresh-token hash;
// - token-family membership;
// - refresh-token replacement lineage;
// - session context metadata;
// - authentication and activity timestamps;
// - expiry state;
// - revocation state and reason.
//
// Cross-domain references remain opaque and are represented by dedicated
// value objects.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Maintain Session identity.
// - Maintain opaque Identity and Device references.
// - Maintain Session lifecycle status.
// - Maintain refresh-token security state.
// - Maintain token-family membership.
// - Track refresh-token rotation lineage.
// - Record authenticated and activity timestamps.
// - Manage expiry semantics.
// - Manage revocation state.
// - Enforce Session-level invariants.
// - Provide security-safe lifecycle predicates.
//
// -----------------------------------------------------------------------------
//
// This entity does NOT:
//
// - Validate Identity domain state.
// - Validate Device aggregate state.
// - Generate refresh tokens.
// - Hash refresh tokens.
// - Compare raw refresh tokens.
// - Perform JWT signing or verification.
// - Persist itself.
// - Access Prisma.
// - Communicate with external systems.
// - Send notifications.
// - Revoke other sessions directly.
// - Revoke an entire token family directly.
//
// Token generation, hashing, comparison, rotation orchestration, and
// token-family-wide revocation belong to the appropriate application and
// infrastructure security boundaries.
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

import { SessionException } from '../exceptions/session.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { SessionPublicId } from '../value-objects/session-public-id.vo';

import type { SessionIdentityPublicId } from '../value-objects/session-identity-public-id.vo';

import type { SessionDevicePublicId } from '../value-objects/session-device-public-id.vo';

import { SessionStatus } from '../value-objects/session-status.vo';

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

// =============================================================================
// Props
// =============================================================================

export interface SessionProps {
  /**
   * Opaque public reference to the Identity aggregate that owns this Session.
   */
  identityPublicId: SessionIdentityPublicId;

  /**
   * Optional opaque public reference to the Device associated with this Session.
   */
  devicePublicId: SessionDevicePublicId | undefined;

  /**
   * Current Session lifecycle status.
   */
  status: SessionStatus;

  /**
   * Persisted hash of the refresh token.
   *
   * Raw refresh tokens must never be stored in the entity.
   */
  refreshTokenHash: SessionRefreshTokenHash;

  /**
   * Stable identifier shared by all Sessions belonging to the same
   * refresh-token family.
   */
  tokenFamilyPublicId: SessionTokenFamilyPublicId;

  /**
   * Public identifier of the Session that replaced this Session during
   * refresh-token rotation.
   */
  replacedBySessionPublicId: SessionReplacedByPublicId | undefined;

  /**
   * Optional IP address observed for the Session.
   */
  ipAddress: SessionIpAddress | undefined;

  /**
   * Optional user-agent observed for the Session.
   */
  userAgent: SessionUserAgent | undefined;

  /**
   * Optional ISO 3166-1 alpha-2 country code.
   */
  countryCode: SessionCountryCode | undefined;

  /**
   * Optional city associated with the Session context.
   */
  city: SessionCity | undefined;

  /**
   * Timestamp at which the Session was authenticated.
   */
  authenticatedAt: SessionAuthenticatedAt;

  /**
   * Timestamp of the most recent activity associated with this Session.
   */
  lastActivityAt: SessionLastActivityAt;

  /**
   * Timestamp at which the Session expires.
   */
  expiresAt: SessionExpiresAt;

  /**
   * Timestamp at which the Session was revoked.
   */
  revokedAt: SessionRevokedAt | undefined;

  /**
   * Reason associated with Session revocation.
   */
  revokedReason: SessionRevocationReason | undefined;

  /**
   * Session creation timestamp.
   */
  createdAt: Date;

  /**
   * Session last-update timestamp.
   */
  updatedAt: Date;
}

// =============================================================================
// Entity
// =============================================================================

export class SessionEntity extends Entity<SessionProps, SessionPublicId> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    props: SessionProps,
    id?: UniqueEntityId,
    publicId?: SessionPublicId,
  ) {
    super(props, id, publicId);
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates a new active Session.
   *
   * The refresh token must already have been generated and hashed by the
   * appropriate security infrastructure before this factory is called.
   *
   * A token family identifier is supplied by the application workflow.
   * For an initial login this normally represents a newly created token family.
   */
  public static create(
    identityPublicId: SessionIdentityPublicId,
    refreshTokenHash: SessionRefreshTokenHash,
    tokenFamilyPublicId: SessionTokenFamilyPublicId,
    authenticatedAt: SessionAuthenticatedAt,
    lastActivityAt: SessionLastActivityAt,
    expiresAt: SessionExpiresAt,
    options?: {
      devicePublicId?: SessionDevicePublicId;
      ipAddress?: SessionIpAddress;
      userAgent?: SessionUserAgent;
      countryCode?: SessionCountryCode;
      city?: SessionCity;
      createdAt?: Date;
    },
  ): SessionEntity {
    const createdAt = options?.createdAt ?? new Date();

    SessionEntity.ensureValidDate(createdAt, 'creation date');

    SessionEntity.validateChronology(
      authenticatedAt,
      lastActivityAt,
      expiresAt,
    );

    const timestamp = SessionEntity.cloneDate(createdAt);

    return new SessionEntity(
      {
        identityPublicId,

        devicePublicId: options?.devicePublicId,

        status: SessionStatus.create('ACTIVE'),

        refreshTokenHash,

        tokenFamilyPublicId,

        replacedBySessionPublicId: undefined,

        ipAddress: options?.ipAddress,

        userAgent: options?.userAgent,

        countryCode: options?.countryCode,

        city: options?.city,

        authenticatedAt,

        lastActivityAt,

        expiresAt,

        revokedAt: undefined,

        revokedReason: undefined,

        createdAt: timestamp,

        updatedAt: SessionEntity.cloneDate(timestamp),
      },

      new UniqueEntityId(),

      new SessionPublicId(),
    );
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  /**
   * Rehydrates a persisted Session.
   *
   * Only Session-level invariants are validated.
   *
   * Cross-domain Identity and Device state is intentionally not validated.
   */
  public static rehydrate(
    props: SessionProps,
    id: UniqueEntityId,
    publicId: SessionPublicId,
  ): SessionEntity {
    SessionEntity.ensureValidDate(props.createdAt, 'creation date');

    SessionEntity.ensureValidDate(props.updatedAt, 'updated date');

    if (props.updatedAt.getTime() < props.createdAt.getTime()) {
      throw new SessionException(
        'Session updated date cannot be before creation date',
      );
    }

    SessionEntity.validateChronology(
      props.authenticatedAt,
      props.lastActivityAt,
      props.expiresAt,
    );

    SessionEntity.validateRevocationState(props);

    return new SessionEntity(
      {
        identityPublicId: props.identityPublicId,

        devicePublicId: props.devicePublicId,

        status: props.status,

        refreshTokenHash: props.refreshTokenHash,

        tokenFamilyPublicId: props.tokenFamilyPublicId,

        replacedBySessionPublicId: props.replacedBySessionPublicId,

        ipAddress: props.ipAddress,

        userAgent: props.userAgent,

        countryCode: props.countryCode,

        city: props.city,

        authenticatedAt: props.authenticatedAt,

        lastActivityAt: props.lastActivityAt,

        expiresAt: props.expiresAt,

        revokedAt: props.revokedAt,

        revokedReason: props.revokedReason,

        createdAt: SessionEntity.cloneDate(props.createdAt),

        updatedAt: SessionEntity.cloneDate(props.updatedAt),
      },

      id,

      publicId,
    );
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of the Session.
   */
  public override get publicId(): SessionPublicId {
    return super.publicId;
  }

  /**
   * Opaque public reference to the Identity that owns this Session.
   */
  public get identityPublicId(): SessionIdentityPublicId {
    return this.props.identityPublicId;
  }

  /**
   * Determines whether this Session belongs to the supplied Identity.
   */
  public belongsToIdentity(identityPublicId: SessionIdentityPublicId): boolean {
    return this.props.identityPublicId.equals(identityPublicId);
  }

  // ===========================================================================
  // Device
  // ===========================================================================

  /**
   * Optional opaque public reference to the associated Device.
   */
  public get devicePublicId(): SessionDevicePublicId | undefined {
    return this.props.devicePublicId;
  }

  /**
   * Determines whether this Session is associated with a Device.
   */
  public hasDevice(): boolean {
    return this.props.devicePublicId !== undefined;
  }

  /**
   * Determines whether this Session belongs to the supplied Device.
   */
  public belongsToDevice(devicePublicId: SessionDevicePublicId): boolean {
    return (
      this.props.devicePublicId !== undefined &&
      this.props.devicePublicId.equals(devicePublicId)
    );
  }

  // ===========================================================================
  // Status
  // ===========================================================================

  /**
   * Current Session lifecycle status.
   */
  public get status(): SessionStatus {
    return this.props.status;
  }

  /**
   * Determines whether this Session is active.
   */
  public isActive(): boolean {
    return this.props.status.equals(SessionStatus.create('ACTIVE'));
  }

  /**
   * Determines whether this Session is expired.
   */
  public isExpiredStatus(): boolean {
    return this.props.status.equals(SessionStatus.create('EXPIRED'));
  }

  /**
   * Determines whether this Session is revoked.
   */
  public isRevoked(): boolean {
    return this.props.status.equals(SessionStatus.create('REVOKED'));
  }

  /**
   * Determines whether this Session can currently be used.
   *
   * Expiry is evaluated dynamically against the supplied reference date.
   * A persisted ACTIVE status does not override the expiry timestamp.
   */
  public isUsable(referenceDate: Date = new Date()): boolean {
    SessionEntity.ensureValidDate(referenceDate, 'reference date');

    return (
      this.isActive() && !this.isExpired(referenceDate) && !this.isRevoked()
    );
  }

  /**
   * Determines whether this Session cannot currently be used.
   */
  public isNotUsable(referenceDate: Date = new Date()): boolean {
    return !this.isUsable(referenceDate);
  }

  // ===========================================================================
  // Refresh Token
  // ===========================================================================

  /**
   * Persisted refresh-token hash.
   */
  public get refreshTokenHash(): SessionRefreshTokenHash {
    return this.props.refreshTokenHash;
  }

  /**
   * Replaces the persisted refresh-token hash.
   *
   * The supplied hash must already have been produced by security
   * infrastructure.
   *
   * This operation is intended for controlled refresh-token rotation workflows.
   */
  public replaceRefreshTokenHash(
    refreshTokenHash: SessionRefreshTokenHash,
  ): void {
    this.ensureUsableForLifecycleOperation();

    if (this.props.refreshTokenHash.equals(refreshTokenHash)) {
      return;
    }

    this.props.refreshTokenHash = refreshTokenHash;

    this.touch();
  }

  // ===========================================================================
  // Token Family
  // ===========================================================================

  /**
   * Public identifier of the refresh-token family.
   */
  public get tokenFamilyPublicId(): SessionTokenFamilyPublicId {
    return this.props.tokenFamilyPublicId;
  }

  /**
   * Determines whether this Session belongs to the supplied token family.
   */
  public belongsToTokenFamily(
    tokenFamilyPublicId: SessionTokenFamilyPublicId,
  ): boolean {
    return this.props.tokenFamilyPublicId.equals(tokenFamilyPublicId);
  }

  // ===========================================================================
  // Token Rotation Lineage
  // ===========================================================================

  /**
   * Public identifier of the Session that replaced this Session.
   */
  public get replacedBySessionPublicId():
    SessionReplacedByPublicId | undefined {
    return this.props.replacedBySessionPublicId;
  }

  /**
   * Determines whether this Session has been replaced during token rotation.
   */
  public hasBeenReplaced(): boolean {
    return this.props.replacedBySessionPublicId !== undefined;
  }

  /**
   * Marks this Session as replaced by another Session.
   *
   * The replacement Session must already exist conceptually within the
   * application workflow. Cross-aggregate existence validation belongs outside
   * this entity.
   */
  public markAsReplaced(
    replacementSessionPublicId: SessionReplacedByPublicId,
  ): void {
    if (this.isRevoked()) {
      throw new SessionException('A revoked Session cannot be replaced');
    }

    if (this.hasBeenReplaced()) {
      if (
        this.props.replacedBySessionPublicId!.equals(replacementSessionPublicId)
      ) {
        return;
      }

      throw new SessionException(
        'Session has already been replaced by another Session',
      );
    }

    this.props.replacedBySessionPublicId = replacementSessionPublicId;

    this.touch();
  }

  // ===========================================================================
  // Session Context
  // ===========================================================================

  /**
   * Optional IP address associated with this Session.
   */
  public get ipAddress(): SessionIpAddress | undefined {
    return this.props.ipAddress;
  }

  /**
   * Optional user-agent associated with this Session.
   */
  public get userAgent(): SessionUserAgent | undefined {
    return this.props.userAgent;
  }

  /**
   * Optional country code associated with this Session.
   */
  public get countryCode(): SessionCountryCode | undefined {
    return this.props.countryCode;
  }

  /**
   * Optional city associated with this Session.
   */
  public get city(): SessionCity | undefined {
    return this.props.city;
  }

  // ===========================================================================
  // Authentication
  // ===========================================================================

  /**
   * Timestamp at which this Session was authenticated.
   */
  public get authenticatedAt(): SessionAuthenticatedAt {
    return this.props.authenticatedAt;
  }

  // ===========================================================================
  // Activity
  // ===========================================================================

  /**
   * Timestamp of the most recent activity associated with this Session.
   */
  public get lastActivityAt(): SessionLastActivityAt {
    return this.props.lastActivityAt;
  }

  /**
   * Records Session activity.
   *
   * Activity timestamps cannot move backwards and cannot precede the
   * authentication timestamp.
   */
  public recordActivity(lastActivityAt: SessionLastActivityAt): void {
    this.ensureUsableForLifecycleOperation();

    if (
      lastActivityAt.value.getTime() <=
      this.props.lastActivityAt.value.getTime()
    ) {
      return;
    }

    if (
      lastActivityAt.value.getTime() <
      this.props.authenticatedAt.value.getTime()
    ) {
      throw new SessionException(
        'Session activity date cannot be before authentication date',
      );
    }

    this.props.lastActivityAt = lastActivityAt;

    this.touch();
  }

  // ===========================================================================
  // Expiry
  // ===========================================================================

  /**
   * Session expiry timestamp.
   */
  public get expiresAt(): SessionExpiresAt {
    return this.props.expiresAt;
  }

  /**
   * Determines whether the Session has expired relative to the supplied date.
   */
  public isExpired(referenceDate: Date = new Date()): boolean {
    SessionEntity.ensureValidDate(referenceDate, 'reference date');

    return this.props.expiresAt.isExpired(referenceDate);
  }

  /**
   * Marks the Session as expired.
   *
   * This transition is intended for explicit lifecycle reconciliation after
   * the expiry timestamp has passed.
   */
  public expire(referenceDate: Date = new Date()): void {
    SessionEntity.ensureValidDate(referenceDate, 'reference date');

    if (this.isRevoked() || this.isExpiredStatus()) {
      return;
    }

    if (!this.isExpired(referenceDate)) {
      throw new SessionException(
        'An unexpired Session cannot be marked as expired',
      );
    }

    this.props.status = SessionStatus.create('EXPIRED');

    this.touch();
  }

  // ===========================================================================
  // Revocation
  // ===========================================================================

  /**
   * Timestamp at which the Session was revoked.
   */
  public get revokedAt(): SessionRevokedAt | undefined {
    return this.props.revokedAt;
  }

  /**
   * Reason associated with Session revocation.
   */
  public get revokedReason(): SessionRevocationReason | undefined {
    return this.props.revokedReason;
  }

  /**
   * Revokes this Session.
   *
   * Revocation is terminal for the Session.
   */
  public revoke(
    revokedAt: SessionRevokedAt,
    reason: SessionRevocationReason,
  ): void {
    if (this.isRevoked()) {
      return;
    }

    if (
      revokedAt.value.getTime() < this.props.authenticatedAt.value.getTime()
    ) {
      throw new SessionException(
        'Session revocation date cannot be before authentication date',
      );
    }

    this.props.status = SessionStatus.create('REVOKED');

    this.props.revokedAt = revokedAt;

    this.props.revokedReason = reason;

    this.touch();
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Session creation timestamp.
   *
   * Returns a defensive copy.
   */
  public get createdAt(): Date {
    return SessionEntity.cloneDate(this.props.createdAt);
  }

  /**
   * Session last-update timestamp.
   *
   * Returns a defensive copy.
   */
  public get updatedAt(): Date {
    return SessionEntity.cloneDate(this.props.updatedAt);
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
    SessionEntity.ensureValidDate(updatedAt, 'updated date');

    const timestamp = SessionEntity.cloneDate(updatedAt);

    if (timestamp.getTime() < this.props.createdAt.getTime()) {
      throw new SessionException(
        'Session updated date cannot be before creation date',
      );
    }

    this.props.updatedAt = timestamp;
  }

  // ===========================================================================
  // Guards
  // ===========================================================================

  /**
   * Ensures that the Session is usable before a lifecycle operation that
   * requires an active, unexpired Session.
   */
  private ensureUsableForLifecycleOperation(
    referenceDate: Date = new Date(),
  ): void {
    SessionEntity.ensureValidDate(referenceDate, 'reference date');

    if (this.isRevoked()) {
      throw new SessionException(
        'A revoked Session cannot perform this operation',
      );
    }

    if (this.isExpiredStatus() || this.isExpired(referenceDate)) {
      throw new SessionException(
        'An expired Session cannot perform this operation',
      );
    }

    if (!this.isActive()) {
      throw new SessionException(
        'Only an active Session can perform this operation',
      );
    }
  }

  // ===========================================================================
  // Validation
  // ===========================================================================

  /**
   * Validates Session chronology.
   */
  private static validateChronology(
    authenticatedAt: SessionAuthenticatedAt,
    lastActivityAt: SessionLastActivityAt,
    expiresAt: SessionExpiresAt,
  ): void {
    if (lastActivityAt.value.getTime() < authenticatedAt.value.getTime()) {
      throw new SessionException(
        'Session last activity date cannot be before authentication date',
      );
    }

    if (expiresAt.value.getTime() <= authenticatedAt.value.getTime()) {
      throw new SessionException(
        'Session expiry date must be after authentication date',
      );
    }
  }

  /**
   * Validates revocation-related invariants.
   */
  private static validateRevocationState(props: SessionProps): void {
    if (
      props.status.equals(SessionStatus.create('REVOKED')) &&
      props.revokedAt === undefined
    ) {
      throw new SessionException(
        'A revoked Session must have a revoked-at timestamp',
      );
    }

    if (
      props.status.equals(SessionStatus.create('REVOKED')) &&
      props.revokedReason === undefined
    ) {
      throw new SessionException(
        'A revoked Session must have a revocation reason',
      );
    }

    if (
      !props.status.equals(SessionStatus.create('REVOKED')) &&
      props.revokedAt !== undefined
    ) {
      throw new SessionException(
        'Only a revoked Session may have a revoked-at timestamp',
      );
    }

    if (
      !props.status.equals(SessionStatus.create('REVOKED')) &&
      props.revokedReason !== undefined
    ) {
      throw new SessionException(
        'Only a revoked Session may have a revocation reason',
      );
    }

    if (
      props.revokedAt !== undefined &&
      props.revokedAt.value.getTime() < props.authenticatedAt.value.getTime()
    ) {
      throw new SessionException(
        'Session revocation date cannot be before authentication date',
      );
    }
  }

  /**
   * Validates a Date.
   */
  private static ensureValidDate(value: Date, fieldName: string): void {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      throw new SessionException(`Session ${fieldName} must be a valid date`);
    }
  }

  /**
   * Creates a defensive Date copy.
   */
  private static cloneDate(value: Date): Date {
    SessionEntity.ensureValidDate(value, 'date');

    return new Date(value.getTime());
  }
}
