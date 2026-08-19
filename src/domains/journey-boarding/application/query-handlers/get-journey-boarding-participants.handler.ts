// -----------------------------------------------------------------------------
// Journey Boarding — Get Participants Query Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneyBoardingParticipantsQuery } from '../queries/get-journey-boarding-participants.query';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { JourneyBoardingParticipantEntity } from '../../domain/entities/journey-boarding-participant.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyBoardingRepository } from '../../domain/repositories/journey-boarding.repository';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

import { JourneyBoardingNotFoundException } from '../../domain/exceptions/journey-boarding-not-found.exception';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieval of all participants belonging to a Journey Boarding.
 *
 * The query enters the application layer using the Journey Boarding public
 * identifier. The handler resolves the aggregate first and then uses its
 * internal UniqueEntityId for the aggregate-scoped participant repository
 * query.
 */
export class GetJourneyBoardingParticipantsHandler implements QueryHandler<
  GetJourneyBoardingParticipantsQuery,
  JourneyBoardingParticipantEntity[]
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly repository: JourneyBoardingRepository) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetJourneyBoardingParticipantsQuery,
  ): Promise<JourneyBoardingParticipantEntity[]> {
    // -------------------------------------------------------------------------
    // Resolve Journey Boarding by Public ID
    // -------------------------------------------------------------------------

    const boarding = await this.repository.findByPublicId(
      query.journeyBoardingPublicId,
    );

    // -------------------------------------------------------------------------
    // Journey Boarding Not Found
    // -------------------------------------------------------------------------

    if (boarding === null) {
      throw new JourneyBoardingNotFoundException(
        query.journeyBoardingPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Resolve Participants Using Internal Aggregate ID
    // -------------------------------------------------------------------------

    return this.repository.findParticipants(boarding.id);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyBoardingParticipantsHandler;
