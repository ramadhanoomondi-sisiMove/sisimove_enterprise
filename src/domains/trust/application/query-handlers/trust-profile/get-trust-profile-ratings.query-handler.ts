// src/domains/trust/application/query-handlers/trust-profile/get-trust-profile-ratings.query-handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetTrustProfileRatingsQuery } from '../../queries/trust-profile/get-trust-profile-ratings.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { TrustRatingEntity } from '../../../domain/entities/trust-rating.entity';
import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import { TrustProfileId } from '../../../domain/value-objects/trust-profile-id.vo';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

export class GetTrustProfileRatingsQueryHandler implements QueryHandler<
  GetTrustProfileRatingsQuery,
  TrustRatingEntity[]
> {
  constructor(private readonly repository: TrustProfileRepository) {}

  async execute(
    query: GetTrustProfileRatingsQuery,
  ): Promise<TrustRatingEntity[]> {
    const trustProfileId = new TrustProfileId(query.trustProfileId);

    return this.repository.findRatings(trustProfileId);
  }
}
