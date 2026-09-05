// -----------------------------------------------------------------------------
// Accounting — Get Accounting Account Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving one Accounting Account aggregate
// by its public identifier.
//
// Query:
// - GetAccountingAccountQuery
//
// Repository:
// - AccountingAccountRepository
//
// Responsibilities:
//
// - load the Accounting Account aggregate by public identity;
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
// - calculate balances;
// - perform accounting operations.
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

import type GetAccountingAccountQuery from '../queries/get-accounting-account.query';

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
export class GetAccountingAccountHandler implements QueryHandler<
  GetAccountingAccountQuery,
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
   * Retrieves an Accounting Account aggregate by public identifier.
   */
  public async execute(
    query: GetAccountingAccountQuery,
  ): Promise<AccountingAccountAggregate> {
    const aggregate = await this.accountingAccountRepository.findByPublicId(
      query.publicId,
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

export default GetAccountingAccountHandler;
