// -----------------------------------------------------------------------------
// Journey Boarding — Count All Participants Query Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { CountAllJourneyBoardingParticipantsQuery } from '../queries/count-all-journey-boarding-participants.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyBoardingRepository } from '../../domain/repositories/journey-boarding.repository';

// -----------------------------------------------------------------------------
// Dependency Injection Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_BOARDING_TOKENS } from '../journey-boarding.tokens';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

/**
 * Counts all Journey Boarding participants across all Journey Boardings.
 *
 * Delegates the count to the repository without loading or rehydrating
 * individual participant records.
 */
@Injectable()
export class CountAllJourneyBoardingParticipantsQueryHandler implements QueryHandler<
  CountAllJourneyBoardingParticipantsQuery,
  number
> {
  constructor(
    @Inject(JOURNEY_BOARDING_TOKENS.REPOSITORY)
    private readonly repository: JourneyBoardingRepository,
  ) {}

  public async execute(): Promise<number> {
    return this.repository.countAllParticipants();
  }
}
