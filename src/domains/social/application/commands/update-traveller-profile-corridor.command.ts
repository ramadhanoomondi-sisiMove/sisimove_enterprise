// src/domains/social/application/commands/update-traveller-profile-corridor.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class UpdateTravellerProfileCorridorCommand extends Command {
  constructor(
    public readonly travellerProfileId: string,
    public readonly corridorId: string,
    public readonly originName: string,
    public readonly destinationName: string,
    public readonly originLatitude: number,
    public readonly originLongitude: number,
    public readonly destinationLatitude: number,
    public readonly destinationLongitude: number,
    public readonly corridorKey: string | null = null,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
