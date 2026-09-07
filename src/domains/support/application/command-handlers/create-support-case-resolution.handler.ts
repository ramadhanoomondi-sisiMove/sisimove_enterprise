// -----------------------------------------------------------------------------
// Support — Create Support Case Resolution Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler for creating a resolution child entity.
//
// Important:
//
// Creating a resolution does NOT transition the Support Case to RESOLVED.
//
// The resolution is attached to the SupportCaseAggregate through
// SupportCaseAggregate.createResolution().
//
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { CreateSupportCaseResolutionCommand } from '../commands/create-support-case-resolution.command';

import { SUPPORT_TOKENS } from '../support.tokens';

import { SupportCaseAggregate } from '../../domain/aggregates/support-case.aggregate';

import { SupportCaseResolutionEntity } from '../../domain/entities/support-case-resolution.entity';

import type { SupportCaseRepository } from '../../domain/repositories/support-case.repository';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class CreateSupportCaseResolutionHandler implements CommandHandler<
  CreateSupportCaseResolutionCommand,
  SupportCaseAggregate
> {
  public constructor(
    @Inject(SUPPORT_TOKENS.REPOSITORIES.SUPPORT_CASE)
    private readonly supportCaseRepository: SupportCaseRepository,
  ) {}

  public async execute(
    command: CreateSupportCaseResolutionCommand,
  ): Promise<SupportCaseAggregate> {
    const aggregate = await this.supportCaseRepository.findByPublicId(
      command.supportCasePublicId,
    );

    if (aggregate === null) {
      throw new Error(
        `Support case not found: ${command.supportCasePublicId.value}.`,
      );
    }

    const resolution = SupportCaseResolutionEntity.create({
      type: command.type,
      summary: command.summary,
      resolvedByPublicId: command.resolvedByPublicId,

      ...(command.resolvedAt !== undefined
        ? {
            resolvedAt: command.resolvedAt,
          }
        : {}),
    });

    aggregate.createResolution(
      resolution,
      command.correlationId,
      command.causationId,
    );

    await this.supportCaseRepository.save(aggregate);

    return aggregate;
  }
}

export default CreateSupportCaseResolutionHandler;
