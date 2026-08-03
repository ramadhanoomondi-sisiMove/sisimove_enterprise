import { Inject, Injectable } from '@nestjs/common';

import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';
import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { ASSET_EVENT_PUBLISHER, ASSET_REPOSITORY } from '../asset.tokens';

import { ApproveAssetCommand } from '../commands/approve-asset.command';

import { AssetNotFoundException } from '../../domain/exceptions';

import type { AssetRepository } from '../../domain/repositories/asset.repository';

import {
  AssetId,
  AssetModeratorId,
  ModerationConfidence,
} from '../../domain/value-objects';

@Injectable()
export class ApproveAssetHandler implements CommandHandler<ApproveAssetCommand> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: AssetRepository,

    @Inject(ASSET_EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: ApproveAssetCommand): Promise<void> {
    // ----------------------------------------------------------------------
    // Load Aggregate
    // ----------------------------------------------------------------------

    const aggregate = await this.assetRepository.findByPublicId(
      new AssetId(command.assetId),
    );

    if (!aggregate) {
      throw new AssetNotFoundException(command.assetId);
    }

    // ----------------------------------------------------------------------
    // Execute Domain Behavior
    // ----------------------------------------------------------------------

    aggregate.approveModeration(
      command.type,
      command.moderatorId
        ? new AssetModeratorId(command.moderatorId)
        : undefined,
      command.confidence !== undefined
        ? new ModerationConfidence(command.confidence)
        : undefined,
      command.moderatedAt,
      command.correlationId,
      command.causationId,
    );

    // ----------------------------------------------------------------------
    // Persist
    // ----------------------------------------------------------------------

    await this.assetRepository.save(aggregate);

    // ----------------------------------------------------------------------
    // Publish Events
    // ----------------------------------------------------------------------

    await this.eventPublisher.publishAll(aggregate.pullDomainEvents());
  }
}
