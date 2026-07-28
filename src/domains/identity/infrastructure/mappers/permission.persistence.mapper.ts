// src/domains/identity/infrastructure/mappers/permission.persistence.mapper.ts

import type { Permission as PrismaPermission } from '@prisma/client';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import { PermissionEntity } from '../../domain/entities/permission.entity';
import { PermissionId } from '../../domain/value-objects/permission-id.vo';

export class PermissionPersistenceMapper {
  static toDomain(permission: PrismaPermission): PermissionEntity {
    return PermissionEntity.rehydrate(
      {
        publicId: new PermissionId(permission.publicId),

        name: permission.name,
        code: permission.code,

        resource: permission.resource,
        action: permission.action,

        description: permission.description ?? undefined,

        isSystem: permission.isSystem,
        isActive: permission.isActive,

        createdAt: permission.createdAt,
        updatedAt: permission.updatedAt,
      },
      new UniqueEntityId(permission.id),
    );
  }

  static toPersistence(permission: PermissionEntity) {
    return {
      id: permission.id.value,

      publicId: permission.permissionId.value,

      name: permission.name,
      code: permission.code,

      resource: permission.resource,
      action: permission.action,

      description: permission.description ?? null,

      isSystem: permission.isSystem,
      isActive: permission.isActive,

      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    };
  }
}
