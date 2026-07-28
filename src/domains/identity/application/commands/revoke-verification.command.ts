import { Command } from '@foundation/kernel/application/command';

export class RevokeVerificationCommand extends Command {
  constructor(
    public readonly verificationPublicId: string,
    public readonly reviewerIdentityPublicId: string,
    public readonly revocationReason: string,
    public readonly correlationId: string,
  ) {
    super();
  }
}
