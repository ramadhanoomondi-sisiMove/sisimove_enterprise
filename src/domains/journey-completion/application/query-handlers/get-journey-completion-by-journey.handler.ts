/**
 * -----------------------------------------------------------------------------
 * Journey Completion — Get By Journey Query Handler
 * -----------------------------------------------------------------------------
 */

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

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
// Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_COMPLETION_TOKENS } from '../journey-completion.tokens';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieval of a Journey Completion aggregate by Journey public ID.
 *
 * The repository is injected through the Journey Completion dependency
 * injection token.
 *
 * The handler converts the supplied journey public ID into its domain value
 * object before delegating the lookup to the repository.
 */
@Injectable()
export class GetJourneyCompletionByJourneyHandler implements QueryHandler<
  GetJourneyCompletionByJourneyQuery,
  JourneyCompletionEntity | null
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    @Inject(JOURNEY_COMPLETION_TOKENS.REPOSITORY)
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

    return this.repository.findJourneyCompletionByJourneyPublicId(
      journeyPublicId,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyCompletionByJourneyHandler;
