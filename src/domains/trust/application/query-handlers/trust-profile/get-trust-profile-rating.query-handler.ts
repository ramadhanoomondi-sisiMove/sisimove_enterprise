// src/domains/trust/application/query-handlers/trust-profile/get-trust-profile-rating.query-handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetTrustProfileRatingQuery } from '../../queries/trust-profile/get-trust-profile-rating.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { TrustRatingEntity } from '../../../domain/entities/trust-rating.entity';
import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import { TrustProfileId, TrustRatingId } from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

export class GetTrustProfileRatingQueryHandler implements QueryHandler<
  GetTrustProfileRatingQuery,
  TrustRatingEntity | null
> {
  constructor(private readonly repository: TrustProfileRepository) {}

  async execute(
    query: GetTrustProfileRatingQuery,
  ): Promise<TrustRatingEntity | null> {
    const trustProfileId = new TrustProfileId(query.trustProfileId);
    const ratingId = new TrustRatingId(query.ratingId);

    const rating = await this.repository.findRatingById(
      trustProfileId,
      ratingId,
    );

    return rating;
  }
}
