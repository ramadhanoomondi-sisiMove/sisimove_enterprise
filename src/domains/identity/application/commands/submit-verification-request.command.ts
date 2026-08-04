// src/domains/identity/application/commands/submit-verification-request.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

import type { VerificationRequestType } from '../../domain/enums/verification-request-type.enum';

export class SubmitVerificationRequestCommand extends Command {
  constructor(
    public readonly verificationPublicId: string,
    public readonly type: VerificationRequestType,
    public readonly assetId: string,
    public readonly metadata: Readonly<Record<string, unknown>> | undefined,
    public readonly correlationId: string,
  ) {
    super();
  }
}
