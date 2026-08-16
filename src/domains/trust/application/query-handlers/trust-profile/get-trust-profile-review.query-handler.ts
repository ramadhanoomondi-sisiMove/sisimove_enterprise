// src/domains/trust/application/query-handlers/trust-profile/get-trust-profile-review.query-handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetTrustProfileReviewQuery } from '../../queries/trust-profile/get-trust-profile-review.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { TrustReviewEntity } from '../../../domain/entities/trust-review.entity';
import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import { TrustProfileId, TrustReviewId } from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

export class GetTrustProfileReviewQueryHandler implements QueryHandler<
  GetTrustProfileReviewQuery,
  TrustReviewEntity | null
> {
  constructor(private readonly repository: TrustProfileRepository) {}

  async execute(
    query: GetTrustProfileReviewQuery,
  ): Promise<TrustReviewEntity | null> {
    const trustProfileId = new TrustProfileId(query.trustProfileId);
    const reviewId = new TrustReviewId(query.reviewId);

    return await this.repository.findReviewById(trustProfileId, reviewId);
  }
}
