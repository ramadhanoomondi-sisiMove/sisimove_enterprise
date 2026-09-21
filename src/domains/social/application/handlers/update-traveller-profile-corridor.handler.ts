// -----------------------------------------------------------------------------
// sisiMove — Update Traveller Profile Corridor Handler
// -----------------------------------------------------------------------------
//
// Application command handler for updating a Traveller Profile corridor.
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

import type { UpdateTravellerProfileCorridorCommand } from '../commands/update-traveller-profile-corridor.command';

import {
  TravellerProfileCorridorNotFoundException,
  TravellerProfileNotFoundException,
} from '../../domain/exceptions';

import { TRAVELLER_PROFILE_TOKENS } from '../traveller-profile.tokens';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import {
  CorridorKey,
  TravellerProfileCorridorId,
  TravellerProfileId,
} from '../../domain/value-objects';

// =============================================================================
// Update Traveller Profile Corridor Handler
// =============================================================================

export class UpdateTravellerProfileCorridorHandler implements CommandHandler<UpdateTravellerProfileCorridorCommand> {
  constructor(
    @Inject(TRAVELLER_PROFILE_TOKENS.REPOSITORY)
    private readonly repository: TravellerProfileRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

  async execute(command: UpdateTravellerProfileCorridorCommand): Promise<void> {
    const profileId = new TravellerProfileId(command.travellerProfileId);

    const corridorId = new TravellerProfileCorridorId(command.corridorId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TravellerProfileNotFoundException();
    }

    const corridor = aggregate.getCorridorById(corridorId);

    if (corridor === undefined) {
      throw new TravellerProfileCorridorNotFoundException();
    }

    corridor.setOriginName(command.originName.trim());
    corridor.setDestinationName(command.destinationName.trim());

    corridor.setOriginCoordinates(
      command.originLatitude,
      command.originLongitude,
    );

    corridor.setDestinationCoordinates(
      command.destinationLatitude,
      command.destinationLongitude,
    );

    corridor.setCorridorKey(new CorridorKey(command.corridorKey));

    corridor.setUpdatedAt(new Date());

    aggregate.updateCorridor(
      corridorId,
      command.correlationId,
      command.causationId,
    );

    await this.repository.save(aggregate);
  }
}
