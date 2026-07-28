// src/domains/authorization/application/handlers/get-identity-roles.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import {
  AUTHORIZATION_IDENTITY_ROLE_REPOSITORY,
  AUTHORIZATION_ROLE_REPOSITORY,
} from '../../authorization.tokens';

import { GetIdentityRolesQuery } from '../../queries/get-identity-roles.query';

import type { IdentityRoleRepository } from '../../../domain/repositories/identity-role.repository';
import type { RoleRepository } from '../../../domain/repositories/role.repository';

import { IdentityId } from '../../../../identity/domain/value-objects/identity-id.vo';

export interface IdentityRoleResponse {
  rolePublicId: string;
  roleCode: string;
  roleName: string;
  assignedAt: Date;
}

@Injectable()
export class GetIdentityRolesHandler implements QueryHandler<
  GetIdentityRolesQuery,
  IdentityRoleResponse[]
> {
  constructor(
    @Inject(AUTHORIZATION_IDENTITY_ROLE_REPOSITORY)
    private readonly identityRoleRepository: IdentityRoleRepository,

    @Inject(AUTHORIZATION_ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepository,
  ) {}

  async execute(query: GetIdentityRolesQuery): Promise<IdentityRoleResponse[]> {
    const identityId = new IdentityId(query.identityPublicId);

    const assignments =
      await this.identityRoleRepository.findByIdentity(identityId);

    const responses: IdentityRoleResponse[] = [];

    for (const assignment of assignments) {
      if (!assignment.isActive()) {
        continue;
      }

      const role = await this.roleRepository.findByPublicId(assignment.roleId);

      if (!role) {
        continue;
      }

      responses.push({
        rolePublicId: role.publicId.value,
        roleCode: role.code,
        roleName: role.name,
        assignedAt: assignment.assignedAt,
      });
    }

    return responses;
  }
}
