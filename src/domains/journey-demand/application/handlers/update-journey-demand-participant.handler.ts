// src/domains/journey-demand/application/handlers/update-journey-demand-participant.handler.ts

// -----------------------------------------------------------------------------
// Journey Demand — Update Participant Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { UpdateJourneyDemandParticipantCommand } from '../commands/update-journey-demand-participant.command';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { JourneyDemandNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Domain Repository
// -----------------------------------------------------------------------------

import type { JourneyDemandRepository } from '../../domain/repositories/journey-demand.repository';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyDemandParticipantPublicId,
  JourneyDemandPublicId,
  JourneyDemandSeats,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

export class UpdateJourneyDemandParticipantHandler implements CommandHandler<UpdateJourneyDemandParticipantCommand> {
  constructor(private readonly repository: JourneyDemandRepository) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

  async execute(command: UpdateJourneyDemandParticipantCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Journey Demand Identity
    // -------------------------------------------------------------------------

    const journeyDemandPublicId = new JourneyDemandPublicId(
      command.journeyDemandPublicId,
    );

    // -------------------------------------------------------------------------
    // Load Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      journeyDemandPublicId,
    );

    if (aggregate === null) {
      throw new JourneyDemandNotFoundException(command.journeyDemandPublicId);
    }

    // -------------------------------------------------------------------------
    // Participant Identity
    // -------------------------------------------------------------------------

    const participantPublicId = new JourneyDemandParticipantPublicId(
      command.participantPublicId,
    );

    // -------------------------------------------------------------------------
    // Locate Participant Inside Aggregate
    // -------------------------------------------------------------------------

    const participant = aggregate.getParticipantByPublicId(participantPublicId);

    if (participant === undefined) {
      return;
    }

    // -------------------------------------------------------------------------
    // Update Seats
    // -------------------------------------------------------------------------

    participant.setSeats(new JourneyDemandSeats(command.seats));

    // -------------------------------------------------------------------------
    // Record Participant Update
    // -------------------------------------------------------------------------

    aggregate.recordParticipantUpdated(
      participant,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);
  }
}
