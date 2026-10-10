// src/domains/journey-boarding/application/query-handlers/get-journey-boarding-participants.handler.ts

// -----------------------------------------------------------------------------
// Journey Boarding — Get Participants Query Handler
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Resolve a Journey Boarding aggregate by its public identifier.
// - Retrieve its participants using the aggregate's internal identity.
// - Throw a domain-specific exception when the boarding does not exist.
//
// Architectural rules:
// - Inject the repository through the centralized dependency-injection token.
// - Resolve the aggregate before performing an aggregate-scoped participant
//   query.
// - Use the internal aggregate ID for persistence-level participant lookup.
// - Keep persistence implementation details inside the repository.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Dependency Injection Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_BOARDING_TOKENS } from '../journey-boarding.tokens';

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
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyBoardingNotFoundException } from '../../domain/exceptions/journey-boarding-not-found.exception';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class GetJourneyBoardingParticipantsHandler implements QueryHandler<
  GetJourneyBoardingParticipantsQuery,
  JourneyBoardingParticipantEntity[]
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(JOURNEY_BOARDING_TOKENS.REPOSITORY)
    private readonly repository: JourneyBoardingRepository,
  ) {}

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
    //
    // The public identifier is used at the application boundary. The
    // repository participant query uses the aggregate's internal identity.
    // -------------------------------------------------------------------------

    return this.repository.findParticipants(boarding.id);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyBoardingParticipantsHandler;
