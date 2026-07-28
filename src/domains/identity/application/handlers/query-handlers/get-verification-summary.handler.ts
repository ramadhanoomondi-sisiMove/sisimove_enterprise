// src/domains/identity/application/queries/handlers/get-verification-summary.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import type { VerificationSummary } from '../../contracts/verification-summary';

import { GetVerificationSummaryQuery } from '../../queries/get-verification-summary.query';
import type { VerificationQueryService } from '../../services/verification-query.service';

@Injectable()
export class GetVerificationSummaryHandler implements QueryHandler<
  GetVerificationSummaryQuery,
  VerificationSummary | null
> {
  constructor(
    @Inject('VerificationQueryService')
    private readonly queryService: VerificationQueryService,
  ) {}

  async execute(
    query: GetVerificationSummaryQuery,
  ): Promise<VerificationSummary | null> {
    return this.queryService.findSummary(query.verificationPublicId);
  }
}
