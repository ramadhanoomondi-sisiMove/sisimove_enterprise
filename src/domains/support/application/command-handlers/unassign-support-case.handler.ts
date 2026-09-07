// -----------------------------------------------------------------------------
// Support — Unassign Support Case Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler for removing the current assignment from a
// SupportCase aggregate.
//
// Responsibilities:
//
// - load the SupportCase aggregate;
// - delegate unassignment to the aggregate;
// - persist the updated aggregate;
// - return the updated aggregate.
//
// Domain behavior remains inside SupportCaseAggregate.unassign().
//
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { UnassignSupportCaseCommand } from '../commands/unassign-support-case.command';

import { SUPPORT_TOKENS } from '../support.tokens';

import { SupportCaseAggregate } from '../../domain/aggregates/support-case.aggregate';

import type { SupportCaseRepository } from '../../domain/repositories/support-case.repository';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class UnassignSupportCaseHandler implements CommandHandler<
  UnassignSupportCaseCommand,
  SupportCaseAggregate
> {
  public constructor(
    @Inject(SUPPORT_TOKENS.REPOSITORIES.SUPPORT_CASE)
    private readonly supportCaseRepository: SupportCaseRepository,
  ) {}

  public async execute(
    command: UnassignSupportCaseCommand,
  ): Promise<SupportCaseAggregate> {
    const aggregate = await this.supportCaseRepository.findByPublicId(
      command.supportCasePublicId,
    );

    if (aggregate === null) {
      throw new Error(
        `Support case not found: ${command.supportCasePublicId.value}.`,
      );
    }

    aggregate.unassign(command.correlationId, command.causationId);

    await this.supportCaseRepository.save(aggregate);

    return aggregate;
  }
}

export default UnassignSupportCaseHandler;
