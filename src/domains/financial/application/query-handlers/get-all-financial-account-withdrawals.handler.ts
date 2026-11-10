// -----------------------------------------------------------------------------
// Financial Account Withdrawal — Get All Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler responsible for retrieving all Financial Account
// Withdrawal aggregates across the platform.
//
// Aggregate:
//
// FinancialAccountWithdrawalAggregate
// └── FinancialAccountWithdrawalEntity
//
// Responsibilities:
//
// 1. Retrieve all Financial Account Withdrawal aggregates.
// 2. Return complete aggregates, newest first as ordered by the repository.
// 3. Preserve aggregate ownership and Financial Account association.
//
// The handler does NOT:
//
// - retrieve withdrawals for only one Financial Account;
// - modify Financial Account Withdrawal aggregates;
// - perform withdrawal lifecycle transitions;
// - process or execute financial disbursements;
// - create Financial Transactions;
// - manage Financial Account balances;
// - call external payment providers;
// - perform settlement or accounting.
//
// Query behavior belongs to the application layer.
// Aggregate rehydration and ordering belong to the repository.
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

import type { GetAllFinancialAccountWithdrawalsQuery } from '../queries/get-all-financial-account-withdrawals.query';

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
 * Handles retrieval of all Financial Account Withdrawal aggregates
 * across the platform.
 *
 * Each result represents a complete Financial Account Withdrawal aggregate.
 * The repository is responsible for rehydration and result ordering.
 */
@Injectable()
export class GetAllFinancialAccountWithdrawalsHandler implements QueryHandler<
  GetAllFinancialAccountWithdrawalsQuery,
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

  public async execute(): Promise<FinancialAccountWithdrawalAggregate[]> {
    return this.repository.findAll();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAllFinancialAccountWithdrawalsHandler;
