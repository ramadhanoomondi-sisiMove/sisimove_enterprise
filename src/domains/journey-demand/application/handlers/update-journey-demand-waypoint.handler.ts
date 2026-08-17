// src/domains/journey-demand/application/handlers/update-journey-demand-waypoint.handler.ts

// -----------------------------------------------------------------------------
// Update Journey Demand Waypoint Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { UpdateJourneyDemandWaypointCommand } from '../commands/update-journey-demand-waypoint.command';

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
  JourneyDemandPublicId,
  JourneyDemandWaypointPublicId,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

export class UpdateJourneyDemandWaypointHandler implements CommandHandler<UpdateJourneyDemandWaypointCommand> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly repository: JourneyDemandRepository) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: UpdateJourneyDemandWaypointCommand,
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
      throw new JourneyDemandNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Waypoint Identity
    // -------------------------------------------------------------------------

    const waypointPublicId = new JourneyDemandWaypointPublicId(
      command.waypointPublicId,
    );

    // -------------------------------------------------------------------------
    // Build Changes
    //
    // With exactOptionalPropertyTypes enabled, optional properties must be
    // omitted when their value is undefined.
    // -------------------------------------------------------------------------

    const changes: {
      name?: string;
      latitude?: number;
      longitude?: number;
      sequence?: number;
    } = {};

    if (command.name !== undefined) {
      changes.name = command.name;
    }

    if (command.latitude !== undefined) {
      changes.latitude = command.latitude;
    }

    if (command.longitude !== undefined) {
      changes.longitude = command.longitude;
    }

    if (command.sequence !== undefined) {
      changes.sequence = command.sequence;
    }

    // -------------------------------------------------------------------------
    // Update Aggregate
    //
    // The aggregate is responsible for:
    //
    // - locating the waypoint
    // - validating the corridor
    // - validating the requested changes
    // - constructing JourneyDemandLocation
    // - constructing JourneyDemandCoordinate
    // - constructing JourneyDemandSequence
    // - updating aggregate audit/version state
    // - recording JourneyDemandWaypointUpdatedEvent
    // -------------------------------------------------------------------------

    aggregate.updateWaypoint(
      waypointPublicId,
      changes,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);
  }
}
