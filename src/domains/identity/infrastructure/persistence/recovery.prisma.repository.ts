// src/domains/identity/infrastructure/persistence/recovery.prisma.repository.ts

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';

import type { RecoveryAggregate } from '../../domain/aggregates/recovery.aggregate';
import type { RecoveryEntity } from '../../domain/entities/recovery.entity';
import type { RecoveryRepository } from '../../domain/repositories/recovery.repository';

import type { RecoveryId } from '../../domain/value-objects/recovery-id.vo';
import { RecoveryStatus } from '../../domain/value-objects/recovery-status.enum';
import type { RecoveryType } from '../../domain/value-objects/recovery-type.enum';

import { RecoveryPersistenceMapper } from '../mappers/recovery.persistence.mapper';

@Injectable()
export class RecoveryPrismaRepository implements RecoveryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(recovery: RecoveryAggregate): Promise<void> {
    const data = RecoveryPersistenceMapper.toPersistence(recovery);

    await this.prisma.recovery.upsert({
      where: {
        id: recovery.id.value,
      },
      create: data,
      update: data,
    });
  }

  async delete(recovery: RecoveryAggregate): Promise<void> {
    await this.prisma.recovery.delete({
      where: {
        id: recovery.id.value,
      },
    });
  }

  async findById(id: string): Promise<RecoveryAggregate | null> {
    const recovery = await this.prisma.recovery.findUnique({
      where: {
        id,
      },
    });

    return recovery ? RecoveryPersistenceMapper.toDomain(recovery) : null;
  }

  async findByPublicId(
    publicId: RecoveryId,
  ): Promise<RecoveryAggregate | null> {
    const recovery = await this.prisma.recovery.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    return recovery ? RecoveryPersistenceMapper.toDomain(recovery) : null;
  }

  async findByRecoveryTokenHash(
    recoveryTokenHash: string,
  ): Promise<RecoveryAggregate | null> {
    const recovery = await this.prisma.recovery.findUnique({
      where: {
        recoveryTokenHash,
      },
    });

    return recovery ? RecoveryPersistenceMapper.toDomain(recovery) : null;
  }

  async findEntityByPublicId(
    publicId: RecoveryId,
  ): Promise<RecoveryEntity | null> {
    const recovery = await this.prisma.recovery.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    return recovery ? RecoveryPersistenceMapper.toEntity(recovery) : null;
  }

  async findByIdentityId(identityId: string): Promise<RecoveryEntity[]> {
    const recoveries = await this.prisma.recovery.findMany({
      where: {
        identityId,
      },
      orderBy: {
        requestedAt: 'desc',
      },
    });

    return recoveries.map((recovery) =>
      RecoveryPersistenceMapper.toEntity(recovery),
    );
  }

  async findByIdentityIdAndType(
    identityId: string,
    type: RecoveryType,
  ): Promise<RecoveryEntity[]> {
    const recoveries = await this.prisma.recovery.findMany({
      where: {
        identityId,
        type,
      },
      orderBy: {
        requestedAt: 'desc',
      },
    });

    return recoveries.map((recovery) =>
      RecoveryPersistenceMapper.toEntity(recovery),
    );
  }

  async findByStatus(status: RecoveryStatus): Promise<RecoveryEntity[]> {
    const recoveries = await this.prisma.recovery.findMany({
      where: {
        status,
      },
      orderBy: {
        requestedAt: 'desc',
      },
    });

    return recoveries.map((recovery) =>
      RecoveryPersistenceMapper.toEntity(recovery),
    );
  }

  async findExpired(before: Date): Promise<RecoveryAggregate[]> {
    const recoveries = await this.prisma.recovery.findMany({
      where: {
        status: RecoveryStatus.PENDING,
        expiresAt: {
          lte: before,
        },
      },
      orderBy: {
        expiresAt: 'asc',
      },
    });

    return recoveries.map((recovery) =>
      RecoveryPersistenceMapper.toDomain(recovery),
    );
  }

  async findActiveByIdentityIdAndType(
    identityId: string,
    type: RecoveryType,
  ): Promise<RecoveryAggregate | null> {
    const recovery = await this.prisma.recovery.findFirst({
      where: {
        identityId,
        type,
        status: RecoveryStatus.PENDING,
      },
      orderBy: {
        requestedAt: 'desc',
      },
    });

    return recovery ? RecoveryPersistenceMapper.toDomain(recovery) : null;
  }

  async existsActiveRecovery(
    identityId: string,
    type: RecoveryType,
  ): Promise<boolean> {
    const count = await this.prisma.recovery.count({
      where: {
        identityId,
        type,
        status: RecoveryStatus.PENDING,
      },
    });

    return count > 0;
  }
}
