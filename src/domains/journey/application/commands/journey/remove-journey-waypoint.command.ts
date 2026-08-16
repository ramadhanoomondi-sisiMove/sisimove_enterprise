import { Command } from '../../../../../foundation/kernel/application/command';

export class RemoveJourneyWaypointCommand extends Command {
  constructor(
    public readonly journeyPublicId: string,
    public readonly waypointPublicId: string,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
