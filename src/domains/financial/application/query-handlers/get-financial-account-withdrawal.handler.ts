// -----------------------------------------------------------------------------
// Financial Account Withdrawal — Get Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler responsible for retrieving an existing Financial
// Account Withdrawal aggregate by its public identifier.
//
// Aggregate:
//
// FinancialAccountWithdrawalAggregate
// └── FinancialAccountWithdrawalEntity
//
// Responsibilities:
//
// 1. Load the Financial Account Withdrawal aggregate.
// 2. Ensure the aggregate exists.
// 3. Return the aggregate.
//
// The handler does NOT:
//
// - modify the withdrawal;
// - transition withdrawal lifecycle state;
// - create domain events;
// - execute a withdrawal;
// - move money;
// - modify Financial Account balances;
// - create Financial Transactions;
// - create or execute Financial Disbursements;
// - communicate with external providers;
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

import type { GetFinancialAccountWithdrawalQuery } from '../queries/get-financial-account-withdrawal.query';

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

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieval of a Financial Account Withdrawal aggregate by its
 * public identifier.
 *
 * The repository rehydrates the complete aggregate:
 *
 * FinancialAccountWithdrawalAggregate
 * └── FinancialAccountWithdrawalEntity
 *
 * No domain mutation or event creation occurs during this query.
 */
@Injectable()
export class GetFinancialAccountWithdrawalHandler implements QueryHandler<
  GetFinancialAccountWithdrawalQuery,
  FinancialAccountWithdrawalAggregate
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
    query: GetFinancialAccountWithdrawalQuery,
  ): Promise<FinancialAccountWithdrawalAggregate> {
    // -------------------------------------------------------------------------
    // 1. Load aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      query.withdrawalPublicId,
    );

    // -------------------------------------------------------------------------
    // 2. Ensure aggregate exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new FinancialAccountWithdrawalNotFoundException(
        query.withdrawalPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Return aggregate
    // -------------------------------------------------------------------------
    //
    // Withdrawal state is available through the aggregate:
    //
    // aggregate.publicId
    // aggregate.accountPublicId
    // aggregate.amount
    // aggregate.currency
    // aggregate.destinationPublicId
    // aggregate.disbursementPublicId
    // aggregate.status
    // aggregate.requestedAt
    // aggregate.completedAt
    // aggregate.failedAt
    // aggregate.cancelledAt
    //
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialAccountWithdrawalHandler;
