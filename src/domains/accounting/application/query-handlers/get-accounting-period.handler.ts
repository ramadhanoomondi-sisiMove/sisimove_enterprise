// -----------------------------------------------------------------------------
// Accounting — Get Accounting Period Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving one Accounting Period aggregate
// by its public identifier.
//
// Query:
// - GetAccountingPeriodQuery
//
// Repository:
// - AccountingPeriodRepository
//
// Responsibilities:
//
// - load the Accounting Period aggregate by public identity;
// - fail when the requested aggregate does not exist;
// - return the aggregate to the application/query boundary.
//
// This handler does NOT:
//
// - modify the aggregate;
// - persist anything;
// - access Prisma directly;
// - perform authorization;
// - publish domain events;
// - orchestrate other aggregates;
// - calculate accounting balances;
// - create or post journals.
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

import type GetAccountingPeriodQuery from '../queries/get-accounting-period.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { AccountingPeriodAggregate } from '../../domain/aggregates/accounting-period.aggregate';

import type { AccountingPeriodRepository } from '../../domain/repositories/accounting-period.repository';

import { AccountingException } from '../../domain/exceptions/accounting.exception';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetAccountingPeriodHandler implements QueryHandler<
  GetAccountingPeriodQuery,
  AccountingPeriodAggregate
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
   * Retrieves an Accounting Period aggregate by public identifier.
   */
  public async execute(
    query: GetAccountingPeriodQuery,
  ): Promise<AccountingPeriodAggregate> {
    const aggregate = await this.accountingPeriodRepository.findByPublicId(
      query.publicId,
    );

    if (aggregate === null) {
      throw new AccountingException('Accounting period does not exist.');
    }

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAccountingPeriodHandler;
