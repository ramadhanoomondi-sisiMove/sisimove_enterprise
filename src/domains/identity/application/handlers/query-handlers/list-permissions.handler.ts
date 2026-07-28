// src/domains/authorization/application/handlers/query-handlers/list-permissions.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { PERMISSION_READ_REPOSITORY } from '../../../application/authorization.tokens';

import type { PermissionReadRepository } from '../../repositories/permission-read.repository';

import { ListPermissionsQuery } from '../../queries/list-permissions.query';

import type { PermissionResponse } from '../../responses/permission.response';

@Injectable()
export class ListPermissionsHandler implements QueryHandler<
  ListPermissionsQuery,
  readonly PermissionResponse[]
> {
  constructor(
    @Inject(PERMISSION_READ_REPOSITORY)
    private readonly permissionReadRepository: PermissionReadRepository,
  ) {}

  async execute(
    query: ListPermissionsQuery,
  ): Promise<readonly PermissionResponse[]> {
    return this.permissionReadRepository.findAll(query.includeInactive);
  }
}
