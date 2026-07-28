// src/domains/authorization/application/handlers/get-identity-permissions.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import {
  AUTHORIZATION_IDENTITY_ROLE_REPOSITORY,
  AUTHORIZATION_PERMISSION_REPOSITORY,
  AUTHORIZATION_ROLE_PERMISSION_REPOSITORY,
} from '../../authorization.tokens';

import { GetIdentityPermissionsQuery } from '../../queries/get-identity-permissions.query';

import type { IdentityRoleRepository } from '../../../domain/repositories/identity-role.repository';
import type { PermissionRepository } from '../../../domain/repositories/permission.repository';
import type { RolePermissionRepository } from '../../../domain/repositories/role-permission.repository';

import { IdentityId } from '../../../../identity/domain/value-objects/identity-id.vo';

@Injectable()
export class GetIdentityPermissionsHandler implements QueryHandler<
  GetIdentityPermissionsQuery,
  string[]
> {
  constructor(
    @Inject(AUTHORIZATION_IDENTITY_ROLE_REPOSITORY)
    private readonly identityRoleRepository: IdentityRoleRepository,

    @Inject(AUTHORIZATION_ROLE_PERMISSION_REPOSITORY)
    private readonly rolePermissionRepository: RolePermissionRepository,

    @Inject(AUTHORIZATION_PERMISSION_REPOSITORY)
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async execute(query: GetIdentityPermissionsQuery): Promise<string[]> {
    const identityId = new IdentityId(query.identityId);

    const identityRoles =
      await this.identityRoleRepository.findByIdentity(identityId);

    const permissionCodes = new Set<string>();

    for (const identityRole of identityRoles) {
      if (!identityRole.isActive()) {
        continue;
      }

      const rolePermissions = await this.rolePermissionRepository.findByRole(
        identityRole.roleId,
      );

      for (const rolePermission of rolePermissions) {
        const permission = await this.permissionRepository.findById(
          rolePermission.permissionId,
        );

        if (permission?.isActive) {
          permissionCodes.add(permission.code);
        }
      }
    }

    return [...permissionCodes];
  }
}
