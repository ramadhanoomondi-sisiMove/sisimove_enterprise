import { Command } from '../../../../foundation/kernel/application/command';

export class ChangeTravellerProfileHandleCommand extends Command {
  constructor(
    public readonly travellerProfileId: string,
    public readonly handle: string,
    public readonly correlationId: string,
    public readonly memberPublicId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
