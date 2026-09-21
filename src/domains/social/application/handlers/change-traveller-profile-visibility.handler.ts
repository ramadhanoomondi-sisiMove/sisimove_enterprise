// -----------------------------------------------------------------------------
// sisiMove — Change Traveller Profile Visibility Handler
// -----------------------------------------------------------------------------
//
// Application command handler for changing Traveller Profile visibility.
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

import type { ChangeTravellerProfileVisibilityCommand } from '../commands/change-traveller-profile-visibility.command';

import { TRAVELLER_PROFILE_TOKENS } from '../traveller-profile.tokens';

import { TravellerProfileNotFoundException } from '../../domain/exceptions';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { TravellerProfileId } from '../../domain/value-objects/traveller-profile-id.vo';

// =============================================================================
// Change Traveller Profile Visibility Handler
// =============================================================================

export class ChangeTravellerProfileVisibilityHandler implements CommandHandler<ChangeTravellerProfileVisibilityCommand> {
  constructor(
    @Inject(TRAVELLER_PROFILE_TOKENS.REPOSITORY)
    private readonly repository: TravellerProfileRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

  async execute(
    command: ChangeTravellerProfileVisibilityCommand,
  ): Promise<void> {
    const aggregate = await this.repository.findById(
      new TravellerProfileId(command.travellerProfileId),
    );

    if (aggregate === null) {
      throw new TravellerProfileNotFoundException();
    }

    aggregate.changeVisibility(
      command.visibility,
      command.correlationId,
      command.causationId,
    );

    await this.repository.save(aggregate);
  }
}
