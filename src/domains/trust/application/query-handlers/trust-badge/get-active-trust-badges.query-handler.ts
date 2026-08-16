// src/domains/trust/application/query-handlers/trust-badge/get-active-trust-badges.query-handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetActiveTrustBadgesQuery } from '../../queries/trust-badge/get-active-trust-badges.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { TrustBadgeEntity } from '../../../domain/entities/trust-badge.entity';
import type { TrustBadgeRepository } from '../../../domain/repositories/trust-badge.repository';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

export class GetActiveTrustBadgesQueryHandler implements QueryHandler<
  GetActiveTrustBadgesQuery,
  TrustBadgeEntity[]
> {
  constructor(private readonly repository: TrustBadgeRepository) {}

  async execute(query: GetActiveTrustBadgesQuery): Promise<TrustBadgeEntity[]> {
    void query;

    return this.repository.findActive();
  }
}
