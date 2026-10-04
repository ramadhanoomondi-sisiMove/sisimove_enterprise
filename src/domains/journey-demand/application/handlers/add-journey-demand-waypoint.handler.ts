// -----------------------------------------------------------------------------
// Journey Demand — Add Waypoint Handler
// -----------------------------------------------------------------------------
//
// Application responsibility:
//
//     1. Load the Journey Demand aggregate.
//     2. Convert primitive command values into domain value objects.
//     3. Create the waypoint child entity.
//     4. Attach the waypoint to the aggregate.
//     5. Record the waypoint-added domain event.
//     6. Persist the complete aggregate.
//
// Architectural rule:
//
// JourneyDemandWaypointEntity is a child entity of JourneyDemandAggregate.
// It is therefore created by the application handler, attached through the
// aggregate, and persisted through the aggregate repository.
//
// The handler does NOT implement corridor invariants itself. Those rules
// belong to JourneyDemandAggregate.
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

import type { AddJourneyDemandWaypointCommand } from '../commands/add-journey-demand-waypoint.command';

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
// Domain Entity
// -----------------------------------------------------------------------------

import { JourneyDemandWaypointEntity } from '../../domain/entities/journey-demand-waypoint.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { JourneyDemandPublicId } from '../../domain/value-objects/journey-demand-public-id.vo';

import { JourneyDemandWaypointPublicId } from '../../domain/value-objects/journey-demand-waypoint-public-id.vo';

import { JourneyDemandWaypointTypeValueObject } from '../../domain/value-objects/journey-demand-waypoint-type.vo';

import { JourneyDemandSequence } from '../../domain/value-objects/journey-demand-sequence.vo';

import { JourneyDemandLocation } from '../../domain/value-objects/journey-demand-location.vo';

import { JourneyDemandCoordinate } from '../../domain/value-objects/journey-demand-coordinate.vo';

// =============================================================================
// Handler
// =============================================================================

export class AddJourneyDemandWaypointHandler implements CommandHandler<AddJourneyDemandWaypointCommand> {
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

  async execute(command: AddJourneyDemandWaypointCommand): Promise<void> {
    // =========================================================================
    // Journey Demand Identity
    // =========================================================================
    //
    // Commands carry primitive values at the application boundary.
    // Convert the Journey Demand public identifier into its domain value
    // object before loading the aggregate.
    //

    const journeyDemandPublicId = new JourneyDemandPublicId(
      command.journeyDemandPublicId,
    );

    // =========================================================================
    // Load Aggregate
    // =========================================================================
    //
    // The Journey Demand aggregate is the consistency boundary for all
    // corridor and waypoint operations.
    //

    const aggregate = await this.repository.findByPublicId(
      journeyDemandPublicId,
    );

    if (aggregate === null) {
      throw new JourneyDemandNotFoundException(command.journeyDemandPublicId);
    }

    // =========================================================================
    // Waypoint Type
    // =========================================================================
    //
    // The waypoint type is the authoritative source of waypoint semantics.
    //
    // It determines whether this waypoint is:
    //
    // - ORIGIN
    // - DESTINATION
    // - PICKUP
    // - DROPOFF
    // - WAYPOINT
    //
    // Pickup/dropoff requirements are therefore derived from the type and are
    // not supplied independently by the application command.
    //

    const type = new JourneyDemandWaypointTypeValueObject(command.type);

    // =========================================================================
    // Waypoint Sequence
    // =========================================================================
    //
    // Sequence validation remains inside the domain value object.
    //

    const sequence = new JourneyDemandSequence(command.sequence);

    // =========================================================================
    // Waypoint Name
    // =========================================================================
    //
    // The domain location value object owns validation/normalization of the
    // human-readable waypoint name.
    //

    const name = new JourneyDemandLocation(command.name);

    // =========================================================================
    // Geographic Coordinates
    // =========================================================================
    //
    // Latitude and longitude form one atomic geographic value object.
    //
    // JourneyDemandCoordinate is responsible for validating geographic bounds.
    //

    const coordinates = new JourneyDemandCoordinate(
      command.latitude,
      command.longitude,
    );

    // =========================================================================
    // Waypoint Identity
    // =========================================================================
    //
    // The waypoint receives its own public identity.
    //
    // Constructing the value object without an explicit value allows the
    // JourneyDemandWaypointPublicId implementation to generate the identifier.
    //

    const waypointPublicId = new JourneyDemandWaypointPublicId();

    // =========================================================================
    // Create Waypoint Entity
    // =========================================================================
    //
    // The child entity receives domain value objects rather than primitives.
    //
    // Notice that pickup/dropoff requirements are deliberately absent.
    // JourneyDemandWaypointEntity derives those requirements from its type.
    //

    const waypoint = JourneyDemandWaypointEntity.create({
      publicId: waypointPublicId,
      type,
      sequence,
      name,
      coordinates,
    });

    // =========================================================================
    // Add Waypoint to Aggregate
    // =========================================================================
    //
    // The aggregate owns all corridor consistency rules.
    //
    // This is intentionally NOT implemented in this handler.
    //
    // The aggregate may enforce rules such as:
    //
    // - the Journey Demand is eligible for modification
    // - the corridor exists
    // - the corridor permits waypoint changes
    // - sequence values are valid/unique
    // - origin/destination constraints are maintained
    // - waypoint placement is valid
    // - corridor invariants remain intact
    //

    aggregate.addWaypoint(waypoint);

    // =========================================================================
    // Record Domain Event
    // =========================================================================
    //
    // Record the event only after the aggregate successfully accepts the
    // waypoint.
    //
    // Correlation and causation identifiers preserve command/event lineage.
    //

    aggregate.recordWaypointAdded(
      waypoint,
      command.correlationId,
      command.causationId,
    );

    // =========================================================================
    // Persist Aggregate
    // =========================================================================
    //
    // Persist the complete Journey Demand aggregate.
    //
    // There is intentionally no waypoint repository call here.
    //

    await this.repository.save(aggregate);
  }
}
