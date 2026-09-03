// -----------------------------------------------------------------------------
// Device — Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps the Device aggregate:
//
// DeviceAggregate
// └── DeviceEntity
//
// Persistence:
//
// Device
//
// Device is an independent aggregate root.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { Device as PrismaDevice } from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { DeviceAggregate } from '../../../../domain/aggregates/device.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { DeviceEntity } from '../../../../domain/entities/device.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  DevicePublicId,
  DeviceIdentityPublicId,
  DeviceStatus,
  DeviceTrustLevel,
  DeviceFingerprint,
  DeviceName,
  DevicePlatform,
  DeviceOperatingSystem,
  DeviceOperatingSystemVersion,
  DeviceBrowser,
  DeviceBrowserVersion,
  DeviceType,
  DeviceTrustedAt,
  DeviceLastSeenAt,
  DeviceRevokedAt,
} from '../../../../domain/value-objects';

// =============================================================================
// Persistence Types
// =============================================================================

/**
 * Persistence representation of the Device aggregate.
 *
 * Device is a single-entity aggregate, therefore no child collection
 * is required in the persistence structure.
 */
export interface DevicePersistence {
  device: ReturnType<typeof DevicePrismaMapper.deviceToPersistence>;
}

// =============================================================================
// Mapper
// =============================================================================

export class DevicePrismaMapper {
  // ===========================================================================
  // Prisma → Domain Aggregate
  // ===========================================================================

  /**
   * Rehydrates a complete Device aggregate from a Prisma Device record.
   *
   * Rehydration does not emit domain events.
   */
  public static toDomain(record: PrismaDevice): DeviceAggregate {
    return DeviceAggregate.rehydrate(this.deviceToDomain(record));
  }

  // ===========================================================================
  // Prisma → Domain Entity
  // ===========================================================================

  /**
   * Rehydrates a DeviceEntity from a persisted Prisma Device record.
   *
   * Mapping:
   *
   * Prisma id
   *     ↓
   * UniqueEntityId
   *
   * Prisma publicId
   *     ↓
   * DevicePublicId
   *
   * Prisma identityPublicId
   *     ↓
   * DeviceIdentityPublicId
   *
   * Prisma status
   *     ↓
   * DeviceStatus
   *
   * Prisma trustLevel
   *     ↓
   * DeviceTrustLevel
   *
   * Prisma fingerprint
   *     ↓
   * DeviceFingerprint
   */
  public static deviceToDomain(record: PrismaDevice): DeviceEntity {
    if (record === undefined) {
      throw new Error('Device Prisma record is required.');
    }

    const publicId = new DevicePublicId(record.publicId);

    return DeviceEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        identityPublicId: new DeviceIdentityPublicId(record.identityPublicId),

        // ---------------------------------------------------------------------
        // Device Status
        // ---------------------------------------------------------------------

        status: DeviceStatus.create(record.status),

        // ---------------------------------------------------------------------
        // Trust
        // ---------------------------------------------------------------------

        trustLevel: DeviceTrustLevel.create(record.trustLevel),

        // ---------------------------------------------------------------------
        // Fingerprint
        // ---------------------------------------------------------------------

        fingerprint: DeviceFingerprint.create(record.fingerprint),

        // ---------------------------------------------------------------------
        // Device Metadata
        // ---------------------------------------------------------------------

        name: record.name !== null ? DeviceName.create(record.name) : undefined,

        platform:
          record.platform !== null
            ? DevicePlatform.create(record.platform)
            : undefined,

        operatingSystem:
          record.operatingSystem !== null
            ? DeviceOperatingSystem.create(record.operatingSystem)
            : undefined,

        operatingSystemVersion:
          record.operatingSystemVersion !== null
            ? DeviceOperatingSystemVersion.create(record.operatingSystemVersion)
            : undefined,

        browser:
          record.browser !== null
            ? DeviceBrowser.create(record.browser)
            : undefined,

        browserVersion:
          record.browserVersion !== null
            ? DeviceBrowserVersion.create(record.browserVersion)
            : undefined,

        // ---------------------------------------------------------------------
        // Device Type
        // ---------------------------------------------------------------------

        deviceType: DeviceType.create(record.deviceType),

        // ---------------------------------------------------------------------
        // Trust Lifecycle
        // ---------------------------------------------------------------------

        trustedAt:
          record.trustedAt !== null
            ? DeviceTrustedAt.create(record.trustedAt)
            : undefined,

        // ---------------------------------------------------------------------
        // Activity Lifecycle
        // ---------------------------------------------------------------------

        lastSeenAt:
          record.lastSeenAt !== null
            ? DeviceLastSeenAt.create(record.lastSeenAt)
            : undefined,

        // ---------------------------------------------------------------------
        // Revocation Lifecycle
        // ---------------------------------------------------------------------

        revokedAt:
          record.revokedAt !== null
            ? DeviceRevokedAt.create(record.revokedAt)
            : undefined,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),

      publicId,
    );
  }

  // ===========================================================================
  // Domain Entity → Prisma Persistence
  // ===========================================================================

  /**
   * Maps DeviceEntity into its Prisma persistence shape.
   *
   * Domain value objects are serialized into primitive persistence values.
   */
  public static deviceToPersistence(entity: DeviceEntity): {
    id: string;
    publicId: string;
    identityPublicId: string;
    status: PrismaDevice['status'];
    trustLevel: PrismaDevice['trustLevel'];
    fingerprint: string;
    name: string | null;
    platform: string | null;
    operatingSystem: string | null;
    operatingSystemVersion: string | null;
    browser: string | null;
    browserVersion: string | null;
    deviceType: PrismaDevice['deviceType'];
    trustedAt: Date | null;
    lastSeenAt: Date | null;
    revokedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    if (entity === undefined) {
      throw new Error('Device entity is required.');
    }

    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      identityPublicId: entity.identityPublicId.value,

      // -----------------------------------------------------------------------
      // Device Status
      // -----------------------------------------------------------------------

      status: entity.status.value,

      // -----------------------------------------------------------------------
      // Trust
      // -----------------------------------------------------------------------

      trustLevel: entity.trustLevel.value,

      // -----------------------------------------------------------------------
      // Fingerprint
      // -----------------------------------------------------------------------

      fingerprint: entity.fingerprint.value,

      // -----------------------------------------------------------------------
      // Device Metadata
      // -----------------------------------------------------------------------

      name: entity.name?.value ?? null,

      platform: entity.platform?.value ?? null,

      operatingSystem: entity.operatingSystem?.value ?? null,

      operatingSystemVersion: entity.operatingSystemVersion?.value ?? null,

      browser: entity.browser?.value ?? null,

      browserVersion: entity.browserVersion?.value ?? null,

      // -----------------------------------------------------------------------
      // Device Type
      // -----------------------------------------------------------------------

      deviceType: entity.deviceType.value,

      // -----------------------------------------------------------------------
      // Trust Lifecycle
      // -----------------------------------------------------------------------

      trustedAt: entity.trustedAt?.value ?? null,

      // -----------------------------------------------------------------------
      // Activity Lifecycle
      // -----------------------------------------------------------------------

      lastSeenAt: entity.lastSeenAt?.value ?? null,

      // -----------------------------------------------------------------------
      // Revocation Lifecycle
      // -----------------------------------------------------------------------

      revokedAt: entity.revokedAt?.value ?? null,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Aggregate → Persistence
  // ===========================================================================

  /**
   * Converts the complete Device aggregate into its persistence structure.
   *
   * Device is a single-entity aggregate, so the aggregate persistence
   * structure contains only the Device root record.
   */
  public static toPersistence(aggregate: DeviceAggregate): DevicePersistence {
    if (aggregate === undefined) {
      throw new Error('Device aggregate is required.');
    }

    return {
      device: this.deviceToPersistence(aggregate.device),
    };
  }

  // ===========================================================================
  // Component Mapping
  // ===========================================================================

  /**
   * Maps a Prisma Device record directly into DeviceEntity.
   *
   * Useful for repository-level component operations.
   */
  public static toDeviceDomain(record: PrismaDevice): DeviceEntity {
    return this.deviceToDomain(record);
  }

  /**
   * Maps a Prisma Device record into DeviceAggregate.
   *
   * Equivalent to toDomain().
   */
  public static toDeviceAggregate(record: PrismaDevice): DeviceAggregate {
    return this.toDomain(record);
  }

  // ===========================================================================
  // Generic Domain Component Mapping
  // ===========================================================================

  /**
   * Maps a supported Prisma Device record into its corresponding
   * domain component.
   *
   * Device has only one aggregate-owned entity, so this resolves directly
   * to DeviceEntity.
   */
  public static toDomainComponent(record: PrismaDevice): DeviceEntity {
    return this.deviceToDomain(record);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default DevicePrismaMapper;
