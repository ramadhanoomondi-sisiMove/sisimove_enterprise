// -----------------------------------------------------------------------------
// Identity — Prisma Device Repository
// -----------------------------------------------------------------------------
//
// Prisma infrastructure implementation of the DeviceRepository port.
//
// Aggregate:
//
// DeviceAggregate
// └── DeviceEntity
//
// Persistence:
//
// Device
//
// Responsibilities:
//
// - Persist Device aggregates through Prisma.
// - Rehydrate Device aggregates through DevicePrismaMapper.
// - Retrieve Devices by public identifier.
// - Retrieve Devices by internal identifier.
// - Retrieve Devices belonging to an Identity.
// - Retrieve active Devices belonging to an Identity.
// - Retrieve a Device by Identity + fingerprint.
// - Determine Device existence.
//
// This repository does NOT:
//
// - contain domain business rules;
// - validate Identity state;
// - authenticate users;
// - generate device fingerprints;
// - perform device recognition;
// - generate authentication tokens;
// - publish domain events;
// - communicate with external systems.
//
// Cross-domain Identity references remain opaque.
//
//     Device
//         │
//         └── identityPublicId
//                  │
//                  ▼
//            Identity public ID
//
// The repository never loads or resolves the Identity aggregate.
//
// -----------------------------------------------------------------------------
//
// Persistence uniqueness:
//
// Prisma schema:
//
//     @@unique([identityPublicId, fingerprint])
//
// Therefore fingerprint is NOT globally unique.
//
// The generated Prisma unique input is:
//
//     identityPublicId_fingerprint
//
// which must be used for fingerprint-based unique lookups.
//
// -----------------------------------------------------------------------------
//
// Domain behavior remains inside:
//
//     DeviceAggregate
//     DeviceEntity
//
// Persistence concerns remain inside this infrastructure adapter.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import { PrismaService } from '../../../../../../infrastructure/database/prisma/prisma.service';

// -----------------------------------------------------------------------------
// Repository Port
// -----------------------------------------------------------------------------

import type { DeviceRepository } from '../../../../domain/repositories/device.repository';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { DeviceAggregate } from '../../../../domain/aggregates/device.aggregate';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { DevicePublicId } from '../../../../domain/value-objects/device-public-id.vo';

import type { DeviceIdentityPublicId } from '../../../../domain/value-objects/device-identity-public-id.vo';

import type { DeviceFingerprint } from '../../../../domain/value-objects/device-fingerprint.vo';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import { DevicePrismaMapper } from '../mappers/device-prisma.mapper';

// =============================================================================
// Repository
// =============================================================================

/**
 * Prisma implementation of the DeviceRepository port.
 *
 * Device is an independent aggregate responsible for device registration,
 * lifecycle state, trust state, and device metadata.
 *
 * The repository translates between:
 *
 *     DeviceAggregate
 *              ↕
 *     DevicePrismaMapper
 *              ↕
 *     Prisma Device
 *
 * The Identity public identifier remains an opaque cross-aggregate reference.
 *
 * Prisma access is provided through the application's NestJS-managed
 * PrismaService.
 */
@Injectable()
export class PrismaDeviceRepository implements DeviceRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  /**
   * Creates a Prisma-backed Device repository.
   */
  public constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists a Device aggregate.
   *
   * Device is a single-entity aggregate, therefore persistence is represented
   * by one Device upsert.
   *
   * Domain value objects are converted into persistence primitives by the
   * DevicePrismaMapper.
   */
  public async save(device: DeviceAggregate): Promise<void> {
    if (device === undefined) {
      throw new Error('Device aggregate is required.');
    }

    const persistence = DevicePrismaMapper.toPersistence(device);

    const record = persistence.device;

    await this.prisma.device.upsert({
      where: {
        id: record.id,
      },

      create: record,

      update: {
        publicId: record.publicId,
        identityPublicId: record.identityPublicId,
        status: record.status,
        trustLevel: record.trustLevel,
        fingerprint: record.fingerprint,
        name: record.name,
        platform: record.platform,
        operatingSystem: record.operatingSystem,
        operatingSystemVersion: record.operatingSystemVersion,
        browser: record.browser,
        browserVersion: record.browserVersion,
        deviceType: record.deviceType,
        trustedAt: record.trustedAt,
        lastSeenAt: record.lastSeenAt,
        revokedAt: record.revokedAt,
        updatedAt: record.updatedAt,
      },
    });
  }

  // ===========================================================================
  // Deletion
  // ===========================================================================

  /**
   * Deletes a Device aggregate.
   *
   * Deletion policy belongs to the application/domain workflow.
   *
   * The repository only performs the persistence operation.
   */
  public async delete(device: DeviceAggregate): Promise<void> {
    if (device === undefined) {
      throw new Error('Device aggregate is required.');
    }

    await this.prisma.device.delete({
      where: {
        id: device.id.toString(),
      },
    });
  }

  // ===========================================================================
  // Retrieval — Public Identifier
  // ===========================================================================

  /**
   * Finds a Device aggregate by public identifier.
   *
   * Returns undefined when no Device exists with the supplied public ID.
   */
  public async findByPublicId(
    publicId: DevicePublicId,
  ): Promise<DeviceAggregate | undefined> {
    if (publicId === undefined) {
      throw new Error('Device public ID is required.');
    }

    const record = await this.prisma.device.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    if (record === null) {
      return undefined;
    }

    return DevicePrismaMapper.toDomain(record);
  }

  /**
   * Finds a Device aggregate by public identifier.
   *
   * Throws when the Device does not exist.
   */
  public async getByPublicId(
    publicId: DevicePublicId,
  ): Promise<DeviceAggregate> {
    if (publicId === undefined) {
      throw new Error('Device public ID is required.');
    }

    const device = await this.findByPublicId(publicId);

    if (device === undefined) {
      throw new Error(
        `Device with public ID "${publicId.value}" was not found.`,
      );
    }

    return device;
  }

  // ===========================================================================
  // Retrieval — Internal Identifier
  // ===========================================================================

  /**
   * Finds a Device aggregate by its internal persistence identifier.
   *
   * The internal ID is a persistence concern and is not converted into a
   * DevicePublicId.
   */
  public async findById(id: string): Promise<DeviceAggregate | undefined> {
    if (typeof id !== 'string' || id.trim().length === 0) {
      throw new Error('Device internal ID is required.');
    }

    const record = await this.prisma.device.findUnique({
      where: {
        id,
      },
    });

    if (record === null) {
      return undefined;
    }

    return DevicePrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Retrieval — Identity Ownership
  // ===========================================================================

  /**
   * Finds all Device aggregates belonging to an Identity.
   *
   * identityPublicId is an opaque cross-aggregate reference.
   *
   * The Identity aggregate is never loaded or resolved.
   */
  public async findByIdentityPublicId(
    identityPublicId: DeviceIdentityPublicId,
  ): Promise<DeviceAggregate[]> {
    if (identityPublicId === undefined) {
      throw new Error('Device Identity public ID is required.');
    }

    const records = await this.prisma.device.findMany({
      where: {
        identityPublicId: identityPublicId.value,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => DevicePrismaMapper.toDomain(record));
  }

  /**
   * Finds all active Devices belonging to an Identity.
   *
   * Status filtering is performed directly by Prisma.
   */
  public async findActiveByIdentityPublicId(
    identityPublicId: DeviceIdentityPublicId,
  ): Promise<DeviceAggregate[]> {
    if (identityPublicId === undefined) {
      throw new Error('Device Identity public ID is required.');
    }

    const records = await this.prisma.device.findMany({
      where: {
        identityPublicId: identityPublicId.value,
        status: 'ACTIVE',
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => DevicePrismaMapper.toDomain(record));
  }

  /**
   * Determines whether at least one Device belongs to an Identity.
   */
  public async existsByIdentityPublicId(
    identityPublicId: DeviceIdentityPublicId,
  ): Promise<boolean> {
    if (identityPublicId === undefined) {
      throw new Error('Device Identity public ID is required.');
    }

    const record = await this.prisma.device.findFirst({
      where: {
        identityPublicId: identityPublicId.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Retrieval — Identity + Fingerprint
  // ===========================================================================

  /**
   * Finds a Device by Identity and stable fingerprint.
   *
   * The Prisma schema defines:
   *
   *     @@unique([identityPublicId, fingerprint])
   *
   * Therefore the generated Prisma unique selector is:
   *
   *     identityPublicId_fingerprint
   *
   * The Identity reference remains opaque. The Identity aggregate is never
   * loaded or resolved.
   */
  public async findByIdentityPublicIdAndFingerprint(
    identityPublicId: DeviceIdentityPublicId,
    fingerprint: DeviceFingerprint,
  ): Promise<DeviceAggregate | undefined> {
    if (identityPublicId === undefined) {
      throw new Error('Device Identity public ID is required.');
    }

    if (fingerprint === undefined) {
      throw new Error('Device fingerprint is required.');
    }

    const record = await this.prisma.device.findUnique({
      where: {
        identityPublicId_fingerprint: {
          identityPublicId: identityPublicId.value,
          fingerprint: fingerprint.value,
        },
      },
    });

    if (record === null) {
      return undefined;
    }

    return DevicePrismaMapper.toDomain(record);
  }

  /**
   * Determines whether a Device exists for an Identity with the supplied
   * fingerprint.
   *
   * The compound unique constraint allows Prisma to perform this lookup
   * directly through findUnique().
   */
  public async existsByIdentityPublicIdAndFingerprint(
    identityPublicId: DeviceIdentityPublicId,
    fingerprint: DeviceFingerprint,
  ): Promise<boolean> {
    if (identityPublicId === undefined) {
      throw new Error('Device Identity public ID is required.');
    }

    if (fingerprint === undefined) {
      throw new Error('Device fingerprint is required.');
    }

    const record = await this.prisma.device.findUnique({
      where: {
        identityPublicId_fingerprint: {
          identityPublicId: identityPublicId.value,
          fingerprint: fingerprint.value,
        },
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Existence — Public Identifier
  // ===========================================================================

  /**
   * Determines whether a Device exists with the supplied public identifier.
   */
  public async existsByPublicId(publicId: DevicePublicId): Promise<boolean> {
    if (publicId === undefined) {
      throw new Error('Device public ID is required.');
    }

    const record = await this.prisma.device.findUnique({
      where: {
        publicId: publicId.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default PrismaDeviceRepository;
