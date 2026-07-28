import type { Permission } from '@prisma/client';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import { PermissionEntity } from '../../domain/entities/permission.entity';

import { PermissionId } from '../../domain/value-objects/permission-id.vo';

export class PermissionMapper {
  // --------------------------------------------------------------------------
  // Domain
  // --------------------------------------------------------------------------

  static toDomain(permission: Permission): PermissionEntity {
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

  // --------------------------------------------------------------------------
  // Persistence
  // --------------------------------------------------------------------------

  static toPersistence(
    entity: PermissionEntity,
  ): Omit<Permission, 'id'> & { id: string } {
    return {
      id: entity.id.value,

      publicId: entity.publicId.value,

      name: entity.name,
      code: entity.code,

      resource: entity.resource,
      action: entity.action,

      description: entity.description ?? null,

      isSystem: entity.isSystem,
      isActive: entity.isActive,

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
