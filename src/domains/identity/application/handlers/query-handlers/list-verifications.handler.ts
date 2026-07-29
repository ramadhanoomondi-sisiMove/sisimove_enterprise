// src/domains/identity/application/queries/handlers/list-verifications.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { IDENTITY_VERIFICATION_QUERY_SERVICE } from '../../identity.tokens';

import type { VerificationListItem } from '../../contracts/verification-list-item';
import type { VerificationQueryService } from '../../services/verification-query.service';

import { ListVerificationsQuery } from '../../queries/list-verifications.query';

@Injectable()
export class ListVerificationsHandler implements QueryHandler<
  ListVerificationsQuery,
  VerificationListItem[]
> {
  public constructor(
    @Inject(IDENTITY_VERIFICATION_QUERY_SERVICE)
    private readonly queryService: VerificationQueryService,
  ) {}

  public async execute(
    query: ListVerificationsQuery,
  ): Promise<VerificationListItem[]> {
    void query;

    return this.queryService.findAll();
  }
}
