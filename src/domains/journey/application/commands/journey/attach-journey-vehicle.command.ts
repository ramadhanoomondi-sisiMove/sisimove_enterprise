// src/domains/journey/application/commands/journey/attach-journey-vehicle.command.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyPublicId } from '../../../domain/value-objects/journey-public-id.vo';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Configures the vehicle of an existing Journey.
 *
 * JourneyVehicle is a Journey-owned child entity. The command therefore
 * carries primitive vehicle configuration rather than an existing
 * JourneyVehiclePublicId.
 *
 * The application handler creates the JourneyVehicleEntity and attaches it
 * to the Journey aggregate.
 */
export class AttachJourneyVehicleCommand extends Command {
  public constructor(
    public readonly journeyPublicId: JourneyPublicId,

    public readonly make: string,

    public readonly model: string,

    public readonly year: number | undefined,

    public readonly color: string | undefined,

    public readonly registration: string | undefined,

    public readonly assetPublicId: string | undefined,

    public readonly correlationId: string,

    public readonly causationId?: string,
  ) {
    super();
  }
}
