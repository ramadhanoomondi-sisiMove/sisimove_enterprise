// -----------------------------------------------------------------------------
// Device — Aggregate
// -----------------------------------------------------------------------------
//
// Aggregate:
//
// DeviceAggregate
// └── DeviceEntity
//
// Device is an independent aggregate responsible for the lifecycle, trust,
// recognition, activity, and revocation state of one Device.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Own the DeviceEntity.
// - Expose Device state through the aggregate boundary.
// - Coordinate Device lifecycle transitions.
// - Record Device domain events.
// - Preserve correlation/causation metadata for domain events.
// - Coordinate Device trust state.
// - Coordinate Device activity state.
// - Coordinate Device revocation.
// - Enforce aggregate-level structural consistency.
//
// -----------------------------------------------------------------------------
//
// This aggregate does NOT:
//
// - Validate Identity domain state.
// - Validate Session state.
// - Authenticate users.
// - Generate authentication tokens.
// - Generate refresh tokens.
// - Generate device fingerprints.
// - Resolve device-recognition intelligence.
// - Persist itself.
// - Access Prisma.
// - Communicate with external systems.
// - Send notifications.
// - Manage Sessions.
// - Authorize requests.
// - Decide external security policy.
//
// Device recognition, fingerprint generation, persistence, authentication
// orchestration, and external security intelligence belong to the appropriate
// application/infrastructure boundaries.
//
// Cross-aggregate orchestration belongs to the application layer.
//
// -----------------------------------------------------------------------------
//
// Aggregate identity:
//
// Internal identity:
// - DeviceEntity.id
//
// Public identity:
// - DeviceEntity.publicId
//
// Cross-domain reference:
//
// - DeviceIdentityPublicId
//
// -----------------------------------------------------------------------------
//
// Domain events:
//
// - DeviceCreatedEvent
// - DeviceTrustedEvent
// - DeviceSeenEvent
// - DeviceRevokedEvent
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

import type { DeviceEntity } from '../entities/device.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import { DeviceCreatedEvent } from '../events/device-created.event';

import { DeviceTrustedEvent } from '../events/device-trusted.event';

import { DeviceSeenEvent } from '../events/device-seen.event';

import { DeviceRevokedEvent } from '../events/device-revoked.event';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { DeviceException } from '../exceptions/device.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { DeviceIdentityPublicId } from '../value-objects/device-identity-public-id.vo';

import type { DeviceStatus } from '../value-objects/device-status.vo';

import type { DeviceTrustLevel } from '../value-objects/device-trust-level.vo';

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

interface DeviceAggregateProps {
  /**
   * Root entity owned by the Device aggregate.
   */
  device: DeviceEntity;
}

// =============================================================================
// Aggregate
// =============================================================================

/**
 * Device aggregate root.
 *
 * Owns exactly one DeviceEntity representing one recognized Device.
 */
export class DeviceAggregate extends AggregateRoot<DeviceAggregateProps> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(props: DeviceAggregateProps) {
    if (props === undefined) {
      throw new DeviceException('Device aggregate properties are required.');
    }

    if (props.device === undefined) {
      throw new DeviceException('Device aggregate root is required.');
    }

    super(props, props.device.id, props.device.publicId);
  }

  // ===========================================================================
  // Factory — Create
  // ===========================================================================

  /**
   * Creates a new Device aggregate around an existing DeviceEntity.
   *
   * Entity creation and domain-event recording remain separate operations.
   */
  public static create(device: DeviceEntity): DeviceAggregate {
    if (device === undefined) {
      throw new DeviceException('Device entity is required.');
    }

    const aggregate = new DeviceAggregate({
      device,
    });

    aggregate.ensureAggregateConsistency();

    return aggregate;
  }

  // ===========================================================================
  // Factory — Rehydrate
  // ===========================================================================

  /**
   * Rehydrates a persisted Device aggregate.
   *
   * Rehydration never emits domain events.
   */
  public static rehydrate(device: DeviceEntity): DeviceAggregate {
    if (device === undefined) {
      throw new DeviceException(
        'Device aggregate root is required for rehydration.',
      );
    }

    const aggregate = new DeviceAggregate({
      device,
    });

    aggregate.ensureAggregateConsistency();

    return aggregate;
  }

  // ===========================================================================
  // Aggregate State
  // ===========================================================================

  /**
   * Returns the Device aggregate root entity.
   */
  public get device(): DeviceEntity {
    return this.props.device;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Internal persistence identity of the aggregate.
   */
  public override get id(): typeof this.device.id {
    return this.device.id;
  }

  /**
   * Public identity of the Device aggregate.
   */
  public override get publicId(): typeof this.device.publicId {
    return this.device.publicId;
  }

  /**
   * Opaque public reference to the Identity aggregate.
   */
  public get identityPublicId(): DeviceIdentityPublicId {
    return this.device.identityPublicId;
  }

  /**
   * Determines whether this Device belongs to the supplied Identity.
   */
  public belongsToIdentity(identityPublicId: DeviceIdentityPublicId): boolean {
    return this.device.belongsToIdentity(identityPublicId);
  }

  // ===========================================================================
  // Status
  // ===========================================================================

  /**
   * Current Device lifecycle status.
   */
  public get status(): DeviceStatus {
    return this.device.status;
  }

  /**
   * Determines whether the Device is active.
   */
  public isActive(): boolean {
    return this.device.isActive();
  }

  /**
   * Determines whether the Device is revoked.
   */
  public isRevoked(): boolean {
    return this.device.isRevoked();
  }

  /**
   * Determines whether the Device can currently be used for authentication.
   */
  public canAuthenticate(): boolean {
    return this.device.canAuthenticate();
  }

  /**
   * Determines whether the Device cannot currently be used for authentication.
   */
  public cannotAuthenticate(): boolean {
    return this.device.cannotAuthenticate();
  }

  // ===========================================================================
  // Creation Event
  // ===========================================================================

  /**
   * Records creation of the Device aggregate.
   *
   * The entity is created separately through DeviceEntity.create().
   *
   * The device fingerprint and other security-sensitive recognition material
   * are intentionally not published.
   */
  public recordCreated(correlationId: string, causationId?: string): void {
    this.ensureCorrelationId(correlationId);

    this.addDomainEvent(
      new DeviceCreatedEvent(
        this.id.value,
        this.publicId.value,
        this.identityPublicId.value,
        this.status.value,
        this.platform?.value ?? '',
        this.deviceType.value,
        this.name?.value,
        this.createdAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Activation
  // ===========================================================================

  /**
   * Activates the Device.
   *
   * A revoked Device cannot be restored through ordinary activation.
   *
   * Activation does not emit a domain event because Device activation is not
   * currently represented by a dedicated Device domain event.
   */
  public activate(): void {
    this.device.activate();
  }

  // ===========================================================================
  // Trust
  // ===========================================================================

  /**
   * Current Device trust level.
   */
  public get trustLevel(): DeviceTrustLevel {
    return this.device.trustLevel;
  }

  /**
   * Determines whether the Device is trusted.
   */
  public isTrusted(): boolean {
    return this.device.isTrusted();
  }

  /**
   * Determines whether the Device has low trust.
   */
  public isLowTrust(): boolean {
    return this.device.isLowTrust();
  }

  /**
   * Timestamp at which the Device became trusted.
   */
  public get trustedAt(): DeviceTrustedAt | undefined {
    return this.device.trustedAt;
  }

  /**
   * Marks the Device as trusted and records DeviceTrustedEvent.
   *
   * Trust policy itself belongs to the appropriate application/security
   * boundary. The aggregate records the resulting domain state.
   */
  public trust(
    trustedAt: DeviceTrustedAt,
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureCorrelationId(correlationId);

    const wasTrusted = this.device.isTrusted();

    this.device.trust(trustedAt);

    if (wasTrusted) {
      return;
    }

    this.addDomainEvent(
      new DeviceTrustedEvent(
        this.id.value,
        this.publicId.value,
        this.identityPublicId.value,
        this.isTrusted(),
        this.trustedAt!.value,
        correlationId,
        causationId,
      ),
    );
  }

  /**
   * Updates the Device trust level.
   *
   * A transition to TRUSTED records DeviceTrustedEvent.
   *
   * A transition back to LOW does not emit a dedicated event because the
   * current Device event model contains no DeviceUntrustedEvent.
   */
  public setTrustLevel(
    trustLevel: DeviceTrustLevel,
    trustedAt: DeviceTrustedAt | undefined,
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureCorrelationId(correlationId);

    const wasTrusted = this.device.isTrusted();

    this.device.setTrustLevel(trustLevel, trustedAt);

    const isTrusted = this.device.isTrusted();

    if (!wasTrusted && isTrusted) {
      this.addDomainEvent(
        new DeviceTrustedEvent(
          this.id.value,
          this.publicId.value,
          this.identityPublicId.value,
          isTrusted,
          this.trustedAt!.value,
          correlationId,
          causationId,
        ),
      );
    }
  }

  /**
   * Removes the trusted state from the Device.
   *
   * No domain event is emitted because the current Device event model does
   * not define a DeviceUntrustedEvent.
   */
  public untrust(): void {
    this.device.untrust();
  }

  // ===========================================================================
  // Fingerprint
  // ===========================================================================

  /**
   * Stable Device fingerprint.
   *
   * This value is available only through the trusted domain boundary and is
   * never included in Device domain events.
   */
  public get fingerprint(): DeviceFingerprint {
    return this.device.fingerprint;
  }

  /**
   * Determines whether the Device has the supplied fingerprint.
   */
  public hasFingerprint(fingerprint: DeviceFingerprint): boolean {
    return this.device.hasFingerprint(fingerprint);
  }

  // ===========================================================================
  // Metadata
  // ===========================================================================

  /**
   * Optional human-readable Device name.
   */
  public get name(): DeviceName | undefined {
    return this.device.name;
  }

  /**
   * Optional Device platform.
   */
  public get platform(): DevicePlatform | undefined {
    return this.device.platform;
  }

  /**
   * Optional operating-system name.
   */
  public get operatingSystem(): DeviceOperatingSystem | undefined {
    return this.device.operatingSystem;
  }

  /**
   * Optional operating-system version.
   */
  public get operatingSystemVersion():
    DeviceOperatingSystemVersion | undefined {
    return this.device.operatingSystemVersion;
  }

  /**
   * Optional browser name.
   */
  public get browser(): DeviceBrowser | undefined {
    return this.device.browser;
  }

  /**
   * Optional browser version.
   */
  public get browserVersion(): DeviceBrowserVersion | undefined {
    return this.device.browserVersion;
  }

  /**
   * Device classification.
   */
  public get deviceType(): DeviceType {
    return this.device.deviceType;
  }

  // ===========================================================================
  // Activity
  // ===========================================================================

  /**
   * Timestamp of the most recent Device observation.
   */
  public get lastSeenAt(): DeviceLastSeenAt | undefined {
    return this.device.lastSeenAt;
  }

  /**
   * Records that the Device was observed and records DeviceSeenEvent.
   *
   * The event is emitted only when the last-seen timestamp actually advances.
   */
  public recordSeen(
    lastSeenAt: DeviceLastSeenAt,
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureCorrelationId(correlationId);

    const previousLastSeenAt = this.device.lastSeenAt;

    this.device.recordSeen(lastSeenAt);

    if (
      previousLastSeenAt !== undefined &&
      this.device.lastSeenAt?.value.getTime() ===
        previousLastSeenAt.value.getTime()
    ) {
      return;
    }

    this.addDomainEvent(
      new DeviceSeenEvent(
        this.id.value,
        this.publicId.value,
        this.identityPublicId.value,
        this.status.value,
        this.lastSeenAt!.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Revocation
  // ===========================================================================

  /**
   * Timestamp at which the Device was revoked.
   */
  public get revokedAt(): DeviceRevokedAt | undefined {
    return this.device.revokedAt;
  }

  /**
   * Revokes the Device and records DeviceRevokedEvent.
   *
   * Revocation is terminal for the Device.
   */
  public revoke(
    revokedAt: DeviceRevokedAt,
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureCorrelationId(correlationId);

    const wasRevoked = this.device.isRevoked();

    this.device.revoke(revokedAt);

    if (wasRevoked) {
      return;
    }

    this.addDomainEvent(
      new DeviceRevokedEvent(
        this.id.value,
        this.publicId.value,
        this.identityPublicId.value,
        this.status.value,
        this.revokedAt!.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Device creation timestamp.
   */
  public get createdAt(): Date {
    return this.device.createdAt;
  }

  /**
   * Device last-update timestamp.
   */
  public get updatedAt(): Date {
    return this.device.updatedAt;
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
    DeviceAggregate.ensureValidDate(
      updatedAt,
      'Device update timestamp must be valid.',
    );

    this.device.setUpdatedAt(updatedAt);
  }

  // ===========================================================================
  // Aggregate Consistency
  // ===========================================================================

  /**
   * Validates structural consistency of the Device aggregate.
   *
   * Entity-level invariants remain the responsibility of DeviceEntity.
   *
   * Cross-domain Identity validation remains outside this aggregate.
   */
  private ensureAggregateConsistency(): void {
    if (this.device === undefined) {
      throw new DeviceException('Device aggregate root is required.');
    }

    if (this.device.id === undefined) {
      throw new DeviceException(
        'Device aggregate internal identity is required.',
      );
    }

    if (this.device.publicId === undefined) {
      throw new DeviceException(
        'Device aggregate public identity is required.',
      );
    }

    if (this.identityPublicId === undefined) {
      throw new DeviceException('Device Identity public identity is required.');
    }

    if (this.status === undefined) {
      throw new DeviceException('Device status is required.');
    }

    if (this.trustLevel === undefined) {
      throw new DeviceException('Device trust level is required.');
    }

    if (this.fingerprint === undefined) {
      throw new DeviceException('Device fingerprint is required.');
    }

    if (this.deviceType === undefined) {
      throw new DeviceException('Device type is required.');
    }

    DeviceAggregate.ensureValidDate(
      this.createdAt,
      'Device creation timestamp must be valid.',
    );

    DeviceAggregate.ensureValidDate(
      this.updatedAt,
      'Device update timestamp must be valid.',
    );

    if (this.updatedAt.getTime() < this.createdAt.getTime()) {
      throw new DeviceException(
        'Device updated timestamp cannot be before its creation timestamp.',
      );
    }

    if (this.trustedAt !== undefined) {
      DeviceAggregate.ensureValidDate(
        this.trustedAt.value,
        'Device trusted timestamp must be valid.',
      );

      if (this.trustedAt.value.getTime() < this.createdAt.getTime()) {
        throw new DeviceException(
          'Device trusted timestamp cannot be before its creation timestamp.',
        );
      }
    }

    if (this.lastSeenAt !== undefined) {
      DeviceAggregate.ensureValidDate(
        this.lastSeenAt.value,
        'Device last-seen timestamp must be valid.',
      );

      if (this.lastSeenAt.value.getTime() < this.createdAt.getTime()) {
        throw new DeviceException(
          'Device last-seen timestamp cannot be before its creation timestamp.',
        );
      }
    }

    if (this.revokedAt !== undefined) {
      DeviceAggregate.ensureValidDate(
        this.revokedAt.value,
        'Device revoked timestamp must be valid.',
      );

      if (this.revokedAt.value.getTime() < this.createdAt.getTime()) {
        throw new DeviceException(
          'Device revoked timestamp cannot be before its creation timestamp.',
        );
      }
    }

    if (this.isRevoked() && this.revokedAt === undefined) {
      throw new DeviceException(
        'Revoked Device must have a revoked-at timestamp.',
      );
    }

    if (!this.isRevoked() && this.revokedAt !== undefined) {
      throw new DeviceException(
        'Only a revoked Device may have a revoked-at timestamp.',
      );
    }

    if (this.isTrusted() && this.trustedAt === undefined) {
      throw new DeviceException(
        'Trusted Device must have a trusted-at timestamp.',
      );
    }

    if (!this.isTrusted() && this.trustedAt !== undefined) {
      throw new DeviceException(
        'Only a trusted Device may have a trusted-at timestamp.',
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
      throw new DeviceException('Device operation correlation ID is required.');
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
      throw new DeviceException(message);
    }
  }
}
