// -----------------------------------------------------------------------------
// Journey Boarding — Get Query Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneyBoardingQuery } from '../queries/get-journey-boarding.query';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { JourneyBoardingAggregate } from '../../domain/aggregates/journey-boarding.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyBoardingRepository } from '../../domain/repositories/journey-boarding.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyBoardingNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieval of a Journey Boarding aggregate by public identifier.
 *
 * Responsibilities:
 *
 * 1. Query the Journey Boarding repository.
 * 2. Translate a missing aggregate into JourneyBoardingNotFoundException.
 * 3. Return the rehydrated JourneyBoardingAggregate.
 */
export class GetJourneyBoardingHandler implements QueryHandler<
  GetJourneyBoardingQuery,
  JourneyBoardingAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly repository: JourneyBoardingRepository) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetJourneyBoardingQuery,
  ): Promise<JourneyBoardingAggregate> {
    // -------------------------------------------------------------------------
    // Lookup
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      query.journeyBoardingPublicId,
    );

    // -------------------------------------------------------------------------
    // Not Found
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new JourneyBoardingNotFoundException(
        query.journeyBoardingPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Result
    // -------------------------------------------------------------------------

    return aggregate;
  }
}
