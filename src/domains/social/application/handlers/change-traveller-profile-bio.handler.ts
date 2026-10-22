import { Inject } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { ChangeTravellerProfileBioCommand } from '../commands/change-traveller-profile-bio.command';

import { TRAVELLER_PROFILE_TOKENS } from '../traveller-profile.tokens';

import { TravellerProfileNotFoundException } from '../../domain/exceptions';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { TravellerBio } from '../../domain/value-objects/traveller-bio.vo';
import { TravellerProfilePublicId } from '../../domain/value-objects/traveller-profile-public-id.vo';

// =============================================================================
// Change Traveller Profile Bio Handler
// =============================================================================

export class ChangeTravellerProfileBioHandler implements CommandHandler<ChangeTravellerProfileBioCommand> {
  constructor(
    @Inject(TRAVELLER_PROFILE_TOKENS.REPOSITORY)
    private readonly repository: TravellerProfileRepository,
  ) {}

  async execute(command: ChangeTravellerProfileBioCommand): Promise<void> {
    const aggregate = await this.repository.findByPublicId(
      new TravellerProfilePublicId(command.travellerProfileId),
    );

    if (aggregate === null) {
      throw new TravellerProfileNotFoundException();
    }

    aggregate.changeBio(
      new TravellerBio(command.bio),
      command.correlationId,
      command.causationId,
    );

    await this.repository.save(aggregate);
  }
}
