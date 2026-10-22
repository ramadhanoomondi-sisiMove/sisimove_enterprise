import { ForbiddenException, Inject } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { ChangeTravellerProfileHandleCommand } from '../commands/change-traveller-profile-handle.command';

import { TRAVELLER_PROFILE_TOKENS } from '../traveller-profile.tokens';

import {
  TravellerProfileHandleAlreadyExistsException,
  TravellerProfileNotFoundException,
} from '../../domain/exceptions';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { TravellerHandle } from '../../domain/value-objects/traveller-handle.vo';
import { TravellerProfilePublicId } from '../../domain/value-objects/traveller-profile-public-id.vo';

// =============================================================================
// Change Traveller Profile Handle Handler
// =============================================================================

export class ChangeTravellerProfileHandleHandler implements CommandHandler<ChangeTravellerProfileHandleCommand> {
  constructor(
    @Inject(TRAVELLER_PROFILE_TOKENS.REPOSITORY)
    private readonly repository: TravellerProfileRepository,
  ) {}

  async execute(command: ChangeTravellerProfileHandleCommand): Promise<void> {
    // The URL carries the profile PUBLIC ID, not its internal ID.
    const aggregate = await this.repository.findByPublicId(
      new TravellerProfilePublicId(command.travellerProfileId),
    );

    if (aggregate === null) {
      throw new TravellerProfileNotFoundException();
    }

    // Never trust the profile ID supplied by the client as proof of ownership.
    if (aggregate.profile.memberPublicId.value !== command.memberPublicId) {
      throw new ForbiddenException(
        'You are not allowed to update this traveller profile.',
      );
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
