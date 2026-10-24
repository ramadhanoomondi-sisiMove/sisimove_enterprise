// -----------------------------------------------------------------------------
// Journey Boarding — List Query Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';
import type { ListJourneyBoardingsQuery } from '../queries/list-journey-boardings.query';
import { JOURNEY_BOARDING_TOKENS } from '../journey-boarding.tokens';

import type { JourneyBoardingAggregate } from '../../domain/aggregates/journey-boarding.aggregate';
import type { JourneyBoardingRepository } from '../../domain/repositories/journey-boarding.repository';

/**
 * Handles collection reads for Journey Boarding aggregates.
 *
 * The repository owns the efficient bulk load of boarding roots and their
 * participant/event collections. The handler deliberately avoids loading roots
 * first and then rehydrating each aggregate individually.
 */
@Injectable()
export class ListJourneyBoardingsHandler implements QueryHandler<
  ListJourneyBoardingsQuery,
  JourneyBoardingAggregate[]
> {
  public constructor(
    @Inject(JOURNEY_BOARDING_TOKENS.REPOSITORY)
    private readonly repository: JourneyBoardingRepository,
  ) {}

  public async execute(
    query: ListJourneyBoardingsQuery,
  ): Promise<JourneyBoardingAggregate[]> {
    void query;
    return this.repository.findJourneyBoardingAggregates();
  }
}

export default ListJourneyBoardingsHandler;
