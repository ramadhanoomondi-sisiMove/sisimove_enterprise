// src/domains/journey-demand/application/handlers/update-journey-demand-participant.handler.ts

// -----------------------------------------------------------------------------
// Journey Demand — Update Participant Handler
// -----------------------------------------------------------------------------
//
// Responsibilities
// ----------------
// 1. Load the Journey Demand aggregate.
// 2. Locate the existing participant inside the aggregate.
// 3. Convert the requested seat count into JourneyDemandSeats.
// 4. Let the participant entity enforce participant-level lifecycle rules.
// 5. Let the aggregate record the participant update.
// 6. Persist the complete aggregate.
//
// Architectural boundary
// ----------------------
// - This handler does NOT create participants.
// - Participant creation belongs to the Add Participant command.
// - The participant entity owns its own mutable-state rules.
// - The aggregate owns participant coordination and domain event recording.
// - The repository persists the complete aggregate.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Dependency Injection
// -----------------------------------------------------------------------------

import { Inject } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { UpdateJourneyDemandParticipantCommand } from '../commands/update-journey-demand-participant.command';

// -----------------------------------------------------------------------------
// Dependency Injection Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_DEMAND_TOKENS } from '../journey-demand.tokens';

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
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    @Inject(JOURNEY_DEMAND_TOKENS.REPOSITORY)
    private readonly repository: JourneyDemandRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

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
    // Locate Existing Participant
    // -------------------------------------------------------------------------
    //
    // Update is intentionally different from participant creation.
    //
    // If the participant does not exist, this command is invalid. We do not
    // create one here because creation requires immutable member identity and
    // belongs to the dedicated Add Participant command.
    // -------------------------------------------------------------------------

    const participant = aggregate.getParticipantByPublicId(participantPublicId);

    if (participant === undefined) {
      throw new Error(
        `Journey Demand participant "${command.participantPublicId}" was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // Convert Seats Primitive to Domain Value Object
    // -------------------------------------------------------------------------

    const seats = new JourneyDemandSeats(command.seats);

    // -------------------------------------------------------------------------
    // Update Participant
    // -------------------------------------------------------------------------
    //
    // JourneyDemandParticipantEntity.setSeats(...) owns participant-level
    // lifecycle validation, including preventing inactive participants from
    // changing their seats.
    // -------------------------------------------------------------------------

    participant.setSeats(seats);

    // -------------------------------------------------------------------------
    // Record Participant Update
    // -------------------------------------------------------------------------
    //
    // The aggregate coordinates the participant change and records the
    // corresponding domain event/version information.
    // -------------------------------------------------------------------------

    aggregate.recordParticipantUpdated(
      participant,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // Persist Complete Aggregate
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);
  }
}
