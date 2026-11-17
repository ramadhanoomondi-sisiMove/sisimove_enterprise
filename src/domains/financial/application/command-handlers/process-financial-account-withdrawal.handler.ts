import { Inject, Injectable, Logger } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation — Unit of Work
// -----------------------------------------------------------------------------

import { UNIT_OF_WORK } from '../../../../foundation/persistence/unit-of-work.token';

import type { UnitOfWork } from '../../../../foundation/persistence/unit-of-work.interface';

// -----------------------------------------------------------------------------
// Foundation — Event Publisher
// -----------------------------------------------------------------------------

import { EVENT_PUBLISHER } from '../../../../foundation/events/event-publisher.token';

import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS } from '../financial-account-withdrawal.tokens';

// -----------------------------------------------------------------------------
// Foundation — Command Handler
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { ProcessFinancialAccountWithdrawalCommand } from '../commands/process-financial-account-withdrawal.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { FinancialAccountWithdrawalAggregate } from '../../domain/aggregates/financial-account-withdrawal.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { FinancialAccountWithdrawalRepository } from '../../domain/repositories/financial-account-withdrawal.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialAccountWithdrawalNotFoundException } from '../../domain/exceptions';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class ProcessFinancialAccountWithdrawalHandler implements CommandHandler<
  ProcessFinancialAccountWithdrawalCommand,
  FinancialAccountWithdrawalAggregate
> {
  private readonly logger = new Logger(
    ProcessFinancialAccountWithdrawalHandler.name,
  );

  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.REPOSITORY)
    private readonly withdrawalRepository: FinancialAccountWithdrawalRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: UnitOfWork,

    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: ProcessFinancialAccountWithdrawalCommand,
  ): Promise<FinancialAccountWithdrawalAggregate> {
    // -------------------------------------------------------------------------
    // 1. Execute Withdrawal Transition Within UnitOfWork
    // -------------------------------------------------------------------------

    const result = await this.unitOfWork.execute(async () => {
      // -----------------------------------------------------------------------
      // 1.1 Resolve Withdrawal
      // -----------------------------------------------------------------------

      const aggregate = await this.withdrawalRepository.findByPublicId(
        command.withdrawalId,
      );

      if (aggregate === null) {
        throw new FinancialAccountWithdrawalNotFoundException(
          command.withdrawalId.value,
        );
      }

      // -----------------------------------------------------------------------
      // 1.2 Idempotency — Already Transitioned
      // -----------------------------------------------------------------------
      //
      // Only PENDING withdrawals may enter PROCESSING.
      //
      // A withdrawal already in PROCESSING or a terminal state must not
      // produce another FinancialAccountWithdrawalProcessingEvent.
      //
      // The caller receives the persisted aggregate without any mutation.
      // -----------------------------------------------------------------------

      if (!aggregate.isPending) {
        return {
          aggregate,
          transitioned: false,
        };
      }

      // -----------------------------------------------------------------------
      // 1.3 Validate Processing Eligibility
      // -----------------------------------------------------------------------
      //
      // The entity owns the authoritative lifecycle validation.
      //
      // This preliminary check makes the handler's intent explicit.
      // The aggregate.process() method validates again before mutation.
      //
      // In particular, a PENDING withdrawal that already has a
      // disbursement must not enter PROCESSING.
      // -----------------------------------------------------------------------

      if (!aggregate.canProcess()) {
        throw new Error(
          `Financial Account Withdrawal "${aggregate.publicId.value}" is PENDING but is not eligible for processing.`,
        );
      }

      // -----------------------------------------------------------------------
      // 1.4 Perform Domain Transition
      // -----------------------------------------------------------------------
      //
      // Aggregate:
      //   PENDING -> PROCESSING
      //
      // The aggregate:
      // - delegates lifecycle validation to its entity;
      // - changes withdrawal lifecycle state;
      // - records FinancialAccountWithdrawalProcessingEvent.
      //
      // It does not:
      // - reserve or release funds;
      // - change Financial Account balances;
      // - create Financial Transactions;
      // - create Financial Disbursements;
      // - initiate M-PESA B2C.
      // -----------------------------------------------------------------------

      aggregate.process(command.correlationId, command.causationId);

      // -----------------------------------------------------------------------
      // 1.5 Atomically Persist PENDING -> PROCESSING
      // -----------------------------------------------------------------------
      //
      // saveIfPending() performs an atomic conditional update:
      //
      // WHERE:
      //   withdrawal ID matches
      //   public ID matches
      //   account ID matches
      //   persisted status = PENDING
      //
      // This prevents concurrent commands from both winning the transition.
      // -----------------------------------------------------------------------

      const saved = await this.withdrawalRepository.saveIfPending(aggregate);

      // -----------------------------------------------------------------------
      // 1.6 Handle Concurrent Transition
      // -----------------------------------------------------------------------

      if (!saved) {
        const latestAggregate = await this.withdrawalRepository.findByPublicId(
          command.withdrawalId,
        );

        if (latestAggregate === null) {
          throw new FinancialAccountWithdrawalNotFoundException(
            command.withdrawalId.value,
          );
        }

        // ---------------------------------------------------------------------
        // Failed Conditional Save Without a Visible State Change
        // ---------------------------------------------------------------------
        //
        // A failed conditional save must not be acknowledged as a successful
        // transition when the persisted withdrawal is still PENDING.
        //
        // Throwing allows the surrounding event-processing infrastructure
        // to retry, provided it supports retrying failed deliveries.
        //
        // The domain event generated by the losing aggregate is discarded.
        // ---------------------------------------------------------------------

        if (latestAggregate.isPending) {
          throw new Error(
            `Financial Account Withdrawal "${command.withdrawalId.value}" remains PENDING after a failed conditional save.`,
          );
        }

        // ---------------------------------------------------------------------
        // Another Transaction Already Changed the Withdrawal
        // ---------------------------------------------------------------------
        //
        // Return the latest persisted aggregate.
        //
        // Do not publish events from the losing aggregate.
        // ---------------------------------------------------------------------

        return {
          aggregate: latestAggregate,
          transitioned: false,
        };
      }

      // -----------------------------------------------------------------------
      // 1.7 Publish Domain Events Within UnitOfWork
      // -----------------------------------------------------------------------
      //
      // The event publisher must persist events using the same ambient
      // transaction as the withdrawal repository.
      //
      // This ensures that the lifecycle transition and its processing event
      // commit or roll back together.
      //
      // The publisher must not deliver the event to external consumers
      // before the database transaction commits.
      // -----------------------------------------------------------------------

      const domainEvents = aggregate.pullDomainEvents();

      if (domainEvents.length > 0) {
        await this.eventPublisher.publishAll(domainEvents);
      }

      // -----------------------------------------------------------------------
      // 1.8 Return Successfully Transitioned Aggregate
      // -----------------------------------------------------------------------

      return {
        aggregate,
        transitioned: true,
      };
    });

    // =========================================================================
    // 2. Post-Transaction Logging
    // =========================================================================
    //
    // Log only after the UnitOfWork completes successfully.
    //
    // Duplicate commands and concurrent losers do not generate a second
    // transition log.
    // =========================================================================

    if (result.transitioned) {
      this.logger.log(
        `Financial Account Withdrawal entered PROCESSING: ${result.aggregate.publicId.value}`,
      );
    }

    // =========================================================================
    // 3. Return Persisted Withdrawal State
    // =========================================================================

    return result.aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ProcessFinancialAccountWithdrawalHandler;
