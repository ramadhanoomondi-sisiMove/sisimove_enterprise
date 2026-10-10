// -----------------------------------------------------------------------------
// Support — Create Journey Support Case Handler
// -----------------------------------------------------------------------------

import { ForbiddenException, Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { JourneyRepository } from '../../../journey/domain/repositories/journey.repository';
import { JourneyPublicId } from '../../../journey/domain/value-objects/journey-public-id.vo';
import { JourneyNotFoundException } from '../../../journey/domain/exceptions/journey-not-found.exception';

import type { JourneyBookingRepository } from '../../../journey-booking/domain/repositories/journey-booking.repository';
import { JourneyBookingPassengerPublicId } from '../../../journey-booking/domain/value-objects/journey-booking-passenger-public-id.vo';

import { JOURNEY_TOKENS } from '../../../journey/application/journey.tokens';
import { JOURNEY_BOOKING_TOKENS } from '../../../journey-booking/application/journey-booking.tokens';

import { SUPPORT_TOKENS } from '../support.tokens';

import { CreateJourneySupportCaseCommand } from '../commands/create-journey-support-case.command';
import { CreateSupportCaseCommand } from '../commands/create-support-case.command';

import { SupportCaseAggregate } from '../../domain/aggregates/support-case.aggregate';

import { SupportCaseRequesterPublicId } from '../../domain/value-objects/support-case-requester-public-id.vo';
import { SupportCaseReferenceType } from '../../domain/value-objects/support-case-reference-type.vo';
import { SupportCaseReferencePublicId } from '../../domain/value-objects/support-case-reference-public-id.vo';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class CreateJourneySupportCaseHandler implements CommandHandler<
  CreateJourneySupportCaseCommand,
  SupportCaseAggregate
> {
  constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly journeyRepository: JourneyRepository,

    @Inject(JOURNEY_BOOKING_TOKENS.REPOSITORY)
    private readonly journeyBookingRepository: JourneyBookingRepository,

    @Inject(SUPPORT_TOKENS.COMMAND_HANDLERS.CREATE_SUPPORT_CASE)
    private readonly createSupportCaseHandler: CommandHandler<
      CreateSupportCaseCommand,
      SupportCaseAggregate
    >,
  ) {}

  public async execute(
    command: CreateJourneySupportCaseCommand,
  ): Promise<SupportCaseAggregate> {
    const journeyPublicId = new JourneyPublicId(command.journeyPublicId.value);

    // -------------------------------------------------------------------------
    // 1. Confirm that the Journey exists.
    // -------------------------------------------------------------------------

    const journey =
      await this.journeyRepository.findByPublicId(journeyPublicId);

    if (!journey) {
      throw new JourneyNotFoundException(
        'The requested Journey could not be found.',
      );
    }

    const requesterPublicId = command.requesterPublicId.value;

    // -------------------------------------------------------------------------
    // 2. Authorize the requester.
    //
    // The requester must be the Journey provider or a passenger with an
    // active booking for this Journey.
    // -------------------------------------------------------------------------

    const isProvider = journey.providerPublicId.value === requesterPublicId;

    let hasActiveBooking = false;

    if (!isProvider) {
      hasActiveBooking =
        await this.journeyBookingRepository.existsActiveBookingByJourneyAndPassenger(
          journeyPublicId,
          new JourneyBookingPassengerPublicId(requesterPublicId),
        );
    }

    if (!isProvider && !hasActiveBooking) {
      throw new ForbiddenException(
        'You are not authorized to create a support case for this Journey.',
      );
    }

    // -------------------------------------------------------------------------
    // 3. Delegate Support Case creation to the existing handler.
    //
    // Support stores the Journey reference as an opaque public ID.
    // The requester cannot supply or override the reference.
    // -------------------------------------------------------------------------

    const supportCaseCommand = new CreateSupportCaseCommand(
      SupportCaseRequesterPublicId.create(requesterPublicId),
      command.priority,
      command.category,
      command.subject,
      command.correlationId,
      command.causationId,
      command.description,
      SupportCaseReferenceType.create('Journey'),
      SupportCaseReferencePublicId.create(command.journeyPublicId.value),
    );

    return this.createSupportCaseHandler.execute(supportCaseCommand);
  }
}

export default CreateJourneySupportCaseHandler;
