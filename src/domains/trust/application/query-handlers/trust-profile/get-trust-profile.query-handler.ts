// src/domains/trust/application/query-handlers/trust-profile/get-trust-profile.query-handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetTrustProfileQuery } from '../../queries/trust-profile/get-trust-profile.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { TrustProfileAggregate } from '../../../domain/aggregates/trust-profile.aggregate';
import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import { TrustProfileId } from '../../../domain/value-objects/trust-profile-id.vo';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

export class GetTrustProfileQueryHandler implements QueryHandler<
  GetTrustProfileQuery,
  TrustProfileAggregate | null
> {
  constructor(private readonly repository: TrustProfileRepository) {}

  async execute(
    query: GetTrustProfileQuery,
  ): Promise<TrustProfileAggregate | null> {
    const trustProfileId = new TrustProfileId(query.trustProfileId);

    return this.repository.findById(trustProfileId);
  }
}
