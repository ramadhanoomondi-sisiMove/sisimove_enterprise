// -----------------------------------------------------------------------------
// Financial Transaction — Get Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler responsible for retrieving an existing Financial
// Transaction aggregate.
//
// Aggregate:
//
// FinancialTransactionAggregate
// ├── FinancialTransactionEntity
// └── FinancialTransactionEntryEntity[]
//
// FinancialTransactionEntryEntity is aggregate-owned and is therefore
// rehydrated as part of the FinancialTransactionAggregate.
//
// Responsibilities:
//
// 1. Load the Financial Transaction aggregate.
// 2. Ensure the aggregate exists.
// 3. Return the complete Financial Transaction aggregate.
//
// The handler does NOT:
//
// - load transaction entries as independent aggregates;
// - modify the Financial Transaction aggregate;
// - modify transaction entries;
// - perform lifecycle transitions;
// - complete transactions;
// - fail transactions;
// - cancel transactions;
// - reverse transactions;
// - create domain events;
// - manage Financial Account balances;
// - manage payments;
// - manage settlements;
// - manage withdrawals;
// - manage disbursements;
// - perform accounting.
//
// Query behavior belongs to the application layer.
// Aggregate rehydration belongs to the repository.
// Aggregate invariants remain inside FinancialTransactionAggregate.
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

import type { GetFinancialTransactionQuery } from '../queries/get-financial-transaction.query';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { FinancialTransactionAggregate } from '../../domain/aggregates/financial-transaction.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { FinancialTransactionRepository } from '../../domain/repositories/financial-transaction.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieval of a Financial Transaction aggregate by public identity.
 *
 * The complete aggregate is rehydrated:
 *
 * FinancialTransactionAggregate
 * ├── FinancialTransactionEntity
 * └── FinancialTransactionEntryEntity[]
 *
 * Transaction entries remain aggregate-owned entities and are therefore
 * returned as part of the FinancialTransactionAggregate.
 */
@Injectable()
export class GetFinancialTransactionHandler implements QueryHandler<
  GetFinancialTransactionQuery,
  FinancialTransactionAggregate
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

  public async execute(
    query: GetFinancialTransactionQuery,
  ): Promise<FinancialTransactionAggregate> {
    // -------------------------------------------------------------------------
    // 1. Load Financial Transaction aggregate
    // -------------------------------------------------------------------------
    //
    // The repository rehydrates the complete aggregate:
    //
    // FinancialTransactionAggregate
    // ├── FinancialTransactionEntity
    // └── FinancialTransactionEntryEntity[]
    //
    // Entries remain aggregate-owned entities.
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      query.transactionPublicId,
    );

    // -------------------------------------------------------------------------
    // 2. Ensure aggregate exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new FinancialNotFoundException(
        `Financial transaction '${query.transactionPublicId.value}' was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Return aggregate
    // -------------------------------------------------------------------------
    //
    // This is a read-only application operation.
    //
    // No lifecycle transition, balance mutation, or domain event occurs.
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialTransactionHandler;
