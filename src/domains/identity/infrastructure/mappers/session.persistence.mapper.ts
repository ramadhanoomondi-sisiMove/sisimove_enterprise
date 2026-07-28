// src/domains/identity/infrastructure/persistence/session.persistence.mapper.ts

import type {
  Session as PrismaSession,
  SessionStatus as PrismaSessionStatus,
  SessionRevocationReason as PrismaSessionRevocationReason,
} from '@prisma/client';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';
import type {
  SessionStatus,
  SessionRevocationReason,
} from '../../domain/entities/session.entity';
import { SessionEntity } from '../../domain/entities/session.entity';
import { IdentityId } from '../../domain/value-objects/identity-id.vo';

export class SessionPersistenceMapper {
  static toDomain(session: PrismaSession): SessionEntity {
    return new SessionEntity(
      {
        identityId: session.identityId,
        deviceId: session.deviceId ?? undefined,
        status: session.status as SessionStatus,
        refreshTokenHash: session.refreshTokenHash,
        ipAddress: session.ipAddress ?? undefined,
        userAgent: session.userAgent ?? undefined,
        countryCode: session.countryCode ?? undefined,
        city: session.city ?? undefined,
        authenticatedAt: session.authenticatedAt,
        lastActivityAt: session.lastActivityAt,
        expiresAt: session.expiresAt,
        revokedAt: session.revokedAt ?? undefined,
        revokedReason:
          (session.revokedReason as SessionRevocationReason) ?? undefined,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      },
      new UniqueEntityId(session.id),
      new IdentityId(session.publicId),
    );
  }

  static toPersistence(session: SessionEntity) {
    return {
      id: session.id.value,
      publicId: session.publicId.value,
      identityId: session.identityId,
      deviceId: session.deviceId ?? null,
      status: session.status as PrismaSessionStatus,
      refreshTokenHash: session.refreshTokenHash,
      ipAddress: session.ipAddress ?? null,
      userAgent: session.userAgent ?? null,
      countryCode: session.countryCode ?? null,
      city: session.city ?? null,
      authenticatedAt: session.authenticatedAt,
      lastActivityAt: session.lastActivityAt,
      expiresAt: session.expiresAt,
      revokedAt: session.revokedAt ?? null,
      revokedReason:
        (session.revokedReason as PrismaSessionRevocationReason) ?? null,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }
}
