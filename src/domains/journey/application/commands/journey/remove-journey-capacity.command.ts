import { Command } from '../../../../../foundation/kernel/application/command';

export class RemoveJourneyCapacityCommand extends Command {
  constructor(
    public readonly journeyPublicId: string,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
