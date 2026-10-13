// src/domains/journey-boarding/application/command-handlers/remove-participant.handler.ts

// -----------------------------------------------------------------------------
// Journey Boarding — Remove Participant Command Handler
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Resolve the Journey Boarding aggregate by public identifier.
// - Delegate participant removal to the aggregate.
// - Record a historical event after successful removal.
// - Persist the updated aggregate and historical event.
// - Resolve the associated Journey's public identifier.
// - Return the aggregate together with the Journey public ID.
//
// Architectural rules:
// - Inject repositories through centralized dependency-injection tokens.
// - Keep participant lifecycle invariants inside the aggregate.
// - Use a domain-specific exception when the aggregate cannot be found.
// - Use the internal Journey ID for repository lookup.
// - Return the Journey public ID for REST response mapping.
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { JOURNEY_BOARDING_TOKENS } from '../journey-boarding.tokens';
import { JOURNEY_TOKENS } from '../../../journey/application/journey.tokens';

import type { RemoveParticipantCommand } from '../commands/remove-participant.command';

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

export interface RemoveParticipantResult {
  aggregate: JourneyBoardingAggregate;
  journeyPublicId: string;
}

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class RemoveParticipantHandler implements CommandHandler<
  RemoveParticipantCommand,
  RemoveParticipantResult
> {
  public constructor(
    @Inject(JOURNEY_BOARDING_TOKENS.REPOSITORY)
    private readonly repository: JourneyBoardingRepository,

    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly journeyRepository: JourneyRepository,
  ) {}

  public async execute(
    command: RemoveParticipantCommand,
  ): Promise<RemoveParticipantResult> {
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
    // Remove Participant
    // -------------------------------------------------------------------------
    //
    // The aggregate enforces participant and lifecycle invariants.
    // If removal fails, no historical event is created.
    // -------------------------------------------------------------------------

    aggregate.removeParticipant(
      command.participantPublicId,
      command.correlationId,
      command.causationId,
      command.removedAt,
      command.actorPublicId,
    );

    // -------------------------------------------------------------------------
    // Record Successful Removal
    // -------------------------------------------------------------------------

    const removalEvent = JourneyBoardingEventEntity.create({
      boardingId: aggregate.publicId,
      type: JourneyBoardingEventType.participantRemoved(),
      actorPublicId: command.actorPublicId,
      occurredAt: command.removedAt ?? new Date(),
    });

    aggregate.addBoardingEvent(removalEvent);

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

export default RemoveParticipantHandler;
