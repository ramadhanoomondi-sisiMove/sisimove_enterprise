// -----------------------------------------------------------------------------
// Financial Account — Get Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler responsible for retrieving an existing
// Financial Account aggregate.
//
// Aggregate:
//
// FinancialAccountAggregate
// ├── FinancialAccountEntity
// └── FinancialAccountBalanceEntity
//
// Responsibilities:
//
// 1. Load the complete Financial Account aggregate.
// 2. Return the aggregate.
//
// The handler does NOT:
//
// - modify the aggregate;
// - modify FinancialAccountEntity;
// - modify FinancialAccountBalanceEntity;
// - create domain events;
// - perform lifecycle transitions;
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
// Domain behavior remains inside FinancialAccountAggregate.
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

import type { GetFinancialAccountQuery } from '../queries/get-financial-account.query';

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
 * Handles retrieval of a Financial Account aggregate.
 *
 * The repository rehydrates the complete aggregate:
 *
 * FinancialAccountAggregate
 * ├── FinancialAccountEntity
 * └── FinancialAccountBalanceEntity
 *
 * The handler performs no domain mutation.
 */
@Injectable()
export class GetFinancialAccountHandler implements QueryHandler<
  GetFinancialAccountQuery,
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
    query: GetFinancialAccountQuery,
  ): Promise<FinancialAccountAggregate> {
    // -------------------------------------------------------------------------
    // 1. Load complete aggregate
    // -------------------------------------------------------------------------
    //
    // The repository is responsible for rehydrating both:
    //
    // - FinancialAccountEntity;
    // - FinancialAccountBalanceEntity.
    //
    // The handler intentionally works with the aggregate root.
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

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialAccountHandler;
