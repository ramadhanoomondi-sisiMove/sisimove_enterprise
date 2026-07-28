// src/domains/identity/application/queries/handlers/get-verification-review.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import type { VerificationReviewResult } from '../../contracts/verification-review-result';

import { GetVerificationReviewQuery } from '../../queries/get-verification-review.query';
import type { VerificationQueryService } from '../../services/verification-query.service';

@Injectable()
export class GetVerificationReviewHandler implements QueryHandler<
  GetVerificationReviewQuery,
  VerificationReviewResult | null
> {
  constructor(
    @Inject('VerificationQueryService')
    private readonly queryService: VerificationQueryService,
  ) {}

  async execute(
    query: GetVerificationReviewQuery,
  ): Promise<VerificationReviewResult | null> {
    return this.queryService.findReview(query.requestPublicId);
  }
}
