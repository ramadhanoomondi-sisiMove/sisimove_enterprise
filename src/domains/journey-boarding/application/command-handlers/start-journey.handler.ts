// src/domains/journey-boarding/application/command-handlers/start-journey.handler.ts

// -----------------------------------------------------------------------------
// Journey Boarding — Start Journey Command Handler
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Load the Journey Boarding aggregate.
// - Load the associated Journey aggregate.
// - Prevent starting before the scheduled departure time.
// - Coordinate boarding and Journey commencement.
// - Record the JOURNEY_STARTED historical event.
// - Persist both aggregates within one transaction.
// - Return the updated boarding aggregate and Journey public ID.
//
// Architectural rules:
// - Journey Boarding coordinates the departure workflow.
// - Each aggregate retains ownership of its lifecycle invariants.
// - Both repositories use the same transaction context.
// - Internal Journey IDs are used for repository lookups.
// - Public Journey IDs are returned for REST response mapping.
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { PrismaUnitOfWork } from '../../../../infrastructure/persistence/prisma-unit-of-work';

import type { StartJourneyCommand } from '../commands/start-journey.command';

import { JOURNEY_BOARDING_TOKENS } from '../journey-boarding.tokens';
import { JOURNEY_TOKENS } from '../../../journey/application/journey.tokens';

import type { JourneyBoardingAggregate } from '../../domain/aggregates/journey-boarding.aggregate';

import type { JourneyBoardingRepository } from '../../domain/repositories/journey-boarding.repository';
import type { JourneyRepository } from '../../../journey/domain/repositories/journey.repository';

import { JourneyId } from '../../../journey/domain/value-objects/journey-id.vo';

import { JourneyBoardingNotFoundException } from '../../domain/exceptions';

import { JourneyBoardingEventEntity } from '../../domain/entities/journey-boarding-event.entity';
import { JourneyBoardingEventType } from '../../domain/value-objects/journey-boarding-event-type.vo';

export interface StartJourneyResult {
  aggregate: JourneyBoardingAggregate;
  journeyPublicId: string;
}

@Injectable()
export class StartJourneyHandler implements CommandHandler<
  StartJourneyCommand,
  StartJourneyResult
> {
  public constructor(
    @Inject(JOURNEY_BOARDING_TOKENS.REPOSITORY)
    private readonly repository: JourneyBoardingRepository,

    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly journeyRepository: JourneyRepository,

    private readonly unitOfWork: PrismaUnitOfWork,
  ) {}

  public async execute(
    command: StartJourneyCommand,
  ): Promise<StartJourneyResult> {
    return this.unitOfWork.execute(async () => {
      // -----------------------------------------------------------------------
      // 1. Load Journey Boarding
      // -----------------------------------------------------------------------

      const boarding = await this.repository.findByPublicId(
        command.journeyBoardingPublicId,
      );

      if (boarding === null) {
        throw new JourneyBoardingNotFoundException(
          command.journeyBoardingPublicId.value,
        );
      }

      // -----------------------------------------------------------------------
      // 2. Load Journey Aggregate
      // -----------------------------------------------------------------------

      const journey = await this.journeyRepository.findById(
        new JourneyId(boarding.journeyBoarding.journeyId.value),
      );

      if (journey === null) {
        throw new Error(
          `Journey not found for boarding "${boarding.publicId.value}".`,
        );
      }

      // -----------------------------------------------------------------------
      // 3. Validate Journey Lifecycle
      // -----------------------------------------------------------------------

      if (!journey.canStart()) {
        throw new Error(
          `Journey "${journey.journey.publicId.value}" cannot start ` +
            `from status "${journey.status.value}".`,
        );
      }

      // -----------------------------------------------------------------------
      // 4. Enforce Scheduled Departure Time
      // -----------------------------------------------------------------------
      //
      // A Journey must have a schedule, and its scheduled departure time
      // must have arrived before the Journey can start.
      //
      // Use the actual current time for this business rule rather than
      // a caller-supplied event timestamp.
      // -----------------------------------------------------------------------

      const schedule = journey.schedule;

      if (schedule === undefined) {
        throw new Error(
          `Journey "${journey.journey.publicId.value}" cannot start ` +
            'because no departure schedule is configured.',
        );
      }

      const departureAt = schedule.departureAt.value;
      const now = new Date();

      if (now.getTime() < departureAt.getTime()) {
        throw new Error(
          `Journey "${journey.journey.publicId.value}" cannot start before ` +
            `its scheduled departure time (${departureAt.toISOString()}).`,
        );
      }

      // -----------------------------------------------------------------------
      // 5. Establish Shared Event Timestamp
      // -----------------------------------------------------------------------

      const startedAt = command.journeyStartedAt ?? now;

      // -----------------------------------------------------------------------
      // 6. Start Boarding
      // -----------------------------------------------------------------------

      boarding.startJourney(
        command.correlationId,
        command.causationId,
        startedAt,
      );

      // -----------------------------------------------------------------------
      // 7. Start Journey
      // -----------------------------------------------------------------------
      //
      // JourneyAggregate owns the Journey lifecycle transition.
      // Starting transitions the Journey to IN_PROGRESS.
      // COMPLETION_PENDING belongs to the completion-request workflow.
      // -----------------------------------------------------------------------

      journey.start(command.correlationId, command.causationId, startedAt);

      // -----------------------------------------------------------------------
      // 8. Record Historical Event
      // -----------------------------------------------------------------------

      const journeyStartedEvent = JourneyBoardingEventEntity.create({
        boardingId: boarding.publicId,
        type: JourneyBoardingEventType.journeyStarted(),
        occurredAt: startedAt,
      });

      boarding.addBoardingEvent(journeyStartedEvent);

      // -----------------------------------------------------------------------
      // 9. Persist Both Aggregates
      // -----------------------------------------------------------------------
      //
      // Both writes must participate in the same Unit of Work transaction.
      // If either write fails, the transaction must roll back.
      // -----------------------------------------------------------------------

      await this.journeyRepository.save(journey);
      await this.repository.save(boarding);

      // -----------------------------------------------------------------------
      // 10. Return Result
      // -----------------------------------------------------------------------

      return {
        aggregate: boarding,
        journeyPublicId: journey.journey.publicId.value,
      };
    });
  }
}

export default StartJourneyHandler;
