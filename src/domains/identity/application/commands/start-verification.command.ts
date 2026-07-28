import { Command } from '../../../../foundation/kernel/application/command';

export class StartVerificationCommand extends Command {
  constructor(
    public readonly identityPublicId: string,
    public readonly correlationId: string,
  ) {
    super();
  }
}
