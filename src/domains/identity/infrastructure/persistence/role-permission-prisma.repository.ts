// src/domains/identity/infrastructure/persistence/role-permission.prisma.repository.ts

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';

import { RolePermissionEntity } from '../../domain/entities/role-permission.entity';

import type { RolePermissionRepository } from '../../domain/repositories/role-permission.repository';

import type { PermissionId } from '../../domain/value-objects/permission-id.vo';
import type { RoleId } from '../../domain/value-objects/role-id.vo';

import { RolePermissionPersistenceMapper } from '../mappers/role-permission.persistence.mapper';

@Injectable()
export class RolePermissionPrismaRepository implements RolePermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(rolePermission: RolePermissionEntity): Promise<void> {
    const data = RolePermissionPersistenceMapper.toPersistence(rolePermission);

    await this.prisma.rolePermission.create({
      data,
    });
  }

  async delete(roleId: RoleId, permissionId: PermissionId): Promise<void> {
    await this.prisma.rolePermission.delete({
      where: {
        roleId_permissionId: {
          roleId: roleId.value,
          permissionId: permissionId.value,
        },
      },
    });
  }

  async findByRoleAndPermission(
    roleId: RoleId,
    permissionId: PermissionId,
  ): Promise<RolePermissionEntity | null> {
    const record = await this.prisma.rolePermission.findUnique({
      where: {
        roleId_permissionId: {
          roleId: roleId.value,
          permissionId: permissionId.value,
        },
      },
    });

    if (!record) {
      return null;
    }

    return RolePermissionPersistenceMapper.toDomain(record);
  }

  async findByRole(roleId: RoleId): Promise<readonly RolePermissionEntity[]> {
    const records = await this.prisma.rolePermission.findMany({
      where: {
        roleId: roleId.value,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      RolePermissionPersistenceMapper.toDomain(record),
    );
  }

  async findByPermission(
    permissionId: PermissionId,
  ): Promise<readonly RolePermissionEntity[]> {
    const records = await this.prisma.rolePermission.findMany({
      where: {
        permissionId: permissionId.value,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      RolePermissionPersistenceMapper.toDomain(record),
    );
  }

  async exists(roleId: RoleId, permissionId: PermissionId): Promise<boolean> {
    const count = await this.prisma.rolePermission.count({
      where: {
        roleId: roleId.value,
        permissionId: permissionId.value,
      },
    });

    return count > 0;
  }
}
