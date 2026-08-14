// src/domains/social/application/handlers/change-traveller-profile-country.handler.ts

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { ChangeTravellerProfileCountryCommand } from '../commands/change-traveller-profile-country.command';

import { TravellerProfileNotFoundException } from '../../domain/exceptions';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { CountryCode } from '../../domain/value-objects/country-code.vo';
import { TravellerProfileId } from '../../domain/value-objects/traveller-profile-id.vo';

export class ChangeTravellerProfileCountryHandler implements CommandHandler<ChangeTravellerProfileCountryCommand> {
  constructor(private readonly repository: TravellerProfileRepository) {}

  async execute(command: ChangeTravellerProfileCountryCommand): Promise<void> {
    const aggregate = await this.repository.findById(
      new TravellerProfileId(command.travellerProfileId),
    );

    if (aggregate === null) {
      throw new TravellerProfileNotFoundException();
    }

    aggregate.changeCountry(
      new CountryCode(command.countryCode),
      command.correlationId,
      command.causationId,
    );

    await this.repository.save(aggregate);
  }
}
