// -----------------------------------------------------------------------------
// Financial Account Withdrawal — Request Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for requesting a Financial Account Withdrawal.
//
// Workflow:
//
// 1. Resolve the source Financial Account.
// 2. Ensure the account is operational.
// 3. Ensure the withdrawal currency matches the account currency.
// 4. Create the Financial Account Withdrawal entity.
// 5. Create the Financial Account Withdrawal aggregate.
// 6. Record the withdrawal-requested event.
// 7. Persist the aggregate.
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
// No FinancialDisbursementDestinationRepository is required here.
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
// Those responsibilities belong to their respective aggregates,
// application workflows, and integration boundaries.
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
// Application Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS } from '../financial-account-withdrawal.tokens';

import { FINANCIAL_ACCOUNT_TOKENS } from '../financial-account.tokens';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { RequestFinancialAccountWithdrawalCommand } from '../commands/request-financial-account-withdrawal.command';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import { FinancialAccountWithdrawalAggregate } from '../../domain/aggregates/financial-account-withdrawal.aggregate';

import { FinancialAccountWithdrawalEntity } from '../../domain/entities/financial-account-withdrawal.entity';

// -----------------------------------------------------------------------------
// Repositories
// -----------------------------------------------------------------------------

import type { FinancialAccountWithdrawalRepository } from '../../domain/repositories/financial-account-withdrawal.repository';

import type { FinancialAccountRepository } from '../../domain/repositories/financial-account.repository';

// -----------------------------------------------------------------------------
// Exceptions
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
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: RequestFinancialAccountWithdrawalCommand,
  ): Promise<FinancialAccountWithdrawalAggregate> {
    // -------------------------------------------------------------------------
    // Resolve Financial Account
    // -------------------------------------------------------------------------

    const account = await this.accountRepository.findByPublicId(
      command.accountId,
    );

    if (account === null) {
      throw new FinancialAccountNotFoundException(command.accountId.value);
    }

    // -------------------------------------------------------------------------
    // Validate Account
    // -------------------------------------------------------------------------
    //
    // A withdrawal request may only originate from an operational account.
    //
    // The Financial Account aggregate owns the definition of an operational
    // account.
    // -------------------------------------------------------------------------

    account.ensureOperational();

    // -------------------------------------------------------------------------
    // Validate Currency
    // -------------------------------------------------------------------------
    //
    // The withdrawal amount must use the same currency as the source account.
    //
    // The account aggregate owns this currency invariant.
    // -------------------------------------------------------------------------

    account.ensureCurrency(command.amount.currency);

    // -------------------------------------------------------------------------
    // Create Withdrawal Entity
    // -------------------------------------------------------------------------
    //
    // The command already contains the selected destination snapshot.
    //
    // No FinancialDisbursementDestination aggregate is resolved here.
    //
    // Current entity factory signature:
    //
    // create(
    //   accountId,
    //   accountPublicId,
    //   amount,
    //   destination,
    //   referenceType,
    //   referencePublicId,
    //   requestedAt,
    // )
    //
    // Therefore the optional business-reference values are passed before the
    // optional request timestamp.
    // -------------------------------------------------------------------------

    const withdrawalEntity = FinancialAccountWithdrawalEntity.create(
      account.id,
      account.publicId,
      command.amount,
      command.destination,
      command.referenceType,
      command.referencePublicId,
    );

    // -------------------------------------------------------------------------
    // Create Withdrawal Aggregate
    // -------------------------------------------------------------------------
    //
    // The aggregate becomes responsible for the withdrawal's domain behavior
    // and lifecycle.
    // -------------------------------------------------------------------------

    const aggregate =
      FinancialAccountWithdrawalAggregate.create(withdrawalEntity);

    // -------------------------------------------------------------------------
    // Record Requested Event
    // -------------------------------------------------------------------------
    //
    // The aggregate records the domain event.
    //
    // The handler supplies application-level correlation and causation
    // metadata.
    // -------------------------------------------------------------------------

    aggregate.recordRequested(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------
    //
    // Persisting a withdrawal does not mutate the Financial Account balance.
    //
    // Funds reservation/debit and transaction creation belong to the
    // appropriate financial workflow.
    // -------------------------------------------------------------------------

    await this.withdrawalRepository.save(aggregate);

    // -------------------------------------------------------------------------
    // Return
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RequestFinancialAccountWithdrawalHandler;
