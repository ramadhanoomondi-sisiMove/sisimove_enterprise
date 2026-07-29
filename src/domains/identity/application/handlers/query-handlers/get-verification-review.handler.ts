// src/domains/identity/application/queries/handlers/get-verification-review.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { IDENTITY_VERIFICATION_QUERY_SERVICE } from '../../identity.tokens';

import type { VerificationReviewResult } from '../../contracts/verification-review-result';
import { GetVerificationReviewQuery } from '../../queries/get-verification-review.query';
import type { VerificationQueryService } from '../../services/verification-query.service';

@Injectable()
export class GetVerificationReviewHandler implements QueryHandler<
  GetVerificationReviewQuery,
  VerificationReviewResult | null
> {
  public constructor(
    @Inject(IDENTITY_VERIFICATION_QUERY_SERVICE)
    private readonly queryService: VerificationQueryService,
  ) {}

  public async execute(
    query: GetVerificationReviewQuery,
  ): Promise<VerificationReviewResult | null> {
    return this.queryService.findReview(query.requestPublicId);
  }
}
