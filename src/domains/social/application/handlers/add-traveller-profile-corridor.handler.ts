// -----------------------------------------------------------------------------
// sisiMove — Add Traveller Profile Corridor Handler
// -----------------------------------------------------------------------------
//
// Application command handler for adding a corridor to a Traveller Profile.
//
// Dependency injection:
//
// - TravellerProfileRepository is a domain abstraction.
// - The repository is injected through the existing Traveller Profile
//   application token because the repository is a TypeScript interface.
//
// -----------------------------------------------------------------------------

import { Inject } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { AddTravellerProfileCorridorCommand } from '../commands/add-traveller-profile-corridor.command';

import { TRAVELLER_PROFILE_TOKENS } from '../traveller-profile.tokens';

import { TravellerProfileNotFoundException } from '../../domain/exceptions';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { TravellerProfileCorridorEntity } from '../../domain/entities/traveller-profile-corridor.entity';

import {
  CorridorKey,
  TravellerProfileCorridorId,
  TravellerProfileId,
} from '../../domain/value-objects';

// =============================================================================
// Add Traveller Profile Corridor Handler
// =============================================================================

export class AddTravellerProfileCorridorHandler implements CommandHandler<AddTravellerProfileCorridorCommand> {
  constructor(
    @Inject(TRAVELLER_PROFILE_TOKENS.REPOSITORY)
    private readonly repository: TravellerProfileRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

  async execute(command: AddTravellerProfileCorridorCommand): Promise<void> {
    const profileId = new TravellerProfileId(command.travellerProfileId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TravellerProfileNotFoundException();
    }

    const corridor = TravellerProfileCorridorEntity.create({
      publicId: new TravellerProfileCorridorId(),

      profileId,

      originName: command.originName.trim(),
      destinationName: command.destinationName.trim(),

      originLatitude: command.originLatitude,
      originLongitude: command.originLongitude,

      destinationLatitude: command.destinationLatitude,
      destinationLongitude: command.destinationLongitude,

      corridorKey: new CorridorKey(command.corridorKey),

      isPrimary: command.isPrimary,

      createdAt: new Date(),
      updatedAt: new Date(),
    });

    aggregate.addCorridor(corridor, command.correlationId, command.causationId);

    await this.repository.save(aggregate);
  }
}
