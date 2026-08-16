// src/domains/journey/application/commands/journey/attach-journey-vehicle.command.ts

import { Command } from '../../../../../foundation/kernel/application/command';

import type { JourneyPublicId } from '../../../domain/value-objects/journey-public-id.vo';
import type { JourneyVehiclePublicId } from '../../../domain/value-objects/journey-vehicle-public-id.vo';

export class AttachJourneyVehicleCommand extends Command {
  constructor(
    public readonly journeyPublicId: JourneyPublicId,
    public readonly vehiclePublicId: JourneyVehiclePublicId,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
