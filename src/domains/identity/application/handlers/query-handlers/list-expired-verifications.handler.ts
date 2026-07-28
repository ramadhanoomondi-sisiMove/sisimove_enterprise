// src/domains/identity/application/queries/handlers/list-expired-verifications.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import type { VerificationListItem } from '../../contracts/verification-list-item';
import type { VerificationQueryService } from '../../services/verification-query.service';

import { ListExpiredVerificationsQuery } from '../../queries/list-expired-verifications.query';

@Injectable()
export class ListExpiredVerificationsHandler implements QueryHandler<
  ListExpiredVerificationsQuery,
  VerificationListItem[]
> {
  constructor(
    @Inject('VerificationQueryService')
    private readonly queryService: VerificationQueryService,
  ) {}

  execute(
    query: ListExpiredVerificationsQuery,
  ): Promise<VerificationListItem[]> {
    void query;

    return this.queryService.findExpired();
  }
}
