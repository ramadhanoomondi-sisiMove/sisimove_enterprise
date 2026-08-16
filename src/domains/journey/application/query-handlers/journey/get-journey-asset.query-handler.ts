// src/domains/journey/application/query-handlers/journey/get-journey-asset.query-handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneyAssetQuery } from '../../queries/journey/get-journey-asset.query';

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

export class GetJourneyAssetQueryHandler implements QueryHandler<
  GetJourneyAssetQuery,
  JourneyAssetEntity | null
> {
  constructor(private readonly repository: JourneyRepository) {}

  async execute(
    query: GetJourneyAssetQuery,
  ): Promise<JourneyAssetEntity | null> {
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
    // Resolve Asset
    //
    // The asset lookup is scoped to the owning Journey aggregate.
    // -------------------------------------------------------------------------

    return this.repository.findAssetById(aggregate.journeyId, query.assetId);
  }
}
