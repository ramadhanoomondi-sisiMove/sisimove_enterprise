// src/domains/authorization/application/handlers/query-handlers/get-role.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { ROLE_READ_REPOSITORY } from '../../../application/authorization.tokens';

import type { RoleReadRepository } from '../../repositories/role-read.repository';

import { GetRoleQuery } from '../../queries/get-role.query';

import type { RoleResponse } from '../../responses/role.response';

import { RoleNotFoundException } from '../../../domain/exceptions/role-not-found.exception';

@Injectable()
export class GetRoleHandler implements QueryHandler<
  GetRoleQuery,
  RoleResponse
> {
  constructor(
    @Inject(ROLE_READ_REPOSITORY)
    private readonly roleReadRepository: RoleReadRepository,
  ) {}

  async execute(query: GetRoleQuery): Promise<RoleResponse> {
    const role = await this.roleReadRepository.findByPublicId(query.roleId);

    if (!role) {
      throw new RoleNotFoundException(query.roleId);
    }

    return role;
  }
}
