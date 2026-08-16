// src/domains/journey/application/query-handlers/journey/get-journey-assets.query-handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneyAssetsQuery } from '../../queries/journey/get-journey-assets.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyAssetEntity } from '../../../domain/entities/journey-asset.entity';
import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyNotFoundException } from '../../../domain/exceptions';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

export class GetJourneyAssetsQueryHandler implements QueryHandler<
  GetJourneyAssetsQuery,
  JourneyAssetEntity[]
> {
  constructor(private readonly repository: JourneyRepository) {}

  async execute(query: GetJourneyAssetsQuery): Promise<JourneyAssetEntity[]> {
    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      query.journeyPublicId,
    );

    if (aggregate === null) {
      throw new JourneyNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Resolve Assets
    //
    // Assets are owned by the Journey aggregate, so the repository lookup
    // is scoped by the aggregate's internal JourneyId.
    // -------------------------------------------------------------------------

    return this.repository.findAssets(aggregate.journeyId);
  }
}
