// src/domains/identity/infrastructure/persistence/identity-role.prisma.repository.ts

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';

import type { IdentityRoleRepository } from '../../domain/repositories/identity-role.repository';

import type { IdentityRoleEntity } from '../../domain/entities/identity-role.entity';
import type { RoleId } from '../../domain/value-objects/role-id.vo';

import type { IdentityId } from '../../domain/value-objects/identity-id.vo';

import { IdentityRolePersistenceMapper } from '../mappers/identity-role.persistence.mapper';

@Injectable()
export class IdentityRolePrismaRepository implements IdentityRoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(identityRole: IdentityRoleEntity): Promise<void> {
    await this.prisma.identityRole.create({
      data: IdentityRolePersistenceMapper.toPersistence(identityRole),
    });
  }

  async update(identityRole: IdentityRoleEntity): Promise<void> {
    await this.prisma.identityRole.update({
      where: {
        id: identityRole.id.value,
      },
      data: IdentityRolePersistenceMapper.toPersistence(identityRole),
    });
  }

  async delete(identityId: IdentityId, roleId: RoleId): Promise<void> {
    await this.prisma.identityRole.delete({
      where: {
        identityId_roleId: {
          identityId: identityId.value,
          roleId: roleId.value,
        },
      },
    });
  }

  async findByIdentityAndRole(
    identityId: IdentityId,
    roleId: RoleId,
  ): Promise<IdentityRoleEntity | null> {
    const record = await this.prisma.identityRole.findUnique({
      where: {
        identityId_roleId: {
          identityId: identityId.value,
          roleId: roleId.value,
        },
      },
    });

    return record === null
      ? null
      : IdentityRolePersistenceMapper.toDomain(record);
  }

  async findByIdentity(
    identityId: IdentityId,
  ): Promise<readonly IdentityRoleEntity[]> {
    const records = await this.prisma.identityRole.findMany({
      where: {
        identityId: identityId.value,
      },
      orderBy: {
        assignedAt: 'desc',
      },
    });

    return records.map((record) =>
      IdentityRolePersistenceMapper.toDomain(record),
    );
  }

  async findByRole(roleId: RoleId): Promise<readonly IdentityRoleEntity[]> {
    const records = await this.prisma.identityRole.findMany({
      where: {
        roleId: roleId.value,
      },
      orderBy: {
        assignedAt: 'desc',
      },
    });

    return records.map((record) =>
      IdentityRolePersistenceMapper.toDomain(record),
    );
  }

  async exists(identityId: IdentityId, roleId: RoleId): Promise<boolean> {
    const count = await this.prisma.identityRole.count({
      where: {
        identityId: identityId.value,
        roleId: roleId.value,
      },
    });

    return count > 0;
  }
}
