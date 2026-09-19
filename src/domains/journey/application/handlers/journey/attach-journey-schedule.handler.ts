// src/domains/journey/application/handlers/journey/attach-journey-schedule.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Schedule Command Handler
// -----------------------------------------------------------------------------
//
// Application-layer command handler for attaching an existing Journey Schedule
// to a Journey aggregate.
//
// Responsibilities:
// - resolve the Journey aggregate;
// - resolve the Journey Schedule within the Journey aggregate boundary;
// - delegate the attachment mutation to the Journey aggregate;
// - persist the mutated aggregate.
//
// The command already contains JourneyPublicId and JourneySchedulePublicId as
// domain value objects. The handler therefore does not reconstruct them.
//
// The handler does NOT:
// - access Prisma directly;
// - perform HTTP concerns;
// - mutate persistence models;
// - implement Journey business rules.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { AttachJourneyScheduleCommand } from '../../commands/journey/attach-journey-schedule.command';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyNotFoundException } from '../../../domain/exceptions';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

// -----------------------------------------------------------------------------
// Application Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_TOKENS } from '../../journey.tokens';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class AttachJourneyScheduleHandler implements CommandHandler<
  AttachJourneyScheduleCommand,
  void
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly journeyRepository: JourneyRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(command: AttachJourneyScheduleCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    //
    // command.journeyPublicId is already a JourneyPublicId Value Object.
    // Do not construct another JourneyPublicId here.
    // -------------------------------------------------------------------------

    const aggregate = await this.journeyRepository.findByPublicId(
      command.journeyPublicId,
    );

    if (aggregate === null) {
      throw new JourneyNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Resolve Schedule
    //
    // command.schedulePublicId is already a JourneySchedulePublicId Value
    // Object. The lookup is scoped to the Journey aggregate.
    // -------------------------------------------------------------------------

    const schedule = await this.journeyRepository.findScheduleByPublicId(
      aggregate.journeyId,
      command.schedulePublicId,
    );

    if (schedule === null) {
      throw new Error(
        `Journey schedule '${command.schedulePublicId.value}' ` +
          `was not found for Journey '${command.journeyPublicId.value}'.`,
      );
    }

    // -------------------------------------------------------------------------
    // Aggregate Mutation
    // -------------------------------------------------------------------------
    //
    // The Journey aggregate owns the business rules governing schedule
    // attachment.
    //

    aggregate.attachSchedule(schedule);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.journeyRepository.save(aggregate);
  }
}
