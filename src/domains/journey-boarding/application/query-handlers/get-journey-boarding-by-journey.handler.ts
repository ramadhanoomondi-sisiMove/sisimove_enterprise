// -----------------------------------------------------------------------------
// Journey Boarding — Get By Journey Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { JOURNEY_BOARDING_TOKENS } from '../journey-boarding.tokens';
import { JOURNEY_TOKENS } from '../../../journey/application/journey.tokens';

import type { GetJourneyBoardingByJourneyQuery } from '../queries/get-journey-boarding-by-journey.query';

import { JourneyBoardingAggregate } from '../../domain/aggregates/journey-boarding.aggregate';

import type { JourneyBoardingRepository } from '../../domain/repositories/journey-boarding.repository';
import type { JourneyRepository } from '../../../journey/domain/repositories/journey.repository';

import { JourneyBoardingJourneyId } from '../../domain/value-objects/journey-boarding-journey-id.vo';

import { JourneyBoardingNotFoundException } from '../../domain/exceptions';
import { JourneyNotFoundException } from '../../../journey/domain/exceptions';

@Injectable()
export class GetJourneyBoardingByJourneyHandler implements QueryHandler<
  GetJourneyBoardingByJourneyQuery,
  JourneyBoardingAggregate
> {
  public constructor(
    @Inject(JOURNEY_BOARDING_TOKENS.REPOSITORY)
    private readonly repository: JourneyBoardingRepository,

    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly journeyRepository: JourneyRepository,
  ) {}

  public async execute(
    query: GetJourneyBoardingByJourneyQuery,
  ): Promise<JourneyBoardingAggregate> {
    // Resolve the public Journey ID (e.g. JNY-HYPYVSK)
    // to the Journey entity containing its internal database ID.
    const journey = await this.journeyRepository.findJourneyByPublicId(
      query.journeyId,
    );

    if (journey === null) {
      throw new JourneyNotFoundException();
    }

    // The boarding repository searches by the internal Journey ID.
    const internalJourneyId = JourneyBoardingJourneyId.create(
      journey.id.toString(),
    );

    const journeyBoarding =
      await this.repository.findJourneyBoardingByJourneyId(internalJourneyId);

    if (journeyBoarding === null) {
      throw new JourneyBoardingNotFoundException(query.journeyId.value);
    }

    const [participants, events] = await Promise.all([
      this.repository.findParticipants(journeyBoarding.id),
      this.repository.findEvents(journeyBoarding.id),
    ]);

    return JourneyBoardingAggregate.rehydrate(
      journeyBoarding,
      participants,
      events,
    );
  }
}
