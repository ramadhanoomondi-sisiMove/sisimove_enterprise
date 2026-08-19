// -----------------------------------------------------------------------------
// Journey Boarding — Get By Journey Query Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneyBoardingByJourneyQuery } from '../queries/get-journey-boarding-by-journey.query';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { JourneyBoardingEntity } from '../../domain/entities/journey-boarding.entity';

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
 * Handles retrieval of the Journey Boarding root associated with a Journey.
 *
 * This query intentionally uses the repository's root-entity lookup rather
 * than aggregate rehydration because the repository contract explicitly
 * exposes findJourneyBoardingByJourneyId() as a root query.
 */
export class GetJourneyBoardingByJourneyHandler implements QueryHandler<
  GetJourneyBoardingByJourneyQuery,
  JourneyBoardingEntity
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly repository: JourneyBoardingRepository) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetJourneyBoardingByJourneyQuery,
  ): Promise<JourneyBoardingEntity> {
    // -------------------------------------------------------------------------
    // Lookup
    // -------------------------------------------------------------------------

    const journeyBoarding =
      await this.repository.findJourneyBoardingByJourneyId(query.journeyId);

    // -------------------------------------------------------------------------
    // Not Found
    // -------------------------------------------------------------------------

    if (journeyBoarding === null) {
      throw new JourneyBoardingNotFoundException(query.journeyId.value);
    }

    // -------------------------------------------------------------------------
    // Result
    // -------------------------------------------------------------------------

    return journeyBoarding;
  }
}
