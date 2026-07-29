// src/domains/identity/infrastructure/persistence/role.prisma.repository.ts

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';

import { RoleAggregate } from '../../domain/aggregates/role.aggregate';
import type { RoleRepository } from '../../domain/repositories/role.repository';

import { RoleCode } from '../../domain/value-objects/role-code.vo';
import { RoleId } from '../../domain/value-objects/role-id.vo';
import { RoleName } from '../../domain/value-objects/role-name.vo';

import { RolePersistenceMapper } from '../mappers/role.persistence.mapper';
import { RolePermissionPersistenceMapper } from '../mappers/role-permission.persistence.mapper';

@Injectable()
export class RolePrismaRepository implements RoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(role: RoleAggregate): Promise<void> {
    const roleData = RolePersistenceMapper.toPersistence(role.role);

    const rolePermissions = role.rolePermissions.map((permission) =>
      RolePermissionPersistenceMapper.toPersistence(permission),
    );

    await this.prisma.$transaction(async (tx) => {
      await tx.role.create({
        data: roleData,
      });

      if (rolePermissions.length > 0) {
        await tx.rolePermission.createMany({
          data: rolePermissions,
        });
      }
    });
  }

  async update(role: RoleAggregate): Promise<void> {
    const roleData = RolePersistenceMapper.toPersistence(role.role);

    const rolePermissions = role.rolePermissions.map((permission) =>
      RolePermissionPersistenceMapper.toPersistence(permission),
    );

    await this.prisma.$transaction(async (tx) => {
      await tx.role.update({
        where: {
          id: role.id.value,
        },
        data: roleData,
      });

      await tx.rolePermission.deleteMany({
        where: {
          roleId: role.publicId.value,
        },
      });

      if (rolePermissions.length > 0) {
        await tx.rolePermission.createMany({
          data: rolePermissions,
        });
      }
    });
  }

  async delete(roleId: RoleId): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.rolePermission.deleteMany({
        where: {
          roleId: roleId.value,
        },
      });

      await tx.role.delete({
        where: {
          publicId: roleId.value,
        },
      });
    });
  }

  async findById(roleId: RoleId): Promise<RoleAggregate | null> {
    const record = await this.prisma.role.findUnique({
      where: {
        id: roleId.value,
      },
      include: {
        rolePermissions: true,
      },
    });

    if (!record) {
      return null;
    }

    return RoleAggregate.rehydrate(
      RolePersistenceMapper.toDomain(record),
      record.rolePermissions.map((permission) =>
        RolePermissionPersistenceMapper.toDomain(permission),
      ),
    );
  }

  async findByPublicId(publicId: RoleId): Promise<RoleAggregate | null> {
    const record = await this.prisma.role.findUnique({
      where: {
        publicId: publicId.value,
      },
      include: {
        rolePermissions: true,
      },
    });

    if (!record) {
      return null;
    }

    return RoleAggregate.rehydrate(
      RolePersistenceMapper.toDomain(record),
      record.rolePermissions.map((permission) =>
        RolePermissionPersistenceMapper.toDomain(permission),
      ),
    );
  }

  async findByName(name: RoleName): Promise<RoleAggregate | null> {
    const record = await this.prisma.role.findUnique({
      where: {
        name: name.value,
      },
      include: {
        rolePermissions: true,
      },
    });

    if (!record) {
      return null;
    }

    return RoleAggregate.rehydrate(
      RolePersistenceMapper.toDomain(record),
      record.rolePermissions.map((permission) =>
        RolePermissionPersistenceMapper.toDomain(permission),
      ),
    );
  }

  async findByCode(code: RoleCode): Promise<RoleAggregate | null> {
    const record = await this.prisma.role.findUnique({
      where: {
        code: code.value,
      },
      include: {
        rolePermissions: true,
      },
    });

    if (!record) {
      return null;
    }

    return RoleAggregate.rehydrate(
      RolePersistenceMapper.toDomain(record),
      record.rolePermissions.map((permission) =>
        RolePermissionPersistenceMapper.toDomain(permission),
      ),
    );
  }

  async exists(roleId: RoleId): Promise<boolean> {
    const count = await this.prisma.role.count({
      where: {
        publicId: roleId.value,
      },
    });

    return count > 0;
  }

  async existsByName(name: RoleName): Promise<boolean> {
    const count = await this.prisma.role.count({
      where: {
        name: name.value,
      },
    });

    return count > 0;
  }

  async existsByCode(code: RoleCode): Promise<boolean> {
    const count = await this.prisma.role.count({
      where: {
        code: code.value,
      },
    });

    return count > 0;
  }
}
