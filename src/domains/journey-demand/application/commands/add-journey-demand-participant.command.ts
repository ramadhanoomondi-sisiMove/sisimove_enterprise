// src/domains/journey-demand/application/commands/add-journey-demand-participant.command.ts

// -----------------------------------------------------------------------------
// Journey Demand — Add Participant Command
// -----------------------------------------------------------------------------
//
// Creates a participant in an existing Journey Demand.
//
// Immutable participant identity:
// - participantPublicId
// - memberPublicId
//
// The application handler is responsible for creating the participant entity.
// The aggregate is responsible for attaching the participant to itself.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class AddJourneyDemandParticipantCommand extends Command {
  constructor(
    // -------------------------------------------------------------------------
    // Journey Demand Identity
    // -------------------------------------------------------------------------

    /**
     * Public identifier of the Journey Demand receiving the participant.
     */
    public readonly journeyDemandPublicId: string,

    // -------------------------------------------------------------------------
    // Participant Identity
    // -------------------------------------------------------------------------

    /**
     * Public identifier assigned to the new participant.
     */
    public readonly participantPublicId: string,

    /**
     * Public identifier of the member becoming a participant.
     *
     * This is a cross-domain reference and remains immutable after creation.
     */
    public readonly memberPublicId: string,

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
