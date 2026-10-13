// src/domains/journey-boarding/application/command-handlers/withdraw-participant.handler.ts

// -----------------------------------------------------------------------------
// Journey Boarding — Withdraw Participant Command Handler
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Resolve the Journey Boarding aggregate by public identifier.
// - Delegate participant withdrawal to the aggregate.
// - Record a historical event after successful withdrawal.
// - Persist the updated aggregate and historical event.
// - Resolve the associated Journey's public identifier.
// - Return the aggregate together with the Journey public ID.
//
// Architectural rules:
// - Inject repositories through centralized dependency-injection tokens.
// - Keep participant lifecycle invariants inside the aggregate.
// - Use a domain-specific exception when the aggregate cannot be found.
// - Use internal Journey IDs only for repository lookups.
// - Return the Journey public ID for REST response mapping.
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { JOURNEY_BOARDING_TOKENS } from '../journey-boarding.tokens';
import { JOURNEY_TOKENS } from '../../../journey/application/journey.tokens';

import type { WithdrawParticipantCommand } from '../commands/withdraw-participant.command';

import type { JourneyBoardingAggregate } from '../../domain/aggregates/journey-boarding.aggregate';

import type { JourneyBoardingRepository } from '../../domain/repositories/journey-boarding.repository';
import type { JourneyRepository } from '../../../journey/domain/repositories/journey.repository';

import { JourneyId } from '../../../journey/domain/value-objects/journey-id.vo';

import { JourneyBoardingNotFoundException } from '../../domain/exceptions';

import { JourneyBoardingEventEntity } from '../../domain/entities/journey-boarding-event.entity';

import { JourneyBoardingEventType } from '../../domain/value-objects/journey-boarding-event-type.vo';

// -----------------------------------------------------------------------------
// Result
// -----------------------------------------------------------------------------

export interface WithdrawParticipantResult {
  aggregate: JourneyBoardingAggregate;
  journeyPublicId: string;
}

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class WithdrawParticipantHandler implements CommandHandler<
  WithdrawParticipantCommand,
  WithdrawParticipantResult
> {
  public constructor(
    @Inject(JOURNEY_BOARDING_TOKENS.REPOSITORY)
    private readonly repository: JourneyBoardingRepository,

    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly journeyRepository: JourneyRepository,
  ) {}

  public async execute(
    command: WithdrawParticipantCommand,
  ): Promise<WithdrawParticipantResult> {
    // -------------------------------------------------------------------------
    // Load Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      command.journeyBoardingPublicId,
    );

    if (aggregate === null) {
      throw new JourneyBoardingNotFoundException(
        command.journeyBoardingPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Withdraw Participant
    // -------------------------------------------------------------------------
    //
    // The aggregate validates participant and lifecycle invariants.
    // If withdrawal fails, no historical event is created.
    // -------------------------------------------------------------------------

    aggregate.withdrawParticipant(
      command.participantPublicId,
      command.correlationId,
      command.causationId,
      command.withdrawnAt,
    );

    // -------------------------------------------------------------------------
    // Record Successful Withdrawal
    // -------------------------------------------------------------------------

    const withdrawalEvent = JourneyBoardingEventEntity.create({
      boardingId: aggregate.publicId,
      type: JourneyBoardingEventType.boardingWithdrawn(),
      occurredAt: command.withdrawnAt ?? new Date(),
    });

    aggregate.addBoardingEvent(withdrawalEvent);

    // -------------------------------------------------------------------------
    // Persist Aggregate And History
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);

    // -------------------------------------------------------------------------
    // Resolve Journey Public ID
    // -------------------------------------------------------------------------

    const journey = await this.journeyRepository.findJourneyById(
      new JourneyId(aggregate.journeyBoarding.journeyId.value),
    );

    if (journey === null) {
      throw new Error(
        `Journey not found for boarding ${aggregate.journeyBoarding.publicId.value}.`,
      );
    }

    // -------------------------------------------------------------------------
    // Result
    // -------------------------------------------------------------------------

    return {
      aggregate,
      journeyPublicId: journey.publicId.value,
    };
  }
}

export default WithdrawParticipantHandler;
