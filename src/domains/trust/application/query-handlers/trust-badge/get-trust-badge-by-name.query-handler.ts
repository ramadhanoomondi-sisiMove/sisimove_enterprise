// src/domains/trust/application/query-handlers/trust-badge/get-trust-badge-by-name.query-handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetTrustBadgeByNameQuery } from '../../queries/trust-badge/get-trust-badge-by-name.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { TrustBadgeAggregate } from '../../../domain/aggregates/trust-badge.aggregate';
import type { TrustBadgeRepository } from '../../../domain/repositories/trust-badge.repository';

import { TrustBadgeName } from '../../../domain/value-objects/trust-badge-name.vo';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

export class GetTrustBadgeByNameQueryHandler implements QueryHandler<
  GetTrustBadgeByNameQuery,
  TrustBadgeAggregate | null
> {
  constructor(private readonly repository: TrustBadgeRepository) {}

  async execute(
    query: GetTrustBadgeByNameQuery,
  ): Promise<TrustBadgeAggregate | null> {
    const name = new TrustBadgeName(query.name);

    return this.repository.findByName(name);
  }
}
