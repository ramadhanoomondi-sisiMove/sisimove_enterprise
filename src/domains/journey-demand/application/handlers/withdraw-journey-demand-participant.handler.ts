// src/domains/journey-demand/application/handlers/withdraw-journey-demand-participant.handler.ts

// -----------------------------------------------------------------------------
// Withdraw Journey Demand Participant Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { WithdrawJourneyDemandParticipantCommand } from '../commands/withdraw-journey-demand-participant.command';

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

export class WithdrawJourneyDemandParticipantHandler implements CommandHandler<WithdrawJourneyDemandParticipantCommand> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly repository: JourneyDemandRepository) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: WithdrawJourneyDemandParticipantCommand,
  ): Promise<void> {
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
    // Find Participant Inside Aggregate
    // -------------------------------------------------------------------------

    const participant = aggregate.getParticipantByPublicId(participantPublicId);

    if (participant === undefined) {
      return;
    }

    // -------------------------------------------------------------------------
    // Withdraw Participant
    //
    // The aggregate is responsible for:
    //
    // - locating the participant
    // - applying the withdrawal operation
    // - preserving participant invariants
    // -------------------------------------------------------------------------

    aggregate.withdrawParticipant(participantPublicId);

    // -------------------------------------------------------------------------
    // Record Domain Event
    //
    // The event records the final participant withdrawal state and aggregate
    // audit/version information.
    // -------------------------------------------------------------------------

    aggregate.recordParticipantWithdrawn(
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
