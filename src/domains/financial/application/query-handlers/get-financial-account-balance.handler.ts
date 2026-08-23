// -----------------------------------------------------------------------------
// Financial Account Balance — Get Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler responsible for retrieving the balance state of
// an existing Financial Account aggregate.
//
// Aggregate:
//
// FinancialAccountAggregate
// ├── FinancialAccountEntity
// └── FinancialAccountBalanceEntity
//
// The balance is aggregate-owned and is therefore retrieved through the
// FinancialAccountAggregate rather than treated as an independent aggregate.
//
// Responsibilities:
//
// 1. Load the complete Financial Account aggregate.
// 2. Ensure the aggregate exists.
// 3. Return the aggregate containing its current balance state.
//
// The handler does NOT:
//
// - load the balance as an independent aggregate;
// - modify FinancialAccountEntity;
// - modify FinancialAccountBalanceEntity;
// - create domain events;
// - perform balance operations;
// - manage transactions;
// - manage payments;
// - manage holds;
// - manage settlements;
// - manage withdrawals;
// - manage disbursements;
// - perform accounting.
//
// Query behavior belongs to the application layer.
// Aggregate rehydration belongs to the repository.
// Aggregate-owned balance state remains inside FinancialAccountAggregate.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_ACCOUNT_TOKENS } from '../financial-account.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetFinancialAccountBalanceQuery } from '../queries/get-financial-account-balance.query';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { FinancialAccountAggregate } from '../../domain/aggregates/financial-account.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { FinancialAccountRepository } from '../../domain/repositories/financial-account.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialAccountNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieval of the balance state belonging to a Financial Account.
 *
 * The complete Financial Account aggregate is rehydrated:
 *
 * FinancialAccountAggregate
 * ├── FinancialAccountEntity
 * └── FinancialAccountBalanceEntity
 *
 * The handler returns the aggregate so that the aggregate remains the
 * authoritative boundary for the account and its balance.
 */
@Injectable()
export class GetFinancialAccountBalanceHandler implements QueryHandler<
  GetFinancialAccountBalanceQuery,
  FinancialAccountAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(FINANCIAL_ACCOUNT_TOKENS.REPOSITORY)
    private readonly repository: FinancialAccountRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetFinancialAccountBalanceQuery,
  ): Promise<FinancialAccountAggregate> {
    // -------------------------------------------------------------------------
    // 1. Load complete aggregate
    // -------------------------------------------------------------------------
    //
    // The repository rehydrates:
    //
    // FinancialAccountAggregate
    // ├── FinancialAccountEntity
    // └── FinancialAccountBalanceEntity
    //
    // The balance is intentionally not retrieved as an independent aggregate.
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      query.accountPublicId,
    );

    // -------------------------------------------------------------------------
    // 2. Ensure aggregate exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new FinancialAccountNotFoundException(query.accountPublicId.value);
    }

    // -------------------------------------------------------------------------
    // 3. Return aggregate
    // -------------------------------------------------------------------------
    //
    // Balance state is available through:
    //
    // aggregate.balance
    // aggregate.availableAmount
    // aggregate.pendingAmount
    // aggregate.heldAmount
    // aggregate.totalAmount
    //
    // No domain mutation or event creation occurs during this query.
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialAccountBalanceHandler;
