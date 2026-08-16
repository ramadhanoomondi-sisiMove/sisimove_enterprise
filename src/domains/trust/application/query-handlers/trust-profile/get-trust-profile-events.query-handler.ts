// src/domains/trust/application/query-handlers/trust-profile/get-trust-profile-events.query-handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetTrustProfileEventsQuery } from '../../queries/trust-profile/get-trust-profile-events.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { TrustEventEntity } from '../../../domain/entities/trust-event.entity';
import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import { TrustProfileId } from '../../../domain/value-objects/trust-profile-id.vo';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

export class GetTrustProfileEventsQueryHandler implements QueryHandler<
  GetTrustProfileEventsQuery,
  TrustEventEntity[]
> {
  constructor(private readonly repository: TrustProfileRepository) {}

  async execute(
    query: GetTrustProfileEventsQuery,
  ): Promise<TrustEventEntity[]> {
    const trustProfileId = new TrustProfileId(query.trustProfileId);

    return this.repository.findEvents(trustProfileId);
  }
}
