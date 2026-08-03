// src/domains/assets/application/handlers/upload-asset.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';
import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { ASSET_EVENT_PUBLISHER, ASSET_REPOSITORY } from '../asset.tokens';

import { UploadAssetCommand } from '../commands/upload-asset.command';

import {
  AssetChecksumAlreadyExistsException,
  AssetNotFoundException,
} from '../../domain/exceptions';

import type { AssetRepository } from '../../domain/repositories/asset.repository';

import { AssetId, Checksum } from '../../domain/value-objects';

@Injectable()
export class UploadAssetHandler implements CommandHandler<UploadAssetCommand> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: AssetRepository,

    @Inject(ASSET_EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: UploadAssetCommand): Promise<void> {
    // ------------------------------------------------------------------------
    // Load Aggregate
    // ------------------------------------------------------------------------

    const assetId = new AssetId(command.assetId);

    const aggregate = await this.assetRepository.findByPublicId(assetId);

    if (!aggregate) {
      throw new AssetNotFoundException(command.assetId);
    }

    // ------------------------------------------------------------------------
    // Build Domain Value Objects
    // ------------------------------------------------------------------------

    const checksum = new Checksum({
      algorithm: command.checksumAlgorithm,
      value: command.checksum,
    });

    // ------------------------------------------------------------------------
    // Application Invariants
    // ------------------------------------------------------------------------

    if (
      await this.assetRepository.existsByChecksum(
        checksum.algorithm,
        checksum.value,
      )
    ) {
      throw new AssetChecksumAlreadyExistsException(checksum.value);
    }

    // ------------------------------------------------------------------------
    // Execute Domain Behavior
    // ------------------------------------------------------------------------

    aggregate.upload(
      checksum,
      command.metadata,
      command.uploadedAt,
      command.correlationId,
      command.causationId,
    );

    // ------------------------------------------------------------------------
    // Persist
    // ------------------------------------------------------------------------

    await this.assetRepository.save(aggregate);

    // ------------------------------------------------------------------------
    // Publish Domain Events
    // ------------------------------------------------------------------------

    await this.eventPublisher.publishAll(aggregate.pullDomainEvents());
  }
}
