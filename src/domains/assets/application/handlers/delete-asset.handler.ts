// src/domains/assets/application/handlers/delete-asset.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';
import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { ASSET_EVENT_PUBLISHER, ASSET_REPOSITORY } from '../asset.tokens';

import { DeleteAssetCommand } from '../commands/delete-asset.command';

import { AssetNotFoundException } from '../../domain/exceptions';

import type { AssetRepository } from '../../domain/repositories/asset.repository';

import { AssetId } from '../../domain/value-objects';

@Injectable()
export class DeleteAssetHandler implements CommandHandler<DeleteAssetCommand> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: AssetRepository,

    @Inject(ASSET_EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: DeleteAssetCommand): Promise<void> {
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

    aggregate.delete(
      command.deletedAt,
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
