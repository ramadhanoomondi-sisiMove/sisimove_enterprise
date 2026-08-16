// src/domains/trust/application/query-handlers/trust-badge/get-trust-badge.query-handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetTrustBadgeQuery } from '../../queries/trust-badge/get-trust-badge.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { TrustBadgeEntity } from '../../../domain/entities/trust-badge.entity';
import type { TrustBadgeRepository } from '../../../domain/repositories/trust-badge.repository';

import { TrustBadgeId } from '../../../domain/value-objects/trust-badge-id.vo';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

export class GetTrustBadgeQueryHandler implements QueryHandler<
  GetTrustBadgeQuery,
  TrustBadgeEntity | null
> {
  constructor(private readonly repository: TrustBadgeRepository) {}

  async execute(query: GetTrustBadgeQuery): Promise<TrustBadgeEntity | null> {
    const trustBadgeId = new TrustBadgeId(query.trustBadgeId);

    const aggregate = await this.repository.findById(trustBadgeId);

    if (aggregate === null) {
      return null;
    }

    return aggregate.badge;
  }
}
