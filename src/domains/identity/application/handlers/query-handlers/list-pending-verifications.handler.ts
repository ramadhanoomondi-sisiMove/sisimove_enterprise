// src/domains/identity/application/queries/handlers/list-pending-verifications.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { IDENTITY_VERIFICATION_QUERY_SERVICE } from '../../identity.tokens';

import type { VerificationListItem } from '../../contracts/verification-list-item';
import { ListPendingVerificationsQuery } from '../../queries/list-pending-verifications.query';
import type { VerificationQueryService } from '../../services/verification-query.service';

@Injectable()
export class ListPendingVerificationsHandler implements QueryHandler<
  ListPendingVerificationsQuery,
  VerificationListItem[]
> {
  public constructor(
    @Inject(IDENTITY_VERIFICATION_QUERY_SERVICE)
    private readonly queryService: VerificationQueryService,
  ) {}

  public execute(
    query: ListPendingVerificationsQuery,
  ): Promise<VerificationListItem[]> {
    void query;

    return this.queryService.findPending();
  }
}
