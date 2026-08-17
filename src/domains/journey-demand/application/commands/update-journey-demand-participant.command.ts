// src/domains/journey-demand/application/commands/update-journey-demand-participant.command.ts

// -----------------------------------------------------------------------------
// Journey Demand — Update Participant Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Updates the mutable participation state of a Journey Demand participant.
 *
 * Participant identity and member identity remain immutable.
 *
 * Currently supported mutable state:
 *
 * - seats
 *
 * The participant entity is responsible for enforcing lifecycle rules around
 * changing seats.
 */
export class UpdateJourneyDemandParticipantCommand extends Command {
  constructor(
    // -------------------------------------------------------------------------
    // Journey Demand Identity
    // -------------------------------------------------------------------------

    public readonly journeyDemandPublicId: string,

    // -------------------------------------------------------------------------
    // Participant Identity
    // -------------------------------------------------------------------------

    public readonly participantPublicId: string,

    // -------------------------------------------------------------------------
    // Participation
    // -------------------------------------------------------------------------

    public readonly seats: number,

    // -------------------------------------------------------------------------
    // Correlation
    // -------------------------------------------------------------------------

    public readonly correlationId: string,

    public readonly causationId?: string,
  ) {
    super();
  }
}
