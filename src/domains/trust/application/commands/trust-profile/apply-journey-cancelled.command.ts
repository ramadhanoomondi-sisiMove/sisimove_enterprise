// src/domains/trust/application/commands/trust-profile/apply-journey-cancelled.command.ts

import { Command } from '../../../../../foundation/kernel/application/command';

export class ApplyJourneyCancelledCommand extends Command {
  constructor(
    public readonly trustProfileId: string,
    public readonly journeyPublicId: string,
    public readonly role: string,
    public readonly bookingPublicId: string | undefined,
    public readonly reason: string | undefined,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
