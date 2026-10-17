import { Inject, Injectable } from '@nestjs/common';

import { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';
import { JOURNEY_TOKENS } from '../../journey.tokens';

import type { JourneyRepository } from '../../../domain/repositories/journey.repository';
import { JourneyAggregate } from '../../../domain/aggregates/journey.aggregate';
import { JourneyProviderPublicId } from '../../../domain/value-objects';

import { GetDetailedJourneysQuery } from '../../queries/journey/get-detailed-journeys.query';

/**
 * Returns complete journey aggregates for a specific provider.
 *
 * The repository loads the composed aggregate, including:
 * - corridor and ordered waypoints;
 * - schedule;
 * - vehicle;
 * - capacity;
 * - pricing;
 * - preferences;
 * - assets.
 *
 * Response mapping remains outside this handler.
 */
@Injectable()
export class GetDetailedJourneysHandler implements QueryHandler<
  GetDetailedJourneysQuery,
  JourneyAggregate[]
> {
  constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly repository: JourneyRepository,
  ) {}

  async execute(query: GetDetailedJourneysQuery): Promise<JourneyAggregate[]> {
    const providerPublicId = new JourneyProviderPublicId(
      query.providerPublicId,
    );

    return this.repository.findByProviderPublicId(providerPublicId);
  }
}

export default GetDetailedJourneysHandler;
