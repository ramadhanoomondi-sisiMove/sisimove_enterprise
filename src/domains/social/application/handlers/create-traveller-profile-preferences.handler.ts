// -----------------------------------------------------------------------------
// sisiMove — Create Traveller Profile Preferences Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for creating and attaching
// TravellerProfilePreferences to an existing TravellerProfile aggregate.
//
// Responsibilities:
//
// - Resolve TravellerProfileRepository through the application DI token.
// - Resolve the existing TravellerProfile aggregate.
// - Convert the supplied profile identifier into a domain value object.
// - Construct TravellerProfilePreferencesEntity.
// - Attach the preferences through TravellerProfileAggregate.
// - Pass correlation/causation metadata to the aggregate.
// - Persist the updated aggregate.
//
// This handler does NOT:
//
// - Create a TravellerProfile.
// - Mutate TravellerProfileEntity directly.
// - Mutate TravellerProfileAggregate internals directly.
// - Persist TravellerProfilePreferences independently.
// - Create Trust.
// - Create Verification.
// - Create Authentication.
// - Assign Identity roles.
// - Communicate with external systems.
//
// TravellerProfileAggregate remains responsible for aggregate-level rules,
// including preventing duplicate preferences.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     CreateTravellerProfilePreferencesCommand
//                         │
//                         ▼
//              TravellerProfileId
//                         │
//                         ▼
//              repository.findById()
//                         │
//                         ├── not found → throw
//                         │
//                         ▼
//              TravellerProfileAggregate
//                         │
//                         ▼
//       TravellerProfilePreferencesEntity.create()
//                         │
//                         ▼
//              aggregate.attachPreferences()
//                         │
//                         ├── aggregate invariant validation
//                         ├── child entity attachment
//                         └── domain event recording
//                         │
//                         ▼
//                 repository.save()
//
// -----------------------------------------------------------------------------
//
// Dependency Injection:
//
//     CreateTravellerProfilePreferencesHandler
//                         │
//                         ▼
//     TRAVELLER_PROFILE_TOKENS.REPOSITORY
//                         │
//                         ▼
//     TravellerProfileRepository
//                         │
//                         ▼
//     PrismaTravellerProfileRepository
//
// The handler depends on the repository abstraction rather than the Prisma
// infrastructure implementation.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { TRAVELLER_PROFILE_TOKENS } from '../traveller-profile.tokens';

// -----------------------------------------------------------------------------
// Application — Command
// -----------------------------------------------------------------------------

import type { CreateTravellerProfilePreferencesCommand } from '../commands/create-traveller-profile-preferences.command';

// -----------------------------------------------------------------------------
// Domain — Repository
// -----------------------------------------------------------------------------

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

// -----------------------------------------------------------------------------
// Domain — Exception
// -----------------------------------------------------------------------------

import { TravellerProfileNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Domain — Entity
// -----------------------------------------------------------------------------

import { TravellerProfilePreferencesEntity } from '../../domain/entities/traveller-profile-preferences.entity';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  TravellerProfileId,
  TravellerProfilePreferencesId,
} from '../../domain/value-objects';

// =============================================================================
// Handler
// =============================================================================

/**
 * Creates and attaches TravellerProfilePreferences to an existing
 * TravellerProfile aggregate.
 *
 * The handler performs application orchestration only:
 *
 *     Command
 *       │
 *       ▼
 *     Convert profile ID
 *       │
 *       ▼
 *     Load aggregate
 *       │
 *       ▼
 *     Create preferences entity
 *       │
 *       ▼
 *     aggregate.attachPreferences()
 *       │
 *       ▼
 *     repository.save()
 *
 * The aggregate remains responsible for aggregate-level invariants and
 * domain-event recording.
 */
@Injectable()
export class CreateTravellerProfilePreferencesHandler implements CommandHandler<CreateTravellerProfilePreferencesCommand> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  /**
   * Inject the TravellerProfile repository through the application token.
   *
   * TravellerProfileRepository is an interface/type and therefore is not a
   * runtime NestJS injection token by itself.
   */
  public constructor(
    @Inject(TRAVELLER_PROFILE_TOKENS.REPOSITORY)
    private readonly repository: TravellerProfileRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the Create Traveller Profile Preferences command.
   *
   * The handler:
   *
   * 1. Validates that a command was supplied.
   * 2. Converts the profile identifier into TravellerProfileId.
   * 3. Loads the existing TravellerProfile aggregate.
   * 4. Creates the preferences child entity.
   * 5. Attaches it through the aggregate.
   * 6. Persists the aggregate.
   */
  public async execute(
    command: CreateTravellerProfilePreferencesCommand,
  ): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------

    if (command === undefined) {
      throw new Error(
        'Create Traveller Profile Preferences command is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Convert TravellerProfile identifier
    // -------------------------------------------------------------------------
    //
    // The command carries the identifier as a primitive string.
    //
    // The domain value object validates the identifier at the application/domain
    // boundary.
    // -------------------------------------------------------------------------

    const profileId = new TravellerProfileId(command.travellerProfileId);

    // -------------------------------------------------------------------------
    // 3. Load TravellerProfile aggregate
    // -------------------------------------------------------------------------
    //
    // Preferences are aggregate-owned child state.
    //
    // Therefore the handler must load the TravellerProfile aggregate and
    // attach the preferences through its public aggregate API.
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findById(profileId);

    if (aggregate === null) {
      throw new TravellerProfileNotFoundException();
    }

    // -------------------------------------------------------------------------
    // 4. Create preferences entity
    // -------------------------------------------------------------------------
    //
    // The preferences entity receives its own public identifier while keeping
    // the parent TravellerProfile identifier.
    // -------------------------------------------------------------------------

    const preferences = TravellerProfilePreferencesEntity.create({
      publicId: new TravellerProfilePreferencesId(),

      profileId,

      showJourneyHistory: command.showJourneyHistory,

      showJourneyStatistics: command.showJourneyStatistics,

      allowJourneyInvites: command.allowJourneyInvites,

      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // -------------------------------------------------------------------------
    // 5. Attach preferences through the aggregate
    // -------------------------------------------------------------------------
    //
    // Do not assign aggregate.preferences directly.
    //
    // TravellerProfileAggregate.attachPreferences() owns the invariant:
    //
    //     one TravellerProfile → at most one preferences entity
    //
    // It also records TravellerProfilePreferencesChangedEvent.
    //
    // Correlation and causation metadata are supplied by the command and are
    // passed through unchanged.
    // -------------------------------------------------------------------------

    aggregate.attachPreferences(
      preferences,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 6. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // Persist the aggregate through its repository.
    //
    // The preferences entity is not persisted independently by this handler.
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateTravellerProfilePreferencesHandler;
