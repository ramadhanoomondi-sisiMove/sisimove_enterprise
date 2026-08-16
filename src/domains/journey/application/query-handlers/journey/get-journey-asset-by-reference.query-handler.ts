// src/domains/journey/application/query-handlers/journey/get-journey-asset-by-reference.query-handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneyAssetByReferenceQuery } from '../../queries/journey/get-journey-asset-by-reference.query';

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

export class GetJourneyAssetByReferenceQueryHandler implements QueryHandler<
  GetJourneyAssetByReferenceQuery,
  JourneyAssetEntity | null
> {
  constructor(private readonly repository: JourneyRepository) {}

  async execute(
    query: GetJourneyAssetByReferenceQuery,
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
    // Asset lookup is scoped to the owning Journey aggregate.
    // -------------------------------------------------------------------------

    return this.repository.findAssetByReference(
      aggregate.journeyId,
      query.assetPublicId,
    );
  }
}
