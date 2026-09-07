// -----------------------------------------------------------------------------
// Support — Delete Support Case Message Command Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { DeleteSupportCaseMessageCommand } from '../commands/delete-support-case-message.command';

import { SUPPORT_TOKENS } from '../support.tokens';

import { SupportCaseAggregate } from '../../domain/aggregates/support-case.aggregate';

import type { SupportCaseRepository } from '../../domain/repositories/support-case.repository';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class DeleteSupportCaseMessageHandler implements CommandHandler<
  DeleteSupportCaseMessageCommand,
  SupportCaseAggregate
> {
  public constructor(
    @Inject(SUPPORT_TOKENS.REPOSITORIES.SUPPORT_CASE)
    private readonly supportCaseRepository: SupportCaseRepository,
  ) {}

  public async execute(
    command: DeleteSupportCaseMessageCommand,
  ): Promise<SupportCaseAggregate> {
    const aggregate = await this.supportCaseRepository.findByPublicId(
      command.supportCasePublicId,
    );

    if (aggregate === null) {
      throw new Error(
        `Support case not found: ${command.supportCasePublicId.value}.`,
      );
    }

    aggregate.deleteMessage(
      command.messagePublicId,
      command.correlationId,
      command.causationId,
      command.deletedAt ?? new Date(),
    );

    await this.supportCaseRepository.save(aggregate);

    return aggregate;
  }
}

export default DeleteSupportCaseMessageHandler;
