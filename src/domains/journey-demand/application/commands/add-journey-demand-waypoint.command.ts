// src/domains/journey-demand/application/commands/add-journey-demand-waypoint.command.ts

// -----------------------------------------------------------------------------
// Journey Demand — Add Waypoint Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyDemandWaypointType } from '../../domain/value-objects/journey-demand-waypoint-type.vo';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Adds a waypoint to the corridor of a Journey Demand.
 *
 * The waypoint is created as part of the Journey Demand aggregate and its
 * identity is therefore generated/owned by the aggregate boundary.
 *
 * A waypoint may represent:
 *
 * - an origin,
 * - a destination,
 * - a pickup location,
 * - a dropoff location,
 * - or an intermediate waypoint.
 *
 * Waypoint pickup/dropoff semantics are derived from the waypoint type by
 * JourneyDemandWaypointTypeValueObject.
 *
 * The aggregate is responsible for validating:
 *
 * - Journey Demand lifecycle eligibility,
 * - waypoint ordering,
 * - sequence uniqueness,
 * - geographic validity,
 * - corridor rules,
 * - origin/destination rules,
 * - and aggregate-level waypoint invariants.
 */
export class AddJourneyDemandWaypointCommand extends Command {
  constructor(
    // -------------------------------------------------------------------------
    // Aggregate Identity
    // -------------------------------------------------------------------------

    /**
     * Public identifier of the Journey Demand receiving the waypoint.
     */
    public readonly journeyDemandPublicId: string,

    // -------------------------------------------------------------------------
    // Waypoint
    // -------------------------------------------------------------------------

    /**
     * Type of waypoint.
     *
     * Pickup/dropoff semantics are derived from this type by the domain
     * value object.
     */
    public readonly type: JourneyDemandWaypointType,

    /**
     * Position of the waypoint within the corridor.
     */
    public readonly sequence: number,

    /**
     * Human-readable waypoint name.
     */
    public readonly name: string,

    /**
     * Geographic latitude of the waypoint.
     */
    public readonly latitude: number,

    /**
     * Geographic longitude of the waypoint.
     */
    public readonly longitude: number,

    // -------------------------------------------------------------------------
    // Event Correlation
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
