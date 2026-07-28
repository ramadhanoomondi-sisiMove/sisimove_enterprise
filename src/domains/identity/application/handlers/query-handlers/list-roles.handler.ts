import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { ROLE_READ_REPOSITORY } from '../../../application/authorization.tokens';

import type { RoleReadRepository } from '../../repositories/role-read.repository';

import { ListRolesQuery } from '../../queries/list-roles.query';

import type { RoleResponse } from '../../responses/role.response';

@Injectable()
export class ListRolesHandler implements QueryHandler<
  ListRolesQuery,
  RoleResponse[]
> {
  constructor(
    @Inject(ROLE_READ_REPOSITORY)
    private readonly roleReadRepository: RoleReadRepository,
  ) {}

  execute(query: ListRolesQuery): Promise<RoleResponse[]> {
    return this.roleReadRepository.findAll(query.includeInactive);
  }
}
