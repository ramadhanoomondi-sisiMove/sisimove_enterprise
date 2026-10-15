// -----------------------------------------------------------------------------
// Journey Completion — Count By Status Query Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { CountJourneyCompletionsByStatusQuery } from '../queries/count-journey-completions-by-status.query';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyCompletionRepository } from '../../domain/repositories/journey-completion.repository';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import { JourneyCompletionStatus } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_COMPLETION_TOKENS } from '../journey-completion.tokens';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles counting Journey Completion aggregate roots by lifecycle status.
 *
 * The handler validates the supplied status through the domain value object
 * and delegates the count to the repository.
 *
 * The repository performs the database count without rehydrating aggregates.
 */
@Injectable()
export class CountJourneyCompletionsByStatusQueryHandler implements QueryHandler<
  CountJourneyCompletionsByStatusQuery,
  number
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
    query: CountJourneyCompletionsByStatusQuery,
  ): Promise<number> {
    const status = JourneyCompletionStatus.create(query.status);

    return this.repository.countByStatus(status);
  }
}
