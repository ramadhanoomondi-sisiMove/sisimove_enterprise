// src/domains/journey/application/handlers/journey/attach-journey-schedule.handler.ts

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
// Handler
// -----------------------------------------------------------------------------

export class AttachJourneyScheduleHandler implements CommandHandler<
  AttachJourneyScheduleCommand,
  void
> {
  constructor(private readonly journeyRepository: JourneyRepository) {}

  async execute(command: AttachJourneyScheduleCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    //
    // command.journeyPublicId is already a JourneyPublicId Value Object.
    // Do NOT construct another JourneyPublicId.
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
    // command.schedulePublicId is already a JourneySchedulePublicId
    // Value Object.
    //
    // The lookup is scoped to the Journey aggregate.
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

    aggregate.attachSchedule(schedule);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.journeyRepository.save(aggregate);
  }
}
