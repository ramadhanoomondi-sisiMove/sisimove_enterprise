// src/domains/assets/application/handlers/change-asset-visibility.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';
import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { ASSET_EVENT_PUBLISHER, ASSET_REPOSITORY } from '../asset.tokens';

import { ChangeAssetVisibilityCommand } from '../commands/change-asset-visibility.command';

import { AssetNotFoundException } from '../../domain/exceptions';

import type { AssetRepository } from '../../domain/repositories/asset.repository';

import { AssetId } from '../../domain/value-objects';

@Injectable()
export class ChangeAssetVisibilityHandler implements CommandHandler<ChangeAssetVisibilityCommand> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: AssetRepository,

    @Inject(ASSET_EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: ChangeAssetVisibilityCommand): Promise<void> {
    // ----------------------------------------------------------------------
    // Load Aggregate
    // ----------------------------------------------------------------------

    const assetId = new AssetId(command.assetId);

    const aggregate = await this.assetRepository.findByPublicId(assetId);

    if (!aggregate) {
      throw new AssetNotFoundException(command.assetId);
    }

    // ----------------------------------------------------------------------
    // Execute Domain Behavior
    // ----------------------------------------------------------------------

    aggregate.changeVisibility(
      command.visibility,
      command.changedAt,
      command.correlationId,
      command.causationId,
    );

    // ----------------------------------------------------------------------
    // Persist
    // ----------------------------------------------------------------------

    await this.assetRepository.save(aggregate);

    // ----------------------------------------------------------------------
    // Publish Domain Events
    // ----------------------------------------------------------------------

    await this.eventPublisher.publishAll(aggregate.pullDomainEvents());
  }
}
