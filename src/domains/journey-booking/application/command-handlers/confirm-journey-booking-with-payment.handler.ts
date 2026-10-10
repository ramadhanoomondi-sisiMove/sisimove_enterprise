// -----------------------------------------------------------------------------
// Journey Booking — Confirm With Payment Command Handler
// -----------------------------------------------------------------------------
//
// Path:
//
// src/domains/journey-booking/application/handlers/
// confirm-journey-booking-with-payment.handler.ts
//
// -----------------------------------------------------------------------------
//
// Application responsibilities:
//
// 1. Load the Journey Booking aggregate.
// 2. Load the associated Journey aggregate.
// 3. Resolve the passenger Financial Account.
// 4. Move AVAILABLE funds to HELD.
// 5. Create and complete the HOLD Financial Transaction.
// 6. Create the Financial Account Hold.
// 7. Authorize the Journey Booking payment.
// 8. Confirm the Journey Booking.
// 9. Reserve Journey capacity.
// 10. Register the confirmed passenger in Journey Boarding as EXPECTED.
// 11. Persist the Journey Booking.
//
// All operations execute inside one PrismaUnitOfWork transaction.
//
// The Journey, Financial Account, Financial Transaction, Financial Account
// Hold, Journey Booking, and Journey Boarding repositories must participate
// in the same ambient Prisma transaction.
//
// If any operation fails, all database changes made within that transaction
// must roll back.
//
// IMPORTANT:
//
// Booking confirmation registers the passenger as EXPECTED for boarding.
// It does not mean the passenger has physically boarded.
//
// Physical boarding is managed separately by Journey Boarding.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Unit of Work
// -----------------------------------------------------------------------------

import { PrismaUnitOfWork } from '../../../../infrastructure/persistence/prisma-unit-of-work';

// -----------------------------------------------------------------------------
// Journey Booking — Command
// -----------------------------------------------------------------------------

import type { ConfirmJourneyBookingWithPaymentCommand } from '../commands/confirm-journey-booking-with-payment.command';

// -----------------------------------------------------------------------------
// Journey Booking — Aggregate
// -----------------------------------------------------------------------------

import type { JourneyBookingAggregate } from '../../domain/aggregates/journey-booking.aggregate';

// -----------------------------------------------------------------------------
// Journey Booking — Exceptions
// -----------------------------------------------------------------------------

import { JourneyBookingNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Journey Booking — Repository
// -----------------------------------------------------------------------------

import type { JourneyBookingRepository } from '../../domain/repositories/journey-booking.repository';

// -----------------------------------------------------------------------------
// Journey Booking — Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_BOOKING_TOKENS } from '../journey-booking.tokens';

// -----------------------------------------------------------------------------
// Journey — Repository
// -----------------------------------------------------------------------------

import type { JourneyRepository } from '../../../journey/domain/repositories/journey.repository';

// -----------------------------------------------------------------------------
// Journey — Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_TOKENS } from '../../../journey/application/journey.tokens';

// -----------------------------------------------------------------------------
// Journey Boarding — Repository
// -----------------------------------------------------------------------------

import type { JourneyBoardingRepository } from '../../../journey-boarding/domain/repositories/journey-boarding.repository';

// -----------------------------------------------------------------------------
// Journey Boarding — Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_BOARDING_TOKENS } from '../../../journey-boarding/application/journey-boarding.tokens';

// -----------------------------------------------------------------------------
// Journey Boarding — Participant Entity
// -----------------------------------------------------------------------------

import { JourneyBoardingParticipantEntity } from '../../../journey-boarding/domain/entities/journey-boarding-participant.entity';

// -----------------------------------------------------------------------------
// Journey Boarding — Value Objects
// -----------------------------------------------------------------------------

import { JourneyBoardingJourneyId } from '../../../journey-boarding/domain/value-objects/journey-boarding-journey-id.vo';

import { JourneyBoardingMemberPublicId } from '../../../journey-boarding/domain/value-objects/journey-boarding-member-public-id.vo';

import { JourneyBoardingBookingPublicId } from '../../../journey-boarding/domain/value-objects/journey-boarding-booking-public-id.vo';

import { JourneyBoardingParticipantRole } from '../../../journey-boarding/domain/value-objects/journey-boarding-participant-role.vo';

import { JourneyBoardingParticipantStatus } from '../../../journey-boarding/domain/value-objects/journey-boarding-participant-status.vo';

// -----------------------------------------------------------------------------
// Financial Account — Repository
// -----------------------------------------------------------------------------

import type { FinancialAccountRepository } from '../../../financial/domain/repositories/financial-account.repository';

// -----------------------------------------------------------------------------
// Financial Account — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_ACCOUNT_TOKENS } from '../../../financial/application/financial-account.tokens';

// -----------------------------------------------------------------------------
// Financial Account — Value Objects
// -----------------------------------------------------------------------------

import { FinancialAccountOwnerPublicId } from '../../../financial/domain/value-objects/financial-account-owner-public-id.vo';

// -----------------------------------------------------------------------------
// Financial Account — Exceptions
// -----------------------------------------------------------------------------

import { FinancialAccountNotFoundException } from '../../../financial/domain/exceptions';

// -----------------------------------------------------------------------------
// Financial Account Hold — Repository
// -----------------------------------------------------------------------------

import type { FinancialAccountHoldRepository } from '../../../financial/domain/repositories/financial-account-hold.repository';

// -----------------------------------------------------------------------------
// Financial Account Hold — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_ACCOUNT_HOLD_TOKENS } from '../../../financial/application/financial-account-hold.tokens';

// -----------------------------------------------------------------------------
// Financial Account Hold — Domain
// -----------------------------------------------------------------------------

import { FinancialAccountHoldAggregate } from '../../../financial/domain/aggregates/financial-account-hold.aggregate';

import { FinancialAccountHoldEntity } from '../../../financial/domain/entities/financial-account-hold.entity';

// -----------------------------------------------------------------------------
// Financial Account Hold — Value Objects
// -----------------------------------------------------------------------------

import { FinancialAccountHeldAmount } from '../../../financial/domain/value-objects/financial-account-held-amount.vo';

import { FinancialHoldReference } from '../../../financial/domain/value-objects/financial-hold-reference.vo';

// -----------------------------------------------------------------------------
// Financial Transaction — Repository
// -----------------------------------------------------------------------------

import type { FinancialTransactionRepository } from '../../../financial/domain/repositories/financial-transaction.repository';

// -----------------------------------------------------------------------------
// Financial Transaction — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_TRANSACTION_TOKENS } from '../../../financial/application/financial-transaction.tokens';

// -----------------------------------------------------------------------------
// Financial Transaction — Domain
// -----------------------------------------------------------------------------

import { FinancialTransactionAggregate } from '../../../financial/domain/aggregates/financial-transaction.aggregate';

// -----------------------------------------------------------------------------
// Financial Transaction — Value Objects
// -----------------------------------------------------------------------------

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
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Journey Booking
    // -------------------------------------------------------------------------

    @Inject(JOURNEY_BOOKING_TOKENS.REPOSITORY)
    private readonly repository: JourneyBookingRepository,

    // -------------------------------------------------------------------------
    // Journey
    // -------------------------------------------------------------------------

    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly journeyRepository: JourneyRepository,

    // -------------------------------------------------------------------------
    // Journey Boarding
    // -------------------------------------------------------------------------

    @Inject(JOURNEY_BOARDING_TOKENS.REPOSITORY)
    private readonly journeyBoardingRepository: JourneyBoardingRepository,

    // -------------------------------------------------------------------------
    // Financial Account
    // -------------------------------------------------------------------------

    @Inject(FINANCIAL_ACCOUNT_TOKENS.REPOSITORY)
    private readonly financialAccountRepository: FinancialAccountRepository,

    // -------------------------------------------------------------------------
    // Financial Account Hold
    // -------------------------------------------------------------------------

    @Inject(FINANCIAL_ACCOUNT_HOLD_TOKENS.REPOSITORY)
    private readonly financialAccountHoldRepository: FinancialAccountHoldRepository,

    // -------------------------------------------------------------------------
    // Financial Transaction
    // -------------------------------------------------------------------------

    @Inject(FINANCIAL_TRANSACTION_TOKENS.REPOSITORY)
    private readonly financialTransactionRepository: FinancialTransactionRepository,

    // -------------------------------------------------------------------------
    // Unit of Work
    // -------------------------------------------------------------------------

    private readonly unitOfWork: PrismaUnitOfWork,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: ConfirmJourneyBookingWithPaymentCommand,
  ): Promise<JourneyBookingAggregate> {
    return this.unitOfWork.execute(async () => {
      // -----------------------------------------------------------------------
      // 1. Load Journey Booking
      // -----------------------------------------------------------------------

      const booking = await this.repository.findByPublicId(
        command.journeyBookingPublicId,
      );

      if (booking === null) {
        throw new JourneyBookingNotFoundException(
          command.journeyBookingPublicId.value,
        );
      }

      // -----------------------------------------------------------------------
      // 2. Load Journey
      // -----------------------------------------------------------------------
      //
      // The Journey is loaded once and reused for both capacity reservation
      // and resolving the internal persistence identity required by
      // JourneyBoardingJourneyId.
      //
      // Do not substitute booking.journeyPublicId.value for journey.id.
      // The Journey public ID and internal persistence ID are distinct.
      // -----------------------------------------------------------------------

      const journey = await this.journeyRepository.findByPublicId(
        booking.journeyPublicId,
      );

      if (journey === null) {
        throw new Error(
          `Journey was not found for public ID "${booking.journeyPublicId.value}".`,
        );
      }

      // -----------------------------------------------------------------------
      // 3. Establish Financial Reservation
      // -----------------------------------------------------------------------
      //
      // This moves the passenger's funds from AVAILABLE to HELD, creates and
      // completes the HOLD transaction, creates the account hold, and persists
      // the financial changes within the current unit-of-work transaction.
      // -----------------------------------------------------------------------

      await this.authorizeFinancialPayment(booking, command);

      // -----------------------------------------------------------------------
      // 4. Authorize Journey Booking Payment
      // -----------------------------------------------------------------------

      booking.authorizePayment(
        command.transactionPublicId,
        command.correlationId,
        command.causationId,
        command.authorizedAt,
      );

      // -----------------------------------------------------------------------
      // 5. Confirm Journey Booking
      // -----------------------------------------------------------------------

      booking.confirm(
        command.correlationId,
        command.causationId,
        command.confirmedAt,
      );

      // -----------------------------------------------------------------------
      // 6. Reserve Journey Capacity
      // -----------------------------------------------------------------------
      //
      // Capacity reservation must succeed before the passenger is registered
      // with Journey Boarding.
      //
      // A failure later in this transaction must roll back this reservation
      // together with the financial and booking changes.
      // -----------------------------------------------------------------------

      await this.journeyRepository.reserveCapacitySeats(
        journey.journeyId,
        booking.seats.value,
      );

      // -----------------------------------------------------------------------
      // 7. Register Passenger As EXPECTED For Boarding
      // -----------------------------------------------------------------------
      //
      // JourneyBoardingJourneyId represents the Journey's internal
      // persistence identity. The Journey aggregate exposes that identity
      // through journey.id.
      //
      // Use the same mapping as PublishJourneyHandler.
      // -----------------------------------------------------------------------

      await this.registerExpectedPassengerForBoarding(
        booking,
        journey.id.toString(),
      );

      // -----------------------------------------------------------------------
      // 8. Persist Journey Booking
      // -----------------------------------------------------------------------
      //
      // All repository operations must share the transaction managed by
      // PrismaUnitOfWork. Repository save operations must not open independent
      // transactions.
      // -----------------------------------------------------------------------

      await this.repository.save(booking);

      // -----------------------------------------------------------------------
      // 9. Return Confirmed Booking
      // -----------------------------------------------------------------------

      return booking;
    });
  }

  // ===========================================================================
  // Register Expected Passenger For Journey Boarding
  // ===========================================================================

  /**
   * Ensures the passenger associated with a confirmed booking is registered
   * in the active Journey Boarding aggregate with EXPECTED status.
   *
   * @param booking Confirmed Journey Booking aggregate.
   * @param journeyInternalId Internal persistence ID of the Journey aggregate.
   *
   * Integrity rules:
   *
   * 1. An active boarding aggregate must exist for the internal Journey ID.
   * 2. An existing booking participant must refer to the same passenger and
   *    have the PASSENGER role.
   * 3. A passenger already registered under another booking is rejected.
   * 4. A new participant must use the PASSENGER role and EXPECTED status.
   *
   * This method does not create a boarding aggregate, open boarding, or mark
   * the passenger as physically boarded.
   *
   * The repository must participate in the ambient Prisma transaction.
   */
  private async registerExpectedPassengerForBoarding(
    booking: JourneyBookingAggregate,
    journeyInternalId: string,
  ): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Create Journey Boarding's Journey Identity
    // -------------------------------------------------------------------------
    //
    // The constructor is private. Always use the value object's factory.
    //
    // journeyInternalId comes from journey.id.toString(), not from the
    // Journey's externally exposed public ID.
    // -------------------------------------------------------------------------

    const journeyBoardingJourneyId =
      JourneyBoardingJourneyId.create(journeyInternalId);

    // -------------------------------------------------------------------------
    // 2. Resolve Active Journey Boarding
    // -------------------------------------------------------------------------

    const boarding = await this.journeyBoardingRepository.findActiveByJourneyId(
      journeyBoardingJourneyId,
    );

    if (boarding === null) {
      throw new Error(
        `Active Journey Boarding was not found for Journey internal ID "${journeyInternalId}" while confirming booking "${booking.publicId.value}".`,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Resolve Participant References
    // -------------------------------------------------------------------------

    const bookingPublicId = new JourneyBoardingBookingPublicId(
      booking.publicId.value,
    );

    const memberPublicId = new JourneyBoardingMemberPublicId(
      booking.passengerPublicId.value,
    );

    // -------------------------------------------------------------------------
    // 4. Check Existing Participant By Booking
    // -------------------------------------------------------------------------
    //
    // The booking public ID is the idempotency key for participant
    // registration.
    //
    // If the booking already has a participant, verify that the participant
    // belongs to the same passenger and has the PASSENGER role.
    //
    // A matching participant means registration is already complete.
    // -------------------------------------------------------------------------

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

      // The participant is already registered correctly. Do not add a
      // duplicate participant or persist an unchanged boarding aggregate.
      return;
    }

    // -------------------------------------------------------------------------
    // 5. Prevent Duplicate Passenger Registration
    // -------------------------------------------------------------------------
    //
    // A member can appear only once in this boarding aggregate.
    //
    // If the passenger already exists under another booking, reject the
    // inconsistent state instead of silently reassigning the participant.
    // -------------------------------------------------------------------------

    const existingByMember = boarding.findParticipantByMember(memberPublicId);

    if (existingByMember !== undefined) {
      throw new Error(
        `Passenger "${memberPublicId.value}" is already registered in Journey Boarding "${boarding.publicId.value}" under another booking.`,
      );
    }

    // -------------------------------------------------------------------------
    // 6. Create EXPECTED Passenger Participant
    // -------------------------------------------------------------------------
    //
    // boardingId must be the Journey Boarding aggregate's public ID.
    // It must not be the Journey's internal ID or public ID.
    //
    // The participant factory generates its own public identity when one is
    // not supplied.
    // -------------------------------------------------------------------------

    const participant = JourneyBoardingParticipantEntity.create({
      boardingId: boarding.publicId,
      memberPublicId,
      bookingPublicId,
      role: JourneyBoardingParticipantRole.passenger(),
      status: JourneyBoardingParticipantStatus.expected(),
    });

    // -------------------------------------------------------------------------
    // 7. Apply Boarding Aggregate Invariants
    // -------------------------------------------------------------------------
    //
    // Let the aggregate enforce participant uniqueness, role/booking
    // constraints, boarding ownership, and lifecycle restrictions.
    // Do not persist the participant independently of its aggregate.
    // -------------------------------------------------------------------------

    boarding.addParticipant(participant);

    // -------------------------------------------------------------------------
    // 8. Persist Boarding Aggregate
    // -------------------------------------------------------------------------
    //
    // PrismaJourneyBoardingRepository must use the ambient transaction-scoped
    // Prisma client supplied by PrismaTransactionContext.
    // -------------------------------------------------------------------------

    await this.journeyBoardingRepository.save(boarding);
  }

  // ===========================================================================
  // Financial Payment Authorization
  // ===========================================================================

  /**
   * Establishes the financial reservation required by the Journey Booking.
   *
   * This method intentionally does not create a separate unit of work.
   * All repository operations participate in the transaction established
   * by execute().
   */
  private async authorizeFinancialPayment(
    booking: JourneyBookingAggregate,
    command: ConfirmJourneyBookingWithPaymentCommand,
  ): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Resolve Booking Payment
    // -------------------------------------------------------------------------

    const payment = booking.payment;

    if (payment === undefined) {
      throw new Error(
        `Journey Booking "${booking.publicId.value}" does not contain a payment.`,
      );
    }

    // -------------------------------------------------------------------------
    // 2. Resolve Amount And Currency
    // -------------------------------------------------------------------------

    const amount = payment.amount.value;

    const currency = Currency.create(payment.currency.value);

    // -------------------------------------------------------------------------
    // 3. Resolve Passenger Financial Account
    // -------------------------------------------------------------------------

    const ownerPublicId = FinancialAccountOwnerPublicId.create(
      booking.passengerPublicId.value,
    );

    const financialAccount =
      await this.financialAccountRepository.findByOwnerPublicId(ownerPublicId);

    if (financialAccount === null) {
      throw new FinancialAccountNotFoundException(ownerPublicId.value);
    }

    // -------------------------------------------------------------------------
    // 4. Hold Passenger Funds
    // -------------------------------------------------------------------------
    //
    // The Financial Account aggregate enforces its balance invariants.
    // -------------------------------------------------------------------------

    financialAccount.holdFunds(amount, currency, command.authorizedAt);

    // -------------------------------------------------------------------------
    // 5. Create Financial Account Reference
    // -------------------------------------------------------------------------

    const accountReference = FinancialAccountReference.create(
      'FINANCIAL_ACCOUNT',
      financialAccount.publicId.value,
    );

    // -------------------------------------------------------------------------
    // 6. Create Financial Transaction Reference
    // -------------------------------------------------------------------------

    const transactionReference = FinancialTransactionReference.create(
      'JOURNEY_BOOKING',
      booking.publicId.value,
    );

    // -------------------------------------------------------------------------
    // 7. Create Transaction Amount
    // -------------------------------------------------------------------------

    const transactionAmount = Money.create(amount, currency);

    // -------------------------------------------------------------------------
    // 8. Create HOLD Financial Transaction
    // -------------------------------------------------------------------------

    const transaction = FinancialTransactionAggregate.create(
      {
        type: FinancialTransactionType.create('HOLD'),
        amount: transactionAmount,
        reference: transactionReference,
      },
      command.correlationId,
      command.authorizedAt,
    );

    // -------------------------------------------------------------------------
    // 9. Record AVAILABLE Debit
    // -------------------------------------------------------------------------

    transaction.addEntry(
      {
        account: accountReference,
        type: FinancialTransactionEntryType.create('DEBIT'),
        balanceType: FinancialBalanceType.create('AVAILABLE'),
        amount: Money.create(amount, currency),
      },
      command.authorizedAt,
    );

    // -------------------------------------------------------------------------
    // 10. Record HELD Credit
    // -------------------------------------------------------------------------

    transaction.addEntry(
      {
        account: accountReference,
        type: FinancialTransactionEntryType.create('CREDIT'),
        balanceType: FinancialBalanceType.create('HELD'),
        amount: Money.create(amount, currency),
      },
      command.authorizedAt,
    );

    // -------------------------------------------------------------------------
    // 11. Complete HOLD Transaction
    // -------------------------------------------------------------------------

    transaction.complete(command.correlationId, command.authorizedAt);

    // -------------------------------------------------------------------------
    // 12. Persist Financial Transaction
    // -------------------------------------------------------------------------

    await this.financialTransactionRepository.save(transaction);

    // -------------------------------------------------------------------------
    // 13. Create Financial Account Hold
    // -------------------------------------------------------------------------

    const holdAmount = FinancialAccountHeldAmount.create(amount);

    const holdReference = FinancialHoldReference.create(
      'JOURNEY_BOOKING',
      booking.publicId.value,
    );

    const holdEntity = FinancialAccountHoldEntity.create(
      financialAccount.id,
      financialAccount.publicId,
      holdAmount,
      currency.toString(),
      holdReference,
    );

    const hold = FinancialAccountHoldAggregate.create(holdEntity);

    // -------------------------------------------------------------------------
    // 14. Link HOLD Transaction
    // -------------------------------------------------------------------------

    hold.setHoldTransactionPublicId(transaction.publicId.value);

    // -------------------------------------------------------------------------
    // 15. Record Hold Creation
    // -------------------------------------------------------------------------

    hold.recordCreated(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // 16. Persist Financial Account Hold
    // -------------------------------------------------------------------------

    await this.financialAccountHoldRepository.create(hold);

    // -------------------------------------------------------------------------
    // 17. Persist Financial Account
    // -------------------------------------------------------------------------

    await this.financialAccountRepository.save(financialAccount);
  }
}
