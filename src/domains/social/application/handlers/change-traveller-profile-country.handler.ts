import { Inject } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { ChangeTravellerProfileCountryCommand } from '../commands/change-traveller-profile-country.command';

import { TRAVELLER_PROFILE_TOKENS } from '../traveller-profile.tokens';

import { TravellerProfileNotFoundException } from '../../domain/exceptions';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { CountryCode } from '../../domain/value-objects/country-code.vo';
import { TravellerProfilePublicId } from '../../domain/value-objects/traveller-profile-public-id.vo';

// =============================================================================
// Change Traveller Profile Country Handler
// =============================================================================

export class ChangeTravellerProfileCountryHandler implements CommandHandler<ChangeTravellerProfileCountryCommand> {
  constructor(
    @Inject(TRAVELLER_PROFILE_TOKENS.REPOSITORY)
    private readonly repository: TravellerProfileRepository,
  ) {}

  async execute(command: ChangeTravellerProfileCountryCommand): Promise<void> {
    const aggregate = await this.repository.findByPublicId(
      new TravellerProfilePublicId(command.travellerProfileId),
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
