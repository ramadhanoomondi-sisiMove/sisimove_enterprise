// src/domains/journey-demand/application/handlers/update-journey-demand-waypoint.handler.ts

// -----------------------------------------------------------------------------
// Journey Demand — Update Waypoint Handler
// -----------------------------------------------------------------------------
//
// Application responsibility:
//
//     1. Load the Journey Demand aggregate.
//     2. Convert primitive identifiers into domain value objects.
//     3. Build the explicitly supplied waypoint changes.
//     4. Delegate waypoint mutation to the aggregate.
//     5. Persist the complete aggregate.
//
// Important:
//
// This command updates an EXISTING waypoint.
//
// It must therefore NOT create a JourneyDemandWaypointEntity.
//
// Waypoint creation belongs to the Add Journey Demand Waypoint command/handler.
// This handler only supplies changes to the aggregate, which remains
// responsible for locating the waypoint and enforcing corridor invariants.
//
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

import type { UpdateJourneyDemandWaypointCommand } from '../commands/update-journey-demand-waypoint.command';

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
  JourneyDemandPublicId,
  JourneyDemandWaypointPublicId,
} from '../../domain/value-objects';

// =============================================================================
// Handler
// =============================================================================

export class UpdateJourneyDemandWaypointHandler implements CommandHandler<UpdateJourneyDemandWaypointCommand> {
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

  public async execute(
    command: UpdateJourneyDemandWaypointCommand,
  ): Promise<void> {
    // =========================================================================
    // Journey Demand Identity
    // =========================================================================
    //
    // Convert the primitive command identifier into the domain value object
    // before interacting with the aggregate.
    //
    const journeyDemandPublicId = new JourneyDemandPublicId(
      command.journeyDemandPublicId,
    );

    // =========================================================================
    // Load Aggregate
    // =========================================================================
    //
    // The complete Journey Demand aggregate is required because the waypoint
    // belongs to the aggregate's corridor.
    //
    // The aggregate may therefore need to enforce invariants involving:
    //
    // - waypoint identity
    // - waypoint ordering
    // - origin/destination
    // - corridor completeness
    // - waypoint coordinates
    // - waypoint names
    //
    const aggregate = await this.repository.findByPublicId(
      journeyDemandPublicId,
    );

    if (aggregate === null) {
      throw new JourneyDemandNotFoundException(command.journeyDemandPublicId);
    }

    // =========================================================================
    // Waypoint Identity
    // =========================================================================
    //
    // The waypoint must already exist. We are updating it rather than creating
    // a new child entity.
    //
    const waypointPublicId = new JourneyDemandWaypointPublicId(
      command.waypointPublicId,
    );

    // =========================================================================
    // Build Changes
    // =========================================================================
    //
    // The command uses optional properties because a waypoint update may
    // change only one part of the waypoint.
    //
    // For example:
    //
    //     { name: 'Kisumu CBD' }
    //
    // or:
    //
    //     { latitude: -0.1022, longitude: 34.7617 }
    //
    // or:
    //
    //     { sequence: 2 }
    //
    // With exactOptionalPropertyTypes enabled, undefined values must not be
    // explicitly assigned to optional properties. Build the object only from
    // values that were actually supplied.
    //
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

    // =========================================================================
    // Update Aggregate
    // =========================================================================
    //
    // Do not construct:
    //
    //     JourneyDemandLocation
    //     JourneyDemandCoordinate
    //     JourneyDemandSequence
    //
    // here.
    //
    // Those are domain concerns and belong behind the aggregate's
    // updateWaypoint(...) behavior.
    //
    // The aggregate is responsible for:
    //
    // - locating the waypoint
    // - validating that the waypoint exists
    // - validating the requested changes
    // - converting primitive changes into domain value objects
    // - enforcing corridor invariants
    // - updating the aggregate version/audit state
    // - recording the waypoint-updated domain event
    //
    aggregate.updateWaypoint(
      waypointPublicId,
      changes,
      command.correlationId,
      command.causationId,
    );

    // =========================================================================
    // Persist Aggregate
    // =========================================================================
    //
    // Persist the complete aggregate rather than the waypoint independently.
    //
    await this.repository.save(aggregate);
  }
}
