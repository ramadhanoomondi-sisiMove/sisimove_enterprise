import { Command } from '../../../../foundation/kernel/application/command';

export class ApproveVerificationRequestCommand extends Command {
  constructor(
    public readonly verificationPublicId: string,
    public readonly requestPublicId: string,
    public readonly reviewerIdentityPublicId: string,
    public readonly correlationId: string,
  ) {
    super();
  }
}
