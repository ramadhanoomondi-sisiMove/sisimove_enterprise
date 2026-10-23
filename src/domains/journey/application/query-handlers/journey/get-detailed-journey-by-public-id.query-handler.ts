import { Inject, Injectable } from '@nestjs/common';

import { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';
import { JourneyAggregate } from '../../../domain/aggregates/journey.aggregate';
import type { JourneyRepository } from '../../../domain/repositories/journey.repository';
import { JourneyPublicId } from '../../../domain/value-objects';
import { JOURNEY_TOKENS } from '../../journey.tokens';
import { GetDetailedJourneyByPublicIdQuery } from '../../queries/journey/get-detailed-journey-by-public-id.query';

/**
 * Retrieves one complete Journey aggregate by its public identifier.
 *
 * This is an administrative read and does not enforce public
 * marketplace visibility. Authorization belongs at the API boundary.
 */
@Injectable()
export class GetDetailedJourneyByPublicIdHandler implements QueryHandler<
  GetDetailedJourneyByPublicIdQuery,
  JourneyAggregate | null
> {
  constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly repository: JourneyRepository,
  ) {}

  async execute(
    query: GetDetailedJourneyByPublicIdQuery,
  ): Promise<JourneyAggregate | null> {
    const journeyPublicId = new JourneyPublicId(query.journeyPublicId);

    return this.repository.findByPublicId(journeyPublicId);
  }
}

export default GetDetailedJourneyByPublicIdHandler;
