// -----------------------------------------------------------------------------
// Financial Account Withdrawal — Request Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for requesting a Financial Account
// Withdrawal.
//
// Workflow:
//
// 1. Resolve the source Financial Account.
// 2. Ensure the account is operational.
// 3. Ensure the withdrawal currency matches the account currency.
// 4. Create the Financial Account Withdrawal entity.
// 5. Create the Financial Account Withdrawal aggregate.
// 6. Record the withdrawal-requested event.
// 7. Persist the complete aggregate.
// 8. Persist domain events into the transactional outbox.
// 9. Return the created aggregate.
//
// Destination handling:
//
// The command already contains the selected withdrawal destination.
//
// The application boundary is responsible for selecting either:
//
// - an explicitly supplied destination; or
// - the account's configured/default destination.
//
// The destination is represented by the
// FinancialAccountWithdrawalDestination value object.
//
// This handler does NOT:
//
// - Modify Financial Account balances.
// - Create a Financial Transaction.
// - Create a Financial Disbursement.
// - Execute an external provider.
// - Move money externally.
// - Perform settlement.
// - Perform accounting.
//
// Domain construction belongs to the domain entity/aggregate.
// Persistence belongs to the repositories.
// Event persistence belongs to the EventPublisher port.
// Transaction coordination belongs to the UnitOfWork port.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

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
// Foundation — Command Handler
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Application Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS } from '../financial-account-withdrawal.tokens';

import { FINANCIAL_ACCOUNT_TOKENS } from '../financial-account.tokens';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { RequestFinancialAccountWithdrawalCommand } from '../commands/request-financial-account-withdrawal.command';

// -----------------------------------------------------------------------------
// Domain — Aggregates
// -----------------------------------------------------------------------------

import { FinancialAccountWithdrawalAggregate } from '../../domain/aggregates/financial-account-withdrawal.aggregate';

// -----------------------------------------------------------------------------
// Domain — Entities
// -----------------------------------------------------------------------------

import { FinancialAccountWithdrawalEntity } from '../../domain/entities/financial-account-withdrawal.entity';

// -----------------------------------------------------------------------------
// Domain — Repositories
// -----------------------------------------------------------------------------

import type { FinancialAccountWithdrawalRepository } from '../../domain/repositories/financial-account-withdrawal.repository';

import type { FinancialAccountRepository } from '../../domain/repositories/financial-account.repository';

// -----------------------------------------------------------------------------
// Domain — Exceptions
// -----------------------------------------------------------------------------

import { FinancialAccountNotFoundException } from '../../domain/exceptions';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class RequestFinancialAccountWithdrawalHandler implements CommandHandler<
  RequestFinancialAccountWithdrawalCommand,
  FinancialAccountWithdrawalAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.REPOSITORY)
    private readonly withdrawalRepository: FinancialAccountWithdrawalRepository,

    @Inject(FINANCIAL_ACCOUNT_TOKENS.REPOSITORY)
    private readonly accountRepository: FinancialAccountRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: UnitOfWork,

    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: RequestFinancialAccountWithdrawalCommand,
  ): Promise<FinancialAccountWithdrawalAggregate> {
    return this.unitOfWork.execute(async () => {
      // -----------------------------------------------------------------------
      // 1. Resolve Financial Account
      // -----------------------------------------------------------------------

      const account = await this.accountRepository.findByPublicId(
        command.accountId,
      );

      if (account === null) {
        throw new FinancialAccountNotFoundException(command.accountId.value);
      }

      // -----------------------------------------------------------------------
      // 2. Validate Account Operational Status
      // -----------------------------------------------------------------------
      //
      // A withdrawal request may only originate from an operational account.
      //
      // The Financial Account aggregate owns this invariant.
      // -----------------------------------------------------------------------

      account.ensureOperational();

      // -----------------------------------------------------------------------
      // 3. Validate Withdrawal Currency
      // -----------------------------------------------------------------------
      //
      // The withdrawal amount must use the same currency as the source
      // Financial Account.
      //
      // The Financial Account aggregate owns this currency invariant.
      // -----------------------------------------------------------------------

      account.ensureCurrency(command.amount.currency);

      // -----------------------------------------------------------------------
      // 4. Create Withdrawal Entity
      // -----------------------------------------------------------------------
      //
      // The command already contains the selected destination snapshot.
      //
      // No FinancialDisbursementDestination aggregate or repository is
      // required here.
      //
      // Entity factory signature:
      //
      // create(
      //   accountId,
      //   accountPublicId,
      //   amount,
      //   destination,
      //   referenceType,
      //   referencePublicId,
      //   requestedAt?,
      // )
      //
      // The optional reference values are passed before the optional
      // request timestamp.
      // -----------------------------------------------------------------------

      const withdrawalEntity = FinancialAccountWithdrawalEntity.create(
        account.id,
        account.publicId,
        command.amount,
        command.destination,
        command.referenceType,
        command.referencePublicId,
      );

      // -----------------------------------------------------------------------
      // 5. Create Withdrawal Aggregate
      // -----------------------------------------------------------------------
      //
      // The aggregate owns the withdrawal's domain behavior and lifecycle.
      // -----------------------------------------------------------------------

      const aggregate =
        FinancialAccountWithdrawalAggregate.create(withdrawalEntity);

      // -----------------------------------------------------------------------
      // 6. Record Withdrawal Requested Event
      // -----------------------------------------------------------------------
      //
      // The aggregate records the domain event.
      //
      // Correlation and causation identifiers are supplied by the application
      // command.
      // -----------------------------------------------------------------------

      aggregate.recordRequested(command.correlationId, command.causationId);

      // -----------------------------------------------------------------------
      // 7. Persist Withdrawal Aggregate
      // -----------------------------------------------------------------------
      //
      // The repository persists the aggregate.
      //
      // This does not reserve or debit funds from the Financial Account.
      // -----------------------------------------------------------------------

      await this.withdrawalRepository.save(aggregate);

      // -----------------------------------------------------------------------
      // 8. Persist Domain Events into Transactional Outbox
      // -----------------------------------------------------------------------
      //
      // pullDomainEvents() returns pending events and clears the aggregate's
      // internal event collection.
      //
      // EventPublisher persists the events and their outbox records using the
      // same transaction context established by UnitOfWork.
      //
      // Events are not dispatched directly to subscribers from this handler.
      // The OutboxWorker handles dispatch after the transaction commits.
      // -----------------------------------------------------------------------

      const domainEvents = aggregate.pullDomainEvents();

      if (domainEvents.length > 0) {
        await this.eventPublisher.publishAll(domainEvents);
      }

      // -----------------------------------------------------------------------
      // 9. Return Created Aggregate
      // -----------------------------------------------------------------------

      return aggregate;
    });
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RequestFinancialAccountWithdrawalHandler;
