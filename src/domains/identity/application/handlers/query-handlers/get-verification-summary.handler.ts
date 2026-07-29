// src/domains/identity/application/queries/handlers/get-verification-summary.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { IDENTITY_VERIFICATION_QUERY_SERVICE } from '../../identity.tokens';

import type { VerificationSummary } from '../../contracts/verification-summary';
import { GetVerificationSummaryQuery } from '../../queries/get-verification-summary.query';
import type { VerificationQueryService } from '../../services/verification-query.service';

@Injectable()
export class GetVerificationSummaryHandler implements QueryHandler<
  GetVerificationSummaryQuery,
  VerificationSummary | null
> {
  public constructor(
    @Inject(IDENTITY_VERIFICATION_QUERY_SERVICE)
    private readonly queryService: VerificationQueryService,
  ) {}

  public async execute(
    query: GetVerificationSummaryQuery,
  ): Promise<VerificationSummary | null> {
    return this.queryService.findSummary(query.verificationPublicId);
  }
}
