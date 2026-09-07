// -----------------------------------------------------------------------------
// Support — Create Support Case Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler for creating a SupportCase aggregate.
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
// - create the SupportCase entity;
// - create the SupportCase aggregate;
// - record the SupportCase-created domain event;
// - persist the complete SupportCase aggregate;
// - return the created aggregate.
//
// This handler does NOT:
//
// - access Prisma directly;
// - perform persistence mapping;
// - validate Identity existence;
// - validate Identity state;
// - validate referenced domain existence;
// - authorize the caller;
// - create participants;
// - create messages;
// - create notes;
// - create evidence;
// - create resolutions;
// - publish domain events directly;
// - implement Support Case lifecycle rules.
//
// Cross-domain references remain opaque to Support.
//
// Entity construction belongs to SupportCaseEntity.
// Aggregate construction belongs to SupportCaseAggregate.
// Persistence belongs to SupportCaseRepository.
//
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { SUPPORT_TOKENS } from '../support.tokens';

import type { CreateSupportCaseCommand } from '../commands/create-support-case.command';

import { SupportCaseAggregate } from '../../domain/aggregates/support-case.aggregate';

import { SupportCaseEntity } from '../../domain/entities/support-case.entity';

import type { SupportCaseRepository } from '../../domain/repositories/support-case.repository';

import { SupportCaseStatus } from '../../domain/value-objects/support-case-status.vo';

@Injectable()
export class CreateSupportCaseHandler implements CommandHandler<
  CreateSupportCaseCommand,
  SupportCaseAggregate
> {
  public constructor(
    @Inject(SUPPORT_TOKENS.REPOSITORIES.SUPPORT_CASE)
    private readonly supportCaseRepository: SupportCaseRepository,
  ) {}

  public async execute(
    command: CreateSupportCaseCommand,
  ): Promise<SupportCaseAggregate> {
    const supportCase = SupportCaseEntity.create({
      requesterPublicId: command.requesterPublicId,

      status: SupportCaseStatus.create('OPEN'),

      priority: command.priority,
      category: command.category,

      subject: command.subject,

      ...(command.description !== undefined
        ? {
            description: command.description,
          }
        : {}),

      ...(command.referenceType !== undefined
        ? {
            referenceType: command.referenceType,
          }
        : {}),

      ...(command.referencePublicId !== undefined
        ? {
            referencePublicId: command.referencePublicId,
          }
        : {}),
    });

    const aggregate = SupportCaseAggregate.create(supportCase);

    aggregate.recordCreated(command.correlationId, command.causationId);

    await this.supportCaseRepository.save(aggregate);

    return aggregate;
  }
}

export default CreateSupportCaseHandler;
