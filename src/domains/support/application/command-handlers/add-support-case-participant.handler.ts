// -----------------------------------------------------------------------------
// Support — Add Support Case Participant Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler for adding a participant to a Support Case.
//
// The participant is a child entity owned by SupportCaseAggregate.
//
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { AddSupportCaseParticipantCommand } from '../commands/add-support-case-participant.command';

import { SUPPORT_TOKENS } from '../support.tokens';

import { SupportCaseAggregate } from '../../domain/aggregates/support-case.aggregate';

import { SupportCaseParticipantEntity } from '../../domain/entities/support-case-participant.entity';

import type { SupportCaseRepository } from '../../domain/repositories/support-case.repository';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class AddSupportCaseParticipantHandler implements CommandHandler<
  AddSupportCaseParticipantCommand,
  SupportCaseAggregate
> {
  public constructor(
    @Inject(SUPPORT_TOKENS.REPOSITORIES.SUPPORT_CASE)
    private readonly supportCaseRepository: SupportCaseRepository,
  ) {}

  public async execute(
    command: AddSupportCaseParticipantCommand,
  ): Promise<SupportCaseAggregate> {
    const aggregate = await this.supportCaseRepository.findByPublicId(
      command.supportCasePublicId,
    );

    if (aggregate === null) {
      throw new Error(
        `Support case not found: ${command.supportCasePublicId.value}.`,
      );
    }

    const participant = SupportCaseParticipantEntity.create({
      memberPublicId: command.memberPublicId,
      role: command.role,
    });

    aggregate.addParticipant(
      participant,
      command.correlationId,
      command.causationId,
    );

    await this.supportCaseRepository.save(aggregate);

    return aggregate;
  }
}

export default AddSupportCaseParticipantHandler;
