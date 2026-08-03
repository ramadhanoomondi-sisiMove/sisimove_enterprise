// src/domains/assets/application/handlers/create-asset.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';
import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { ASSET_EVENT_PUBLISHER, ASSET_REPOSITORY } from '../asset.tokens';

import { CreateAssetCommand } from '../commands/create-asset.command';

import { AssetAggregate } from '../../domain/aggregates/asset.aggregate';
import { AssetEntity } from '../../domain/entities/asset.entity';

import {
  AssetChecksumAlreadyExistsException,
  AssetObjectKeyAlreadyExistsException,
} from '../../domain/exceptions';

import type { AssetRepository } from '../../domain/repositories/asset.repository';

import {
  AssetId,
  AssetOwnerIdentityId,
  AssetStatus,
  AssetVisibility,
  Checksum,
} from '../../domain/value-objects';

@Injectable()
export class CreateAssetHandler implements CommandHandler<
  CreateAssetCommand,
  string
> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: AssetRepository,

    @Inject(ASSET_EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreateAssetCommand): Promise<string> {
    // ----------------------------------------------------------------------
    // Application Invariants
    // ----------------------------------------------------------------------

    if (await this.assetRepository.existsByObjectKey(command.objectKey)) {
      throw new AssetObjectKeyAlreadyExistsException(command.objectKey);
    }

    // ----------------------------------------------------------------------
    // Optional Checksum
    // ----------------------------------------------------------------------

    const checksum =
      command.checksumAlgorithm !== undefined && command.checksum !== undefined
        ? new Checksum({
            algorithm: command.checksumAlgorithm,
            value: command.checksum,
          })
        : undefined;

    if (
      checksum &&
      (await this.assetRepository.existsByChecksum(
        checksum.algorithm,
        checksum.value,
      ))
    ) {
      throw new AssetChecksumAlreadyExistsException(checksum.value);
    }

    // ----------------------------------------------------------------------
    // Create Aggregate
    // ----------------------------------------------------------------------

    const now = new Date();

    const asset = AssetEntity.create({
      publicId: new AssetId(),

      ownerIdentityId: command.ownerIdentityId
        ? new AssetOwnerIdentityId(command.ownerIdentityId)
        : undefined,

      type: command.type,
      category: command.category,

      status: AssetStatus.UPLOADING,
      visibility: AssetVisibility.PRIVATE,

      storageProvider: command.storageProvider,

      bucket: command.bucket,
      objectKey: command.objectKey,

      originalFilename: command.originalFilename,
      storedFilename: command.storedFilename,

      mimeType: command.mimeType,
      extension: command.extension,

      sizeBytes: command.sizeBytes,

      checksumAlgorithm: checksum?.algorithm,
      checksum: checksum?.value,

      width: undefined,
      height: undefined,
      colorDepth: undefined,

      durationSeconds: undefined,
      bitrate: undefined,
      frameRate: undefined,

      blurHash: undefined,

      metadata: command.metadata,

      uploadedAt: undefined,
      archivedAt: undefined,
      deletedAt: undefined,

      createdAt: now,
      updatedAt: now,
    });

    const aggregate = AssetAggregate.create(
      asset,
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

    // ----------------------------------------------------------------------
    // Result
    // ----------------------------------------------------------------------

    return asset.publicId.value;
  }
}
