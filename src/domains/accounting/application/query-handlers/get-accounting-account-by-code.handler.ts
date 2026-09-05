// -----------------------------------------------------------------------------
// Accounting — Get Accounting Account By Code Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving one Accounting Account aggregate
// by its accounting code.
//
// Query:
// - GetAccountingAccountByCodeQuery
//
// Repository:
// - AccountingAccountRepository.findByCode()
//
// Responsibilities:
//
// - load the Accounting Account aggregate by account code;
// - fail when the requested account does not exist;
// - return the aggregate to the application/query boundary.
//
// This handler does NOT:
//
// - modify the aggregate;
// - persist anything;
// - access Prisma directly;
// - perform authorization;
// - publish domain events;
// - calculate balances;
// - create journal entries;
// - post journals.
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

import type GetAccountingAccountByCodeQuery from '../queries/get-accounting-account-by-code.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { AccountingAccountAggregate } from '../../domain/aggregates/accounting-account.aggregate';

import type { AccountingAccountRepository } from '../../domain/repositories/accounting-account.repository';

import { AccountingException } from '../../domain/exceptions/accounting.exception';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetAccountingAccountByCodeHandler implements QueryHandler<
  GetAccountingAccountByCodeQuery,
  AccountingAccountAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(ACCOUNTING_TOKENS.REPOSITORIES.ACCOUNTING_ACCOUNT)
    private readonly accountingAccountRepository: AccountingAccountRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Retrieves an Accounting Account aggregate by account code.
   */
  public async execute(
    query: GetAccountingAccountByCodeQuery,
  ): Promise<AccountingAccountAggregate> {
    const aggregate = await this.accountingAccountRepository.findByCode(
      query.code,
    );

    if (aggregate === null) {
      throw new AccountingException('Accounting account does not exist.');
    }

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAccountingAccountByCodeHandler;
