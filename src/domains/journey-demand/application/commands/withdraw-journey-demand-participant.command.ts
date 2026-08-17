// src/domains/journey-demand/application/commands/withdraw-journey-demand-participant.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class WithdrawJourneyDemandParticipantCommand extends Command {
  constructor(
    public readonly journeyDemandPublicId: string,
    public readonly participantPublicId: string,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
