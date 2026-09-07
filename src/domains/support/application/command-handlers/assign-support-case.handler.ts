// -----------------------------------------------------------------------------
// Support — Assign Support Case Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler for assigning a SupportCase aggregate.
//
// Aggregate:
//
// SupportCaseAggregate
// ├── SupportCaseEntity
// ├── SupportCaseParticipantEntity[]
// ├── SupportCaseMessageEntity[]
// ├── SupportCaseNoteEntity[]
// ├── SupportCaseEvidenceEntity[]
// └── SupportCaseResolutionEntity?
//
// Responsibilities:
//
// - load the SupportCase aggregate;
// - assign the Support Case to the requested member/support agent;
// - persist the updated SupportCase aggregate;
// - return the updated aggregate.
//
// This handler does NOT:
//
// - access Prisma directly;
// - perform persistence mapping;
// - resolve the assignee through Identity;
// - validate Identity existence;
// - validate Identity state;
// - authorize the caller;
// - implement assignment business rules;
// - mutate SupportCaseEntity directly;
// - emit domain events directly.
//
// SupportCaseAggregate.assignTo() owns assignment behavior and domain event
// recording.
//
// Cross-domain references remain opaque to Support.
//
// Aggregate loading belongs to SupportCaseRepository.
// Assignment behavior belongs to SupportCaseAggregate.
// Persistence belongs to SupportCaseRepository.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Support — Application
// -----------------------------------------------------------------------------

import type { AssignSupportCaseCommand } from '../commands/assign-support-case.command';

import { SUPPORT_TOKENS } from '../support.tokens';

// -----------------------------------------------------------------------------
// Support — Domain
// -----------------------------------------------------------------------------

import { SupportCaseAggregate } from '../../domain/aggregates/support-case.aggregate';

import type { SupportCaseRepository } from '../../domain/repositories/support-case.repository';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class AssignSupportCaseHandler implements CommandHandler<
  AssignSupportCaseCommand,
  SupportCaseAggregate
> {
  public constructor(
    @Inject(SUPPORT_TOKENS.REPOSITORIES.SUPPORT_CASE)
    private readonly supportCaseRepository: SupportCaseRepository,
  ) {}

  public async execute(
    command: AssignSupportCaseCommand,
  ): Promise<SupportCaseAggregate> {
    const aggregate = await this.supportCaseRepository.findByPublicId(
      command.supportCasePublicId,
    );

    if (aggregate === null) {
      throw new Error(
        `Support case not found: ${command.supportCasePublicId.value}.`,
      );
    }

    aggregate.assignTo(
      command.assignedToPublicId,
      command.correlationId,
      command.causationId,
    );

    await this.supportCaseRepository.save(aggregate);

    return aggregate;
  }
}

export default AssignSupportCaseHandler;
