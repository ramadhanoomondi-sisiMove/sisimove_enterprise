// -----------------------------------------------------------------------------
// Financial Transaction — Get All Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler responsible for retrieving all Financial
// Transaction aggregates.
//
// Aggregate:
//
// FinancialTransactionAggregate
// ├── FinancialTransactionEntity
// └── FinancialTransactionEntryEntity[]
//
// Responsibilities:
//
// 1. Retrieve all Financial Transaction aggregates.
// 2. Return the complete aggregates, newest first as ordered by the repository.
// 3. Preserve aggregate ownership of transaction entries.
//
// The handler does NOT:
//
// - load transaction entries as independent aggregates;
// - modify Financial Transaction aggregates;
// - perform lifecycle transitions;
// - complete, fail, cancel, or reverse transactions;
// - create domain events;
// - manage Financial Account balances;
// - manage payments or settlements;
// - perform accounting.
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

import { FINANCIAL_TRANSACTION_TOKENS } from '../financial-transaction.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetAllFinancialTransactionsQuery } from '../queries/get-all-financial-transactions.query';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { FinancialTransactionAggregate } from '../../domain/aggregates/financial-transaction.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { FinancialTransactionRepository } from '../../domain/repositories/financial-transaction.repository';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieval of all Financial Transaction aggregates.
 *
 * Each aggregate includes its aggregate-owned transaction entries.
 * The repository is responsible for rehydration and result ordering.
 */
@Injectable()
export class GetAllFinancialTransactionsHandler implements QueryHandler<
  GetAllFinancialTransactionsQuery,
  FinancialTransactionAggregate[]
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(FINANCIAL_TRANSACTION_TOKENS.REPOSITORY)
    private readonly repository: FinancialTransactionRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(): Promise<FinancialTransactionAggregate[]> {
    return this.repository.findAll();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAllFinancialTransactionsHandler;
