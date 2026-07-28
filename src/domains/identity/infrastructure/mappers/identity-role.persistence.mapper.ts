// src/domains/identity/infrastructure/mappers/identity-role.persistence.mapper.ts

import type { IdentityRole as PrismaIdentityRole } from '@prisma/client';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import { IdentityRoleEntity } from '../../domain/entities/identity-role.entity';
import { RoleId } from '../../domain/value-objects/role-id.vo';

import { IdentityId } from '../../domain/value-objects/identity-id.vo';

export class IdentityRolePersistenceMapper {
  static toDomain(identityRole: PrismaIdentityRole): IdentityRoleEntity {
    return IdentityRoleEntity.rehydrate(
      {
        identityId: new IdentityId(identityRole.identityId),
        roleId: new RoleId(identityRole.roleId),

        assignedBy:
          identityRole.assignedById !== null
            ? new IdentityId(identityRole.assignedById)
            : undefined,

        assignedAt: identityRole.assignedAt,

        expiresAt: identityRole.expiresAt ?? undefined,

        revokedAt: identityRole.revokedAt ?? undefined,

        revokedBy:
          identityRole.revokedById !== null
            ? new IdentityId(identityRole.revokedById)
            : undefined,

        createdAt: identityRole.createdAt,
        updatedAt: identityRole.updatedAt,
      },
      new UniqueEntityId(identityRole.id),
    );
  }

  static toPersistence(identityRole: IdentityRoleEntity) {
    return {
      id: identityRole.id.value,

      identityId: identityRole.identityId.value,
      roleId: identityRole.roleId.value,

      assignedById: identityRole.assignedBy?.value ?? null,
      assignedAt: identityRole.assignedAt,

      expiresAt: identityRole.expiresAt ?? null,

      revokedAt: identityRole.revokedAt ?? null,
      revokedById: identityRole.revokedBy?.value ?? null,

      createdAt: identityRole.createdAt,
      updatedAt: identityRole.updatedAt,
    };
  }
}
