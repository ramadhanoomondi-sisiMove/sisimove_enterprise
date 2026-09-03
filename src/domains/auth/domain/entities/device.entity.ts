// -----------------------------------------------------------------------------
// Device — Entity
// -----------------------------------------------------------------------------
//
// Represents a Device within the Authentication domain.
//
// Aggregate context:
//
// Device Aggregate
// └── DeviceEntity
//
// The Device entity is the authoritative owner of:
//
// - device identity;
// - opaque Identity reference;
// - device lifecycle status;
// - device trust level;
// - stable device fingerprint;
// - device descriptive metadata;
// - platform and operating-system metadata;
// - browser metadata;
// - device type;
// - trust lifecycle;
// - activity lifecycle;
// - revocation lifecycle.
//
// Cross-domain Identity references remain opaque and are represented by
// DeviceIdentityPublicId.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Maintain Device identity.
// - Maintain the opaque Identity public reference.
// - Maintain Device lifecycle status.
// - Maintain Device trust level.
// - Maintain stable device fingerprint.
// - Maintain device metadata.
// - Record device trust.
// - Record device activity.
// - Manage device revocation.
// - Enforce Device-level invariants.
// - Provide security-safe predicates.
//
// -----------------------------------------------------------------------------
//
// This entity does NOT:
//
// - Validate Identity domain state.
// - Validate Session state.
// - Authenticate users.
// - Generate authentication tokens.
// - Generate refresh tokens.
// - Hash credentials.
// - Persist itself.
// - Access Prisma.
// - Communicate with external systems.
// - Send notifications.
// - Manage Sessions.
// - Authorize requests.
//
// Device recognition, fingerprint generation, persistence, and external
// security intelligence belong to the appropriate infrastructure/application
// boundaries.
//
// -----------------------------------------------------------------------------
//
// Lifecycle:
//
//                         ACTIVE
//                           │
//             ┌─────────────┴─────────────┐
//             │                           │
//           trust                       revoke
//             │                           │
//             ▼                           ▼
//      ACTIVE / TRUSTED                REVOKED
//             │
//           untrust
//             │
//             ▼
//       ACTIVE / LOW
//
// Revocation is terminal.
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

import { DeviceException } from '../exceptions/device.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { DevicePublicId } from '../value-objects/device-public-id.vo';

import type { DeviceIdentityPublicId } from '../value-objects/device-identity-public-id.vo';

import { DeviceStatus } from '../value-objects/device-status.vo';

import { DeviceTrustLevel } from '../value-objects/device-trust-level.vo';

import type { DeviceFingerprint } from '../value-objects/device-fingerprint.vo';

import type { DeviceName } from '../value-objects/device-name.vo';

import type { DevicePlatform } from '../value-objects/device-platform.vo';

import type { DeviceOperatingSystem } from '../value-objects/device-operating-system.vo';

import type { DeviceOperatingSystemVersion } from '../value-objects/device-operating-system-version.vo';

import type { DeviceBrowser } from '../value-objects/device-browser.vo';

import type { DeviceBrowserVersion } from '../value-objects/device-browser-version.vo';

import type { DeviceType } from '../value-objects/device-type.vo';

import type { DeviceTrustedAt } from '../value-objects/device-trusted-at.vo';

import type { DeviceLastSeenAt } from '../value-objects/device-last-seen-at.vo';

import type { DeviceRevokedAt } from '../value-objects/device-revoked-at.vo';

// =============================================================================
// Props
// =============================================================================

export interface DeviceProps {
  /**
   * Opaque public reference to the Identity aggregate that owns this Device.
   */
  identityPublicId: DeviceIdentityPublicId;

  /**
   * Device lifecycle status.
   */
  status: DeviceStatus;

  /**
   * Current trust level assigned to the Device.
   *
   * Domain values:
   *
   * - LOW
   * - TRUSTED
   */
  trustLevel: DeviceTrustLevel;

  /**
   * Stable device fingerprint.
   *
   * The fingerprint is an opaque device-recognition value.
   * Its generation and collection belong to the appropriate infrastructure
   * boundary.
   */
  fingerprint: DeviceFingerprint;

  /**
   * Optional human-readable device name.
   */
  name: DeviceName | undefined;

  /**
   * Optional device platform.
   */
  platform: DevicePlatform | undefined;

  /**
   * Optional operating-system name.
   */
  operatingSystem: DeviceOperatingSystem | undefined;

  /**
   * Optional operating-system version.
   */
  operatingSystemVersion: DeviceOperatingSystemVersion | undefined;

  /**
   * Optional browser name.
   */
  browser: DeviceBrowser | undefined;

  /**
   * Optional browser version.
   */
  browserVersion: DeviceBrowserVersion | undefined;

  /**
   * Device classification.
   */
  deviceType: DeviceType;

  /**
   * Timestamp at which the Device became trusted.
   */
  trustedAt: DeviceTrustedAt | undefined;

  /**
   * Timestamp at which the Device was last observed.
   */
  lastSeenAt: DeviceLastSeenAt | undefined;

  /**
   * Timestamp at which the Device was revoked.
   */
  revokedAt: DeviceRevokedAt | undefined;

  /**
   * Device creation timestamp.
   */
  createdAt: Date;

  /**
   * Device last-update timestamp.
   */
  updatedAt: Date;
}

// =============================================================================
// Entity
// =============================================================================

export class DeviceEntity extends Entity<DeviceProps, DevicePublicId> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    props: DeviceProps,
    id?: UniqueEntityId,
    publicId?: DevicePublicId,
  ) {
    super(props, id, publicId);
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates a new Device.
   *
   * New Devices begin in ACTIVE state with LOW trust unless a trusted state
   * is explicitly supplied by the application/security workflow.
   *
   * The fingerprint must already have been produced by the appropriate
   * device-recognition infrastructure.
   */
  public static create(
    identityPublicId: DeviceIdentityPublicId,
    fingerprint: DeviceFingerprint,
    deviceType: DeviceType,
    options?: {
      trustLevel?: DeviceTrustLevel;
      name?: DeviceName;
      platform?: DevicePlatform;
      operatingSystem?: DeviceOperatingSystem;
      operatingSystemVersion?: DeviceOperatingSystemVersion;
      browser?: DeviceBrowser;
      browserVersion?: DeviceBrowserVersion;
      trustedAt?: DeviceTrustedAt;
      lastSeenAt?: DeviceLastSeenAt;
      createdAt?: Date;
    },
  ): DeviceEntity {
    const createdAt = options?.createdAt ?? new Date();

    DeviceEntity.ensureValidDate(createdAt, 'creation date');

    const timestamp = DeviceEntity.cloneDate(createdAt);

    const trustLevel = options?.trustLevel ?? DeviceTrustLevel.create('LOW');

    const trustedAt = options?.trustedAt;

    DeviceEntity.validateFactoryTrustState(trustLevel, trustedAt);

    DeviceEntity.validateFactoryTimestampState(timestamp, options?.lastSeenAt);

    return new DeviceEntity(
      {
        identityPublicId,

        status: DeviceStatus.create('ACTIVE'),

        trustLevel,

        fingerprint,

        name: options?.name,

        platform: options?.platform,

        operatingSystem: options?.operatingSystem,

        operatingSystemVersion: options?.operatingSystemVersion,

        browser: options?.browser,

        browserVersion: options?.browserVersion,

        deviceType,

        trustedAt,

        lastSeenAt: options?.lastSeenAt,

        revokedAt: undefined,

        createdAt: timestamp,

        updatedAt: DeviceEntity.cloneDate(timestamp),
      },

      new UniqueEntityId(),

      new DevicePublicId(),
    );
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  /**
   * Rehydrates a persisted Device.
   *
   * Only Device-level invariants are validated.
   *
   * Cross-domain Identity state is intentionally not validated.
   */
  public static rehydrate(
    props: DeviceProps,
    id: UniqueEntityId,
    publicId: DevicePublicId,
  ): DeviceEntity {
    DeviceEntity.ensureValidDate(props.createdAt, 'creation date');

    DeviceEntity.ensureValidDate(props.updatedAt, 'updated date');

    if (props.updatedAt.getTime() < props.createdAt.getTime()) {
      throw new DeviceException(
        'Device updated date cannot be before creation date',
      );
    }

    DeviceEntity.validateTrustState(props);

    DeviceEntity.validateActivityState(props);

    DeviceEntity.validateRevocationState(props);

    return new DeviceEntity(
      {
        identityPublicId: props.identityPublicId,

        status: props.status,

        trustLevel: props.trustLevel,

        fingerprint: props.fingerprint,

        name: props.name,

        platform: props.platform,

        operatingSystem: props.operatingSystem,

        operatingSystemVersion: props.operatingSystemVersion,

        browser: props.browser,

        browserVersion: props.browserVersion,

        deviceType: props.deviceType,

        trustedAt: props.trustedAt,

        lastSeenAt: props.lastSeenAt,

        revokedAt: props.revokedAt,

        createdAt: DeviceEntity.cloneDate(props.createdAt),

        updatedAt: DeviceEntity.cloneDate(props.updatedAt),
      },

      id,

      publicId,
    );
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of the Device.
   */
  public override get publicId(): DevicePublicId {
    return super.publicId;
  }

  /**
   * Opaque public reference to the Identity that owns this Device.
   */
  public get identityPublicId(): DeviceIdentityPublicId {
    return this.props.identityPublicId;
  }

  /**
   * Determines whether this Device belongs to the supplied Identity.
   */
  public belongsToIdentity(identityPublicId: DeviceIdentityPublicId): boolean {
    return this.props.identityPublicId.equals(identityPublicId);
  }

  // ===========================================================================
  // Status
  // ===========================================================================

  /**
   * Current Device lifecycle status.
   */
  public get status(): DeviceStatus {
    return this.props.status;
  }

  /**
   * Determines whether the Device is active.
   */
  public isActive(): boolean {
    return this.props.status.equals(DeviceStatus.create('ACTIVE'));
  }

  /**
   * Determines whether the Device is revoked.
   */
  public isRevoked(): boolean {
    return this.props.status.equals(DeviceStatus.create('REVOKED'));
  }

  /**
   * Determines whether the Device can currently be used
   * for authentication.
   */
  public canAuthenticate(): boolean {
    return this.isActive();
  }

  /**
   * Determines whether the Device cannot currently be used
   * for authentication.
   */
  public cannotAuthenticate(): boolean {
    return !this.canAuthenticate();
  }

  // ===========================================================================
  // Activation
  // ===========================================================================

  /**
   * Activates the Device.
   *
   * A revoked Device cannot be restored through ordinary activation.
   */
  public activate(): void {
    if (this.isActive()) {
      return;
    }

    if (this.isRevoked()) {
      throw new DeviceException('A revoked Device cannot be activated');
    }

    this.props.status = DeviceStatus.create('ACTIVE');

    this.touch();
  }

  // ===========================================================================
  // Trust
  // ===========================================================================

  /**
   * Current Device trust level.
   */
  public get trustLevel(): DeviceTrustLevel {
    return this.props.trustLevel;
  }

  /**
   * Determines whether the Device is trusted.
   */
  public isTrusted(): boolean {
    return this.props.trustLevel.equals(DeviceTrustLevel.create('TRUSTED'));
  }

  /**
   * Determines whether the Device has low trust.
   */
  public isLowTrust(): boolean {
    return this.props.trustLevel.equals(DeviceTrustLevel.create('LOW'));
  }

  /**
   * Updates the Device trust level.
   *
   * Trust decisions themselves belong to the appropriate
   * security/application policy. This entity records the resulting
   * domain state.
   */
  public setTrustLevel(
    trustLevel: DeviceTrustLevel,
    trustedAt?: DeviceTrustedAt,
  ): void {
    if (this.isRevoked()) {
      throw new DeviceException(
        'A revoked Device cannot have its trust level changed',
      );
    }

    if (trustLevel.equals(DeviceTrustLevel.create('TRUSTED'))) {
      if (trustedAt === undefined) {
        throw new DeviceException(
          'A trusted Device must have a trusted-at timestamp',
        );
      }

      this.props.trustLevel = trustLevel;

      this.props.trustedAt = trustedAt;
    } else {
      this.props.trustLevel = trustLevel;

      this.props.trustedAt = undefined;
    }

    this.touch();
  }

  /**
   * Marks the Device as trusted.
   */
  public trust(trustedAt: DeviceTrustedAt): void {
    if (this.isRevoked()) {
      throw new DeviceException('A revoked Device cannot be trusted');
    }

    if (this.isTrusted()) {
      return;
    }

    this.props.trustLevel = DeviceTrustLevel.create('TRUSTED');

    this.props.trustedAt = trustedAt;

    this.touch();
  }

  /**
   * Removes the trusted state from the Device.
   */
  public untrust(): void {
    if (this.isRevoked()) {
      throw new DeviceException('A revoked Device cannot be untrusted');
    }

    if (this.isLowTrust()) {
      return;
    }

    this.props.trustLevel = DeviceTrustLevel.create('LOW');

    this.props.trustedAt = undefined;

    this.touch();
  }

  /**
   * Timestamp at which the Device became trusted.
   */
  public get trustedAt(): DeviceTrustedAt | undefined {
    return this.props.trustedAt;
  }

  // ===========================================================================
  // Fingerprint
  // ===========================================================================

  /**
   * Stable device fingerprint.
   */
  public get fingerprint(): DeviceFingerprint {
    return this.props.fingerprint;
  }

  /**
   * Determines whether the Device has the supplied fingerprint.
   */
  public hasFingerprint(fingerprint: DeviceFingerprint): boolean {
    return this.props.fingerprint.equals(fingerprint);
  }

  // ===========================================================================
  // Metadata
  // ===========================================================================

  /**
   * Optional human-readable Device name.
   */
  public get name(): DeviceName | undefined {
    return this.props.name;
  }

  /**
   * Optional platform.
   */
  public get platform(): DevicePlatform | undefined {
    return this.props.platform;
  }

  /**
   * Optional operating-system name.
   */
  public get operatingSystem(): DeviceOperatingSystem | undefined {
    return this.props.operatingSystem;
  }

  /**
   * Optional operating-system version.
   */
  public get operatingSystemVersion():
    DeviceOperatingSystemVersion | undefined {
    return this.props.operatingSystemVersion;
  }

  /**
   * Optional browser name.
   */
  public get browser(): DeviceBrowser | undefined {
    return this.props.browser;
  }

  /**
   * Optional browser version.
   */
  public get browserVersion(): DeviceBrowserVersion | undefined {
    return this.props.browserVersion;
  }

  /**
   * Device classification.
   */
  public get deviceType(): DeviceType {
    return this.props.deviceType;
  }

  // ===========================================================================
  // Activity
  // ===========================================================================

  /**
   * Timestamp of the most recent Device observation.
   */
  public get lastSeenAt(): DeviceLastSeenAt | undefined {
    return this.props.lastSeenAt;
  }

  /**
   * Records that the Device was observed.
   *
   * Last-seen timestamps must never move backwards.
   */
  public recordSeen(lastSeenAt: DeviceLastSeenAt): void {
    if (this.isRevoked()) {
      throw new DeviceException('A revoked Device cannot record activity');
    }

    if (
      this.props.lastSeenAt !== undefined &&
      lastSeenAt.value.getTime() <= this.props.lastSeenAt.value.getTime()
    ) {
      return;
    }

    if (lastSeenAt.value.getTime() < this.props.createdAt.getTime()) {
      throw new DeviceException(
        'Device last-seen date cannot be before creation date',
      );
    }

    this.props.lastSeenAt = lastSeenAt;

    this.touch();
  }

  // ===========================================================================
  // Revocation
  // ===========================================================================

  /**
   * Timestamp at which the Device was revoked.
   */
  public get revokedAt(): DeviceRevokedAt | undefined {
    return this.props.revokedAt;
  }

  /**
   * Revokes the Device.
   *
   * Revocation is terminal for the Device.
   */
  public revoke(revokedAt: DeviceRevokedAt): void {
    if (this.isRevoked()) {
      return;
    }

    if (revokedAt.value.getTime() < this.props.createdAt.getTime()) {
      throw new DeviceException(
        'Device revocation date cannot be before creation date',
      );
    }

    this.props.status = DeviceStatus.create('REVOKED');

    this.props.revokedAt = revokedAt;

    this.touch();
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Device creation timestamp.
   *
   * Returns a defensive copy.
   */
  public get createdAt(): Date {
    return DeviceEntity.cloneDate(this.props.createdAt);
  }

  /**
   * Device last-update timestamp.
   *
   * Returns a defensive copy.
   */
  public get updatedAt(): Date {
    return DeviceEntity.cloneDate(this.props.updatedAt);
  }

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Updates the persistence timestamp.
   *
   * This does not represent a business state transition.
   */
  public setUpdatedAt(updatedAt: Date): void {
    DeviceEntity.ensureValidDate(updatedAt, 'updated date');

    const timestamp = DeviceEntity.cloneDate(updatedAt);

    if (timestamp.getTime() < this.props.createdAt.getTime()) {
      throw new DeviceException(
        'Device updated date cannot be before creation date',
      );
    }

    this.props.updatedAt = timestamp;
  }

  // ===========================================================================
  // Validation
  // ===========================================================================

  /**
   * Validates trust-related invariants during creation.
   */
  private static validateFactoryTrustState(
    trustLevel: DeviceTrustLevel,
    trustedAt: DeviceTrustedAt | undefined,
  ): void {
    const isTrusted = trustLevel.equals(DeviceTrustLevel.create('TRUSTED'));

    if (isTrusted && trustedAt === undefined) {
      throw new DeviceException(
        'A trusted Device must have a trusted-at timestamp',
      );
    }

    if (!isTrusted && trustedAt !== undefined) {
      throw new DeviceException(
        'A LOW-trust Device cannot have a trusted-at timestamp',
      );
    }
  }

  /**
   * Validates timestamps supplied during creation.
   */
  private static validateFactoryTimestampState(
    createdAt: Date,
    lastSeenAt: DeviceLastSeenAt | undefined,
  ): void {
    if (
      lastSeenAt !== undefined &&
      lastSeenAt.value.getTime() < createdAt.getTime()
    ) {
      throw new DeviceException(
        'Device last-seen date cannot be before creation date',
      );
    }
  }

  /**
   * Validates trust-related invariants.
   */
  private static validateTrustState(props: DeviceProps): void {
    const isTrusted = props.trustLevel.equals(
      DeviceTrustLevel.create('TRUSTED'),
    );

    if (isTrusted && props.trustedAt === undefined) {
      throw new DeviceException(
        'A trusted Device must have a trusted-at timestamp',
      );
    }

    if (!isTrusted && props.trustedAt !== undefined) {
      throw new DeviceException(
        'Only a trusted Device may have a trusted-at timestamp',
      );
    }
  }

  /**
   * Validates Device activity timestamps.
   */
  private static validateActivityState(props: DeviceProps): void {
    if (
      props.lastSeenAt !== undefined &&
      props.lastSeenAt.value.getTime() < props.createdAt.getTime()
    ) {
      throw new DeviceException(
        'Device last-seen date cannot be before creation date',
      );
    }
  }

  /**
   * Validates revocation-related invariants.
   */
  private static validateRevocationState(props: DeviceProps): void {
    const isRevoked = props.status.equals(DeviceStatus.create('REVOKED'));

    if (isRevoked && props.revokedAt === undefined) {
      throw new DeviceException(
        'A revoked Device must have a revoked-at timestamp',
      );
    }

    if (!isRevoked && props.revokedAt !== undefined) {
      throw new DeviceException(
        'Only a revoked Device may have a revoked-at timestamp',
      );
    }

    if (
      props.revokedAt !== undefined &&
      props.revokedAt.value.getTime() < props.createdAt.getTime()
    ) {
      throw new DeviceException(
        'Device revocation date cannot be before creation date',
      );
    }
  }

  /**
   * Validates a Date.
   */
  private static ensureValidDate(value: Date, fieldName: string): void {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      throw new DeviceException(`Device ${fieldName} must be a valid date`);
    }
  }

  /**
   * Creates a defensive Date copy.
   */
  private static cloneDate(value: Date): Date {
    DeviceEntity.ensureValidDate(value, 'date');

    return new Date(value.getTime());
  }
}
