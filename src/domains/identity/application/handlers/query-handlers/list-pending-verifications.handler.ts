// src/domains/identity/application/queries/handlers/list-pending-verifications.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import type { VerificationListItem } from '../../contracts/verification-list-item';
import type { VerificationQueryService } from '../../services/verification-query.service';

import { ListPendingVerificationsQuery } from '../../queries/list-pending-verifications.query';

@Injectable()
export class ListPendingVerificationsHandler implements QueryHandler<
  ListPendingVerificationsQuery,
  VerificationListItem[]
> {
  constructor(
    @Inject('VerificationQueryService')
    private readonly queryService: VerificationQueryService,
  ) {}

  execute(
    query: ListPendingVerificationsQuery,
  ): Promise<VerificationListItem[]> {
    void query;

    return this.queryService.findPending();
  }
}
