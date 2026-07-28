// src/domains/authorization/infrastructure/persistence/repositories/prisma-role-read.repository.ts

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../../infrastructure/database/prisma/prisma.service';

import { RoleReadRepository } from '../../../application/repositories/role-read.repository';
import { RoleResponse } from '../../../application/responses/role.response';

import { RoleResponseMapper } from '../../../presentation/rest/mappers/role-response.mapper';

@Injectable()
export class PrismaRoleReadRepository implements RoleReadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<RoleResponse | null> {
    const role = await this.prisma.role.findUnique({
      where: {
        id,
      },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return role ? RoleResponseMapper.toResponse(role) : null;
  }

  async findByPublicId(publicId: string): Promise<RoleResponse | null> {
    const role = await this.prisma.role.findUnique({
      where: {
        publicId,
      },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return role ? RoleResponseMapper.toResponse(role) : null;
  }

  async findAll(includeInactive = false): Promise<RoleResponse[]> {
    const where: Prisma.RoleWhereInput = {};

    if (!includeInactive) {
      where.isActive = true;
    }

    const roles = await this.prisma.role.findMany({
      where,
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
      orderBy: [
        {
          displayOrder: 'asc',
        },
        {
          name: 'asc',
        },
      ],
    });

    return RoleResponseMapper.toResponses(roles);
  }
}
