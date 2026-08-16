// src/domains/trust/application/handlers/trust-badge/create-trust-badge.handler.ts

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { CreateTrustBadgeCommand } from '../../commands/trust-badge/create-trust-badge.command';

import { TrustBadgeAggregate } from '../../../domain/aggregates/trust-badge.aggregate';
import { TrustBadgeEntity } from '../../../domain/entities/trust-badge.entity';

import type { TrustBadgeRepository } from '../../../domain/repositories/trust-badge.repository';

import {
  AssetPublicId,
  TrustBadgeDescription,
  TrustBadgeId,
  TrustBadgeName,
  TrustBadgeTypeValueObject,
} from '../../../domain/value-objects';

export class CreateTrustBadgeHandler implements CommandHandler<
  CreateTrustBadgeCommand,
  TrustBadgeAggregate
> {
  constructor(private readonly repository: TrustBadgeRepository) {}

  async execute(
    command: CreateTrustBadgeCommand,
  ): Promise<TrustBadgeAggregate> {
    const badge = TrustBadgeEntity.create({
      publicId: new TrustBadgeId(),

      type: new TrustBadgeTypeValueObject(command.type),

      name: new TrustBadgeName(command.name),

      description:
        command.description !== undefined
          ? new TrustBadgeDescription(command.description)
          : undefined,

      assetPublicId:
        command.assetPublicId !== undefined
          ? new AssetPublicId(command.assetPublicId)
          : undefined,

      active: true,

      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const aggregate = TrustBadgeAggregate.create(badge);

    await this.repository.save(aggregate);

    return aggregate;
  }
}
