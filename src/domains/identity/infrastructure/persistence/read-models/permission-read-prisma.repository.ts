// src/domains/authorization/infrastructure/persistence/repositories/prisma-permission-read.repository.ts

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../../infrastructure/database/prisma/prisma.service';

import { PermissionReadRepository } from '../../../application/repositories/permission-read.repository';
import { PermissionResponse } from '../../../application/responses/permission.response';

import { PermissionResponseMapper } from '../../../presentation/rest/mappers/permission-response.mapper';

@Injectable()
export class PermissionReadPrismaRepository implements PermissionReadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<PermissionResponse | null> {
    const permission = await this.prisma.permission.findUnique({
      where: {
        id,
      },
    });

    return permission ? PermissionResponseMapper.toResponse(permission) : null;
  }

  async findByPublicId(publicId: string): Promise<PermissionResponse | null> {
    const permission = await this.prisma.permission.findUnique({
      where: {
        publicId,
      },
    });

    return permission ? PermissionResponseMapper.toResponse(permission) : null;
  }

  async findAll(includeInactive = false): Promise<PermissionResponse[]> {
    const where: Prisma.PermissionWhereInput = {};

    if (!includeInactive) {
      where.isActive = true;
    }

    const permissions = await this.prisma.permission.findMany({
      where,
      orderBy: [
        {
          resource: 'asc',
        },
        {
          action: 'asc',
        },
      ],
    });

    return PermissionResponseMapper.toResponses(permissions);
  }
}
