// -----------------------------------------------------------------------------
// Support — Wait For Member Support Case Command Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { WaitForMemberSupportCaseCommand } from '../commands/wait-for-member-support-case.command';

import { SUPPORT_TOKENS } from '../support.tokens';

import { SupportCaseAggregate } from '../../domain/aggregates/support-case.aggregate';

import type { SupportCaseRepository } from '../../domain/repositories/support-case.repository';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class WaitForMemberSupportCaseHandler implements CommandHandler<
  WaitForMemberSupportCaseCommand,
  SupportCaseAggregate
> {
  public constructor(
    @Inject(SUPPORT_TOKENS.REPOSITORIES.SUPPORT_CASE)
    private readonly supportCaseRepository: SupportCaseRepository,
  ) {}

  public async execute(
    command: WaitForMemberSupportCaseCommand,
  ): Promise<SupportCaseAggregate> {
    const aggregate = await this.supportCaseRepository.findByPublicId(
      command.supportCasePublicId,
    );

    if (aggregate === null) {
      throw new Error(
        `Support case not found: ${command.supportCasePublicId.value}.`,
      );
    }

    aggregate.waitForMember(command.correlationId, command.causationId);

    await this.supportCaseRepository.save(aggregate);

    return aggregate;
  }
}

export default WaitForMemberSupportCaseHandler;
