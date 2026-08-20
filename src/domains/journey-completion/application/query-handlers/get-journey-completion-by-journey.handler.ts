// -----------------------------------------------------------------------------
// Get Journey Completion By Journey Query Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneyCompletionByJourneyQuery } from '../queries/get-journey-completion-by-journey.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyCompletionEntity } from '../../domain/entities/journey-completion.entity';

import type { JourneyCompletionRepository } from '../../domain/repositories/journey-completion.repository';

import { JourneyCompletionJourneyPublicId } from '../../domain/value-objects/journey-completion-journey-public-id.vo';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieval of a Journey Completion by Journey public ID.
 *
 * The repository is supplied explicitly and is not injected through NestJS.
 */
export class GetJourneyCompletionByJourneyHandler implements QueryHandler<
  GetJourneyCompletionByJourneyQuery,
  JourneyCompletionEntity | null
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    private readonly repository: JourneyCompletionRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetJourneyCompletionByJourneyQuery,
  ): Promise<JourneyCompletionEntity | null> {
    const journeyPublicId = new JourneyCompletionJourneyPublicId(
      query.journeyPublicId,
    );

    return await this.repository.findJourneyCompletionByJourneyPublicId(
      journeyPublicId,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyCompletionByJourneyHandler;
