// -----------------------------------------------------------------------------
// Accounting — Get Accounting Journal Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving one Accounting Journal aggregate
// by its public identifier.
//
// Query:
// - GetAccountingJournalQuery
//
// Repository:
// - AccountingJournalRepository
//
// Responsibilities:
//
// - load the Accounting Journal aggregate by public identity;
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
// - post or reverse journals.
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

import type GetAccountingJournalQuery from '../queries/get-accounting-journal.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { AccountingJournalAggregate } from '../../domain/aggregates/accounting-journal.aggregate';

import type { AccountingJournalRepository } from '../../domain/repositories/accounting-journal.repository';

import { AccountingException } from '../../domain/exceptions/accounting.exception';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetAccountingJournalHandler implements QueryHandler<
  GetAccountingJournalQuery,
  AccountingJournalAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(ACCOUNTING_TOKENS.REPOSITORIES.ACCOUNTING_JOURNAL)
    private readonly accountingJournalRepository: AccountingJournalRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Retrieves an Accounting Journal aggregate by public identifier.
   */
  public async execute(
    query: GetAccountingJournalQuery,
  ): Promise<AccountingJournalAggregate> {
    const aggregate = await this.accountingJournalRepository.findByPublicId(
      query.publicId,
    );

    if (aggregate === null) {
      throw new AccountingException('Accounting journal does not exist.');
    }

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAccountingJournalHandler;
