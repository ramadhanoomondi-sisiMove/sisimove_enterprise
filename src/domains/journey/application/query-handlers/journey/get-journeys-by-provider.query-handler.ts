// src/domains/journey/application/query-handlers/journey/get-journeys-by-provider.query-handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneysByProviderQuery } from '../../queries/journey/get-journeys-by-provider.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyEntity } from '../../../domain/entities/journey.entity';
import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

import { JourneyProviderPublicId } from '../../../domain/value-objects/journey-provider-public-id.vo';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

export class GetJourneysByProviderQueryHandler implements QueryHandler<
  GetJourneysByProviderQuery,
  JourneyEntity[]
> {
  constructor(private readonly repository: JourneyRepository) {}

  async execute(query: GetJourneysByProviderQuery): Promise<JourneyEntity[]> {
    const providerPublicId = new JourneyProviderPublicId(
      query.providerPublicId,
    );

    return this.repository.findJourneysByProvider(providerPublicId);
  }
}
