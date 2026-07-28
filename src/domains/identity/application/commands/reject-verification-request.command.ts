import { Command } from '../../../../foundation/kernel/application/command';

export class RejectVerificationRequestCommand extends Command {
  constructor(
    public readonly verificationPublicId: string,
    public readonly requestPublicId: string,
    public readonly reviewerIdentityPublicId: string,
    public readonly rejectionReason: string,
    public readonly correlationId: string,
  ) {
    super();
  }
}
