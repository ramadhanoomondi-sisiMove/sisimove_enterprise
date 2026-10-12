// src/domains/journey-boarding/application/command-handlers/cancel-journey-boarding.handler.ts

// -----------------------------------------------------------------------------
// Journey Boarding — Cancel Command Handler
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Resolve the Journey Boarding aggregate by public identifier.
// - Delegate cancellation to the aggregate.
// - Persist the updated aggregate.
// - Resolve the associated Journey's public identifier.
// - Return the updated aggregate together with the Journey public ID.
//
// Architectural rules:
// - Inject dependencies through centralized dependency-injection tokens.
// - Keep cancellation rules and lifecycle invariants inside the aggregate.
// - Use domain-specific exceptions for missing aggregates.
// - Keep persistence implementation details outside the handler.
// - Use internal Journey IDs only for repository lookups.
// - Return the Journey public ID for REST response mapping.
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { JOURNEY_BOARDING_TOKENS } from '../journey-boarding.tokens';
import { JOURNEY_TOKENS } from '../../../journey/application/journey.tokens';

import type { CancelJourneyBoardingCommand } from '../commands/cancel-journey-boarding.command';

import type { JourneyBoardingAggregate } from '../../domain/aggregates/journey-boarding.aggregate';

import type { JourneyBoardingRepository } from '../../domain/repositories/journey-boarding.repository';
import type { JourneyRepository } from '../../../journey/domain/repositories/journey.repository';

import { JourneyId } from '../../../journey/domain/value-objects/journey-id.vo';

import { JourneyBoardingNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Result
// -----------------------------------------------------------------------------

export interface CancelJourneyBoardingResult {
  aggregate: JourneyBoardingAggregate;
  journeyPublicId: string;
}

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class CancelJourneyBoardingHandler implements CommandHandler<
  CancelJourneyBoardingCommand,
  CancelJourneyBoardingResult
> {
  public constructor(
    @Inject(JOURNEY_BOARDING_TOKENS.REPOSITORY)
    private readonly repository: JourneyBoardingRepository,

    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly journeyRepository: JourneyRepository,
  ) {}

  public async execute(
    command: CancelJourneyBoardingCommand,
  ): Promise<CancelJourneyBoardingResult> {
    const aggregate = await this.repository.findByPublicId(
      command.journeyBoardingPublicId,
    );

    if (aggregate === null) {
      throw new JourneyBoardingNotFoundException(
        command.journeyBoardingPublicId.value,
      );
    }

    aggregate.cancel(
      command.correlationId,
      command.causationId,
      command.cancelledAt,
      command.actorPublicId,
    );

    await this.repository.save(aggregate);

    const journey = await this.journeyRepository.findJourneyById(
      new JourneyId(aggregate.journeyBoarding.journeyId.value),
    );

    if (journey === null) {
      throw new Error(
        `Journey not found for boarding ${aggregate.journeyBoarding.publicId.value}.`,
      );
    }

    return {
      aggregate,
      journeyPublicId: journey.publicId.value,
    };
  }
}

export default CancelJourneyBoardingHandler;
