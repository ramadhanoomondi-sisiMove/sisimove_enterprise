// src/domains/authorization/application/handlers/get-role-permissions.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import {
  AUTHORIZATION_PERMISSION_REPOSITORY,
  AUTHORIZATION_ROLE_PERMISSION_REPOSITORY,
  AUTHORIZATION_ROLE_REPOSITORY,
} from '../../authorization.tokens';

import { GetRolePermissionsQuery } from '../../queries/get-role-permissions.query';

import type { PermissionRepository } from '../../../domain/repositories/permission.repository';
import type { RolePermissionRepository } from '../../../domain/repositories/role-permission.repository';
import type { RoleRepository } from '../../../domain/repositories/role.repository';

import { RoleCode } from '../../../domain/value-objects/role-code.vo';

export interface RolePermissionResponse {
  permissionPublicId: string;
  permissionCode: string;
  permissionName: string;
  resource: string;
  action: string;
  assignedAt: Date;
}

@Injectable()
export class GetRolePermissionsHandler implements QueryHandler<
  GetRolePermissionsQuery,
  RolePermissionResponse[]
> {
  constructor(
    @Inject(AUTHORIZATION_ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepository,

    @Inject(AUTHORIZATION_ROLE_PERMISSION_REPOSITORY)
    private readonly rolePermissionRepository: RolePermissionRepository,

    @Inject(AUTHORIZATION_PERMISSION_REPOSITORY)
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async execute(
    query: GetRolePermissionsQuery,
  ): Promise<RolePermissionResponse[]> {
    const roleCode = new RoleCode(query.roleCode);

    const role = await this.roleRepository.findByCode(roleCode);

    if (!role) {
      return [];
    }

    const rolePermissions = await this.rolePermissionRepository.findByRole(
      role.publicId,
    );

    const responses: RolePermissionResponse[] = [];

    for (const rolePermission of rolePermissions) {
      const permission = await this.permissionRepository.findById(
        rolePermission.permissionId,
      );

      if (!permission) {
        continue;
      }

      responses.push({
        permissionPublicId: permission.publicId.value,
        permissionCode: permission.code,
        permissionName: permission.name,
        resource: permission.resource,
        action: permission.action,
        assignedAt: rolePermission.createdAt,
      });
    }

    return responses;
  }
}
