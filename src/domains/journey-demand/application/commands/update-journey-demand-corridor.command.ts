// src/domains/journey-demand/application/commands/update-journey-demand-corridor.command.ts

// -----------------------------------------------------------------------------
// Journey Demand — Update Corridor Command
// -----------------------------------------------------------------------------
//
// Purpose
// -------
// Updates the corridor configuration of a Journey Demand.
//
// The same command is used during the progressive Journey Demand creation
// workflow and for subsequent corridor edits.
//
// First-time creation:
// - The Journey Demand aggregate may not have a corridor yet.
// - The application handler is responsible for creating the
//   JourneyDemandCorridorEntity.
// - The handler then attaches the corridor to the aggregate.
//
// Existing corridor:
// - The application handler loads the aggregate.
// - The aggregate's updateCorridor(...) operation updates the existing
//   corridor.
//
// Important architectural boundary:
// - This command contains primitives only.
// - It does NOT construct domain value objects.
// - It does NOT construct JourneyDemandCorridorEntity.
// - It does NOT mutate the aggregate.
// - Entity creation remains an application-layer responsibility.
// - Aggregate mutation remains a domain responsibility.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class UpdateJourneyDemandCorridorCommand extends Command {
  constructor(
    // -------------------------------------------------------------------------
    // Aggregate Identity
    // -------------------------------------------------------------------------

    /**
     * Public identifier of the Journey Demand whose corridor is being
     * configured.
     */
    public readonly journeyDemandPublicId: string,

    // -------------------------------------------------------------------------
    // Origin
    // -------------------------------------------------------------------------

    /**
     * Human-readable origin name.
     *
     * The application handler converts this primitive into the
     * JourneyDemandLocation value object.
     */
    public readonly origin: string,

    /**
     * Geographic latitude of the origin.
     *
     * Required when the corridor does not yet exist because
     * JourneyDemandCorridorEntity requires origin coordinates at creation.
     */
    public readonly originLatitude: number,

    /**
     * Geographic longitude of the origin.
     *
     * Required when the corridor does not yet exist because
     * JourneyDemandCorridorEntity requires origin coordinates at creation.
     */
    public readonly originLongitude: number,

    // -------------------------------------------------------------------------
    // Destination
    // -------------------------------------------------------------------------

    /**
     * Human-readable destination name.
     *
     * The application handler converts this primitive into the
     * JourneyDemandLocation value object.
     */
    public readonly destination: string,

    /**
     * Geographic latitude of the destination.
     *
     * Required when the corridor does not yet exist because
     * JourneyDemandCorridorEntity requires destination coordinates at
     * creation.
     */
    public readonly destinationLatitude: number,

    /**
     * Geographic longitude of the destination.
     *
     * Required when the corridor does not yet exist because
     * JourneyDemandCorridorEntity requires destination coordinates at
     * creation.
     */
    public readonly destinationLongitude: number,

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
