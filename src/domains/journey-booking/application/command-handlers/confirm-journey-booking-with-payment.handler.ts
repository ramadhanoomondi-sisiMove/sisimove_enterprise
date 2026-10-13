// -----------------------------------------------------------------------------
// Journey Booking — Confirm With Payment Command Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';
import { PrismaUnitOfWork } from '../../../../infrastructure/persistence/prisma-unit-of-work';

import type { ConfirmJourneyBookingWithPaymentCommand } from '../commands/confirm-journey-booking-with-payment.command';
import type { JourneyBookingAggregate } from '../../domain/aggregates/journey-booking.aggregate';
import { JourneyBookingNotFoundException } from '../../domain/exceptions';
import type { JourneyBookingRepository } from '../../domain/repositories/journey-booking.repository';
import { JOURNEY_BOOKING_TOKENS } from '../journey-booking.tokens';

import type { JourneyRepository } from '../../../journey/domain/repositories/journey.repository';
import { JOURNEY_TOKENS } from '../../../journey/application/journey.tokens';

import type { JourneyBoardingRepository } from '../../../journey-boarding/domain/repositories/journey-boarding.repository';
import { JOURNEY_BOARDING_TOKENS } from '../../../journey-boarding/application/journey-boarding.tokens';
import { JourneyBoardingParticipantEntity } from '../../../journey-boarding/domain/entities/journey-boarding-participant.entity';
import { JourneyBoardingJourneyId } from '../../../journey-boarding/domain/value-objects/journey-boarding-journey-id.vo';
import { JourneyBoardingMemberPublicId } from '../../../journey-boarding/domain/value-objects/journey-boarding-member-public-id.vo';
import { JourneyBoardingBookingPublicId } from '../../../journey-boarding/domain/value-objects/journey-boarding-booking-public-id.vo';
import { JourneyBoardingParticipantRole } from '../../../journey-boarding/domain/value-objects/journey-boarding-participant-role.vo';
import { JourneyBoardingParticipantStatus } from '../../../journey-boarding/domain/value-objects/journey-boarding-participant-status.vo';

import type { FinancialAccountRepository } from '../../../financial/domain/repositories/financial-account.repository';
import { FINANCIAL_ACCOUNT_TOKENS } from '../../../financial/application/financial-account.tokens';
import { FinancialAccountOwnerPublicId } from '../../../financial/domain/value-objects/financial-account-owner-public-id.vo';
import { FinancialAccountNotFoundException } from '../../../financial/domain/exceptions';

import type { FinancialAccountHoldRepository } from '../../../financial/domain/repositories/financial-account-hold.repository';
import { FINANCIAL_ACCOUNT_HOLD_TOKENS } from '../../../financial/application/financial-account-hold.tokens';
import { FinancialAccountHoldAggregate } from '../../../financial/domain/aggregates/financial-account-hold.aggregate';
import { FinancialAccountHoldEntity } from '../../../financial/domain/entities/financial-account-hold.entity';
import { FinancialAccountHeldAmount } from '../../../financial/domain/value-objects/financial-account-held-amount.vo';
import { FinancialHoldReference } from '../../../financial/domain/value-objects/financial-hold-reference.vo';

import type { FinancialTransactionRepository } from '../../../financial/domain/repositories/financial-transaction.repository';
import { FINANCIAL_TRANSACTION_TOKENS } from '../../../financial/application/financial-transaction.tokens';
import { FinancialTransactionAggregate } from '../../../financial/domain/aggregates/financial-transaction.aggregate';

import {
  Currency,
  FinancialAccountReference,
  FinancialBalanceType,
  FinancialTransactionEntryType,
  FinancialTransactionReference,
  FinancialTransactionType,
  Money,
} from '../../../financial/domain/value-objects';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class ConfirmJourneyBookingWithPaymentHandler implements CommandHandler<
  ConfirmJourneyBookingWithPaymentCommand,
  JourneyBookingAggregate
> {
  public constructor(
    @Inject(JOURNEY_BOOKING_TOKENS.REPOSITORY)
    private readonly repository: JourneyBookingRepository,

    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly journeyRepository: JourneyRepository,

    @Inject(JOURNEY_BOARDING_TOKENS.REPOSITORY)
    private readonly journeyBoardingRepository: JourneyBoardingRepository,

    @Inject(FINANCIAL_ACCOUNT_TOKENS.REPOSITORY)
    private readonly financialAccountRepository: FinancialAccountRepository,

    @Inject(FINANCIAL_ACCOUNT_HOLD_TOKENS.REPOSITORY)
    private readonly financialAccountHoldRepository: FinancialAccountHoldRepository,

    @Inject(FINANCIAL_TRANSACTION_TOKENS.REPOSITORY)
    private readonly financialTransactionRepository: FinancialTransactionRepository,

    private readonly unitOfWork: PrismaUnitOfWork,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: ConfirmJourneyBookingWithPaymentCommand,
  ): Promise<JourneyBookingAggregate> {
    return this.unitOfWork.execute(async () => {
      // 1. Load booking.
      const booking = await this.repository.findByPublicId(
        command.journeyBookingPublicId,
      );

      if (booking === null) {
        throw new JourneyBookingNotFoundException(
          command.journeyBookingPublicId.value,
        );
      }

      // 2. Load journey.
      const journey = await this.journeyRepository.findByPublicId(
        booking.journeyPublicId,
      );

      if (journey === null) {
        throw new Error(
          `Journey was not found for public ID "${booking.journeyPublicId.value}".`,
        );
      }

      // 3. Hold passenger funds and record the provider's pending balance.
      await this.authorizeFinancialPayment(booking, journey, command);

      // 4. Authorize payment on the booking.
      booking.authorizePayment(
        command.transactionPublicId,
        command.correlationId,
        command.causationId,
        command.authorizedAt,
      );

      // 5. Confirm booking.
      booking.confirm(
        command.correlationId,
        command.causationId,
        command.confirmedAt,
      );

      // 6. Reserve journey capacity.
      await this.journeyRepository.reserveCapacitySeats(
        journey.journeyId,
        booking.seats.value,
      );

      // 7. Register passenger as EXPECTED for boarding.
      await this.registerExpectedPassengerForBoarding(
        booking,
        journey.id.toString(),
      );

      // 8. Persist booking.
      await this.repository.save(booking);

      return booking;
    });
  }

  // ===========================================================================
  // Register Expected Passenger For Journey Boarding
  // ===========================================================================

  private async registerExpectedPassengerForBoarding(
    booking: JourneyBookingAggregate,
    journeyInternalId: string,
  ): Promise<void> {
    const journeyBoardingJourneyId =
      JourneyBoardingJourneyId.create(journeyInternalId);

    const boarding = await this.journeyBoardingRepository.findActiveByJourneyId(
      journeyBoardingJourneyId,
    );

    if (boarding === null) {
      throw new Error(
        `Active Journey Boarding was not found for Journey internal ID "${journeyInternalId}" while confirming booking "${booking.publicId.value}".`,
      );
    }

    const bookingPublicId = new JourneyBoardingBookingPublicId(
      booking.publicId.value,
    );

    const memberPublicId = new JourneyBoardingMemberPublicId(
      booking.passengerPublicId.value,
    );

    const existingByBooking =
      boarding.findParticipantByBooking(bookingPublicId);

    if (existingByBooking !== undefined) {
      const samePassenger =
        existingByBooking.memberPublicId.equals(memberPublicId);

      const isPassenger = existingByBooking.isPassenger();

      if (!samePassenger || !isPassenger) {
        throw new Error(
          `Journey Boarding integrity conflict for booking "${booking.publicId.value}": the existing participant does not match the booking passenger and role.`,
        );
      }

      return;
    }

    const existingByMember = boarding.findParticipantByMember(memberPublicId);

    if (existingByMember !== undefined) {
      throw new Error(
        `Passenger "${memberPublicId.value}" is already registered in Journey Boarding "${boarding.publicId.value}" under another booking.`,
      );
    }

    const participant = JourneyBoardingParticipantEntity.create({
      boardingId: boarding.publicId,
      memberPublicId,
      bookingPublicId,
      role: JourneyBoardingParticipantRole.passenger(),
      status: JourneyBoardingParticipantStatus.expected(),
    });

    boarding.addParticipant(participant);

    await this.journeyBoardingRepository.save(boarding);
  }

  // ===========================================================================
  // Financial Payment Authorization
  // ===========================================================================

  private async authorizeFinancialPayment(
    booking: JourneyBookingAggregate,
    journey: NonNullable<
      Awaited<ReturnType<JourneyRepository['findByPublicId']>>
    >,
    command: ConfirmJourneyBookingWithPaymentCommand,
  ): Promise<void> {
    // 1. Resolve booking payment.
    const payment = booking.payment;

    if (payment === undefined) {
      throw new Error(
        `Journey Booking "${booking.publicId.value}" does not contain a payment.`,
      );
    }

    const amount = payment.amount.value;
    const currency = Currency.create(payment.currency.value);

    // 2. Resolve passenger account.
    const passengerOwnerPublicId = FinancialAccountOwnerPublicId.create(
      booking.passengerPublicId.value,
    );

    const passengerAccount =
      await this.financialAccountRepository.findByOwnerPublicId(
        passengerOwnerPublicId,
      );

    if (passengerAccount === null) {
      throw new FinancialAccountNotFoundException(passengerOwnerPublicId.value);
    }

    // 3. Resolve provider account exactly once.
    const providerOwnerPublicId = FinancialAccountOwnerPublicId.create(
      journey.providerPublicId.value,
    );

    const providerAccount =
      await this.financialAccountRepository.findByOwnerPublicId(
        providerOwnerPublicId,
      );

    if (providerAccount === null) {
      throw new FinancialAccountNotFoundException(providerOwnerPublicId.value);
    }

    // 4. Validate account currencies before changing either balance.
    if (!passengerAccount.currency.equals(currency)) {
      throw new Error(
        `Passenger financial account currency does not match booking currency for booking "${booking.publicId.value}".`,
      );
    }

    if (!providerAccount.currency.equals(currency)) {
      throw new Error(
        `Provider financial account currency does not match booking currency for booking "${booking.publicId.value}".`,
      );
    }

    // 5. Hold passenger funds.
    passengerAccount.holdFunds(amount, currency, command.authorizedAt);

    // 6. Increase provider pending balance once.
    providerAccount.increasePending(amount, currency, command.authorizedAt);

    // 7. Create references for the passenger HOLD transaction.
    const passengerAccountReference = FinancialAccountReference.create(
      'FINANCIAL_ACCOUNT',
      passengerAccount.publicId.value,
    );

    const transactionReference = FinancialTransactionReference.create(
      'JOURNEY_BOOKING',
      booking.publicId.value,
    );

    const transactionAmount = Money.create(amount, currency);

    // 8. Record the passenger's AVAILABLE -> HELD movement.
    const transaction = FinancialTransactionAggregate.create(
      {
        type: FinancialTransactionType.create('HOLD'),
        amount: transactionAmount,
        reference: transactionReference,
      },
      command.correlationId,
      command.authorizedAt,
    );

    transaction.addEntry(
      {
        account: passengerAccountReference,
        type: FinancialTransactionEntryType.create('DEBIT'),
        balanceType: FinancialBalanceType.create('AVAILABLE'),
        amount: Money.create(amount, currency),
      },
      command.authorizedAt,
    );

    transaction.addEntry(
      {
        account: passengerAccountReference,
        type: FinancialTransactionEntryType.create('CREDIT'),
        balanceType: FinancialBalanceType.create('HELD'),
        amount: Money.create(amount, currency),
      },
      command.authorizedAt,
    );

    transaction.complete(command.correlationId, command.authorizedAt);

    await this.financialTransactionRepository.save(transaction);

    // 9. Create the passenger's hold record.
    const holdAmount = FinancialAccountHeldAmount.create(amount);

    const holdReference = FinancialHoldReference.create(
      'JOURNEY_BOOKING',
      booking.publicId.value,
    );

    const holdEntity = FinancialAccountHoldEntity.create(
      passengerAccount.id,
      passengerAccount.publicId,
      holdAmount,
      currency.toString(),
      holdReference,
    );

    const hold = FinancialAccountHoldAggregate.create(holdEntity);

    hold.setHoldTransactionPublicId(transaction.publicId.value);

    hold.recordCreated(command.correlationId, command.causationId);

    await this.financialAccountHoldRepository.create(hold);

    // 10. Persist both account balance changes in the same unit of work.
    await this.financialAccountRepository.save(passengerAccount);
    await this.financialAccountRepository.save(providerAccount);
  }
}
