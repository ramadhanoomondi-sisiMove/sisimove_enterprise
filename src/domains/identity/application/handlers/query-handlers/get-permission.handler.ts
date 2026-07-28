// src/domains/authorization/application/handlers/query-handlers/get-permission.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { PERMISSION_READ_REPOSITORY } from '../../../application/authorization.tokens';

import type { PermissionReadRepository } from '../../repositories/permission-read.repository';

import { GetPermissionQuery } from '../../queries/get-permission.query';

import type { PermissionResponse } from '../../responses/permission.response';

import { PermissionNotFoundException } from '../../../domain/exceptions/permission-not-found.exception';

@Injectable()
export class GetPermissionHandler implements QueryHandler<
  GetPermissionQuery,
  PermissionResponse
> {
  constructor(
    @Inject(PERMISSION_READ_REPOSITORY)
    private readonly permissionReadRepository: PermissionReadRepository,
  ) {}

  async execute(query: GetPermissionQuery): Promise<PermissionResponse> {
    const permission = await this.permissionReadRepository.findByPublicId(
      query.permissionId,
    );

    if (!permission) {
      throw new PermissionNotFoundException(query.permissionId);
    }

    return permission;
  }
}
