// -----------------------------------------------------------------------------
// Support — Add Support Case Message Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler for adding a message to a Support Case.
//
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { AddSupportCaseMessageCommand } from '../commands/add-support-case-message.command';

import { SUPPORT_TOKENS } from '../support.tokens';

import { SupportCaseAggregate } from '../../domain/aggregates/support-case.aggregate';

import { SupportCaseMessageEntity } from '../../domain/entities/support-case-message.entity';

import type { SupportCaseRepository } from '../../domain/repositories/support-case.repository';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class AddSupportCaseMessageHandler implements CommandHandler<
  AddSupportCaseMessageCommand,
  SupportCaseAggregate
> {
  public constructor(
    @Inject(SUPPORT_TOKENS.REPOSITORIES.SUPPORT_CASE)
    private readonly supportCaseRepository: SupportCaseRepository,
  ) {}

  public async execute(
    command: AddSupportCaseMessageCommand,
  ): Promise<SupportCaseAggregate> {
    const aggregate = await this.supportCaseRepository.findByPublicId(
      command.supportCasePublicId,
    );

    if (aggregate === null) {
      throw new Error(
        `Support case not found: ${command.supportCasePublicId.value}.`,
      );
    }

    const message = SupportCaseMessageEntity.create({
      senderPublicId: command.senderPublicId,
      type: command.type,

      ...(command.content !== undefined
        ? {
            content: command.content,
          }
        : {}),

      ...(command.assetId !== undefined
        ? {
            assetId: command.assetId,
          }
        : {}),

      ...(command.sentAt !== undefined
        ? {
            sentAt: command.sentAt,
          }
        : {}),
    });

    aggregate.addMessage(message, command.correlationId, command.causationId);

    await this.supportCaseRepository.save(aggregate);

    return aggregate;
  }
}

export default AddSupportCaseMessageHandler;
