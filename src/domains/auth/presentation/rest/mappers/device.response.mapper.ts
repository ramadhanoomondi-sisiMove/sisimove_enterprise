// -----------------------------------------------------------------------------
// Identity — Device Response Mapper
// -----------------------------------------------------------------------------
//
// Maps the DeviceAggregate / DeviceEntity domain model into an
// application-facing response DTO.
//
// Aggregate:
//
// DeviceAggregate
// └── DeviceEntity
//
// Mapping principles:
//
// - Expose authentication-safe Device state.
// - Serialize value objects into primitives.
// - Expose the opaque public reference to Identity.
// - Expose Device lifecycle state.
// - Expose Device trust state.
// - Expose Device descriptive metadata.
// - Expose Device platform and operating-system metadata.
// - Expose Device browser metadata.
// - Expose Device classification.
// - Expose Device activity state.
// - Expose Device revocation state.
// - Expose Device audit state.
// - Do not expose fingerprint.
// - Do not expose internal persistence identifiers.
// - Do not access Prisma or persistence models.
// - Do not resolve Identity.
// - Do not evaluate device-recognition policy.
// - Do not expose domain entities or value objects directly.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Map DeviceAggregate -> DeviceResponse.
// - Map DeviceEntity -> DeviceResponse.
// - Provide one canonical Device mapping implementation.
// - Convert Device value objects into primitive response values.
// - Return defensive Date instances.
//
// -----------------------------------------------------------------------------
//
// This mapper does NOT:
//
// - Mutate the aggregate.
// - Persist the aggregate.
// - Access Prisma.
// - Generate device fingerprints.
// - Resolve Identity.
// - Evaluate device-recognition policy.
// - Authenticate users.
// - Generate authentication tokens.
// - Manage Sessions.
// - Authorize requests.
// - Emit domain events.
// - Perform business validation.
// - Expose fingerprint.
//
// -----------------------------------------------------------------------------
//
// Security:
//
// Device fingerprint is intentionally excluded from DeviceResponse.
//
// The fingerprint is stable device-recognition material and should remain
// inside the appropriate trusted domain/application/security boundary.
//
// The response exposes safe Device metadata such as:
//
// - device public identity;
// - Identity public reference;
// - lifecycle status;
// - trust level;
// - device name;
// - platform;
// - operating system;
// - browser;
// - device type;
// - last-seen timestamp;
// - revoked timestamp.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import type { DeviceAggregate } from '../../../domain/aggregates/device.aggregate';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { DeviceEntity } from '../../../domain/entities/device.entity';

// =============================================================================
// Response
// =============================================================================

export interface DeviceResponse {
  // ---------------------------------------------------------------------------
  // Device Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Device aggregate.
   */
  publicId: string;

  /**
   * Opaque public reference to the Identity aggregate.
   */
  identityPublicId: string;

  // ---------------------------------------------------------------------------
  // Device Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Current Device lifecycle status.
   *
   * Serialized from DeviceStatus.
   */
  status: string;

  // ---------------------------------------------------------------------------
  // Trust State
  // ---------------------------------------------------------------------------

  /**
   * Current Device trust level.
   *
   * Serialized from DeviceTrustLevel.
   */
  trustLevel: string;

  /**
   * Timestamp at which the Device became trusted.
   *
   * Undefined when the Device is not trusted.
   */
  trustedAt?: Date;

  // ---------------------------------------------------------------------------
  // Device Metadata
  // ---------------------------------------------------------------------------

  /**
   * Optional human-readable Device name.
   */
  name?: string;

  /**
   * Optional Device platform.
   */
  platform?: string;

  /**
   * Optional operating-system name.
   */
  operatingSystem?: string;

  /**
   * Optional operating-system version.
   */
  operatingSystemVersion?: string;

  /**
   * Optional browser name.
   */
  browser?: string;

  /**
   * Optional browser version.
   */
  browserVersion?: string;

  /**
   * Device classification.
   *
   * Serialized from DeviceType.
   */
  deviceType: string;

  // ---------------------------------------------------------------------------
  // Activity State
  // ---------------------------------------------------------------------------

  /**
   * Timestamp of the most recent Device observation.
   */
  lastSeenAt?: Date;

  // ---------------------------------------------------------------------------
  // Revocation State
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the Device was revoked.
   *
   * Undefined when the Device has not been revoked.
   */
  revokedAt?: Date;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which Device was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which Device was last updated.
   */
  updatedAt: Date;
}

// =============================================================================
// Mapper
// =============================================================================

export class DeviceResponseMapper {
  // ===========================================================================

  // Aggregate -> Response
  // ===========================================================================

  /**
   * Maps a DeviceAggregate into a DeviceResponse.
   *
   * This is the canonical aggregate-to-response mapping entry point.
   */
  public static toResponse(aggregate: DeviceAggregate): DeviceResponse {
    if (aggregate === undefined) {
      throw new Error('Device aggregate is required.');
    }

    return this.mapDevice(aggregate.device);
  }

  // ===========================================================================

  // Entity -> Response
  // ===========================================================================

  /**
   * Maps a DeviceEntity directly into a DeviceResponse.
   *
   * Useful for application/read workflows where the aggregate wrapper is not
   * required by the caller.
   */
  public static fromEntity(device: DeviceEntity): DeviceResponse {
    if (device === undefined) {
      throw new Error('Device entity is required.');
    }

    return this.mapDevice(device);
  }

  // ===========================================================================

  // Internal Device Mapping
  // ===========================================================================

  /**
   * Maps the DeviceEntity portion of the Device aggregate.
   *
   * This is the single canonical implementation used by both:
   *
   * - toResponse();
   * - fromEntity();
   *
   * Keeping the mapping centralized prevents aggregate and entity response
   * paths from drifting apart.
   */
  private static mapDevice(device: DeviceEntity): DeviceResponse {
    return {
      // -----------------------------------------------------------------------
      // Device Identity
      // -----------------------------------------------------------------------

      publicId: device.publicId.value,

      identityPublicId: device.identityPublicId.value,

      // -----------------------------------------------------------------------
      // Device Lifecycle
      // -----------------------------------------------------------------------

      status: device.status.value,

      // -----------------------------------------------------------------------
      // Trust State
      // -----------------------------------------------------------------------

      trustLevel: device.trustLevel.value,

      ...(device.trustedAt !== undefined
        ? {
            trustedAt: new Date(device.trustedAt.value.getTime()),
          }
        : {}),

      // -----------------------------------------------------------------------
      // Device Metadata
      // -----------------------------------------------------------------------

      ...(device.name !== undefined
        ? {
            name: device.name.value,
          }
        : {}),

      ...(device.platform !== undefined
        ? {
            platform: device.platform.value,
          }
        : {}),

      ...(device.operatingSystem !== undefined
        ? {
            operatingSystem: device.operatingSystem.value,
          }
        : {}),

      ...(device.operatingSystemVersion !== undefined
        ? {
            operatingSystemVersion: device.operatingSystemVersion.value,
          }
        : {}),

      ...(device.browser !== undefined
        ? {
            browser: device.browser.value,
          }
        : {}),

      ...(device.browserVersion !== undefined
        ? {
            browserVersion: device.browserVersion.value,
          }
        : {}),

      deviceType: device.deviceType.value,

      // -----------------------------------------------------------------------
      // Activity State
      // -----------------------------------------------------------------------

      ...(device.lastSeenAt !== undefined
        ? {
            lastSeenAt: new Date(device.lastSeenAt.value.getTime()),
          }
        : {}),

      // -----------------------------------------------------------------------
      // Revocation State
      // -----------------------------------------------------------------------

      ...(device.revokedAt !== undefined
        ? {
            revokedAt: new Date(device.revokedAt.value.getTime()),
          }
        : {}),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: new Date(device.createdAt.getTime()),

      updatedAt: new Date(device.updatedAt.getTime()),
    };
  }
}
