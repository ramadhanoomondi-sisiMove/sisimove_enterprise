// -----------------------------------------------------------------------------
// Journey Booking — Authorize Payment Command Handler
// -----------------------------------------------------------------------------
//
// Path:
// src/domains/journey-booking/application/handlers/authorize-journey-booking-payment.handler.ts
//
// Dependency injection:
//     JOURNEY_BOOKING_TOKENS.REPOSITORY
//     FINANCIAL_ACCOUNT_TOKENS.REPOSITORY
//     FINANCIAL_ACCOUNT_HOLD_TOKENS.REPOSITORY
//     FINANCIAL_TRANSACTION_TOKENS.REPOSITORY
//     PrismaUnitOfWork
//
// Application responsibilities:
//
// 1. Load the Journey Booking aggregate.
// 2. Fail with JourneyBookingNotFoundException when it does not exist.
// 3. Establish the financial reservation required for the booking payment.
// 4. Create and complete the corresponding HOLD financial transaction.
// 5. Create the Financial Account Hold.
// 6. Delegate payment authorization to the JourneyBookingAggregate.
// 7. Persist all changed aggregates.
// 8. Commit everything as one atomic unit.
//
// Payment lifecycle rules remain inside the JourneyBookingAggregate.
//
// Financial balance rules remain inside the FinancialAccountAggregate.
//
// Financial transaction rules remain inside the FinancialTransactionAggregate.
//
// Financial hold lifecycle rules remain inside the FinancialAccountHoldAggregate.
//
// The PrismaUnitOfWork owns the transaction boundary.
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
// Command
// -----------------------------------------------------------------------------

import type { AuthorizeJourneyBookingPaymentCommand } from '../commands/authorize-journey-booking-payment.command';

// -----------------------------------------------------------------------------
// Journey Booking
// -----------------------------------------------------------------------------

import type { JourneyBookingAggregate } from '../../domain/aggregates/journey-booking.aggregate';

// -----------------------------------------------------------------------------
// Journey Booking Exceptions
// -----------------------------------------------------------------------------

import { JourneyBookingNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Journey Booking Repository
// -----------------------------------------------------------------------------

import type { JourneyBookingRepository } from '../../domain/repositories/journey-booking.repository';

// -----------------------------------------------------------------------------
// Journey Booking Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_BOOKING_TOKENS } from '../journey-booking.tokens';

// -----------------------------------------------------------------------------
// Financial Account
// -----------------------------------------------------------------------------

import type { FinancialAccountRepository } from '../../../financial/domain/repositories/financial-account.repository';

import { FINANCIAL_ACCOUNT_TOKENS } from '../../../financial/application/financial-account.tokens';

import { FinancialAccountOwnerPublicId } from '../../../financial/domain/value-objects/financial-account-owner-public-id.vo';

// -----------------------------------------------------------------------------
// Financial Account Exceptions
// -----------------------------------------------------------------------------

import { FinancialAccountNotFoundException } from '../../../financial/domain/exceptions';

// -----------------------------------------------------------------------------
// Financial Account Hold
// -----------------------------------------------------------------------------

import type { FinancialAccountHoldRepository } from '../../../financial/domain/repositories/financial-account-hold.repository';

import { FINANCIAL_ACCOUNT_HOLD_TOKENS } from '../../../financial/application/financial-account-hold.tokens';

import { FinancialAccountHoldAggregate } from '../../../financial/domain/aggregates/financial-account-hold.aggregate';

import { FinancialAccountHoldEntity } from '../../../financial/domain/entities/financial-account-hold.entity';

import { FinancialAccountHeldAmount } from '../../../financial/domain/value-objects/financial-account-held-amount.vo';

import { FinancialHoldReference } from '../../../financial/domain/value-objects/financial-hold-reference.vo';

// -----------------------------------------------------------------------------
// Financial Transaction
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// Unit of Work
// -----------------------------------------------------------------------------

import { PrismaUnitOfWork } from '../../../../infrastructure/persistence/prisma-unit-of-work';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class AuthorizeJourneyBookingPaymentHandler implements CommandHandler<
  AuthorizeJourneyBookingPaymentCommand,
  JourneyBookingAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    // -------------------------------------------------------------------------
    // Journey Booking
    // -------------------------------------------------------------------------

    @Inject(JOURNEY_BOOKING_TOKENS.REPOSITORY)
    private readonly repository: JourneyBookingRepository,

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
    command: AuthorizeJourneyBookingPaymentCommand,
  ): Promise<JourneyBookingAggregate> {
    return this.unitOfWork.execute(async () => {
      // -----------------------------------------------------------------------
      // Load Journey Booking
      // -----------------------------------------------------------------------

      const booking = await this.repository.findByPublicId(
        command.journeyBookingPublicId,
      );

      // -----------------------------------------------------------------------
      // Not Found
      // -----------------------------------------------------------------------

      if (booking === null) {
        throw new JourneyBookingNotFoundException(
          command.journeyBookingPublicId.value,
        );
      }

      // -----------------------------------------------------------------------
      // Establish Financial Reservation
      // -----------------------------------------------------------------------
      //
      // This application workflow coordinates:
      //
      // 1. Passenger Financial Account resolution.
      // 2. AVAILABLE -> HELD balance mutation.
      // 3. HOLD Financial Transaction creation.
      // 4. HOLD Financial Transaction completion.
      // 5. Financial Account Hold creation.
      // 6. Persistence of the financial aggregates.
      //
      // The individual aggregates remain responsible for their own rules.
      //
      // -----------------------------------------------------------------------

      await this.authorizeFinancialPayment(booking, command);

      // -----------------------------------------------------------------------
      // Authorize Journey Booking Payment
      // -----------------------------------------------------------------------
      //
      // The Journey Booking aggregate owns the booking payment lifecycle.
      //
      // command.transactionPublicId remains the transaction reference supplied
      // by the booking/payment workflow.
      //
      // The Financial Account HOLD transaction has its own Financial
      // Transaction public ID, which is stored on the Financial Account Hold.
      //
      // -----------------------------------------------------------------------

      booking.authorizePayment(
        command.transactionPublicId,
        command.correlationId,
        command.causationId,
        command.authorizedAt,
      );

      // -----------------------------------------------------------------------
      // Persist Journey Booking
      // -----------------------------------------------------------------------

      await this.repository.save(booking);

      // -----------------------------------------------------------------------
      // Return
      // -----------------------------------------------------------------------

      return booking;
    });
  }

  // ===========================================================================
  // Financial Payment Authorization
  // ===========================================================================

  private async authorizeFinancialPayment(
    booking: JourneyBookingAggregate,
    command: AuthorizeJourneyBookingPaymentCommand,
  ): Promise<void> {
    // -------------------------------------------------------------------------
    // Payment
    // -------------------------------------------------------------------------

    const payment = booking.payment;

    if (payment === undefined) {
      throw new Error(
        `Journey Booking "${booking.publicId.value}" does not contain a payment.`,
      );
    }

    // -------------------------------------------------------------------------
    // Payment Amount
    // -------------------------------------------------------------------------
    //
    // JourneyBookingPaymentAmount already represents the validated payment
    // amount as an integer in the financial domain's expected minor-unit form.
    //
    // No currency conversion or division is performed here.
    //
    // -------------------------------------------------------------------------

    const amount = payment.amount.value;

    // -------------------------------------------------------------------------
    // Payment Currency
    // -------------------------------------------------------------------------

    const currency = Currency.create(payment.currency.value);

    // -------------------------------------------------------------------------
    // Resolve Passenger Financial Account
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
    // Hold Funds
    // -------------------------------------------------------------------------
    //
    // FinancialAccountAggregate owns the authoritative balance mutation:
    //
    //     AVAILABLE -> HELD
    //
    // The Financial Account Hold aggregate does not perform this mutation.
    //
    // -------------------------------------------------------------------------

    financialAccount.holdFunds(amount, currency, command.authorizedAt);

    // -------------------------------------------------------------------------
    // Financial Account Reference
    // -------------------------------------------------------------------------

    const accountReference = FinancialAccountReference.create(
      'FINANCIAL_ACCOUNT',
      financialAccount.publicId.value,
    );

    // -------------------------------------------------------------------------
    // Financial Transaction Reference
    // -------------------------------------------------------------------------

    const transactionReference = FinancialTransactionReference.create(
      'JOURNEY_BOOKING',
      booking.publicId.value,
    );

    // -------------------------------------------------------------------------
    // Transaction Amount
    // -------------------------------------------------------------------------

    const transactionAmount = Money.create(amount, currency);

    // -------------------------------------------------------------------------
    // Create HOLD Financial Transaction
    // -------------------------------------------------------------------------
    //
    // FinancialTransactionAggregate.create() creates the transaction in
    // PENDING state.
    //
    // sourceAccount and destinationAccount are intentionally omitted.
    //
    // This is an internal balance-state movement within one Financial Account:
    //
    //     DEBIT  AVAILABLE
    //     CREDIT HELD
    //
    // With exactOptionalPropertyTypes enabled, optional properties that are
    // intentionally absent must be omitted rather than explicitly assigned
    // undefined.
    //
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
    // AVAILABLE -> Debit
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
    // HELD -> Credit
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
    // Complete HOLD Transaction
    // -------------------------------------------------------------------------
    //
    // FinancialTransactionAggregate validates:
    //
    // - entries exist;
    // - at least one debit exists;
    // - at least one credit exists;
    // - debit and credit totals balance;
    // - debit total equals transaction amount;
    // - credit total equals transaction amount.
    //
    // -------------------------------------------------------------------------

    transaction.complete(command.correlationId, command.authorizedAt);

    // -------------------------------------------------------------------------
    // Persist Financial Transaction
    // -------------------------------------------------------------------------

    await this.financialTransactionRepository.save(transaction);

    // -------------------------------------------------------------------------
    // Create Financial Account Hold
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
    // Link HOLD Transaction
    // -------------------------------------------------------------------------
    //
    // The Financial Account Hold aggregate owns the relationship between the
    // hold and the transaction that established it.
    //
    // It does not create or execute the Financial Transaction itself.
    //
    // -------------------------------------------------------------------------

    hold.setHoldTransactionPublicId(transaction.publicId.value);

    // -------------------------------------------------------------------------
    // Record Hold Creation
    // -------------------------------------------------------------------------
    //
    // FinancialAccountHoldAggregate.create() intentionally does not emit the
    // Created event automatically. The application workflow explicitly
    // records creation after the hold has been fully established.
    //
    // -------------------------------------------------------------------------

    hold.recordCreated(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // Persist Financial Account Hold
    // -------------------------------------------------------------------------

    await this.financialAccountHoldRepository.create(hold);
    // -------------------------------------------------------------------------
    // Persist Financial Account
    // -------------------------------------------------------------------------

    await this.financialAccountRepository.save(financialAccount);
  }
}
