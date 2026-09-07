// -----------------------------------------------------------------------------
// Support — Add Support Case Evidence Command Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { AddSupportCaseEvidenceCommand } from '../commands/add-support-case-evidence.command';

import { SUPPORT_TOKENS } from '../support.tokens';

import { SupportCaseAggregate } from '../../domain/aggregates/support-case.aggregate';

import { SupportCaseEvidenceEntity } from '../../domain/entities/support-case-evidence.entity';

import type { SupportCaseRepository } from '../../domain/repositories/support-case.repository';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class AddSupportCaseEvidenceHandler implements CommandHandler<
  AddSupportCaseEvidenceCommand,
  SupportCaseAggregate
> {
  public constructor(
    @Inject(SUPPORT_TOKENS.REPOSITORIES.SUPPORT_CASE)
    private readonly supportCaseRepository: SupportCaseRepository,
  ) {}

  public async execute(
    command: AddSupportCaseEvidenceCommand,
  ): Promise<SupportCaseAggregate> {
    const aggregate = await this.supportCaseRepository.findByPublicId(
      command.supportCasePublicId,
    );

    if (aggregate === null) {
      throw new Error(
        `Support case not found: ${command.supportCasePublicId.value}.`,
      );
    }

    const evidence = SupportCaseEvidenceEntity.create({
      submittedByPublicId: command.submittedByPublicId,
      assetId: command.assetId,

      ...(command.description !== undefined
        ? {
            description: command.description,
          }
        : {}),
    });

    aggregate.addEvidence(evidence, command.correlationId, command.causationId);

    await this.supportCaseRepository.save(aggregate);

    return aggregate;
  }
}

export default AddSupportCaseEvidenceHandler;
