// src/domains/trust/application/query-handlers/trust-profile/get-trust-profile-reviews.query-handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetTrustProfileReviewsQuery } from '../../queries/trust-profile/get-trust-profile-reviews.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { TrustReviewEntity } from '../../../domain/entities/trust-review.entity';
import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import { TrustProfileId } from '../../../domain/value-objects/trust-profile-id.vo';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

export class GetTrustProfileReviewsQueryHandler implements QueryHandler<
  GetTrustProfileReviewsQuery,
  TrustReviewEntity[]
> {
  constructor(private readonly repository: TrustProfileRepository) {}

  async execute(
    query: GetTrustProfileReviewsQuery,
  ): Promise<TrustReviewEntity[]> {
    const trustProfileId = new TrustProfileId(query.trustProfileId);

    return this.repository.findReviews(trustProfileId);
  }
}
