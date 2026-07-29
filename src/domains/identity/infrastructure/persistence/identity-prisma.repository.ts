// src/domains/identity/infrastructure/persistence/identity.prisma.repository.ts

import { Injectable } from '@nestjs/common';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';
import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';

import { IdentityAggregate } from '../../domain/aggregates/identity.aggregate';
import { AuthenticationEntity } from '../../domain/entities/authentication.entity';

import type { IdentityRepository } from '../../domain/repositories/identity.repository';

import { AuthenticationId } from '../../domain/value-objects/authentication-id.vo';
import type { AuthenticationFailureReason } from '../../domain/value-objects/authentication-failure-reason.enum';
import type { AuthenticationMfaMethod } from '../../domain/value-objects/authentication-mfa-method.enum';
import { AuthenticationStatus } from '../../domain/value-objects/authentication-status.enum';
import { Email } from '../../domain/value-objects/email.vo';
import { IdentityId } from '../../domain/value-objects/identity-id.vo';
import { MfaStatus } from '../../domain/value-objects/mfa-status.enum';

import { IdentityPersistenceMapper } from '../mappers/identity.persistence.mapper';

@Injectable()
export class IdentityPrismaRepository implements IdentityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(
    identity: IdentityAggregate,
    authentication: AuthenticationEntity,
  ): Promise<void> {
    const identityData = IdentityPersistenceMapper.toPersistence(identity);

    const authenticationData =
      IdentityPersistenceMapper.authenticationToPersistence(authentication);

    await this.prisma.$transaction(async (tx) => {
      await tx.identity.create({
        data: identityData,
      });

      await tx.authentication.create({
        data: authenticationData,
      });
    });
  }

  async update(identity: IdentityAggregate): Promise<void> {
    const data = IdentityPersistenceMapper.toPersistence(identity);

    await this.prisma.identity.update({
      where: {
        id: identity.id.value,
      },
      data,
    });
  }

  async findById(id: IdentityId): Promise<IdentityAggregate | null> {
    const record = await this.prisma.identity.findUnique({
      where: {
        id: id.value,
      },
    });

    return record ? IdentityPersistenceMapper.toDomain(record) : null;
  }

  async findByEmail(email: Email): Promise<IdentityAggregate | null> {
    const record = await this.prisma.identity.findUnique({
      where: {
        email: email.value,
      },
    });

    return record ? IdentityPersistenceMapper.toDomain(record) : null;
  }

  async findByPublicId(
    publicId: IdentityId,
  ): Promise<IdentityAggregate | null> {
    const record = await this.prisma.identity.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    return record ? IdentityPersistenceMapper.toDomain(record) : null;
  }

  async findAuthenticationByIdentityId(
    identityId: string,
  ): Promise<AuthenticationEntity | null> {
    const record = await this.prisma.authentication.findUnique({
      where: {
        identityId,
      },
    });

    if (!record || record.passwordHash === null) {
      return null;
    }

    return new AuthenticationEntity(
      {
        identityId: record.identityId,

        status: record.status as AuthenticationStatus,

        passwordHash: record.passwordHash,
        passwordVersion: record.passwordVersion,

        passwordChangedAt: record.passwordChangedAt ?? undefined,
        passwordExpiresAt: record.passwordExpiresAt ?? undefined,
        passwordMustChange: record.passwordMustChange,

        failedAuthenticationCount: record.failedAuthenticationCount,
        lastFailedAuthenticationAt:
          record.lastFailedAuthenticationAt ?? undefined,

        lockedAt: record.lockedAt ?? undefined,
        lockedUntil: record.lockedUntil ?? undefined,
        lockReason:
          (record.lockReason as AuthenticationFailureReason | null) ??
          undefined,

        lastAuthenticatedAt: record.lastAuthenticatedAt ?? undefined,

        mfaStatus: record.mfaStatus as MfaStatus,
        mfaMethod:
          (record.mfaMethod as AuthenticationMfaMethod | null) ?? undefined,
        mfaSecret: record.mfaSecret ?? undefined,
        mfaEnabledAt: record.mfaEnabledAt ?? undefined,

        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },
      new UniqueEntityId(record.id),
      new AuthenticationId(record.publicId),
    );
  }
}
