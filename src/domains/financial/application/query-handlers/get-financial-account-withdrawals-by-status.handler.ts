// -----------------------------------------------------------------------------
// Financial Account Withdrawals — Get By Status Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler responsible for retrieving all Financial Account
// Withdrawal aggregates belonging to a Financial Account and matching the
// supplied lifecycle status.
//
// Responsibilities:
//
// 1. Load all withdrawals belonging to the supplied Financial Account.
// 2. Restrict results to the requested lifecycle status.
// 3. Return the matching Financial Account Withdrawal aggregates.
//
// The handler does NOT:
//
// - mutate withdrawals;
// - modify Financial Account balances;
// - create Financial Transactions;
// - create or execute Financial Disbursements;
// - communicate with external providers;
// - create domain events;
// - perform withdrawal lifecycle transitions;
// - perform accounting.
//
// Query behavior belongs to the application layer.
// Aggregate rehydration belongs to the repository.
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

import type { GetFinancialAccountWithdrawalsByStatusQuery } from '../queries/get-financial-account-withdrawals-by-status.query';

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
 * Handles retrieval of Financial Account Withdrawals belonging to a Financial
 * Account and matching a supplied lifecycle status.
 *
 * The repository rehydrates complete Financial Account Withdrawal aggregates.
 */
@Injectable()
export class GetFinancialAccountWithdrawalsByStatusHandler implements QueryHandler<
  GetFinancialAccountWithdrawalsByStatusQuery,
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
    query: GetFinancialAccountWithdrawalsByStatusQuery,
  ): Promise<FinancialAccountWithdrawalAggregate[]> {
    // -------------------------------------------------------------------------
    // Load withdrawals by account and lifecycle status
    // -------------------------------------------------------------------------
    //
    // The repository performs the persistence-level filtering and rehydrates
    // each matching withdrawal as a complete aggregate.
    // -------------------------------------------------------------------------

    return this.repository.findByAccountPublicIdAndStatus(
      query.accountPublicId,
      query.status,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialAccountWithdrawalsByStatusHandler;
