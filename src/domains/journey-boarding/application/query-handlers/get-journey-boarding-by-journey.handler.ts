// src/domains/journey-boarding/application/query-handlers/get-journey-boarding-by-journey.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { JOURNEY_BOARDING_TOKENS } from '../journey-boarding.tokens';

import type { GetJourneyBoardingByJourneyQuery } from '../queries/get-journey-boarding-by-journey.query';

import { JourneyBoardingAggregate } from '../../domain/aggregates/journey-boarding.aggregate';

import type { JourneyBoardingRepository } from '../../domain/repositories/journey-boarding.repository';

import { JourneyBoardingNotFoundException } from '../../domain/exceptions';

@Injectable()
export class GetJourneyBoardingByJourneyHandler implements QueryHandler<
  GetJourneyBoardingByJourneyQuery,
  JourneyBoardingAggregate
> {
  public constructor(
    @Inject(JOURNEY_BOARDING_TOKENS.REPOSITORY)
    private readonly repository: JourneyBoardingRepository,
  ) {}

  public async execute(
    query: GetJourneyBoardingByJourneyQuery,
  ): Promise<JourneyBoardingAggregate> {
    const journeyBoarding =
      await this.repository.findJourneyBoardingByJourneyId(query.journeyId);

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
