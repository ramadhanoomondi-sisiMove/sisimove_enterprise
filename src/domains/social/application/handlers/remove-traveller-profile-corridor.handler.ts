// -----------------------------------------------------------------------------
// sisiMove — Remove Traveller Profile Corridor Handler
// -----------------------------------------------------------------------------
//
// Application command handler for removing a corridor from a Traveller Profile.
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

import type { RemoveTravellerProfileCorridorCommand } from '../commands/remove-traveller-profile-corridor.command';

import { TRAVELLER_PROFILE_TOKENS } from '../traveller-profile.tokens';

import { TravellerProfileNotFoundException } from '../../domain/exceptions';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import {
  TravellerProfileCorridorId,
  TravellerProfileId,
} from '../../domain/value-objects';

// =============================================================================
// Remove Traveller Profile Corridor Handler
// =============================================================================

export class RemoveTravellerProfileCorridorHandler implements CommandHandler<RemoveTravellerProfileCorridorCommand> {
  constructor(
    @Inject(TRAVELLER_PROFILE_TOKENS.REPOSITORY)
    private readonly repository: TravellerProfileRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

  async execute(command: RemoveTravellerProfileCorridorCommand): Promise<void> {
    const profileId = new TravellerProfileId(command.travellerProfileId);

    const corridorId = new TravellerProfileCorridorId(command.corridorId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TravellerProfileNotFoundException();
    }

    aggregate.removeCorridor(
      corridorId,
      command.correlationId,
      command.causationId,
    );

    await this.repository.save(aggregate);
  }
}
