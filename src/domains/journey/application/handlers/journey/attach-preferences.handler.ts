// src/domains/journey/application/handlers/journey/attach-preferences.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Preferences Command Handler
// -----------------------------------------------------------------------------
//
// Application-layer command handler for configuring Journey Preferences.
//
// Responsibilities:
// - resolve the Journey aggregate;
// - create a new Journey Preferences child entity;
// - convert primitive command values into domain value objects;
// - attach the preferences to the Journey aggregate;
// - persist the mutated aggregate.
//
// The handler does NOT:
// - access Prisma directly;
// - perform HTTP concerns;
// - mutate persistence models;
// - implement Journey business rules.
//
// Journey owns the preferences child and its attachment relationship.
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
// Domain — Entity
// -----------------------------------------------------------------------------

import { JourneyPreferencesEntity } from '../../../domain/entities/journey-preferences.entity';

// -----------------------------------------------------------------------------
// Domain — Exceptions
// -----------------------------------------------------------------------------

import { JourneyNotFoundException } from '../../../domain/exceptions';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyPreferencesPublicId,
  JourneySmokingPolicyValueObject,
  JourneyPetsPolicyValueObject,
  JourneyLuggagePolicyValueObject,
  JourneyConversationPreferenceValueObject,
  JourneyMusicPreferenceValueObject,
} from '../../../domain/value-objects';

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
    // Do not reconstruct it here.
    // -------------------------------------------------------------------------

    const aggregate = await this.journeyRepository.findByPublicId(
      command.journeyPublicId,
    );

    if (aggregate === null) {
      throw new JourneyNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Create Preferences
    //
    // JourneyPreferences is a Journey-owned child entity.
    //
    // Its public identity is generated when the child is created.
    // -------------------------------------------------------------------------

    const now = new Date();

    const preferences = JourneyPreferencesEntity.create({
      publicId: new JourneyPreferencesPublicId(),

      smoking: new JourneySmokingPolicyValueObject(command.smoking),

      pets: new JourneyPetsPolicyValueObject(command.pets),

      luggage: new JourneyLuggagePolicyValueObject(command.luggage),

      conversation: new JourneyConversationPreferenceValueObject(
        command.conversation,
      ),

      music: new JourneyMusicPreferenceValueObject(command.music),

      createdAt: now,
      updatedAt: now,
    });

    // -------------------------------------------------------------------------
    // Aggregate Mutation
    //
    // Journey owns the preferences attachment relationship.
    // -------------------------------------------------------------------------

    aggregate.attachPreferences(preferences);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.journeyRepository.save(aggregate);
  }
}
