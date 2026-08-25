// -----------------------------------------------------------------------------
// Financial Settlement — Get Items Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler responsible for retrieving the Settlement Items
// owned by a Financial Settlement aggregate.
//
// Aggregate:
//
// FinancialSettlementAggregate
// └── FinancialSettlementEntity
//     └── FinancialSettlementItemEntity[]
//         └── FinancialSettlementAllocationEntity[]
//
// Settlement Items are aggregate-owned entities.
//
// They are therefore obtained from the owning FinancialSettlementAggregate
// after the aggregate has been rehydrated by the repository.
//
// The handler does NOT expose a Settlement Item repository because Settlement
// Items are not aggregate roots.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// 1. Load the Financial Settlement aggregate.
// 2. Ensure the aggregate exists.
// 3. Return its Settlement Items.
//
// The handler does NOT:
//
// - modify the Financial Settlement;
// - modify Settlement Items;
// - allocate Settlement Items;
// - settle Settlement Items;
// - complete settlements;
// - fail settlements;
// - cancel settlements;
// - create domain events;
// - modify Financial Account balances;
// - create Financial Transactions;
// - execute disbursements;
// - perform accounting.
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

import type { GetFinancialSettlementItemsQuery } from '../queries/get-financial-settlement-items.query';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { FinancialSettlementItemEntity } from '../../domain/entities/financial-settlement-item.entity';

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
 * Handles retrieval of Settlement Items belonging to a Financial Settlement.
 *
 * Settlement Items remain aggregate-owned entities and are returned directly
 * from the owning Financial Settlement aggregate.
 */
@Injectable()
export class GetFinancialSettlementItemsHandler implements QueryHandler<
  GetFinancialSettlementItemsQuery,
  readonly FinancialSettlementItemEntity[]
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
    query: GetFinancialSettlementItemsQuery,
  ): Promise<readonly FinancialSettlementItemEntity[]> {
    // -------------------------------------------------------------------------
    // 1. Load owning Financial Settlement aggregate
    // -------------------------------------------------------------------------
    //
    // The repository must rehydrate the complete aggregate graph.
    //
    // Settlement Items remain owned by:
    //
    // FinancialSettlementAggregate
    // └── FinancialSettlementEntity
    //     └── FinancialSettlementItemEntity[]
    //
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
    // 3. Return aggregate-owned Settlement Items
    // -------------------------------------------------------------------------
    //
    // The aggregate exposes its items through a readonly collection.
    //
    // No mutation occurs during this query.
    // -------------------------------------------------------------------------

    return aggregate.items;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialSettlementItemsHandler;
