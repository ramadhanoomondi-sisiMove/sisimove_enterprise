// src/domains/journey/application/handlers/journey/attach-preferences.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Preferences Command Handler
// -----------------------------------------------------------------------------
//
// Application-layer command handler for attaching existing Journey Preferences
// to a Journey aggregate.
//
// Responsibilities:
// - resolve the Journey aggregate;
// - resolve the Journey Preferences within the Journey aggregate boundary;
// - delegate the attachment mutation to the Journey aggregate;
// - persist the mutated aggregate.
//
// The command already contains JourneyPublicId and JourneyPreferencesPublicId
// as domain value objects. The handler therefore does not reconstruct them.
//
// The handler does NOT:
// - access Prisma directly;
// - perform HTTP concerns;
// - mutate persistence models;
// - implement Journey business rules.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

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
// Application Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_TOKENS } from '../../journey.tokens';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class AttachPreferencesHandler implements CommandHandler<
  AttachPreferencesCommand,
  void
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly journeyRepository: JourneyRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(command: AttachPreferencesCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    //
    // command.journeyPublicId is already a JourneyPublicId Value Object.
    // Do not construct another JourneyPublicId here.
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
    // command.preferencesPublicId is already a JourneyPreferencesPublicId
    // Value Object. The lookup is scoped to the owning Journey aggregate.
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
    //
    // The Journey aggregate owns the business rules governing preferences
    // attachment.
    //

    aggregate.attachPreferences(preferences);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.journeyRepository.save(aggregate);
  }
}
