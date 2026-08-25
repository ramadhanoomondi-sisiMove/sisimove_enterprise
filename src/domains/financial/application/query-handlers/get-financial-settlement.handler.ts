// -----------------------------------------------------------------------------
// Financial Settlement — Get Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler responsible for retrieving an existing
// Financial Settlement aggregate.
//
// Aggregate:
//
// FinancialSettlementAggregate
// └── FinancialSettlementEntity
//     └── FinancialSettlementItemEntity[]
//         └── FinancialSettlementAllocationEntity[]
//
// Responsibilities:
//
// 1. Load the complete Financial Settlement aggregate.
// 2. Ensure the aggregate exists.
// 3. Return the aggregate.
//
// The handler does NOT:
//
// - modify the Financial Settlement;
// - modify Settlement Items;
// - perform lifecycle transitions;
// - allocate Settlement Items;
// - complete settlements;
// - fail settlements;
// - cancel settlements;
// - create domain events;
// - modify Financial Account balances;
// - create Financial Transactions;
// - execute disbursements;
// - perform accounting.
//
// Query behavior belongs to the application layer.
// Aggregate rehydration belongs to the repository.
// Domain behavior remains inside FinancialSettlementAggregate.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_SETTLEMENT_TOKENS } from '../financial-settlement.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetFinancialSettlementQuery } from '../queries/get-financial-settlement.query';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { FinancialSettlementAggregate } from '../../domain/aggregates/financial-settlement.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { FinancialSettlementRepository } from '../../domain/repositories/financial-settlement.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieval of a Financial Settlement aggregate by public identity.
 *
 * The repository rehydrates the complete aggregate:
 *
 * FinancialSettlementAggregate
 * └── FinancialSettlementEntity
 *     └── FinancialSettlementItemEntity[]
 *         └── FinancialSettlementAllocationEntity[]
 */
@Injectable()
export class GetFinancialSettlementHandler implements QueryHandler<
  GetFinancialSettlementQuery,
  FinancialSettlementAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(FINANCIAL_SETTLEMENT_TOKENS.REPOSITORY)
    private readonly repository: FinancialSettlementRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetFinancialSettlementQuery,
  ): Promise<FinancialSettlementAggregate> {
    // -------------------------------------------------------------------------
    // 1. Load complete Financial Settlement aggregate
    // -------------------------------------------------------------------------
    //
    // The repository is responsible for rehydrating:
    //
    // FinancialSettlementAggregate
    // └── FinancialSettlementEntity
    //     └── FinancialSettlementItemEntity[]
    //         └── FinancialSettlementAllocationEntity[]
    //
    // The handler intentionally works with the aggregate root.
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      query.settlementPublicId,
    );

    // -------------------------------------------------------------------------
    // 2. Ensure aggregate exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new FinancialNotFoundException(
        `Financial settlement '${query.settlementPublicId.value}' was not found.`,
      );
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

export default GetFinancialSettlementHandler;
