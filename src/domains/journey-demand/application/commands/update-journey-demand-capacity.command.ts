// src/domains/journey-demand/application/commands/update-journey-demand-capacity.command.ts

// -----------------------------------------------------------------------------
// Journey Demand — Update Capacity Command
// -----------------------------------------------------------------------------
//
// Responsibilities
// ----------------
// Carries the primitive capacity data required by the application layer.
//
// Architectural boundary
// ----------------------
// - Command contains primitives only.
// - The handler creates JourneyDemandCapacityEntity when capacity does not
//   yet exist.
// - The handler constructs JourneyDemandSeats.
// - The aggregate owns attachment and subsequent capacity mutation.
// - The repository persists the complete aggregate.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class UpdateJourneyDemandCapacityCommand extends Command {
  constructor(
    // -------------------------------------------------------------------------
    // Aggregate Identity
    // -------------------------------------------------------------------------

    /**
     * Public identifier of the Journey Demand being updated.
     */
    public readonly journeyDemandPublicId: string,

    // -------------------------------------------------------------------------
    // Capacity
    // -------------------------------------------------------------------------

    /**
     * Number of seats required by the Journey Demand.
     *
     * The application handler converts this primitive into the
     * JourneyDemandSeats value object.
     */
    public readonly seatsRequired: number,

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
