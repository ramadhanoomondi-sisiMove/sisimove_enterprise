// src/domains/journey-demand/application/handlers/add-journey-demand-participant.handler.ts

// -----------------------------------------------------------------------------
// Journey Demand — Add Participant Handler
// -----------------------------------------------------------------------------
//
// Application responsibility:
//
//     1. Load the Journey Demand aggregate.
//     2. Validate the aggregate exists.
//     3. Construct the participant's domain value objects.
//     4. Create the participant child entity.
//     5. Attach the participant to the aggregate.
//     6. Record the participant-added domain event.
//     7. Persist the complete aggregate.
//
// Architectural rule:
//
// The participant is NOT persisted independently.
//
// JourneyDemandParticipantEntity is a child entity of JourneyDemandAggregate.
// Therefore the aggregate remains the consistency boundary and the repository
// persists the aggregate as a whole.
//
// The handler is also the correct place to construct the child entity because
// the application layer receives primitive command values while the domain
// entity requires domain value objects.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Dependency Injection
// -----------------------------------------------------------------------------

import { Inject } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { AddJourneyDemandParticipantCommand } from '../commands/add-journey-demand-participant.command';

// -----------------------------------------------------------------------------
// Dependency Injection Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_DEMAND_TOKENS } from '../journey-demand.tokens';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { JourneyDemandNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Domain Repository
// -----------------------------------------------------------------------------

import type { JourneyDemandRepository } from '../../domain/repositories/journey-demand.repository';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import { JourneyDemandParticipantEntity } from '../../domain/entities/journey-demand-participant.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { JourneyDemandPublicId } from '../../domain/value-objects/journey-demand-public-id.vo';
import { JourneyDemandParticipantPublicId } from '../../domain/value-objects/journey-demand-participant-public-id.vo';
import { MemberPublicId } from '../../domain/value-objects/member-public-id.vo';

// =============================================================================
// Handler
// =============================================================================

export class AddJourneyDemandParticipantHandler implements CommandHandler<AddJourneyDemandParticipantCommand> {
  constructor(
    @Inject(JOURNEY_DEMAND_TOKENS.REPOSITORY)
    private readonly repository: JourneyDemandRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  async execute(command: AddJourneyDemandParticipantCommand): Promise<void> {
    // =========================================================================
    // Journey Demand Identity
    // =========================================================================
    //
    // The command carries primitive strings because application commands form
    // the boundary into the domain. Convert the primitive into the domain
    // value object before interacting with the aggregate.
    //
    const journeyDemandPublicId = new JourneyDemandPublicId(
      command.journeyDemandPublicId,
    );

    // =========================================================================
    // Load Aggregate
    // =========================================================================
    //
    // The Journey Demand aggregate is the consistency boundary.
    //
    // We intentionally do not load or persist a participant independently.
    // The repository rehydrates the complete aggregate so that the aggregate
    // can enforce its own invariants before the participant is attached.
    //
    const aggregate = await this.repository.findByPublicId(
      journeyDemandPublicId,
    );

    if (aggregate === null) {
      throw new JourneyDemandNotFoundException(command.journeyDemandPublicId);
    }

    // =========================================================================
    // Participant Identity
    // =========================================================================
    //
    // Both identifiers belong to the participant entity:
    //
    // - participantPublicId identifies this participant record within the
    //   Journey Demand aggregate.
    //
    // - memberPublicId identifies the member who is participating.
    //
    // Neither identifier should remain a primitive string inside the domain.
    //
    const participantPublicId = new JourneyDemandParticipantPublicId(
      command.participantPublicId,
    );

    const memberPublicId = new MemberPublicId(command.memberPublicId);

    // =========================================================================
    // Duplicate Participant Protection
    // =========================================================================
    //
    // A participant with the same public ID must not be attached twice.
    //
    // The aggregate owns the participant collection, so duplicate detection
    // is performed through the aggregate rather than by querying the
    // participant repository directly.
    //
    const existingParticipant =
      aggregate.getParticipantByPublicId(participantPublicId);

    if (existingParticipant !== undefined) {
      throw new Error(
        `Journey Demand participant "${command.participantPublicId}" already exists.`,
      );
    }

    // =========================================================================
    // Create Participant Entity
    // =========================================================================
    //
    // The application layer converts command primitives into domain value
    // objects and then creates the child entity.
    //
    // The entity factory supplies its own domain defaults for:
    //
    // - seats
    // - participant status
    // - joinedAt
    // - withdrawnAt
    // - removedAt
    // - createdAt
    // - updatedAt
    //
    const participant = JourneyDemandParticipantEntity.create({
      publicId: participantPublicId,
      memberPublicId,
    });

    // =========================================================================
    // Attach Participant to Aggregate
    // =========================================================================
    //
    // The aggregate remains responsible for owning its child entities.
    //
    // We do not call a participant repository here and we do not mutate the
    // aggregate's internal participant collection directly.
    //
    aggregate.addParticipant(participant);

    // =========================================================================
    // Record Domain Event
    // =========================================================================
    //
    // The participant has now been successfully attached to the aggregate.
    //
    // The aggregate records the domain event using the correlation and
    // causation identifiers supplied by the application command.
    //
    aggregate.recordParticipantAdded(
      participant,
      command.correlationId,
      command.causationId,
    );

    // =========================================================================
    // Persist Aggregate
    // =========================================================================
    //
    // Persist the complete Journey Demand aggregate.
    //
    // The repository is responsible for translating the aggregate state into
    // the persistence model, including the newly attached participant.
    //
    await this.repository.save(aggregate);
  }
}
