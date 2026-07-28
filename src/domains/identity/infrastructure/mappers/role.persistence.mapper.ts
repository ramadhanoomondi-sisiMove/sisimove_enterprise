// src/domains/identity/infrastructure/mappers/role.persistence.mapper.ts

import type { Role as PrismaRole } from '@prisma/client';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import { RoleEntity } from '../../domain/entities/role.entity';
import { RoleId } from '../../domain/value-objects/role-id.vo';

export class RolePersistenceMapper {
  static toDomain(role: PrismaRole): RoleEntity {
    return RoleEntity.rehydrate(
      {
        publicId: new RoleId(role.publicId),

        name: role.name,
        code: role.code,

        description: role.description ?? undefined,
        displayOrder: role.displayOrder,

        isSystem: role.isSystem,
        isActive: role.isActive,

        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      },
      new UniqueEntityId(role.id),
    );
  }

  static toPersistence(role: RoleEntity) {
    return {
      id: role.id.value,

      publicId: role.publicId.value,

      name: role.name,
      code: role.code,

      description: role.description ?? null,
      displayOrder: role.displayOrder,

      isSystem: role.isSystem,
      isActive: role.isActive,

      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }
}
