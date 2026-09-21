// -----------------------------------------------------------------------------
// sisiMove — Remove Traveller Profile Preferences Handler
// -----------------------------------------------------------------------------
//
// Application command handler for removing Traveller Profile preferences.
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

import type { RemoveTravellerProfilePreferencesCommand } from '../commands/remove-traveller-profile-preferences.command';

import { TRAVELLER_PROFILE_TOKENS } from '../traveller-profile.tokens';

import { TravellerProfileNotFoundException } from '../../domain/exceptions';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { TravellerProfileId } from '../../domain/value-objects/traveller-profile-id.vo';

// =============================================================================
// Remove Traveller Profile Preferences Handler
// =============================================================================

export class RemoveTravellerProfilePreferencesHandler implements CommandHandler<RemoveTravellerProfilePreferencesCommand> {
  constructor(
    @Inject(TRAVELLER_PROFILE_TOKENS.REPOSITORY)
    private readonly repository: TravellerProfileRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

  async execute(
    command: RemoveTravellerProfilePreferencesCommand,
  ): Promise<void> {
    const profileId = new TravellerProfileId(command.travellerProfileId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TravellerProfileNotFoundException();
    }

    aggregate.removePreferences();

    await this.repository.save(aggregate);
  }
}
