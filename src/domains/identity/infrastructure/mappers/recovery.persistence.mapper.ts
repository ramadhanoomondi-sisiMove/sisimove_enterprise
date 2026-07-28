// src/domains/identity/infrastructure/persistence/recovery.persistence.mapper.ts

import type {
  Recovery as PrismaRecovery,
  RecoveryFailureReason as PrismaRecoveryFailureReason,
  RecoveryStatus as PrismaRecoveryStatus,
  RecoveryType as PrismaRecoveryType,
} from '@prisma/client';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import { RecoveryAggregate } from '../../domain/aggregates/recovery.aggregate';
import { RecoveryEntity } from '../../domain/entities/recovery.entity';

import { IdentityId } from '../../domain/value-objects/identity-id.vo';
import type { RecoveryFailureReason } from '../../domain/value-objects/recovery-failure-reason.enum';
import { RecoveryId } from '../../domain/value-objects/recovery-id.vo';
import type { RecoveryStatus } from '../../domain/value-objects/recovery-status.enum';
import type { RecoveryType } from '../../domain/value-objects/recovery-type.enum';

export class RecoveryPersistenceMapper {
  static toDomain(recovery: PrismaRecovery): RecoveryAggregate {
    return new RecoveryAggregate(
      {
        identityId: recovery.identityId,

        type: recovery.type as RecoveryType,
        status: recovery.status as RecoveryStatus,

        recoveryTokenHash: recovery.recoveryTokenHash ?? undefined,

        requestedAt: recovery.requestedAt,
        expiresAt: recovery.expiresAt,

        completedAt: recovery.completedAt ?? undefined,
        cancelledAt: recovery.cancelledAt ?? undefined,

        failureReason:
          (recovery.failureReason as RecoveryFailureReason | null) ?? undefined,

        createdAt: recovery.createdAt,
        updatedAt: recovery.updatedAt,
      },
      new UniqueEntityId(recovery.id),
      new RecoveryId(recovery.publicId),
    );
  }

  static toEntity(recovery: PrismaRecovery): RecoveryEntity {
    return new RecoveryEntity(
      {
        publicId: new RecoveryId(recovery.publicId),

        identityId: new IdentityId(recovery.identityId),

        type: recovery.type as RecoveryType,
        status: recovery.status as RecoveryStatus,

        requestedAt: recovery.requestedAt,
        expiresAt: recovery.expiresAt,

        createdAt: recovery.createdAt,
        updatedAt: recovery.updatedAt,

        recoveryTokenHash: recovery.recoveryTokenHash ?? undefined,

        completedAt: recovery.completedAt ?? undefined,

        cancelledAt: recovery.cancelledAt ?? undefined,

        failureReason:
          (recovery.failureReason as RecoveryFailureReason | null) ?? undefined,
      },
      new UniqueEntityId(recovery.id),
    );
  }

  static toPersistence(recovery: RecoveryAggregate) {
    return {
      id: recovery.id.value,
      publicId: recovery.publicId.value,

      identityId: recovery.identityId,

      type: recovery.type as PrismaRecoveryType,
      status: recovery.status as PrismaRecoveryStatus,

      recoveryTokenHash: recovery.recoveryTokenHash ?? null,

      requestedAt: recovery.requestedAt,
      expiresAt: recovery.expiresAt,

      completedAt: recovery.completedAt ?? null,
      cancelledAt: recovery.cancelledAt ?? null,

      failureReason:
        (recovery.failureReason as PrismaRecoveryFailureReason | undefined) ??
        null,

      createdAt: recovery.createdAt,
      updatedAt: recovery.updatedAt,
    };
  }
}
