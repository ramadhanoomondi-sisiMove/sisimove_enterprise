// src/domains/trust/application/query-handlers/trust-profile/get-trust-profile-badges.query-handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetTrustProfileBadgesQuery } from '../../queries/trust-profile/get-trust-profile-badges.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { TrustProfileBadgeEntity } from '../../../domain/entities/trust-profile-badge.entity';
import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import { TrustProfileId } from '../../../domain/value-objects/trust-profile-id.vo';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

export class GetTrustProfileBadgesQueryHandler implements QueryHandler<
  GetTrustProfileBadgesQuery,
  TrustProfileBadgeEntity[]
> {
  constructor(private readonly repository: TrustProfileRepository) {}

  async execute(
    query: GetTrustProfileBadgesQuery,
  ): Promise<TrustProfileBadgeEntity[]> {
    const trustProfileId = new TrustProfileId(query.trustProfileId);

    return this.repository.findProfileBadges(trustProfileId);
  }
}
