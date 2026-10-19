import { Inject, Injectable } from '@nestjs/common';

import { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { IDENTITY_TOKENS } from '../identity.tokens';

import type { VerificationRepository } from '../../domain/repositories/verification.repository';
import type { VerificationAggregate } from '../../domain/aggregates/verification.aggregate';
import type { GetVerificationReviewQueueQuery } from '../queries/get-verification-review-queue.query';

@Injectable()
export class GetVerificationReviewQueueHandler implements QueryHandler<
  GetVerificationReviewQueueQuery,
  VerificationAggregate[]
> {
  public constructor(
    @Inject(IDENTITY_TOKENS.REPOSITORIES.VERIFICATION)
    private readonly verificationRepository: VerificationRepository,
  ) {}

  public async execute(): Promise<VerificationAggregate[]> {
    return this.verificationRepository.findForReviewQueue();
  }
}

export default GetVerificationReviewQueueHandler;
