// -----------------------------------------------------------------------------
// Get Journey Completion Query Handler
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import type { JourneyCompletionAggregate } from '../../domain/aggregates/journey-completion.aggregate';

import type { JourneyCompletionRepository } from '../../domain/repositories/journey-completion.repository';

import { JourneyCompletionPublicId } from '../../domain/value-objects';

import type { GetJourneyCompletionQuery } from '../queries/get-journey-completion.query';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

export class GetJourneyCompletionHandler implements QueryHandler<
  GetJourneyCompletionQuery,
  JourneyCompletionAggregate | null
> {
  public constructor(
    private readonly repository: JourneyCompletionRepository,
  ) {}

  public async execute(
    query: GetJourneyCompletionQuery,
  ): Promise<JourneyCompletionAggregate | null> {
    const journeyCompletionPublicId = new JourneyCompletionPublicId(
      query.journeyCompletionPublicId,
    );

    return this.repository.findByPublicId(journeyCompletionPublicId);
  }
}
