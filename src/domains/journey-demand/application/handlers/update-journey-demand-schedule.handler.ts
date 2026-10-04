// src/domains/journey-demand/application/handlers/update-journey-demand-schedule.handler.ts

// -----------------------------------------------------------------------------
// Journey Demand — Update Schedule Handler
// -----------------------------------------------------------------------------
//
// Application responsibility:
//
//     1. Load the Journey Demand aggregate.
//     2. Convert primitive command values into domain value objects.
//     3. Create and attach the schedule child when the aggregate does not yet
//        contain one.
//     4. Delegate subsequent schedule changes to the aggregate.
//     5. Persist the complete aggregate.
//
// Architectural rule:
//
// JourneyDemandScheduleEntity is a child entity of JourneyDemandAggregate.
// It is therefore created/attached through the aggregate and persisted through
// the Journey Demand repository.
//
// The handler owns the application-level decision of whether this is the first
// schedule configuration or an update to an existing schedule.
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

import type { UpdateJourneyDemandScheduleCommand } from '../commands/update-journey-demand-schedule.command';

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

import { JourneyDemandScheduleEntity } from '../../domain/entities/journey-demand-schedule.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyDemandArrivalWindow,
  JourneyDemandPublicId,
  JourneyDemandSchedulePublicId,
  JourneyDemandScheduleWindow,
  JourneyDemandTimezone,
} from '../../domain/value-objects';

// =============================================================================
// Handler
// =============================================================================

export class UpdateJourneyDemandScheduleHandler implements CommandHandler<UpdateJourneyDemandScheduleCommand> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    @Inject(JOURNEY_DEMAND_TOKENS.REPOSITORY)
    private readonly repository: JourneyDemandRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  async execute(command: UpdateJourneyDemandScheduleCommand): Promise<void> {
    // =========================================================================
    // Journey Demand Identity
    // =========================================================================

    const journeyDemandPublicId = new JourneyDemandPublicId(
      command.journeyDemandPublicId,
    );

    // =========================================================================
    // Load Aggregate
    // =========================================================================
    //
    // The complete Journey Demand aggregate is rehydrated before the schedule
    // component is created or modified.
    //
    const aggregate = await this.repository.findByPublicId(
      journeyDemandPublicId,
    );

    if (aggregate === null) {
      throw new JourneyDemandNotFoundException(command.journeyDemandPublicId);
    }

    // =========================================================================
    // Domain Value Objects
    // =========================================================================
    //
    // The application command carries primitive Date/string values.
    //
    // The domain entity operates on schedule-specific value objects, so the
    // conversion belongs here at the application boundary.
    //
    const scheduleWindow = new JourneyDemandScheduleWindow(
      command.earliestDeparture,
      command.latestDeparture,
    );

    const arrivalWindow = new JourneyDemandArrivalWindow(
      command.targetArrival,
      command.maximumArrival,
    );

    const timezone = new JourneyDemandTimezone(
      command.timezone ?? 'Africa/Nairobi',
    );

    // =========================================================================
    // First-Time Schedule Creation
    // =========================================================================
    //
    // A newly-created Journey Demand may not have a schedule child yet.
    //
    // In that state, aggregate.updateSchedule(...) cannot be used if that
    // aggregate method assumes that a schedule entity already exists.
    //
    // Create the child here, attach it to the aggregate, and persist the
    // aggregate.
    //
    if (!aggregate.hasSchedule()) {
      const schedule = JourneyDemandScheduleEntity.create({
        publicId: new JourneyDemandSchedulePublicId(),
        scheduleWindow,
        arrivalWindow,
        timezone,
      });

      aggregate.attachSchedule(schedule);

      await this.repository.save(aggregate);

      return;
    }

    // =========================================================================
    // Existing Schedule Update
    // =========================================================================
    //
    // Once the schedule child exists, all subsequent changes are delegated to
    // the aggregate's domain behavior.
    //
    aggregate.updateSchedule(
      command.earliestDeparture,
      command.latestDeparture,
      command.targetArrival,
      command.maximumArrival,
      command.timezone,
      command.correlationId,
      command.causationId,
    );

    // =========================================================================
    // Persist Aggregate
    // =========================================================================

    await this.repository.save(aggregate);
  }
}
