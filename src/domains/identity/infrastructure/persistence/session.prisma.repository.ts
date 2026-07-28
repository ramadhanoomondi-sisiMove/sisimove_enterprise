// src/domains/identity/infrastructure/persistence/session.prisma.repository.ts

import { Injectable } from '@nestjs/common';
import { SessionStatus } from '@prisma/client';

import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';
import { SessionEntity } from '../../domain/entities/session.entity';
import { SessionRepository } from '../../domain/repositories/session.repository';

import { SessionPersistenceMapper } from '../mappers/session.persistence.mapper';

@Injectable()
export class SessionPrismaRepository implements SessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(session: SessionEntity): Promise<void> {
    const data = SessionPersistenceMapper.toPersistence(session);

    await this.prisma.session.create({
      data,
    });
  }

  async update(session: SessionEntity): Promise<void> {
    await this.prisma.session.update({
      where: { id: session.id.value },
      data: {
        status: session.status,
        lastActivityAt: session.lastActivityAt,
        expiresAt: session.expiresAt,
        revokedAt: session.revokedAt ?? null,
        revokedReason: session.revokedReason ?? null,
        updatedAt: session.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<SessionEntity | null> {
    const record = await this.prisma.session.findUnique({
      where: { id },
    });

    return record ? SessionPersistenceMapper.toDomain(record) : null;
  }

  async findByPublicId(publicId: string): Promise<SessionEntity | null> {
    const record = await this.prisma.session.findUnique({
      where: { publicId },
    });

    return record ? SessionPersistenceMapper.toDomain(record) : null;
  }

  async findByRefreshTokenHash(
    refreshTokenHash: string,
  ): Promise<SessionEntity | null> {
    const record = await this.prisma.session.findUnique({
      where: { refreshTokenHash },
    });

    return record ? SessionPersistenceMapper.toDomain(record) : null;
  }

  async findActiveSessionsByIdentityId(
    identityId: string,
  ): Promise<SessionEntity[]> {
    const records = await this.prisma.session.findMany({
      where: {
        identityId,
        status: SessionStatus.ACTIVE,
      },
      orderBy: {
        lastActivityAt: 'desc',
      },
    });

    return records.map((record) => SessionPersistenceMapper.toDomain(record));
  }

  async revokeAllByIdentityId(identityId: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: {
        identityId,
        status: SessionStatus.ACTIVE,
      },
      data: {
        status: SessionStatus.REVOKED,
        revokedAt: new Date(),
        revokedReason: 'USER_LOGOUT',
      },
    });
  }
}
