// -----------------------------------------------------------------------------
// Support — Change Support Case Category Command Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { ChangeSupportCaseCategoryCommand } from '../commands/change-support-case-category.command';

import { SUPPORT_TOKENS } from '../support.tokens';

import { SupportCaseAggregate } from '../../domain/aggregates/support-case.aggregate';

import type { SupportCaseRepository } from '../../domain/repositories/support-case.repository';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class ChangeSupportCaseCategoryHandler implements CommandHandler<
  ChangeSupportCaseCategoryCommand,
  SupportCaseAggregate
> {
  public constructor(
    @Inject(SUPPORT_TOKENS.REPOSITORIES.SUPPORT_CASE)
    private readonly supportCaseRepository: SupportCaseRepository,
  ) {}

  public async execute(
    command: ChangeSupportCaseCategoryCommand,
  ): Promise<SupportCaseAggregate> {
    const aggregate = await this.supportCaseRepository.findByPublicId(
      command.supportCasePublicId,
    );

    if (aggregate === null) {
      throw new Error(
        `Support case not found: ${command.supportCasePublicId.value}.`,
      );
    }

    aggregate.changeCategory(
      command.category,
      command.correlationId,
      command.causationId,
    );

    await this.supportCaseRepository.save(aggregate);

    return aggregate;
  }
}

export default ChangeSupportCaseCategoryHandler;
