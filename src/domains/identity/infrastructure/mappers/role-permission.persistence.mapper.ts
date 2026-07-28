// src/domains/identity/infrastructure/mappers/role-permission.persistence.mapper.ts

import type { RolePermission as PrismaRolePermission } from '@prisma/client';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import { PermissionId } from '../../domain/value-objects/permission-id.vo';
import { RolePermissionEntity } from '../../domain/entities/role-permission.entity';
import { RoleId } from '../../domain/value-objects/role-id.vo';

export class RolePermissionPersistenceMapper {
  static toDomain(rolePermission: PrismaRolePermission): RolePermissionEntity {
    return RolePermissionEntity.rehydrate(
      {
        roleId: new RoleId(rolePermission.roleId),
        permissionId: new PermissionId(rolePermission.permissionId),
        createdAt: rolePermission.createdAt,
      },
      new UniqueEntityId(rolePermission.id),
    );
  }

  static toPersistence(rolePermission: RolePermissionEntity) {
    return {
      id: rolePermission.id.value,

      roleId: rolePermission.roleId.value,
      permissionId: rolePermission.permissionId.value,

      createdAt: rolePermission.createdAt,
    };
  }
}
