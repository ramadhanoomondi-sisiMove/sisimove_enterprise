// src/domains/authorization/application/handlers/query-handlers/list-roles.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { AUTHORIZATION_ROLE_READ_REPOSITORY } from '../../authorization.tokens';

import type { RoleReadRepository } from '../../repositories/role-read.repository';

import { ListRolesQuery } from '../../queries/list-roles.query';

import type { RoleResponse } from '../../responses/role.response';

@Injectable()
export class ListRolesHandler implements QueryHandler<
  ListRolesQuery,
  readonly RoleResponse[]
> {
  public constructor(
    @Inject(AUTHORIZATION_ROLE_READ_REPOSITORY)
    private readonly roleReadRepository: RoleReadRepository,
  ) {}

  public async execute(
    query: ListRolesQuery,
  ): Promise<readonly RoleResponse[]> {
    return this.roleReadRepository.findAll(query.includeInactive);
  }
}
