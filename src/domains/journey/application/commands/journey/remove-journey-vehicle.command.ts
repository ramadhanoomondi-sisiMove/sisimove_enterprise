// src/domains/journey/application/commands/journey/remove-journey-vehicle.command.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyPublicId } from '../../../domain/value-objects/journey-public-id.vo';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class RemoveJourneyVehicleCommand extends Command {
  constructor(
    public readonly journeyPublicId: JourneyPublicId,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
