// src/domains/trust/application/query-handlers/trust-badge/get-trust-badge-by-type.query-handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetTrustBadgeByTypeQuery } from '../../queries/trust-badge/get-trust-badge-by-type.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { TrustBadgeEntity } from '../../../domain/entities/trust-badge.entity';
import type { TrustBadgeRepository } from '../../../domain/repositories/trust-badge.repository';

import { TrustBadgeTypeValueObject } from '../../../domain/value-objects/trust-badge-type.vo';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

export class GetTrustBadgeByTypeQueryHandler implements QueryHandler<
  GetTrustBadgeByTypeQuery,
  TrustBadgeEntity | null
> {
  constructor(private readonly repository: TrustBadgeRepository) {}

  async execute(
    query: GetTrustBadgeByTypeQuery,
  ): Promise<TrustBadgeEntity | null> {
    const type = new TrustBadgeTypeValueObject(query.type);

    return this.repository.findBadgeByType(type);
  }
}
