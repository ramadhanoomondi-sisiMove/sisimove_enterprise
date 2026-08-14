// src/domains/social/application/handlers/change-traveller-profile-bio.handler.ts

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { ChangeTravellerProfileBioCommand } from '../commands/change-traveller-profile-bio.command';

import { TravellerProfileNotFoundException } from '../../domain/exceptions';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { TravellerBio } from '../../domain/value-objects/traveller-bio.vo';
import { TravellerProfileId } from '../../domain/value-objects/traveller-profile-id.vo';

export class ChangeTravellerProfileBioHandler implements CommandHandler<ChangeTravellerProfileBioCommand> {
  constructor(private readonly repository: TravellerProfileRepository) {}

  async execute(command: ChangeTravellerProfileBioCommand): Promise<void> {
    const aggregate = await this.repository.findById(
      new TravellerProfileId(command.travellerProfileId),
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
