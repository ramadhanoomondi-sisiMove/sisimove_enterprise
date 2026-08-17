// src/domains/journey-demand/application/handlers/add-journey-demand-participant.handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { AddJourneyDemandParticipantCommand } from '../commands/add-journey-demand-participant.command';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { JourneyDemandNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Domain Repository
// -----------------------------------------------------------------------------

import type { JourneyDemandRepository } from '../../domain/repositories/journey-demand.repository';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import { JourneyDemandParticipantEntity } from '../../domain/entities/journey-demand-participant.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { JourneyDemandPublicId } from '../../domain/value-objects/journey-demand-public-id.vo';
import { JourneyDemandParticipantPublicId } from '../../domain/value-objects/journey-demand-participant-public-id.vo';
import { MemberPublicId } from '../../domain/value-objects/member-public-id.vo';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

export class AddJourneyDemandParticipantHandler implements CommandHandler<AddJourneyDemandParticipantCommand> {
  constructor(private readonly repository: JourneyDemandRepository) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

  async execute(command: AddJourneyDemandParticipantCommand): Promise<void> {
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

    const memberPublicId = new MemberPublicId(command.memberPublicId);

    // -------------------------------------------------------------------------
    // Create Participant
    // -------------------------------------------------------------------------

    const participant = JourneyDemandParticipantEntity.create({
      publicId: participantPublicId,
      memberPublicId,
    });

    // -------------------------------------------------------------------------
    // Add Participant to Aggregate
    // -------------------------------------------------------------------------

    aggregate.addParticipant(participant);

    // -------------------------------------------------------------------------
    // Record Domain Event
    // -------------------------------------------------------------------------

    aggregate.recordParticipantAdded(
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
