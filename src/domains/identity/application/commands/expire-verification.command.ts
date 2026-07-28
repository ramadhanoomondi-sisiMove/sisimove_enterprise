import { Command } from '../../../../foundation/kernel/application/command';

export class ExpireVerificationCommand extends Command {
  constructor(
    public readonly verificationPublicId: string,
    public readonly correlationId: string,
  ) {
    super();
  }
}
