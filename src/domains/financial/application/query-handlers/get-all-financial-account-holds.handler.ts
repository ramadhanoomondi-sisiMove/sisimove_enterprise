// -----------------------------------------------------------------------------
// Financial Account Holds — Get All Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler responsible for retrieving all Financial Account
// Holds across all Financial Accounts, regardless of lifecycle status.
//
// Responsibilities:
//
// 1. Load all Financial Account Hold aggregates.
// 2. Return the aggregates.
//
// The handler does NOT modify holds, perform lifecycle transitions, execute
// financial transactions, or modify account balances.
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

import { FINANCIAL_ACCOUNT_HOLD_TOKENS } from '../financial-account-hold.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetAllFinancialAccountHoldsQuery } from '../queries/get-all-financial-account-holds.query';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { FinancialAccountHoldAggregate } from '../../domain/aggregates/financial-account-hold.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { FinancialAccountHoldRepository } from '../../domain/repositories/financial-account-hold.repository';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class GetAllFinancialAccountHoldsHandler implements QueryHandler<
  GetAllFinancialAccountHoldsQuery,
  FinancialAccountHoldAggregate[]
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(FINANCIAL_ACCOUNT_HOLD_TOKENS.REPOSITORY)
    private readonly repository: FinancialAccountHoldRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(): Promise<FinancialAccountHoldAggregate[]> {
    return this.repository.findAll();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAllFinancialAccountHoldsHandler;
