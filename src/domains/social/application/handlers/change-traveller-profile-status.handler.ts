// -----------------------------------------------------------------------------
// sisiMove — Change Traveller Profile Status Handler
// -----------------------------------------------------------------------------
//
// Application command handler for changing Traveller Profile status.
//
// This operation remains permission-controlled at the HTTP boundary because
// status management is an administrative/system operation rather than an
// ordinary traveller self-service operation.
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

import type { ChangeTravellerProfileStatusCommand } from '../commands/change-traveller-profile-status.command';

import { TRAVELLER_PROFILE_TOKENS } from '../traveller-profile.tokens';

import { TravellerProfileNotFoundException } from '../../domain/exceptions';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { TravellerProfileId } from '../../domain/value-objects/traveller-profile-id.vo';

// =============================================================================
// Change Traveller Profile Status Handler
// =============================================================================

export class ChangeTravellerProfileStatusHandler implements CommandHandler<ChangeTravellerProfileStatusCommand> {
  constructor(
    @Inject(TRAVELLER_PROFILE_TOKENS.REPOSITORY)
    private readonly repository: TravellerProfileRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

  async execute(command: ChangeTravellerProfileStatusCommand): Promise<void> {
    const aggregate = await this.repository.findById(
      new TravellerProfileId(command.travellerProfileId),
    );

    if (aggregate === null) {
      throw new TravellerProfileNotFoundException();
    }

    aggregate.changeStatus(
      command.status,
      command.correlationId,
      command.causationId,
    );

    await this.repository.save(aggregate);
  }
}
