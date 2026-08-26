// -----------------------------------------------------------------------------
// Financial Account Withdrawals — Get Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler responsible for retrieving all Financial Account
// Withdrawal aggregates belonging to a Financial Account.
//
// Aggregate:
//
// FinancialAccountWithdrawalAggregate
// └── FinancialAccountWithdrawalEntity
//
// Responsibilities:
//
// 1. Load all withdrawal aggregates belonging to the supplied Financial
//    Account.
// 2. Return the matching withdrawal aggregates.
//
// The handler does NOT:
//
// - modify withdrawals;
// - transition withdrawal lifecycle state;
// - create domain events;
// - execute withdrawals;
// - move money;
// - modify Financial Account balances;
// - create Financial Transactions;
// - create or execute Financial Disbursements;
// - communicate with external providers;
// - perform accounting.
//
// Query behavior belongs to the application layer.
// Repository access belongs to the query handler.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS } from '../financial-account-withdrawal.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetFinancialAccountWithdrawalsQuery } from '../queries/get-financial-account-withdrawals.query';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { FinancialAccountWithdrawalAggregate } from '../../domain/aggregates/financial-account-withdrawal.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { FinancialAccountWithdrawalRepository } from '../../domain/repositories/financial-account-withdrawal.repository';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieval of all Financial Account Withdrawals belonging to a
 * Financial Account.
 *
 * The repository returns fully rehydrated Financial Account Withdrawal
 * aggregates.
 *
 * An empty result is valid and does not represent an error.
 */
@Injectable()
export class GetFinancialAccountWithdrawalsHandler implements QueryHandler<
  GetFinancialAccountWithdrawalsQuery,
  FinancialAccountWithdrawalAggregate[]
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.REPOSITORY)
    private readonly repository: FinancialAccountWithdrawalRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetFinancialAccountWithdrawalsQuery,
  ): Promise<FinancialAccountWithdrawalAggregate[]> {
    // -------------------------------------------------------------------------
    // Load withdrawals belonging to the Financial Account
    // -------------------------------------------------------------------------
    //
    // The repository performs aggregate rehydration.
    //
    // No individual withdrawal is treated as an entity-only query here.
    // Each returned item remains a FinancialAccountWithdrawalAggregate.
    // -------------------------------------------------------------------------

    return this.repository.findByAccountPublicId(query.accountPublicId);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialAccountWithdrawalsHandler;
