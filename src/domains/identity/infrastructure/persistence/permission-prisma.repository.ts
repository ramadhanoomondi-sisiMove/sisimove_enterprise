// src/domains/identity/infrastructure/persistence/permission.prisma.repository.ts

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';

import type { PermissionRepository } from '../../domain/repositories/permission.repository';

import type { PermissionEntity } from '../../domain/entities/permission.entity';

import type { PermissionAction } from '../../domain/value-objects/permission-action.vo';
import type { PermissionCode } from '../../domain/value-objects/permission-code.vo';
import type { PermissionId } from '../../domain/value-objects/permission-id.vo';
import type { PermissionResource } from '../../domain/value-objects/permission-resource.vo';

import { PermissionPersistenceMapper } from '../mappers/permission.persistence.mapper';

@Injectable()
export class PermissionPrismaRepository implements PermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(permission: PermissionEntity): Promise<void> {
    await this.prisma.permission.create({
      data: PermissionPersistenceMapper.toPersistence(permission),
    });
  }

  async update(permission: PermissionEntity): Promise<void> {
    await this.prisma.permission.update({
      where: {
        id: permission.id.value,
      },
      data: PermissionPersistenceMapper.toPersistence(permission),
    });
  }

  async delete(permissionId: PermissionId): Promise<void> {
    await this.prisma.permission.delete({
      where: {
        id: permissionId.value,
      },
    });
  }

  async findById(permissionId: PermissionId): Promise<PermissionEntity | null> {
    const record = await this.prisma.permission.findUnique({
      where: {
        id: permissionId.value,
      },
    });

    return record ? PermissionPersistenceMapper.toDomain(record) : null;
  }

  async findByPublicId(
    publicId: PermissionId,
  ): Promise<PermissionEntity | null> {
    const record = await this.prisma.permission.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    return record ? PermissionPersistenceMapper.toDomain(record) : null;
  }

  async findByCode(code: PermissionCode): Promise<PermissionEntity | null> {
    const record = await this.prisma.permission.findUnique({
      where: {
        code: code.value,
      },
    });

    return record ? PermissionPersistenceMapper.toDomain(record) : null;
  }

  async findByResourceAndAction(
    resource: PermissionResource,
    action: PermissionAction,
  ): Promise<PermissionEntity | null> {
    const record = await this.prisma.permission.findFirst({
      where: {
        resource: resource.value,
        action: action.value,
      },
    });

    return record ? PermissionPersistenceMapper.toDomain(record) : null;
  }

  async exists(permissionId: PermissionId): Promise<boolean> {
    const count = await this.prisma.permission.count({
      where: {
        id: permissionId.value,
      },
    });

    return count > 0;
  }

  async existsByCode(code: PermissionCode): Promise<boolean> {
    const count = await this.prisma.permission.count({
      where: {
        code: code.value,
      },
    });

    return count > 0;
  }

  async existsByResourceAndAction(
    resource: PermissionResource,
    action: PermissionAction,
  ): Promise<boolean> {
    const count = await this.prisma.permission.count({
      where: {
        resource: resource.value,
        action: action.value,
      },
    });

    return count > 0;
  }
}
