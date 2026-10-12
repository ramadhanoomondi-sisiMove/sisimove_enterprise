// src/domains/journey-boarding/application/command-handlers/start-journey.handler.ts

// -----------------------------------------------------------------------------
// Journey Boarding — Start Journey Command Handler
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Resolve the Journey Boarding aggregate by its public identifier.
// - Delegate journey commencement to the aggregate.
// - Persist the updated aggregate.
// - Resolve the associated Journey's public identifier.
// - Return the updated aggregate together with the Journey public ID.
//
// Architectural rules:
// - Repository dependencies are injected through centralized DI tokens.
// - The handler does not depend on concrete persistence implementations.
// - Journey-start and boarding lifecycle invariants remain inside the aggregate.
// - Internal Journey IDs are used only for repository lookups.
// - Public Journey IDs are returned for REST response mapping.
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { JOURNEY_BOARDING_TOKENS } from '../journey-boarding.tokens';
import { JOURNEY_TOKENS } from '../../../journey/application/journey.tokens';

import type { StartJourneyCommand } from '../commands/start-journey.command';

import type { JourneyBoardingAggregate } from '../../domain/aggregates/journey-boarding.aggregate';

import type { JourneyBoardingRepository } from '../../domain/repositories/journey-boarding.repository';
import type { JourneyRepository } from '../../../journey/domain/repositories/journey.repository';

import { JourneyId } from '../../../journey/domain/value-objects/journey-id.vo';

import { JourneyBoardingNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Result
// -----------------------------------------------------------------------------

export interface StartJourneyResult {
  aggregate: JourneyBoardingAggregate;
  journeyPublicId: string;
}

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class StartJourneyHandler implements CommandHandler<
  StartJourneyCommand,
  StartJourneyResult
> {
  public constructor(
    @Inject(JOURNEY_BOARDING_TOKENS.REPOSITORY)
    private readonly repository: JourneyBoardingRepository,

    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly journeyRepository: JourneyRepository,
  ) {}

  public async execute(
    command: StartJourneyCommand,
  ): Promise<StartJourneyResult> {
    // -----------------------------------------------------------------------
    // Aggregate Lookup
    // -----------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      command.journeyBoardingPublicId,
    );

    if (aggregate === null) {
      throw new JourneyBoardingNotFoundException(
        command.journeyBoardingPublicId.value,
      );
    }

    // -----------------------------------------------------------------------
    // Domain Operation
    // -----------------------------------------------------------------------

    aggregate.startJourney(
      command.correlationId,
      command.causationId,
      command.journeyStartedAt,
    );

    // -----------------------------------------------------------------------
    // Persistence
    // -----------------------------------------------------------------------

    await this.repository.save(aggregate);

    // -----------------------------------------------------------------------
    // Resolve Journey Public ID
    // -----------------------------------------------------------------------

    const journey = await this.journeyRepository.findJourneyById(
      new JourneyId(aggregate.journeyBoarding.journeyId.value),
    );

    if (journey === null) {
      throw new Error(
        `Journey not found for boarding ${aggregate.journeyBoarding.publicId.value}.`,
      );
    }

    // -----------------------------------------------------------------------
    // Result
    // -----------------------------------------------------------------------

    return {
      aggregate,
      journeyPublicId: journey.publicId.value,
    };
  }
}

export default StartJourneyHandler;
