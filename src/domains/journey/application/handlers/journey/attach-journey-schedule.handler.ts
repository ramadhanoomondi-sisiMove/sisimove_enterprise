// src/domains/journey/application/handlers/journey/attach-journey-schedule.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Schedule Command Handler
// -----------------------------------------------------------------------------
//
// Application-layer command handler for configuring the schedule of a Journey.
//
// Responsibilities:
// - resolve the Journey aggregate;
// - create a new Journey Schedule child entity from command data;
// - delegate the attachment mutation to the Journey aggregate;
// - persist the mutated aggregate.
//
// The handler does NOT:
// - access Prisma directly;
// - perform HTTP concerns;
// - mutate persistence models;
// - implement Journey business rules.
//
// Journey owns the schedule child and its attachment relationship.
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

import type { AttachJourneyScheduleCommand } from '../../commands/journey/attach-journey-schedule.command';

// -----------------------------------------------------------------------------
// Domain — Entity
// -----------------------------------------------------------------------------

import { JourneyScheduleEntity } from '../../../domain/entities/journey-schedule.entity';

// -----------------------------------------------------------------------------
// Domain — Exceptions
// -----------------------------------------------------------------------------

import { JourneyNotFoundException } from '../../../domain/exceptions';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyArrivalAt,
  JourneyDepartureAt,
  JourneySchedulePublicId,
  JourneyTimezone,
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
export class AttachJourneyScheduleHandler implements CommandHandler<
  AttachJourneyScheduleCommand,
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

  public async execute(command: AttachJourneyScheduleCommand): Promise<void> {
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
    // Create Schedule
    //
    // JourneySchedule is a Journey-owned child entity.
    //
    // The public ID is generated here because the command represents schedule
    // configuration rather than attachment of an existing schedule.
    // -------------------------------------------------------------------------

    const now = new Date();

    const schedule = JourneyScheduleEntity.create({
      publicId: new JourneySchedulePublicId(),

      departureAt: new JourneyDepartureAt(command.departureAt),

      arrivalAt:
        command.arrivalAt !== undefined
          ? new JourneyArrivalAt(command.arrivalAt)
          : undefined,

      timezone: new JourneyTimezone(command.timezone),

      createdAt: now,
      updatedAt: now,
    });

    // -------------------------------------------------------------------------
    // Aggregate Mutation
    //
    // Journey owns the schedule attachment relationship.
    // -------------------------------------------------------------------------

    aggregate.attachSchedule(schedule);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.journeyRepository.save(aggregate);
  }
}
