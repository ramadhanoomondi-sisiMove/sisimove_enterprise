// src/domains/trust/application/query-handlers/trust-profile/get-trust-profile-badge.query-handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetTrustProfileBadgeQuery } from '../../queries/trust-profile/get-trust-profile-badge.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { TrustProfileBadgeEntity } from '../../../domain/entities/trust-profile-badge.entity';
import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import {
  TrustProfileBadgeId,
  TrustProfileId,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

export class GetTrustProfileBadgeQueryHandler implements QueryHandler<
  GetTrustProfileBadgeQuery,
  TrustProfileBadgeEntity | null
> {
  constructor(private readonly repository: TrustProfileRepository) {}

  async execute(
    query: GetTrustProfileBadgeQuery,
  ): Promise<TrustProfileBadgeEntity | null> {
    const trustProfileId = new TrustProfileId(query.trustProfileId);
    const profileBadgeId = new TrustProfileBadgeId(query.profileBadgeId);

    const profileBadge = await this.repository.findProfileBadgeById(
      trustProfileId,
      profileBadgeId,
    );

    return profileBadge;
  }
}
