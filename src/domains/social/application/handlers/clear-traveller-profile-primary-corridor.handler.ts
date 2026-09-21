// -----------------------------------------------------------------------------
// sisiMove — Clear Traveller Profile Primary Corridor Handler
// -----------------------------------------------------------------------------
//
// Application command handler for clearing the primary corridor from a
// Traveller Profile.
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

import type { ClearTravellerProfilePrimaryCorridorCommand } from '../commands/clear-traveller-profile-primary-corridor.command';

import { TRAVELLER_PROFILE_TOKENS } from '../traveller-profile.tokens';

import { TravellerProfileNotFoundException } from '../../domain/exceptions';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { TravellerProfileId } from '../../domain/value-objects/traveller-profile-id.vo';

// =============================================================================
// Clear Traveller Profile Primary Corridor Handler
// =============================================================================

export class ClearTravellerProfilePrimaryCorridorHandler implements CommandHandler<ClearTravellerProfilePrimaryCorridorCommand> {
  constructor(
    @Inject(TRAVELLER_PROFILE_TOKENS.REPOSITORY)
    private readonly repository: TravellerProfileRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

  async execute(
    command: ClearTravellerProfilePrimaryCorridorCommand,
  ): Promise<void> {
    const profileId = new TravellerProfileId(command.travellerProfileId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TravellerProfileNotFoundException();
    }

    aggregate.clearPrimaryCorridor();

    await this.repository.save(aggregate);
  }
}
