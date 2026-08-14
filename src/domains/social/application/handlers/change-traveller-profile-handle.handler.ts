// src/domains/social/application/handlers/change-traveller-profile-handle.handler.ts

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { ChangeTravellerProfileHandleCommand } from '../commands/change-traveller-profile-handle.command';

import {
  TravellerProfileHandleAlreadyExistsException,
  TravellerProfileNotFoundException,
} from '../../domain/exceptions';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { TravellerHandle } from '../../domain/value-objects/traveller-handle.vo';
import { TravellerProfileId } from '../../domain/value-objects/traveller-profile-id.vo';

export class ChangeTravellerProfileHandleHandler implements CommandHandler<ChangeTravellerProfileHandleCommand> {
  constructor(private readonly repository: TravellerProfileRepository) {}

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
