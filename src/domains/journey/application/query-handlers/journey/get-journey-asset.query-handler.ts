// src/domains/journey/application/query-handlers/journey/get-journey-asset.query-handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';
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
// Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_TOKENS } from '../../journey.tokens';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

@Injectable()
export class GetJourneyAssetQueryHandler implements QueryHandler<
  GetJourneyAssetQuery,
  JourneyAssetEntity | null
> {
  constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly repository: JourneyRepository,
  ) {}

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