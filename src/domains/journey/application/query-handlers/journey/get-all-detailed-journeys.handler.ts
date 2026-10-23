import { Inject, Injectable } from '@nestjs/common';

import { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';
import { JourneyAggregate } from '../../../domain/aggregates/journey.aggregate';
import type { JourneyRepository } from '../../../domain/repositories/journey.repository';
import { JOURNEY_TOKENS } from '../../journey.tokens';
import { GetAllDetailedJourneysQuery } from '../../queries/journey/get-all-detailed-journeys.query';

/**
 * Handles platform-wide retrieval of detailed journey aggregates.
 *
 * Unlike GetDetailedJourneysHandler, this handler retrieves journeys
 * across all providers for authorized administrative views.
 */
@Injectable()
export class GetAllDetailedJourneysHandler implements QueryHandler<
  GetAllDetailedJourneysQuery,
  JourneyAggregate[]
> {
  constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly repository: JourneyRepository,
  ) {}

  async execute(): Promise<JourneyAggregate[]> {
    return this.repository.findAllAggregates();
  }
}
export default GetAllDetailedJourneysHandler;
