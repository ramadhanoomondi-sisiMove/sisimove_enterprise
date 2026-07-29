// src/domains/authorization/application/query-handlers/list-permissions.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { AUTHORIZATION_PERMISSION_READ_REPOSITORY } from '../../authorization.tokens';

import type { PermissionReadRepository } from '../../repositories/permission-read.repository';

import { ListPermissionsQuery } from '../../queries/list-permissions.query';

import type { PermissionResponse } from '../../responses/permission.response';

@Injectable()
export class ListPermissionsHandler implements QueryHandler<
  ListPermissionsQuery,
  readonly PermissionResponse[]
> {
  public constructor(
    @Inject(AUTHORIZATION_PERMISSION_READ_REPOSITORY)
    private readonly permissionReadRepository: PermissionReadRepository,
  ) {}

  public async execute(
    query: ListPermissionsQuery,
  ): Promise<readonly PermissionResponse[]> {
    return this.permissionReadRepository.findAll(query.includeInactive);
  }
}
