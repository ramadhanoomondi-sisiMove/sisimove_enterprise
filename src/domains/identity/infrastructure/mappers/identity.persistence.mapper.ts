// src/domains/identity/infrastructure/mappers/identity.persistence.mapper.ts

import type {
  AuthenticationStatus as PrismaAuthenticationStatus,
  Identity as PrismaIdentity,
  IdentityStatus as PrismaIdentityStatus,
  IdentityType as PrismaIdentityType,
  MfaStatus as PrismaMfaStatus,
} from '@prisma/client';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import {
  IdentityAggregate,
  type IdentityStatus,
} from '../../domain/aggregates/identity.aggregate';

import type { AuthenticationEntity } from '../../domain/entities/authentication.entity';

import { Email } from '../../domain/value-objects/email.vo';
import { IdentityId } from '../../domain/value-objects/identity-id.vo';

import type { IdentityType } from '../../domain/value-objects/identity-type.enum';

export class IdentityPersistenceMapper {
  static toDomain(identity: PrismaIdentity): IdentityAggregate {
    return new IdentityAggregate(
      {
        email: new Email(identity.email),
        phoneNumber: identity.phoneNumber ?? undefined,
        type: identity.type as IdentityType,
        status: identity.status as IdentityStatus,
        createdAt: identity.createdAt,
        updatedAt: identity.updatedAt,
        activatedAt: identity.activatedAt ?? undefined,
        suspendedAt: identity.suspendedAt ?? undefined,
        closedAt: identity.closedAt ?? undefined,
      },
      new UniqueEntityId(identity.id),
      new IdentityId(identity.publicId),
    );
  }

  static toPersistence(identity: IdentityAggregate) {
    return {
      id: identity.id.value,
      publicId: identity.publicId.value,
      email: identity.email.value,
      phoneNumber: identity.phoneNumber ?? null,
      type: identity.type as PrismaIdentityType,
      status: identity.status as PrismaIdentityStatus,
      createdAt: identity.createdAt,
      updatedAt: identity.updatedAt,
      activatedAt: identity.activatedAt ?? null,
      suspendedAt: identity.suspendedAt ?? null,
      closedAt: identity.closedAt ?? null,
    };
  }

  static authenticationToPersistence(authentication: AuthenticationEntity) {
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
      lockReason: authentication.lockReason ?? null,

      lastAuthenticatedAt: authentication.lastAuthenticatedAt ?? null,

      mfaStatus: authentication.mfaStatus as PrismaMfaStatus,
      mfaMethod: authentication.mfaMethod ?? null,
      mfaSecret: authentication.mfaSecret ?? null,
      mfaEnabledAt: authentication.mfaEnabledAt ?? null,

      createdAt: authentication.createdAt,
      updatedAt: authentication.updatedAt,
    };
  }
}
