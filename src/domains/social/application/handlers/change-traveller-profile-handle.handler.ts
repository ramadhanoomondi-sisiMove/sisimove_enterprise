// -----------------------------------------------------------------------------
// sisiMove — Change Traveller Profile Handle Handler
// -----------------------------------------------------------------------------
//
// Application command handler for changing a Traveller Profile handle.
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

import type { ChangeTravellerProfileHandleCommand } from '../commands/change-traveller-profile-handle.command';

import { TRAVELLER_PROFILE_TOKENS } from '../traveller-profile.tokens';

import {
  TravellerProfileHandleAlreadyExistsException,
  TravellerProfileNotFoundException,
} from '../../domain/exceptions';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { TravellerHandle } from '../../domain/value-objects/traveller-handle.vo';
import { TravellerProfileId } from '../../domain/value-objects/traveller-profile-id.vo';

// =============================================================================
// Change Traveller Profile Handle Handler
// =============================================================================

export class ChangeTravellerProfileHandleHandler implements CommandHandler<ChangeTravellerProfileHandleCommand> {
  constructor(
    @Inject(TRAVELLER_PROFILE_TOKENS.REPOSITORY)
    private readonly repository: TravellerProfileRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

  async execute(command: ChangeTravellerProfileHandleCommand): Promise<void> {
    const profileId = new TravellerProfileId(command.travellerProfileId);

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TravellerProfileNotFoundException();
    }

    const handle = new TravellerHandle(command.handle);

    const existingProfile = await this.repository.findProfileByHandle(handle);

    if (
      existingProfile !== null &&
      !existingProfile.id.equals(aggregate.profile.id)
    ) {
      throw new TravellerProfileHandleAlreadyExistsException(handle.value);
    }

    aggregate.changeHandle(handle, command.correlationId, command.causationId);

    await this.repository.save(aggregate);
  }
}
