// -----------------------------------------------------------------------------
// Financial Account Holds — Get Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler responsible for retrieving the ACTIVE
// Financial Account Holds belonging to a Financial Account.
//
// Aggregate:
//
// FinancialAccountHoldAggregate
// └── FinancialAccountHoldEntity
//
// Responsibilities:
//
// 1. Load all ACTIVE Financial Account Hold aggregates for the account.
// 2. Return the aggregates.
//
// The handler does NOT:
//
// - modify any hold;
// - perform hold lifecycle transitions;
// - create or execute Financial Transactions;
// - modify Financial Account balances;
// - create domain events;
// - manage payments;
// - manage withdrawals;
// - manage settlements;
// - manage disbursements;
// - perform accounting.
//
// Only ACTIVE holds are returned.
//
// RELEASED, CAPTURED and CANCELLED holds are terminal and are therefore
// excluded by the repository query.
//
// Query behavior belongs to the application layer.
// Aggregate rehydration belongs to the repository.
// Domain behavior remains inside FinancialAccountHoldAggregate.
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

import type { GetFinancialAccountHoldsQuery } from '../queries/get-financial-account-holds.query';

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

/**
 * Handles retrieval of the ACTIVE Financial Account Holds belonging to
 * a Financial Account.
 *
 * A Financial Account may have multiple ACTIVE holds simultaneously.
 */
@Injectable()
export class GetFinancialAccountHoldsHandler implements QueryHandler<
  GetFinancialAccountHoldsQuery,
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

  public async execute(
    query: GetFinancialAccountHoldsQuery,
  ): Promise<FinancialAccountHoldAggregate[]> {
    // -------------------------------------------------------------------------
    // 1. Load ACTIVE holds
    // -------------------------------------------------------------------------
    //
    // The repository is responsible for retrieving and rehydrating the
    // Financial Account Hold aggregates.
    //
    // Only ACTIVE holds are requested. Terminal holds:
    //
    // - RELEASED
    // - CAPTURED
    // - CANCELLED
    //
    // are excluded.
    // -------------------------------------------------------------------------

    const aggregates = await this.repository.findActiveByAccountPublicId(
      query.accountPublicId,
    );

    // -------------------------------------------------------------------------
    // 2. Return aggregates
    // -------------------------------------------------------------------------

    return aggregates;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialAccountHoldsHandler;
