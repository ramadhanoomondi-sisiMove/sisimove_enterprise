// -----------------------------------------------------------------------------
// Support — Resolve Support Case Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler for resolving a Support Case.
//
// Resolution:
//
// SupportCaseAggregate
// ├── SupportCaseEntity
// └── SupportCaseResolutionEntity
//
// The handler:
//
// 1. loads the aggregate;
// 2. creates the resolution entity;
// 3. attaches the resolution through the aggregate;
// 4. transitions the aggregate to RESOLVED;
// 5. persists the complete aggregate.
//
// The aggregate remains responsible for all domain invariants.
//
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { ResolveSupportCaseCommand } from '../commands/resolve-support-case.command';

import { SUPPORT_TOKENS } from '../support.tokens';

import { SupportCaseAggregate } from '../../domain/aggregates/support-case.aggregate';

import { SupportCaseResolutionEntity } from '../../domain/entities/support-case-resolution.entity';

import type { SupportCaseRepository } from '../../domain/repositories/support-case.repository';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class ResolveSupportCaseHandler implements CommandHandler<
  ResolveSupportCaseCommand,
  SupportCaseAggregate
> {
  public constructor(
    @Inject(SUPPORT_TOKENS.REPOSITORIES.SUPPORT_CASE)
    private readonly supportCaseRepository: SupportCaseRepository,
  ) {}

  public async execute(
    command: ResolveSupportCaseCommand,
  ): Promise<SupportCaseAggregate> {
    const aggregate = await this.supportCaseRepository.findByPublicId(
      command.supportCasePublicId,
    );

    if (aggregate === null) {
      throw new Error(
        `Support case not found: ${command.supportCasePublicId.value}.`,
      );
    }

    const resolvedAt = command.resolvedAt ?? new Date();

    const resolution = SupportCaseResolutionEntity.create({
      type: command.resolutionType,
      summary: command.resolutionSummary,
      resolvedByPublicId: command.resolvedByPublicId,
      resolvedAt,
    });

    aggregate.createResolution(
      resolution,
      command.correlationId,
      command.causationId,
    );

    aggregate.resolve(command.correlationId, command.causationId, resolvedAt);

    await this.supportCaseRepository.save(aggregate);

    return aggregate;
  }
}

export default ResolveSupportCaseHandler;
