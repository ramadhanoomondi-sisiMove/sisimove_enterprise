// -----------------------------------------------------------------------------
// Journey Demand — Remove Participant Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { RemoveJourneyDemandParticipantCommand } from '../commands/remove-journey-demand-participant.command';

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
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

export class RemoveJourneyDemandParticipantHandler implements CommandHandler<RemoveJourneyDemandParticipantCommand> {
  constructor(private readonly repository: JourneyDemandRepository) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  async execute(command: RemoveJourneyDemandParticipantCommand): Promise<void> {
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
    // Verify Participant Exists Inside Aggregate
    // -------------------------------------------------------------------------

    const participant = aggregate.getParticipantByPublicId(participantPublicId);

    if (participant === undefined) {
      return;
    }

    // -------------------------------------------------------------------------
    // Remove Participant
    // -------------------------------------------------------------------------

    aggregate.removeParticipant(participantPublicId);

    // -------------------------------------------------------------------------
    // Record Domain Event
    // -------------------------------------------------------------------------

    aggregate.recordParticipantRemoved(
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
