// -----------------------------------------------------------------------------
// sisiMove — Set Traveller Profile Primary Corridor Handler
// -----------------------------------------------------------------------------
//
// Application command handler for setting a Traveller Profile primary
// corridor.
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

import type { SetTravellerProfilePrimaryCorridorCommand } from '../commands/set-traveller-profile-primary-corridor.command';

import { TRAVELLER_PROFILE_TOKENS } from '../traveller-profile.tokens';

import { TravellerProfileNotFoundException } from '../../domain/exceptions';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import {
  TravellerProfileCorridorId,
  TravellerProfileId,
} from '../../domain/value-objects';

// =============================================================================
// Set Traveller Profile Primary Corridor Handler
// =============================================================================

export class SetTravellerProfilePrimaryCorridorHandler implements CommandHandler<SetTravellerProfilePrimaryCorridorCommand> {
  constructor(
    @Inject(TRAVELLER_PROFILE_TOKENS.REPOSITORY)
    private readonly repository: TravellerProfileRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

  async execute(
    command: SetTravellerProfilePrimaryCorridorCommand,
  ): Promise<void> {
    const profileId = new TravellerProfileId(command.travellerProfileId);

    const corridorId = new TravellerProfileCorridorId(command.corridorId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TravellerProfileNotFoundException();
    }

    aggregate.setPrimaryCorridor(
      corridorId,
      command.correlationId,
      command.causationId,
    );

    await this.repository.save(aggregate);
  }
}
