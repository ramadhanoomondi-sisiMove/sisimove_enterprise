// src/domains/identity/infrastructure/mappers/authentication.persistence.mapper.ts

import type {
  Authentication as PrismaAuthentication,
  AuthenticationFailureReason as PrismaAuthenticationFailureReason,
  AuthenticationMfaMethod as PrismaAuthenticationMfaMethod,
  AuthenticationStatus as PrismaAuthenticationStatus,
  MfaStatus as PrismaMfaStatus,
  PasswordHistory as PrismaPasswordHistory,
} from '@prisma/client';

import { UniqueEntityId } from '../../../../../foundation/kernel/domain/unique-entity-id';

import { AuthenticationAggregate } from '../../../domain/aggregates/authentication.aggregate';

import { AuthenticationEntity } from '../../../domain/entities/authentication.entity';
import { PasswordHistoryEntity } from '../../../domain/entities/password-history.entity';

import { AuthenticationId } from '../../../domain/value-objects/authentication-id.vo';

import type { AuthenticationFailureReason } from '../../../domain/value-objects/authentication-failure-reason.enum';
import type { AuthenticationMfaMethod } from '../../../domain/value-objects/authentication-mfa-method.enum';
import type { AuthenticationStatus } from '../../../domain/value-objects/authentication-status.enum';
import type { MfaStatus } from '../../../domain/value-objects/mfa-status.enum';

export class AuthenticationPersistenceMapper {
  // --------------------------------------------------------------------------
  // Aggregate
  // --------------------------------------------------------------------------

  static toDomain(
    authentication: PrismaAuthentication,
    passwordHistories: PrismaPasswordHistory[],
  ): AuthenticationAggregate {
    return AuthenticationAggregate.rehydrate(
      this.toEntity(authentication),
      passwordHistories.map((history) => this.toPasswordHistoryEntity(history)),
    );
  }

  // --------------------------------------------------------------------------
  // Authentication
  // --------------------------------------------------------------------------

  static toEntity(authentication: PrismaAuthentication): AuthenticationEntity {
    return new AuthenticationEntity(
      {
        identityId: authentication.identityId,

        status: authentication.status as AuthenticationStatus,

        passwordHash: authentication.passwordHash ?? undefined,
        passwordVersion: authentication.passwordVersion,

        passwordChangedAt: authentication.passwordChangedAt ?? undefined,

        passwordExpiresAt: authentication.passwordExpiresAt ?? undefined,

        passwordMustChange: authentication.passwordMustChange,

        failedAuthenticationCount: authentication.failedAuthenticationCount,

        lastFailedAuthenticationAt:
          authentication.lastFailedAuthenticationAt ?? undefined,

        lockedAt: authentication.lockedAt ?? undefined,
        lockedUntil: authentication.lockedUntil ?? undefined,

        lockReason:
          authentication.lockReason === null
            ? undefined
            : (authentication.lockReason as AuthenticationFailureReason),

        lastAuthenticatedAt: authentication.lastAuthenticatedAt ?? undefined,

        mfaStatus: authentication.mfaStatus as MfaStatus,

        mfaMethod:
          authentication.mfaMethod === null
            ? undefined
            : (authentication.mfaMethod as AuthenticationMfaMethod),

        mfaSecret: authentication.mfaSecret ?? undefined,

        mfaEnabledAt: authentication.mfaEnabledAt ?? undefined,

        createdAt: authentication.createdAt,
        updatedAt: authentication.updatedAt,
      },
      new UniqueEntityId(authentication.id),
      new AuthenticationId(authentication.publicId),
    );
  }

  // --------------------------------------------------------------------------
  // Password History
  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------
  // Password History
  // --------------------------------------------------------------------------

  static toPasswordHistoryEntity(
    history: PrismaPasswordHistory,
  ): PasswordHistoryEntity {
    return new PasswordHistoryEntity(
      {
        authenticationId: history.authenticationId,
        passwordHash: history.passwordHash,
        version: history.version,
        createdAt: history.createdAt,
      },
      new UniqueEntityId(history.id),
    );
  }

  // --------------------------------------------------------------------------
  // Persistence
  // --------------------------------------------------------------------------

  static toPersistence(aggregate: AuthenticationAggregate) {
    const authentication = aggregate.authentication;

    return {
      id: authentication.id.value,

      publicId: authentication.publicId.value,

      identityId: authentication.identityId,

      status: authentication.status as PrismaAuthenticationStatus,

      passwordHash: authentication.passwordHash ?? null,

      passwordVersion: authentication.passwordVersion,

      passwordChangedAt: authentication.passwordChangedAt ?? null,

      passwordExpiresAt: authentication.passwordExpiresAt ?? null,

      passwordMustChange: authentication.passwordMustChange,

      failedAuthenticationCount: authentication.failedAuthenticationCount,

      lastFailedAuthenticationAt:
        authentication.lastFailedAuthenticationAt ?? null,

      lockedAt: authentication.lockedAt ?? null,

      lockedUntil: authentication.lockedUntil ?? null,

      lockReason:
        authentication.lockReason === undefined
          ? null
          : (authentication.lockReason as PrismaAuthenticationFailureReason),

      lastAuthenticatedAt: authentication.lastAuthenticatedAt ?? null,

      mfaStatus: authentication.mfaStatus as PrismaMfaStatus,

      mfaMethod:
        authentication.mfaMethod === undefined
          ? null
          : (authentication.mfaMethod as PrismaAuthenticationMfaMethod),

      mfaSecret: authentication.mfaSecret ?? null,

      mfaEnabledAt: authentication.mfaEnabledAt ?? null,

      createdAt: authentication.createdAt,
      updatedAt: authentication.updatedAt,
    };
  }

  static passwordHistoryToPersistence(history: PasswordHistoryEntity) {
    return {
      id: history.id.value,

      authenticationId: history.authenticationId,

      passwordHash: history.passwordHash,

      version: history.version,

      createdAt: history.createdAt,
    };
  }
}
