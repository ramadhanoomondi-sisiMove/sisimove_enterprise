// -----------------------------------------------------------------------------
// Recovery — Prisma Repository
// -----------------------------------------------------------------------------
//
// Prisma infrastructure implementation of the RecoveryRepository port.
//
// Aggregate:
//
// RecoveryAggregate
// └── RecoveryEntity
//
// Persistence:
//
// Recovery
//
// Recovery is an independent aggregate.
//
// The Identity reference is opaque:
//
// Recovery
//     │
//     └── identityPublicId
//              │
//              ▼
//        Identity public ID
//
// This repository never loads or resolves the Identity aggregate.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Persist Recovery aggregates through Prisma.
// - Rehydrate Recovery aggregates through RecoveryPrismaMapper.
// - Delete Recovery aggregates when explicitly requested.
// - Retrieve Recovery aggregates by internal identity.
// - Retrieve Recovery aggregates by public identity.
// - Retrieve Recovery aggregates by Identity public reference.
// - Retrieve Recovery aggregates by lifecycle status.
// - Retrieve pending Recovery aggregates.
// - Retrieve Recovery aggregates by Recovery type.
// - Retrieve Recovery aggregates using supported composite criteria.
// - Determine Recovery aggregate existence.
//
// -----------------------------------------------------------------------------
//
// This repository does NOT:
//
// - contain Recovery business rules;
// - generate recovery tokens;
// - hash recovery tokens;
// - compare raw recovery tokens;
// - execute password resets;
// - authenticate users;
// - generate OTPs;
// - send notifications;
// - modify Identity;
// - modify Authentication;
// - navigate the Identity aggregate;
// - expose Prisma types through the domain contract;
// - evaluate dynamic Recovery expiry as a business rule.
//
// Dynamic expiry remains a RecoveryEntity concern:
//
//     recovery.isExpired(referenceDate)
//     recovery.expire(...)
//
// -----------------------------------------------------------------------------
//
// Persistence boundary:
//
// Application
//     │
//     ▼
// RecoveryRepository
//     │
//     ▼
// PrismaRecoveryRepository
//     │
//     ├── RecoveryPrismaMapper
//     │
//     ▼
// Prisma
//
// -----------------------------------------------------------------------------
//
// Infrastructure DI:
//
// PrismaService is injected rather than PrismaClient directly.
//
// PrismaService is the application's NestJS-managed Prisma lifecycle
// abstraction. This ensures the repository receives the same configured
// Prisma instance managed by NestJS.
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
// Aggregate
// -----------------------------------------------------------------------------

import type { RecoveryAggregate } from '../../../../domain/aggregates/recovery.aggregate';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type { RecoveryRepository } from '../../../../domain/repositories/recovery.repository';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import {
  RecoveryPrismaMapper,
  type RecoveryPersistence,
} from '../mappers/recovery-prisma.mapper';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { RecoveryPublicId } from '../../../../domain/value-objects/recovery-public-id.vo';

import type { RecoveryIdentityPublicId } from '../../../../domain/value-objects/recovery-identity-public-id.vo';

import type { RecoveryType } from '../../../../domain/value-objects/recovery-type.vo';

import type { RecoveryStatus } from '../../../../domain/value-objects/recovery-status.vo';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// =============================================================================
// Repository
// =============================================================================

/**
 * Prisma infrastructure implementation of the Recovery repository.
 *
 * Recovery is an independent aggregate responsible for one recovery
 * workflow associated with an Identity.
 *
 * The repository translates between:
 *
 *     RecoveryAggregate
 *              ↕
 *     RecoveryPrismaMapper
 *              ↕
 *     Prisma Recovery
 *
 * The Identity public identifier remains an opaque cross-aggregate reference.
 *
 * NestJS owns the repository lifecycle and injects the application's
 * PrismaService instance.
 */
@Injectable()
export class PrismaRecoveryRepository implements RecoveryRepository {
  // ===========================================================================

  // Constructor

  // ===========================================================================

  /**
   * Creates a Prisma-backed Recovery repository.
   *
   * PrismaService is the application's NestJS-managed Prisma dependency.
   */
  public constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================

  // Persistence

  // ===========================================================================

  /**
   * Persists a Recovery aggregate.
   *
   * Recovery is a single-entity aggregate, therefore persistence is represented
   * by one Recovery upsert.
   *
   * The mapper converts domain value objects into persistence primitives.
   */
  public async save(aggregate: RecoveryAggregate): Promise<void> {
    if (aggregate === undefined) {
      throw new Error('Recovery aggregate is required.');
    }

    const persistence: RecoveryPersistence =
      RecoveryPrismaMapper.toPersistence(aggregate);

    const recovery = persistence.recovery;

    await this.prisma.recovery.upsert({
      where: {
        id: recovery.id,
      },

      create: recovery,

      update: {
        publicId: recovery.publicId,
        identityPublicId: recovery.identityPublicId,
        type: recovery.type,
        status: recovery.status,
        recoveryTokenHash: recovery.recoveryTokenHash,
        requestedAt: recovery.requestedAt,
        expiresAt: recovery.expiresAt,
        completedAt: recovery.completedAt,
        cancelledAt: recovery.cancelledAt,
        updatedAt: recovery.updatedAt,
      },
    });
  }

  /**
   * Deletes a Recovery aggregate.
   *
   * Recovery normally relies on terminal lifecycle states rather than
   * physical deletion. Deletion therefore remains an explicit persistence
   * operation.
   */
  public async delete(aggregate: RecoveryAggregate): Promise<void> {
    if (aggregate === undefined) {
      throw new Error('Recovery aggregate is required.');
    }

    await this.prisma.recovery.delete({
      where: {
        id: aggregate.id.toString(),
      },
    });
  }

  // ===========================================================================

  // Retrieval — Internal Identity

  // ===========================================================================

  /**
   * Finds all Recovery aggregates.
   *
   * Default ordering is newest requested Recovery first.
   */
  public async findAll(): Promise<RecoveryAggregate[]> {
    const records = await this.prisma.recovery.findMany({
      orderBy: [
        {
          requestedAt: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });

    return records.map((record) => RecoveryPrismaMapper.toDomain(record));
  }

  /**
   * Finds a Recovery aggregate by its internal persistence identity.
   */
  public async findById(id: UniqueEntityId): Promise<RecoveryAggregate | null> {
    if (id === undefined) {
      throw new Error('Recovery internal ID is required.');
    }

    const record = await this.prisma.recovery.findUnique({
      where: {
        id: id.toString(),
      },
    });

    if (record === null) {
      return null;
    }

    return RecoveryPrismaMapper.toDomain(record);
  }

  /**
   * Determines whether a Recovery exists by internal persistence identity.
   */
  public async existsById(id: UniqueEntityId): Promise<boolean> {
    if (id === undefined) {
      throw new Error('Recovery internal ID is required.');
    }

    const record = await this.prisma.recovery.findUnique({
      where: {
        id: id.toString(),
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================

  // Retrieval — Public Identity

  // ===========================================================================

  /**
   * Finds a Recovery aggregate by public identifier.
   */
  public async findByPublicId(
    publicId: RecoveryPublicId,
  ): Promise<RecoveryAggregate | null> {
    if (publicId === undefined) {
      throw new Error('Recovery public ID is required.');
    }

    const record = await this.prisma.recovery.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return RecoveryPrismaMapper.toDomain(record);
  }

  /**
   * Determines whether a Recovery exists by public identifier.
   */
  public async existsByPublicId(publicId: RecoveryPublicId): Promise<boolean> {
    if (publicId === undefined) {
      throw new Error('Recovery public ID is required.');
    }

    const record = await this.prisma.recovery.findUnique({
      where: {
        publicId: publicId.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================

  // Retrieval — Identity

  // ===========================================================================

  /**
   * Finds all Recovery aggregates associated with an Identity.
   *
   * identityPublicId is an opaque cross-domain reference.
   *
   * Results are ordered newest requested Recovery first.
   */
  public async findByIdentityPublicId(
    identityPublicId: RecoveryIdentityPublicId,
  ): Promise<RecoveryAggregate[]> {
    if (identityPublicId === undefined) {
      throw new Error('Recovery Identity public ID is required.');
    }

    const records = await this.prisma.recovery.findMany({
      where: {
        identityPublicId: identityPublicId.value,
      },

      orderBy: [
        {
          requestedAt: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });

    return records.map((record) => RecoveryPrismaMapper.toDomain(record));
  }

  /**
   * Finds the most recently requested Recovery associated with an Identity.
   */
  public async findLatestByIdentityPublicId(
    identityPublicId: RecoveryIdentityPublicId,
  ): Promise<RecoveryAggregate | null> {
    if (identityPublicId === undefined) {
      throw new Error('Recovery Identity public ID is required.');
    }

    const record = await this.prisma.recovery.findFirst({
      where: {
        identityPublicId: identityPublicId.value,
      },

      orderBy: [
        {
          requestedAt: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });

    if (record === null) {
      return null;
    }

    return RecoveryPrismaMapper.toDomain(record);
  }

  /**
   * Determines whether an Identity has at least one Recovery aggregate.
   */
  public async existsByIdentityPublicId(
    identityPublicId: RecoveryIdentityPublicId,
  ): Promise<boolean> {
    if (identityPublicId === undefined) {
      throw new Error('Recovery Identity public ID is required.');
    }

    const record = await this.prisma.recovery.findFirst({
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

  // Retrieval — Status

  // ===========================================================================

  /**
   * Finds all Recovery aggregates with the supplied persisted status.
   *
   * This method does not evaluate dynamic expiry.
   *
   * For example, a Recovery may have:
   *
   *     status = PENDING
   *     expiresAt < now
   *
   * Such a Recovery remains persisted as PENDING until the application/domain
   * workflow loads it and invokes expire().
   */
  public async findByStatus(
    status: RecoveryStatus,
  ): Promise<RecoveryAggregate[]> {
    if (status === undefined) {
      throw new Error('Recovery status is required.');
    }

    const records = await this.prisma.recovery.findMany({
      where: {
        status: status.value,
      },

      orderBy: [
        {
          requestedAt: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });

    return records.map((record) => RecoveryPrismaMapper.toDomain(record));
  }

  /**
   * Finds all Recovery aggregates whose persisted status is PENDING.
   *
   * Important:
   *
   * This query intentionally does not compare expiresAt against the current
   * time. Dynamic expiration belongs to RecoveryEntity.
   */
  public async findPending(): Promise<RecoveryAggregate[]> {
    const records = await this.prisma.recovery.findMany({
      where: {
        status: 'PENDING',
      },

      orderBy: [
        {
          requestedAt: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });

    return records.map((record) => RecoveryPrismaMapper.toDomain(record));
  }

  /**
   * Determines whether at least one Recovery exists with the supplied status.
   */
  public async existsByStatus(status: RecoveryStatus): Promise<boolean> {
    if (status === undefined) {
      throw new Error('Recovery status is required.');
    }

    const record = await this.prisma.recovery.findFirst({
      where: {
        status: status.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================

  // Retrieval — Type

  // ===========================================================================

  /**
   * Finds all Recovery aggregates with the supplied Recovery type.
   */
  public async findByType(type: RecoveryType): Promise<RecoveryAggregate[]> {
    if (type === undefined) {
      throw new Error('Recovery type is required.');
    }

    const records = await this.prisma.recovery.findMany({
      where: {
        type: type.value,
      },

      orderBy: [
        {
          requestedAt: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });

    return records.map((record) => RecoveryPrismaMapper.toDomain(record));
  }

  // ===========================================================================

  // Retrieval — Identity + Type

  // ===========================================================================

  /**
   * Finds Recovery aggregates associated with an Identity and restricted to
   * the supplied Recovery type.
   */
  public async findByIdentityPublicIdAndType(
    identityPublicId: RecoveryIdentityPublicId,
    type: RecoveryType,
  ): Promise<RecoveryAggregate[]> {
    if (identityPublicId === undefined) {
      throw new Error('Recovery Identity public ID is required.');
    }

    if (type === undefined) {
      throw new Error('Recovery type is required.');
    }

    const records = await this.prisma.recovery.findMany({
      where: {
        identityPublicId: identityPublicId.value,
        type: type.value,
      },

      orderBy: [
        {
          requestedAt: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });

    return records.map((record) => RecoveryPrismaMapper.toDomain(record));
  }

  /**
   * Finds the most recently requested Recovery of a supplied type for an
   * Identity.
   */
  public async findLatestByIdentityPublicIdAndType(
    identityPublicId: RecoveryIdentityPublicId,
    type: RecoveryType,
  ): Promise<RecoveryAggregate | null> {
    if (identityPublicId === undefined) {
      throw new Error('Recovery Identity public ID is required.');
    }

    if (type === undefined) {
      throw new Error('Recovery type is required.');
    }

    const record = await this.prisma.recovery.findFirst({
      where: {
        identityPublicId: identityPublicId.value,
        type: type.value,
      },

      orderBy: [
        {
          requestedAt: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });

    if (record === null) {
      return null;
    }

    return RecoveryPrismaMapper.toDomain(record);
  }

  // ===========================================================================

  // Retrieval — Identity + Status

  // ===========================================================================

  /**
   * Finds Recovery aggregates associated with an Identity and restricted to
   * the supplied lifecycle status.
   */
  public async findByIdentityPublicIdAndStatus(
    identityPublicId: RecoveryIdentityPublicId,
    status: RecoveryStatus,
  ): Promise<RecoveryAggregate[]> {
    if (identityPublicId === undefined) {
      throw new Error('Recovery Identity public ID is required.');
    }

    if (status === undefined) {
      throw new Error('Recovery status is required.');
    }

    const records = await this.prisma.recovery.findMany({
      where: {
        identityPublicId: identityPublicId.value,
        status: status.value,
      },

      orderBy: [
        {
          requestedAt: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });

    return records.map((record) => RecoveryPrismaMapper.toDomain(record));
  }

  /**
   * Finds the most recently requested Recovery for an Identity and status.
   */
  public async findLatestByIdentityPublicIdAndStatus(
    identityPublicId: RecoveryIdentityPublicId,
    status: RecoveryStatus,
  ): Promise<RecoveryAggregate | null> {
    if (identityPublicId === undefined) {
      throw new Error('Recovery Identity public ID is required.');
    }

    if (status === undefined) {
      throw new Error('Recovery status is required.');
    }

    const record = await this.prisma.recovery.findFirst({
      where: {
        identityPublicId: identityPublicId.value,
        status: status.value,
      },

      orderBy: [
        {
          requestedAt: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });

    if (record === null) {
      return null;
    }

    return RecoveryPrismaMapper.toDomain(record);
  }

  // ===========================================================================

  // Retrieval — Identity + Type + Status

  // ===========================================================================

  /**
   * Finds Recovery aggregates associated with an Identity and restricted by
   * both Recovery type and lifecycle status.
   */
  public async findByIdentityPublicIdAndTypeAndStatus(
    identityPublicId: RecoveryIdentityPublicId,
    type: RecoveryType,
    status: RecoveryStatus,
  ): Promise<RecoveryAggregate[]> {
    if (identityPublicId === undefined) {
      throw new Error('Recovery Identity public ID is required.');
    }

    if (type === undefined) {
      throw new Error('Recovery type is required.');
    }

    if (status === undefined) {
      throw new Error('Recovery status is required.');
    }

    const records = await this.prisma.recovery.findMany({
      where: {
        identityPublicId: identityPublicId.value,
        type: type.value,
        status: status.value,
      },

      orderBy: [
        {
          requestedAt: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });

    return records.map((record) => RecoveryPrismaMapper.toDomain(record));
  }

  /**
   * Finds the most recently requested Recovery associated with an Identity
   * and restricted by both Recovery type and lifecycle status.
   */
  public async findLatestByIdentityPublicIdAndTypeAndStatus(
    identityPublicId: RecoveryIdentityPublicId,
    type: RecoveryType,
    status: RecoveryStatus,
  ): Promise<RecoveryAggregate | null> {
    if (identityPublicId === undefined) {
      throw new Error('Recovery Identity public ID is required.');
    }

    if (type === undefined) {
      throw new Error('Recovery type is required.');
    }

    if (status === undefined) {
      throw new Error('Recovery status is required.');
    }

    const record = await this.prisma.recovery.findFirst({
      where: {
        identityPublicId: identityPublicId.value,
        type: type.value,
        status: status.value,
      },

      orderBy: [
        {
          requestedAt: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });

    if (record === null) {
      return null;
    }

    return RecoveryPrismaMapper.toDomain(record);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default PrismaRecoveryRepository;
