// -----------------------------------------------------------------------------
// sisiMove — Change Traveller Profile Preferences Handler
// -----------------------------------------------------------------------------
//
// Application command handler for changing Traveller Profile preferences.
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

import type { ChangeTravellerProfilePreferencesCommand } from '../commands/change-traveller-profile-preferences.command';

import { TRAVELLER_PROFILE_TOKENS } from '../traveller-profile.tokens';

import {
  TravellerProfileNotFoundException,
  TravellerProfilePreferencesNotFoundException,
} from '../../domain/exceptions';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { TravellerProfileId } from '../../domain/value-objects/traveller-profile-id.vo';

// =============================================================================
// Change Traveller Profile Preferences Handler
// =============================================================================

export class ChangeTravellerProfilePreferencesHandler implements CommandHandler<ChangeTravellerProfilePreferencesCommand> {
  constructor(
    @Inject(TRAVELLER_PROFILE_TOKENS.REPOSITORY)
    private readonly repository: TravellerProfileRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

  async execute(
    command: ChangeTravellerProfilePreferencesCommand,
  ): Promise<void> {
    const profileId = new TravellerProfileId(command.travellerProfileId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TravellerProfileNotFoundException();
    }

    if (aggregate.preferences === undefined) {
      throw new TravellerProfilePreferencesNotFoundException();
    }

    aggregate.changePreferences(
      command.showJourneyHistory,
      command.showJourneyStatistics,
      command.allowJourneyInvites,
      command.correlationId,
      command.causationId,
    );

    await this.repository.save(aggregate);
  }
}
