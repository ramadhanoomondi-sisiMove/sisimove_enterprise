// -----------------------------------------------------------------------------
// Journey Demand — Add Waypoint Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { AddJourneyDemandWaypointCommand } from '../commands/add-journey-demand-waypoint.command';

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

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

export class AddJourneyDemandWaypointHandler implements CommandHandler<AddJourneyDemandWaypointCommand> {
  constructor(private readonly repository: JourneyDemandRepository) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  async execute(command: AddJourneyDemandWaypointCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Journey Demand Identity
    // -------------------------------------------------------------------------
    //
    // The command carries the external/public identifier as a string.
    // Convert it into the domain-specific public ID value object before
    // interacting with the repository.
    //

    const journeyDemandPublicId = new JourneyDemandPublicId(
      command.journeyDemandPublicId,
    );

    // -------------------------------------------------------------------------
    // Load Aggregate
    // -------------------------------------------------------------------------
    //
    // The Journey Demand aggregate is the consistency boundary for waypoint
    // operations.
    //

    const aggregate = await this.repository.findByPublicId(
      journeyDemandPublicId,
    );

    if (aggregate === null) {
      throw new JourneyDemandNotFoundException(command.journeyDemandPublicId);
    }

    // -------------------------------------------------------------------------
    // Waypoint Type
    // -------------------------------------------------------------------------
    //
    // JourneyDemandWaypointTypeValueObject is the authoritative source for
    // waypoint semantics.
    //
    // It determines whether the waypoint represents:
    //
    // - ORIGIN
    // - DESTINATION
    // - PICKUP
    // - DROPOFF
    // - WAYPOINT
    //
    // Pickup/dropoff requirements are therefore NOT supplied independently
    // by the command.
    //

    const type = new JourneyDemandWaypointTypeValueObject(command.type);

    // -------------------------------------------------------------------------
    // Waypoint Sequence
    // -------------------------------------------------------------------------
    //
    // The value object owns sequence validation and semantics.
    //

    const sequence = new JourneyDemandSequence(command.sequence);

    // -------------------------------------------------------------------------
    // Waypoint Name
    // -------------------------------------------------------------------------
    //
    // JourneyDemandLocation owns validation and normalization of the
    // human-readable waypoint location.
    //

    const name = new JourneyDemandLocation(command.name);

    // -------------------------------------------------------------------------
    // Geographic Coordinate
    // -------------------------------------------------------------------------
    //
    // Latitude and longitude form one atomic geographic value object.
    //
    // JourneyDemandCoordinate validates:
    //
    //   -90  <= latitude  <= 90
    //   -180 <= longitude <= 180
    //

    const coordinates = new JourneyDemandCoordinate(
      command.latitude,
      command.longitude,
    );

    // -------------------------------------------------------------------------
    // Waypoint Identity
    // -------------------------------------------------------------------------
    //
    // JourneyDemandWaypointPublicId extends PublicEntityId and generates
    // its identifier when constructed without a value.
    //
    // Do NOT use:
    //
    //   JourneyDemandWaypointPublicId.create()
    //
    // because this public ID value object does not define a static create()
    // method.
    //

    const waypointPublicId = new JourneyDemandWaypointPublicId();

    // -------------------------------------------------------------------------
    // Create Waypoint Entity
    // -------------------------------------------------------------------------
    //
    // Pickup/dropoff requirements are intentionally NOT passed here.
    //
    // The JourneyDemandWaypointEntity derives those semantics from:
    //
    //   waypoint.type.requiresPickup
    //   waypoint.type.requiresDropoff
    //
    // This prevents contradictory states such as:
    //
    //   type = DESTINATION
    //   pickupRequired = true
    //
    // The waypoint type remains the single source of truth.
    //

    const waypoint = JourneyDemandWaypointEntity.create({
      publicId: waypointPublicId,
      type,
      sequence,
      name,
      coordinates,
    });

    // -------------------------------------------------------------------------
    // Add Waypoint to Aggregate
    // -------------------------------------------------------------------------
    //
    // The aggregate owns the Journey Demand consistency boundary.
    //
    // Aggregate-level rules belong here rather than in the application
    // handler, including:
    //
    // - Journey Demand lifecycle eligibility
    // - corridor existence
    // - corridor eligibility
    // - sequence uniqueness
    // - waypoint ordering
    // - origin/destination rules
    // - waypoint placement
    // - aggregate-level pickup/dropoff constraints
    //

    aggregate.addWaypoint(waypoint);

    // -------------------------------------------------------------------------
    // Record Domain Event
    // -------------------------------------------------------------------------
    //
    // The mutation has succeeded, so record the corresponding domain event.
    //
    // Correlation and causation identifiers are propagated from the command
    // for distributed tracing and event lineage.
    //

    aggregate.recordWaypointAdded(
      waypoint,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------
    //
    // Persist the complete aggregate after the domain operation and event
    // recording have completed successfully.
    //

    await this.repository.save(aggregate);
  }
}
