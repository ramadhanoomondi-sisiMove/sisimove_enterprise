// src/domains/journey/application/handlers/journey/create-journey.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Create Journey Command Handler
// -----------------------------------------------------------------------------
//
// Application-layer command handler responsible for creating a new Journey
// aggregate.
//
// Responsibilities:
// - convert the provider public identifier into its domain Value Object;
// - generate the Journey public identifier;
// - enforce public-identifier uniqueness;
// - create the Journey entity in DRAFT state;
// - create the Journey aggregate;
// - persist the aggregate;
// - return the newly created aggregate.
//
// Architectural rules:
// - Journey creation is an aggregate-construction operation.
// - The handler orchestrates creation but does not implement Journey business
//   rules.
// - The Journey starts in DRAFT and is published through the dedicated
//   PublishJourneyHandler.
// - Repository dependencies are resolved through the application token.
// - The provider public identifier is converted here because the command
//   carries the provider identifier as a primitive.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { CreateJourneyCommand } from '../../commands/journey/create-journey.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { JourneyAggregate } from '../../../domain/aggregates/journey.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { JourneyEntity } from '../../../domain/entities/journey.entity';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyAlreadyExistsException } from '../../../domain/exceptions';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyProviderPublicId,
  JourneyPublicId,
  JourneyStatus,
  JourneyStatusValueObject,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Application Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_TOKENS } from '../../journey.tokens';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class CreateJourneyHandler implements CommandHandler<
  CreateJourneyCommand,
  JourneyAggregate
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------
  //
  // Resolve the Journey repository through the application-level token.
  // The handler therefore depends on the repository contract rather than a
  // concrete infrastructure implementation.
  // ---------------------------------------------------------------------------

  public constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly repository: JourneyRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

  public async execute(
    command: CreateJourneyCommand,
  ): Promise<JourneyAggregate> {
    // -------------------------------------------------------------------------
    // Provider Identity
    //
    // CreateJourneyCommand currently carries providerPublicId as a primitive.
    // Convert it into the domain Value Object at the application boundary.
    // -------------------------------------------------------------------------

    const providerPublicId = new JourneyProviderPublicId(
      command.providerPublicId,
    );

    // -------------------------------------------------------------------------
    // Journey Public Identity
    //
    // A new public identifier is generated as part of Journey creation.
    // -------------------------------------------------------------------------

    const journeyPublicId = new JourneyPublicId();

    // -------------------------------------------------------------------------
    // Public Identity Uniqueness
    //
    // The generated public identifier must not already exist in persistence.
    //
    // Although collisions should be extremely unlikely for a properly
    // generated public identifier, the repository remains the authoritative
    // persistence boundary for this uniqueness check.
    // -------------------------------------------------------------------------

    if (await this.repository.existsByPublicId(journeyPublicId)) {
      throw new JourneyAlreadyExistsException();
    }

    // -------------------------------------------------------------------------
    // Journey Entity
    //
    // A newly created Journey always begins in DRAFT.
    //
    // Publication is intentionally a separate lifecycle command so that
    // creating a Journey does not implicitly make it discoverable in the
    // public marketplace.
    // -------------------------------------------------------------------------

    const journey = JourneyEntity.create({
      publicId: journeyPublicId,
      providerPublicId,
      status: new JourneyStatusValueObject(JourneyStatus.DRAFT),
    });

    // -------------------------------------------------------------------------
    // Journey Aggregate
    //
    // The Journey entity becomes the root of the newly created aggregate.
    // Child Journey components are attached through subsequent aggregate
    // operations.
    // -------------------------------------------------------------------------

    const aggregate = JourneyAggregate.create(journey);

    // -------------------------------------------------------------------------
    // Persistence
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);

    // -------------------------------------------------------------------------
    // Result
    // -------------------------------------------------------------------------

    return aggregate;
  }
}
