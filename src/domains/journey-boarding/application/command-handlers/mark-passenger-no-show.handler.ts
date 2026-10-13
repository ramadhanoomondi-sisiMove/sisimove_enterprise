// src/domains/journey-boarding/application/command-handlers/mark-passenger-no-show.handler.ts

// -----------------------------------------------------------------------------
// Journey Boarding — Mark Passenger No-Show Command Handler
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Resolve the Journey Boarding aggregate by public identifier.
// - Delegate the passenger no-show operation to the aggregate.
// - Record a historical event after successful operation.
// - Persist the updated aggregate and historical event.
// - Resolve the associated Journey's public identifier.
// - Return the aggregate together with the Journey public ID.
//
// Architectural rules:
// - Inject repositories through centralized dependency-injection tokens.
// - Keep participant and lifecycle invariants inside the aggregate.
// - Use a domain-specific exception when the aggregate cannot be found.
// - Use internal Journey IDs only for repository lookups.
// - Return the Journey public ID for REST response mapping.
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { JOURNEY_BOARDING_TOKENS } from '../journey-boarding.tokens';
import { JOURNEY_TOKENS } from '../../../journey/application/journey.tokens';

import type { MarkPassengerNoShowCommand } from '../commands/mark-passenger-no-show.command';

import type { JourneyBoardingAggregate } from '../../domain/aggregates/journey-boarding.aggregate';

import type { JourneyBoardingRepository } from '../../domain/repositories/journey-boarding.repository';
import type { JourneyRepository } from '../../../journey/domain/repositories/journey.repository';

import { JourneyId } from '../../../journey/domain/value-objects/journey-id.vo';

import { JourneyBoardingNotFoundException } from '../../domain/exceptions';

import { JourneyBoardingEventEntity } from '../../domain/entities/journey-boarding-event.entity';

import { JourneyBoardingEventType } from '../../domain/value-objects/journey-boarding-event-type.vo';

// -----------------------------------------------------------------------------
// Result
// -----------------------------------------------------------------------------

export interface MarkPassengerNoShowResult {
  aggregate: JourneyBoardingAggregate;
  journeyPublicId: string;
}

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class MarkPassengerNoShowHandler implements CommandHandler<
  MarkPassengerNoShowCommand,
  MarkPassengerNoShowResult
> {
  public constructor(
    @Inject(JOURNEY_BOARDING_TOKENS.REPOSITORY)
    private readonly repository: JourneyBoardingRepository,

    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly journeyRepository: JourneyRepository,
  ) {}

  public async execute(
    command: MarkPassengerNoShowCommand,
  ): Promise<MarkPassengerNoShowResult> {
    // -------------------------------------------------------------------------
    // Load Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      command.journeyBoardingPublicId,
    );

    if (aggregate === null) {
      throw new JourneyBoardingNotFoundException(
        command.journeyBoardingPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Apply Domain Operation
    // -------------------------------------------------------------------------
    //
    // The aggregate validates the participant and lifecycle transition.
    // If the operation fails, no historical event is added.
    // -------------------------------------------------------------------------

    aggregate.markPassengerNoShow(
      command.participantPublicId,
      command.correlationId,
      command.causationId,
      command.noShowAt,
    );

    // -------------------------------------------------------------------------
    // Record Successful No-Show
    // -------------------------------------------------------------------------

    const noShowEvent = JourneyBoardingEventEntity.create({
      boardingId: aggregate.publicId,
      type: JourneyBoardingEventType.passengerNoShow(),
      occurredAt: command.noShowAt ?? new Date(),
    });

    aggregate.addBoardingEvent(noShowEvent);

    // -------------------------------------------------------------------------
    // Persist Aggregate And History
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);

    // -------------------------------------------------------------------------
    // Resolve Journey Public ID
    // -------------------------------------------------------------------------

    const journey = await this.journeyRepository.findJourneyById(
      new JourneyId(aggregate.journeyBoarding.journeyId.value),
    );

    if (journey === null) {
      throw new Error(
        `Journey not found for boarding ${aggregate.journeyBoarding.publicId.value}.`,
      );
    }

    // -------------------------------------------------------------------------
    // Result
    // -------------------------------------------------------------------------

    return {
      aggregate,
      journeyPublicId: journey.publicId.value,
    };
  }
}

export default MarkPassengerNoShowHandler;
