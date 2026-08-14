// src/domains/social/application/handlers/create-traveller-profile.handler.ts

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { TravellerProfileAggregate } from '../../domain/aggregates/traveller-profile.aggregate';
import { TravellerProfileEntity } from '../../domain/entities/traveller-profile.entity';

import { TravellerProfileAlreadyExistsException } from '../../domain/exceptions';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import {
  AvatarAssetPublicId,
  CountryCode,
  MemberPublicId,
  TravellerBio,
  TravellerHandle,
  TravellerProfilePublicId,
  TravellerProfileStatusValueObject,
  TravellerProfileVisibilityValueObject,
} from '../../domain/value-objects';

import type { CreateTravellerProfileCommand } from '../commands/create-traveller-profile.command';

export class CreateTravellerProfileHandler implements CommandHandler<
  CreateTravellerProfileCommand,
  TravellerProfileAggregate
> {
  constructor(private readonly repository: TravellerProfileRepository) {}

  async execute(
    command: CreateTravellerProfileCommand,
  ): Promise<TravellerProfileAggregate> {
    const memberPublicId = new MemberPublicId(command.memberPublicId);

    // -------------------------------------------------------------------------
    // Uniqueness
    // -------------------------------------------------------------------------

    if (await this.repository.existsByMemberPublicId(memberPublicId)) {
      throw new TravellerProfileAlreadyExistsException();
    }

    // -------------------------------------------------------------------------
    // Value Objects
    // -------------------------------------------------------------------------

    const profile = TravellerProfileEntity.create({
      publicId: new TravellerProfilePublicId(),

      memberPublicId,

      handle: new TravellerHandle(command.handle),

      bio: new TravellerBio(command.bio),

      avatarAssetPublicId:
        command.avatarAssetPublicId !== null
          ? new AvatarAssetPublicId(command.avatarAssetPublicId)
          : undefined,

      countryCode: new CountryCode(command.countryCode),

      status: new TravellerProfileStatusValueObject(command.status),

      visibility: new TravellerProfileVisibilityValueObject(command.visibility),

      // -----------------------------------------------------------------------
      // Materialized journey statistics
      // -----------------------------------------------------------------------

      totalJourneys: 0,
      completedJourneys: 0,

      providerJourneys: 0,
      passengerJourneys: 0,

      completedProviderJourneys: 0,
      completedPassengerJourneys: 0,

      // -----------------------------------------------------------------------
      // Audit timestamps
      // -----------------------------------------------------------------------

      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // -------------------------------------------------------------------------
    // Aggregate
    // -------------------------------------------------------------------------

    const aggregate = TravellerProfileAggregate.create(profile);

    // -------------------------------------------------------------------------
    // Persistence
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);

    return aggregate;
  }
}
