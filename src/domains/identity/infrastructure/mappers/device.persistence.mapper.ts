// src/domains/identity/infrastructure/persistence/device.persistence.mapper.ts

import type {
  Device as PrismaDevice,
  DeviceStatus as PrismaDeviceStatus,
  DeviceTrustLevel as PrismaDeviceTrustLevel,
  DeviceType as PrismaDeviceType,
} from '@prisma/client';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import { DeviceAggregate } from '../../domain/aggregates/device.aggregate';
import { DeviceEntity } from '../../domain/entities/device.entity';
import { DeviceFingerprint } from '../../domain/value-objects/device-fingerprint.vo';
import { DeviceId } from '../../domain/value-objects/device-id.vo';
import type { DeviceStatus } from '../../domain/value-objects/device-status.enum';
import type { DeviceTrustLevel } from '../../domain/value-objects/device-trust-level.enum';
import type { DeviceType } from '../../domain/value-objects/device-type.enum';

export class DevicePersistenceMapper {
  static toDomain(device: PrismaDevice): DeviceAggregate {
    return new DeviceAggregate(
      {
        identityId: device.identityId,

        fingerprint: new DeviceFingerprint(device.fingerprint),

        status: device.status as DeviceStatus,
        trustLevel: device.trustLevel as DeviceTrustLevel,

        name: device.name ?? undefined,
        platform: device.platform ?? undefined,
        operatingSystem: device.operatingSystem ?? undefined,
        operatingSystemVersion: device.operatingSystemVersion ?? undefined,
        browser: device.browser ?? undefined,
        browserVersion: device.browserVersion ?? undefined,

        deviceType: device.deviceType as DeviceType,

        trustedAt: device.trustedAt ?? undefined,
        lastSeenAt: device.lastSeenAt ?? undefined,
        revokedAt: device.revokedAt ?? undefined,

        createdAt: device.createdAt,
        updatedAt: device.updatedAt,
      },
      new UniqueEntityId(device.id),
      new DeviceId(device.publicId),
    );
  }

  static toEntity(device: PrismaDevice): DeviceEntity {
    const props = {
      publicId: new DeviceId(device.publicId),

      identityId: device.identityId,

      fingerprint: device.fingerprint,

      status: device.status as DeviceStatus,
      trustLevel: device.trustLevel as DeviceTrustLevel,

      deviceType: device.deviceType as DeviceType,

      createdAt: device.createdAt,
      updatedAt: device.updatedAt,
    };

    return new DeviceEntity(
      {
        ...props,

        ...(device.name !== null && { name: device.name }),
        ...(device.platform !== null && { platform: device.platform }),
        ...(device.operatingSystem !== null && {
          operatingSystem: device.operatingSystem,
        }),
        ...(device.operatingSystemVersion !== null && {
          operatingSystemVersion: device.operatingSystemVersion,
        }),
        ...(device.browser !== null && {
          browser: device.browser,
        }),
        ...(device.browserVersion !== null && {
          browserVersion: device.browserVersion,
        }),
        ...(device.trustedAt !== null && {
          trustedAt: device.trustedAt,
        }),
        ...(device.lastSeenAt !== null && {
          lastSeenAt: device.lastSeenAt,
        }),
        ...(device.revokedAt !== null && {
          revokedAt: device.revokedAt,
        }),
      },
      new UniqueEntityId(device.id),
    );
  }

  static toPersistence(device: DeviceAggregate) {
    return {
      id: device.id.value,
      publicId: device.publicId.value,

      identityId: device.identityId,

      fingerprint: device.fingerprint.value,

      status: device.status as PrismaDeviceStatus,
      trustLevel: device.trustLevel as PrismaDeviceTrustLevel,

      name: device.name ?? null,
      platform: device.platform ?? null,
      operatingSystem: device.operatingSystem ?? null,
      operatingSystemVersion: device.operatingSystemVersion ?? null,
      browser: device.browser ?? null,
      browserVersion: device.browserVersion ?? null,

      deviceType: device.deviceType as PrismaDeviceType,

      trustedAt: device.trustedAt ?? null,
      lastSeenAt: device.lastSeenAt ?? null,
      revokedAt: device.revokedAt ?? null,

      createdAt: device.createdAt,
      updatedAt: device.updatedAt,
    };
  }
}
