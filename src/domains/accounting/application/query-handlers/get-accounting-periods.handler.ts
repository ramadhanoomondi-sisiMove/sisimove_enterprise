// -----------------------------------------------------------------------------
// Accounting — Get Accounting Periods Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving Accounting Period aggregates.
//
// Query:
// - GetAccountingPeriodsQuery
//
// Supported filter:
//
// - status
//
// Repository capabilities:
//
// - findByStatus();
// - findAllOrderedByCreatedAt();
//
// When no status is supplied, all Accounting Period aggregates are returned
// using the repository's defined creation-time ordering.
//
// This handler does NOT:
//
// - modify aggregates;
// - persist anything;
// - access Prisma directly;
// - perform authorization;
// - publish domain events;
// - calculate accounting balances;
// - create or post journals;
// - validate other aggregates.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Accounting
// -----------------------------------------------------------------------------

import { ACCOUNTING_TOKENS } from '../accounting.tokens';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type GetAccountingPeriodsQuery from '../queries/get-accounting-periods.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { AccountingPeriodAggregate } from '../../domain/aggregates/accounting-period.aggregate';

import type { AccountingPeriodRepository } from '../../domain/repositories/accounting-period.repository';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetAccountingPeriodsHandler implements QueryHandler<
  GetAccountingPeriodsQuery,
  AccountingPeriodAggregate[]
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(ACCOUNTING_TOKENS.REPOSITORIES.ACCOUNTING_PERIOD)
    private readonly accountingPeriodRepository: AccountingPeriodRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Retrieves Accounting Period aggregates using the optional status filter.
   *
   * When no status is supplied, all periods are returned in the repository's
   * creation-time ordering.
   */
  public async execute(
    query: GetAccountingPeriodsQuery,
  ): Promise<AccountingPeriodAggregate[]> {
    // -------------------------------------------------------------------------
    // Status filter
    // -------------------------------------------------------------------------

    if (query.status !== undefined) {
      return this.accountingPeriodRepository.findByStatus(query.status);
    }

    // -------------------------------------------------------------------------
    // No filter
    // -------------------------------------------------------------------------

    return this.accountingPeriodRepository.findAllOrderedByCreatedAt();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAccountingPeriodsHandler;
