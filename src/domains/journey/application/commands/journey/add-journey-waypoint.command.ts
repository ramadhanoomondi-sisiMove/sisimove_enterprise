// src/domains/journey/application/commands/journey/add-journey-waypoint.command.ts

// -----------------------------------------------------------------------------
// sisiMove — Add Journey Waypoint Command
// -----------------------------------------------------------------------------
//
// Application command for creating a new Journey Waypoint and attaching it to
// the Journey aggregate.
//
// The waypoint is a Journey-owned child entity. Therefore the command carries
// the waypoint configuration rather than an existing waypoint identifier.
//
// The handler is responsible for translating this command into domain Value
// Objects and constructing the JourneyWaypointEntity.
//
// -----------------------------------------------------------------------------

import { Command } from '../../../../../foundation/kernel/application/command';

import type { JourneyWaypointType } from '../../../domain/value-objects/journey-waypoint-type.vo';

export class AddJourneyWaypointCommand extends Command {
  constructor(
    // -------------------------------------------------------------------------
    // Journey
    // -------------------------------------------------------------------------

    public readonly journeyPublicId: string,

    // -------------------------------------------------------------------------
    // Waypoint
    // -------------------------------------------------------------------------

    public readonly type: JourneyWaypointType,

    public readonly sequence: number,

    public readonly name: string,

    public readonly latitude: number,

    public readonly longitude: number,

    public readonly pickupAllowed: boolean = false,

    public readonly dropoffAllowed: boolean = false,

    // -------------------------------------------------------------------------
    // Domain Event Metadata
    // -------------------------------------------------------------------------

    public readonly correlationId: string,

    public readonly causationId?: string,
  ) {
    super();
  }
}
