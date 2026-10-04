// src/domains/journey-demand/application/commands/update-journey-demand-participant.command.ts

// -----------------------------------------------------------------------------
// Journey Demand — Update Participant Command
// -----------------------------------------------------------------------------
//
// Responsibilities
// ----------------
// Updates the mutable participation state of an existing Journey Demand
// participant.
//
// Immutable participant data is intentionally excluded:
// - participant identity
// - member identity
//
// Currently supported mutable state:
// - seats
//
// Architectural boundary
// ----------------------
// - The command contains primitives only.
// - The handler loads the aggregate and locates the existing participant.
// - The participant entity owns participant-level seat validation.
// - The aggregate records the participant update.
// - The repository persists the complete aggregate.
//
// Participant creation belongs to:
// AddJourneyDemandParticipantCommand
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class UpdateJourneyDemandParticipantCommand extends Command {
  constructor(
    // -------------------------------------------------------------------------
    // Journey Demand Identity
    // -------------------------------------------------------------------------

    /**
     * Public identifier of the Journey Demand being updated.
     */
    public readonly journeyDemandPublicId: string,

    // -------------------------------------------------------------------------
    // Participant Identity
    // -------------------------------------------------------------------------

    /**
     * Public identifier of the existing participant being updated.
     */
    public readonly participantPublicId: string,

    // -------------------------------------------------------------------------
    // Participation
    // -------------------------------------------------------------------------

    /**
     * New number of seats requested by the participant.
     *
     * The application handler converts this primitive into the
     * JourneyDemandSeats value object.
     */
    public readonly seats: number,

    // -------------------------------------------------------------------------
    // Distributed Tracing
    // -------------------------------------------------------------------------

    /**
     * Correlation identifier for distributed tracing.
     */
    public readonly correlationId: string,

    /**
     * Causation identifier for distributed tracing.
     */
    public readonly causationId?: string,
  ) {
    super();
  }
}
