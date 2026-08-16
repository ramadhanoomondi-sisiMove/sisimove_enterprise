// src/domains/journey/application/handlers/journey/attach-preferences.handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { AttachPreferencesCommand } from '../../commands/journey/attach-preferences.command';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyNotFoundException } from '../../../domain/exceptions';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

export class AttachPreferencesHandler implements CommandHandler<
  AttachPreferencesCommand,
  void
> {
  constructor(private readonly journeyRepository: JourneyRepository) {}

  async execute(command: AttachPreferencesCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    //
    // command.journeyPublicId is already a JourneyPublicId Value Object.
    // -------------------------------------------------------------------------

    const aggregate = await this.journeyRepository.findByPublicId(
      command.journeyPublicId,
    );

    if (aggregate === null) {
      throw new JourneyNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Resolve Journey Preferences
    //
    // command.preferencesPublicId is already a
    // JourneyPreferencesPublicId Value Object.
    //
    // The lookup is scoped to the owning Journey aggregate.
    // -------------------------------------------------------------------------

    const preferences = await this.journeyRepository.findPreferencesByPublicId(
      aggregate.journeyId,
      command.preferencesPublicId,
    );

    if (preferences === null) {
      throw new Error(
        `Journey preferences '${command.preferencesPublicId.value}' ` +
          `were not found for Journey '${command.journeyPublicId.value}'.`,
      );
    }

    // -------------------------------------------------------------------------
    // Aggregate Mutation
    // -------------------------------------------------------------------------

    aggregate.attachPreferences(preferences);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.journeyRepository.save(aggregate);
  }
}
