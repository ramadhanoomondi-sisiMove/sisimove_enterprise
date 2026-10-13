// src/domains/journey-boarding/application/command-handlers/remove-participant.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';
import { PrismaUnitOfWork } from '../../../../infrastructure/persistence/prisma-unit-of-work';

// -----------------------------------------------------------------------------
// Journey — Dependencies
// -----------------------------------------------------------------------------

import { JOURNEY_TOKENS } from '../../../journey/application/journey.tokens';
import type { JourneyRepository } from '../../../journey/domain/repositories/journey.repository';
import { JourneyId } from '../../../journey/domain/value-objects/journey-id.vo';

// -----------------------------------------------------------------------------
// Journey Booking — Dependencies
// -----------------------------------------------------------------------------

import { JOURNEY_BOOKING_TOKENS } from '../../../journey-booking/application/journey-booking.tokens';
import type { JourneyBookingRepository } from '../../../journey-booking/domain/repositories/journey-booking.repository';

import { JourneyBookingPublicId } from '../../../journey-booking/domain/value-objects/journey-booking-public-id.vo';
import { JourneyBookingCancellationEntity } from '../../../journey-booking/domain/entities/journey-booking-cancellation.entity';
import { JourneyBookingCancellationReason } from '../../../journey-booking/domain/value-objects/journey-booking-cancellation-reason.vo';
import { JourneyBookingCancelledByPublicId } from '../../../journey-booking/domain/value-objects/journey-booking-cancelled-by-public-id.vo';

import { JourneyBookingNotFoundException } from '../../../journey-booking/domain/exceptions';

// -----------------------------------------------------------------------------
// Journey Boarding — Dependencies
// -----------------------------------------------------------------------------

import { JOURNEY_BOARDING_TOKENS } from '../journey-boarding.tokens';

import type { RemoveParticipantCommand } from '../commands/remove-participant.command';
import type { JourneyBoardingAggregate } from '../../domain/aggregates/journey-boarding.aggregate';
import type { JourneyBoardingRepository } from '../../domain/repositories/journey-boarding.repository';

import {
  JourneyBoardingInvariantException,
  JourneyBoardingNotFoundException,
} from '../../domain/exceptions';

import { JourneyBoardingEventEntity } from '../../domain/entities/journey-boarding-event.entity';
import { JourneyBoardingEventType } from '../../domain/value-objects/journey-boarding-event-type.vo';

// -----------------------------------------------------------------------------
// Financial Account — Dependencies
// -----------------------------------------------------------------------------

import { FINANCIAL_ACCOUNT_TOKENS } from '../../../financial/application/financial-account.tokens';
import type { FinancialAccountRepository } from '../../../financial/domain/repositories/financial-account.repository';
import { FinancialAccountOwnerPublicId } from '../../../financial/domain/value-objects/financial-account-owner-public-id.vo';

import { FINANCIAL_ACCOUNT_HOLD_TOKENS } from '../../../financial/application/financial-account-hold.tokens';
import type { FinancialAccountHoldRepository } from '../../../financial/domain/repositories/financial-account-hold.repository';

// -----------------------------------------------------------------------------
// Financial Transaction — Dependencies
// -----------------------------------------------------------------------------

import { FINANCIAL_TRANSACTION_TOKENS } from '../../../financial/application/financial-transaction.tokens';
import type { FinancialTransactionRepository } from '../../../financial/domain/repositories/financial-transaction.repository';

import { FinancialTransactionAggregate } from '../../../financial/domain/aggregates/financial-transaction.aggregate';

// -----------------------------------------------------------------------------
// Financial Value Objects
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

// -----------------------------------------------------------------------------
// Result
// -----------------------------------------------------------------------------

export interface RemoveParticipantResult {
  aggregate: JourneyBoardingAggregate;
  journeyPublicId: string;
}

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class RemoveParticipantHandler implements CommandHandler<
  RemoveParticipantCommand,
  RemoveParticipantResult
> {
  public constructor(
    @Inject(JOURNEY_BOARDING_TOKENS.REPOSITORY)
    private readonly repository: JourneyBoardingRepository,

    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly journeyRepository: JourneyRepository,

    @Inject(JOURNEY_BOOKING_TOKENS.REPOSITORY)
    private readonly bookingRepository: JourneyBookingRepository,

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
    command: RemoveParticipantCommand,
  ): Promise<RemoveParticipantResult> {
    return this.unitOfWork.execute(async () => {
      // 1. Load boarding aggregate.

      const aggregate = await this.repository.findByPublicId(
        command.journeyBoardingPublicId,
      );

      if (aggregate === null) {
        throw new JourneyBoardingNotFoundException(
          command.journeyBoardingPublicId.value,
        );
      }

      // 2. Resolve participant before changing any state.

      const participant = aggregate.findParticipant(
        command.participantPublicId,
      );

      if (participant === undefined) {
        throw new JourneyBoardingInvariantException(
          `Participant ${command.participantPublicId.value} was not found in boarding ${aggregate.publicId.value}.`,
        );
      }

      // 3. Require the associated booking.

      const participantBookingPublicId = participant.bookingPublicId?.value;

      if (participantBookingPublicId === undefined) {
        throw new JourneyBoardingInvariantException(
          `Participant ${command.participantPublicId.value} has no associated booking.`,
        );
      }

      const bookingPublicId = new JourneyBookingPublicId(
        participantBookingPublicId,
      );

      const booking =
        await this.bookingRepository.findByPublicId(bookingPublicId);

      if (booking === null) {
        throw new JourneyBookingNotFoundException(bookingPublicId.value);
      }

      // 4. Resolve journey and validate booking ownership.

      const journey = await this.journeyRepository.findJourneyById(
        new JourneyId(aggregate.journeyBoarding.journeyId.value),
      );

      if (journey === null) {
        throw new JourneyBoardingInvariantException(
          `Journey not found for boarding ${aggregate.publicId.value}.`,
        );
      }

      if (!booking.belongsToJourney(journey.publicId)) {
        throw new JourneyBoardingInvariantException(
          `Booking ${booking.publicId.value} does not belong to journey ${journey.publicId.value}.`,
        );
      }

      if (booking.isCancelled()) {
        throw new JourneyBoardingInvariantException(
          `Booking ${booking.publicId.value} is already cancelled.`,
        );
      }

      const removedAt = command.removedAt ?? new Date();
      const bookingWasConfirmed = booking.isConfirmed();

      // 5. Resolve the active financial hold before mutating the booking.

      const activeHolds =
        await this.financialAccountHoldRepository.findActiveByReferenceTypeAndPublicId(
          'JOURNEY_BOOKING',
          booking.publicId.value,
        );

      if (activeHolds.length > 1) {
        throw new JourneyBoardingInvariantException(
          `Booking ${booking.publicId.value} has multiple active financial holds. Manual reconciliation is required.`,
        );
      }

      // 6. Release passenger held funds when an active hold exists.

      if (activeHolds.length === 1) {
        const hold = activeHolds[0];

        if (hold === undefined) {
          throw new JourneyBoardingInvariantException(
            `Unable to resolve the active financial hold for booking ${booking.publicId.value}.`,
          );
        }

        if (!hold.canCancel()) {
          throw new JourneyBoardingInvariantException(
            `Financial hold ${hold.publicId.value} cannot be cancelled.`,
          );
        }

        const financialAccount =
          await this.financialAccountRepository.findByPublicId(
            hold.accountPublicId,
          );

        if (financialAccount === null) {
          throw new JourneyBoardingInvariantException(
            `Financial account ${hold.accountPublicId.value} was not found for hold ${hold.publicId.value}.`,
          );
        }

        const currency = Currency.create(hold.currency);
        const amount = hold.amountValue;

        if (amount <= 0) {
          throw new JourneyBoardingInvariantException(
            `Financial hold ${hold.publicId.value} has an invalid amount.`,
          );
        }

        if (!financialAccount.currency.equals(currency)) {
          throw new JourneyBoardingInvariantException(
            `Financial hold currency does not match account currency for hold ${hold.publicId.value}.`,
          );
        }

        if (!financialAccount.hasHeldFunds(amount)) {
          throw new JourneyBoardingInvariantException(
            `Financial account does not contain enough held funds to release hold ${hold.publicId.value}.`,
          );
        }

        const accountReference = FinancialAccountReference.create(
          'FINANCIAL_ACCOUNT',
          financialAccount.publicId.value,
        );

        const transactionReference = FinancialTransactionReference.create(
          'JOURNEY_BOOKING',
          booking.publicId.value,
        );

        const transaction = FinancialTransactionAggregate.create(
          {
            type: FinancialTransactionType.create('RELEASE'),
            amount: Money.create(amount, currency),
            reference: transactionReference,
          },
          command.correlationId,
          removedAt,
        );

        // RELEASE: debit HELD.

        transaction.addEntry(
          {
            account: accountReference,
            type: FinancialTransactionEntryType.create('DEBIT'),
            balanceType: FinancialBalanceType.create('HELD'),
            amount: Money.create(amount, currency),
          },
          removedAt,
        );

        // RELEASE: credit AVAILABLE.

        transaction.addEntry(
          {
            account: accountReference,
            type: FinancialTransactionEntryType.create('CREDIT'),
            balanceType: FinancialBalanceType.create('AVAILABLE'),
            amount: Money.create(amount, currency),
          },
          removedAt,
        );

        transaction.complete(command.correlationId, removedAt);

        financialAccount.releaseHeldFunds(amount, currency, removedAt);

        await this.financialTransactionRepository.save(transaction);
        await this.financialAccountRepository.save(financialAccount);

        hold.cancel(
          transaction.publicId.value,
          removedAt,
          command.correlationId,
          command.causationId,
        );

        await this.financialAccountHoldRepository.save(hold);
      }

      // 7. Reverse the provider's pending balance for a confirmed booking.
      //
      // Booking authorization increases the provider's pending balance.
      // Removing a confirmed booking must reverse that pending amount without
      // crediting it to the provider's available balance.
      //
      // This is a balance reversal, not a release of the passenger's hold.

      if (bookingWasConfirmed) {
        const payment = booking.payment;

        if (payment === undefined) {
          throw new JourneyBoardingInvariantException(
            `Confirmed booking ${booking.publicId.value} has no payment; provider pending funds cannot be reconciled safely.`,
          );
        }

        const providerOwnerPublicId = FinancialAccountOwnerPublicId.create(
          journey.providerPublicId.value,
        );

        const providerAccount =
          await this.financialAccountRepository.findByOwnerPublicId(
            providerOwnerPublicId,
          );

        if (providerAccount === null) {
          throw new JourneyBoardingInvariantException(
            `Provider financial account for journey ${journey.publicId.value} was not found.`,
          );
        }

        const providerCurrency = Currency.create(payment.currency.value);
        const providerPendingAmount = payment.amount.value;

        if (providerPendingAmount <= 0) {
          throw new JourneyBoardingInvariantException(
            `Confirmed booking ${booking.publicId.value} has an invalid payment amount.`,
          );
        }

        if (!providerAccount.currency.equals(providerCurrency)) {
          throw new JourneyBoardingInvariantException(
            `Provider financial account currency does not match booking ${booking.publicId.value}.`,
          );
        }

        if (!providerAccount.hasPendingFunds(providerPendingAmount)) {
          throw new JourneyBoardingInvariantException(
            `Provider financial account does not contain enough pending funds to reverse booking ${booking.publicId.value}.`,
          );
        }

        providerAccount.reversePending(
          providerPendingAmount,
          providerCurrency,
          removedAt,
        );

        await this.financialAccountRepository.save(providerAccount);
      }

      // 8. Cancel the booking using the provider-request reason.

      const cancellationReason =
        JourneyBookingCancellationReason.create('PROVIDER_REQUEST');

      const cancelledByPublicId = command.actorPublicId
        ? new JourneyBookingCancelledByPublicId(command.actorPublicId.value)
        : undefined;

      const cancellation = JourneyBookingCancellationEntity.create({
        reason: cancellationReason,
        cancelledByPublicId,
        cancelledAt: removedAt,
      });

      booking.attachCancellation(cancellation);

      booking.cancel(
        cancellationReason,
        cancelledByPublicId?.value,
        undefined,
        command.correlationId,
        command.causationId,
        removedAt,
      );

      await this.bookingRepository.save(booking);

      // 9. Release journey seats only if this booking had reserved them.

      if (bookingWasConfirmed) {
        await this.journeyRepository.releaseCapacitySeats(
          new JourneyId(journey.id.toString()),
          booking.seats.value,
        );
      }

      // 10. Remove the participant through the boarding aggregate.

      aggregate.removeParticipant(
        command.participantPublicId,
        command.correlationId,
        command.causationId,
        removedAt,
        command.actorPublicId,
      );

      // 11. Record the boarding history event.

      const removalEvent = JourneyBoardingEventEntity.create({
        boardingId: aggregate.publicId,
        type: JourneyBoardingEventType.participantRemoved(),
        actorPublicId: command.actorPublicId,
        occurredAt: removedAt,
      });

      aggregate.addBoardingEvent(removalEvent);

      // 12. Persist boarding.

      await this.repository.save(aggregate);

      return {
        aggregate,
        journeyPublicId: journey.publicId.value,
      };
    });
  }
}

export default RemoveParticipantHandler;
