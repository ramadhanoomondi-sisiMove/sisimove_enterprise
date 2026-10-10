// src/domains/journey/application/handlers/journey/publish-journey.handler.ts

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Transaction
// -----------------------------------------------------------------------------

import { PrismaUnitOfWork } from '../../../../../infrastructure/persistence/prisma-unit-of-work';

// -----------------------------------------------------------------------------
// Journey — Command
// -----------------------------------------------------------------------------

import type { PublishJourneyCommand } from '../../commands/journey/publish-journey.command';

// -----------------------------------------------------------------------------
// Journey — Domain
// -----------------------------------------------------------------------------

import { JourneyNotFoundException } from '../../../domain/exceptions';

import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

import { JourneyPublicId } from '../../../domain/value-objects/journey-public-id.vo';

import { JOURNEY_TOKENS } from '../../journey.tokens';

// -----------------------------------------------------------------------------
// Journey Boarding — Aggregate
// -----------------------------------------------------------------------------

import { JourneyBoardingAggregate } from '../../../../journey-boarding/domain/aggregates/journey-boarding.aggregate';

// -----------------------------------------------------------------------------
// Journey Boarding — Entities
// -----------------------------------------------------------------------------

import { JourneyBoardingEntity } from '../../../../journey-boarding/domain/entities/journey-boarding.entity';

import { JourneyBoardingParticipantEntity } from '../../../../journey-boarding/domain/entities/journey-boarding-participant.entity';

// -----------------------------------------------------------------------------
// Journey Boarding — Repository
// -----------------------------------------------------------------------------

import type { JourneyBoardingRepository } from '../../../../journey-boarding/domain/repositories/journey-boarding.repository';

import { JOURNEY_BOARDING_TOKENS } from '../../../../journey-boarding/application/journey-boarding.tokens';

// -----------------------------------------------------------------------------
// Journey Boarding — Value Objects
// -----------------------------------------------------------------------------

import { JourneyBoardingJourneyId } from '../../../../journey-boarding/domain/value-objects/journey-boarding-journey-id.vo';

import { JourneyBoardingPublicId } from '../../../../journey-boarding/domain/value-objects/journey-boarding-public-id.vo';

import { JourneyBoardingProviderPublicId } from '../../../../journey-boarding/domain/value-objects/journey-boarding-provider-public-id.vo';

import { JourneyBoardingParticipantPublicId } from '../../../../journey-boarding/domain/value-objects/journey-boarding-participant-public-id.vo';

import { JourneyBoardingMemberPublicId } from '../../../../journey-boarding/domain/value-objects/journey-boarding-member-public-id.vo';

import { JourneyBoardingParticipantRole } from '../../../../journey-boarding/domain/value-objects/journey-boarding-participant-role.vo';

import { JourneyBoardingParticipantStatus } from '../../../../journey-boarding/domain/value-objects/journey-boarding-participant-status.vo';

import { JourneyBoardingStatus } from '../../../../journey-boarding/domain/value-objects/journey-boarding-status.vo';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Publishes a Journey and initializes its physical boarding workflow.
 *
 * Transactional workflow:
 *
 * 1. Load the Journey.
 * 2. Publish the Journey.
 * 3. Create a Journey Boarding aggregate.
 * 4. Create and attach the provider participant in EXPECTED status.
 * 5. Open boarding: NOT_STARTED -> BOARDING.
 * 6. Board the provider: EXPECTED -> BOARDED.
 * 7. Persist the Journey and Journey Boarding aggregate.
 *
 * All repository operations must use the transaction-scoped Prisma client
 * supplied by PrismaTransactionContext.
 *
 * If any operation fails, the Prisma transaction rolls back.
 */
@Injectable()
export class PublishJourneyHandler implements CommandHandler<
  PublishJourneyCommand,
  void
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly journeyRepository: JourneyRepository,

    @Inject(JOURNEY_BOARDING_TOKENS.REPOSITORY)
    private readonly journeyBoardingRepository: JourneyBoardingRepository,

    private readonly unitOfWork: PrismaUnitOfWork,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(command: PublishJourneyCommand): Promise<void> {
    await this.unitOfWork.execute(async () => {
      // -----------------------------------------------------------------------
      // 1. Load Journey
      // -----------------------------------------------------------------------

      const journeyPublicId = new JourneyPublicId(command.journeyPublicId);

      const journey =
        await this.journeyRepository.findByPublicId(journeyPublicId);

      if (journey === null) {
        throw new JourneyNotFoundException();
      }

      // -----------------------------------------------------------------------
      // 2. Publish Journey
      // -----------------------------------------------------------------------

      const publishedAt = command.publishedAt ?? new Date();

      journey.publish(command.correlationId, command.causationId, publishedAt);

      await this.journeyRepository.save(journey);

      // -----------------------------------------------------------------------
      // 3. Prepare Boarding Identity
      // -----------------------------------------------------------------------

      const boardingPublicId = new JourneyBoardingPublicId();

      const boardingAlreadyExists =
        await this.journeyBoardingRepository.existsByPublicId(boardingPublicId);

      if (boardingAlreadyExists) {
        throw new Error(
          `Journey boarding '${boardingPublicId.value}' already exists.`,
        );
      }

      const boardingJourneyId = JourneyBoardingJourneyId.create(
        journey.id.toString(),
      );

      const boardingProviderPublicId = new JourneyBoardingProviderPublicId(
        journey.providerPublicId.value,
      );

      // -----------------------------------------------------------------------
      // 4. Create Boarding Entity and Aggregate
      // -----------------------------------------------------------------------

      const boardingEntity = JourneyBoardingEntity.create({
        publicId: boardingPublicId,
        journeyId: boardingJourneyId,
        providerPublicId: boardingProviderPublicId,
        status: JourneyBoardingStatus.notStarted(),
      });

      const boardingAggregate = JourneyBoardingAggregate.create(
        boardingEntity,
        command.correlationId,
        command.causationId,
      );

      // -----------------------------------------------------------------------
      // 5. Create Provider Participant
      // -----------------------------------------------------------------------

      /**
       * A provider is a participant in the physical boarding workflow even
       * though the provider does not have a passenger booking.
       *
       * The participant must reference the Journey Boarding public ID.
       * It must not reference the Journey public ID.
       *
       * JourneyBoardingParticipantEntity defaults to EXPECTED, but the status
       * is supplied explicitly to make the initial lifecycle state clear.
       */
      const providerParticipant = JourneyBoardingParticipantEntity.create({
        publicId: new JourneyBoardingParticipantPublicId(),
        boardingId: boardingPublicId,
        memberPublicId: new JourneyBoardingMemberPublicId(
          journey.providerPublicId.value,
        ),
        role: JourneyBoardingParticipantRole.provider(),
        status: JourneyBoardingParticipantStatus.expected(),
        expectedAt: publishedAt,
      });

      boardingAggregate.addParticipant(providerParticipant);

      // -----------------------------------------------------------------------
      // 6. Open Boarding
      // -----------------------------------------------------------------------

      /**
       * Opening boarding requires the provider participant to exist.
       *
       * The aggregate records the boarding-opened domain event and validates
       * the NOT_STARTED -> BOARDING lifecycle transition.
       */
      boardingAggregate.open(
        command.correlationId,
        command.causationId,
        publishedAt,
      );

      // -----------------------------------------------------------------------
      // 7. Board Provider
      // -----------------------------------------------------------------------

      /**
       * The provider can now transition from EXPECTED to BOARDED because:
       *
       * - the aggregate is in BOARDING status;
       * - the provider participant has been attached;
       * - the participant's member identity matches the provider identity.
       */
      boardingAggregate.boardProvider(
        command.correlationId,
        command.causationId,
        publishedAt,
      );

      // -----------------------------------------------------------------------
      // 8. Persist Completed Boarding Setup
      // -----------------------------------------------------------------------

      /**
       * Persist the aggregate after all participant and lifecycle changes.
       *
       * The repository must persist the boarding entity, provider participant,
       * and applicable boarding event history consistently.
       */
      await this.journeyBoardingRepository.save(boardingAggregate);
    });
  }
}
