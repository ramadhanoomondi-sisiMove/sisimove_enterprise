// -----------------------------------------------------------------------------
// Accounting — Get Accounting Journals By Source Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving Accounting Journal aggregates
// associated with a posting source.
//
// Query:
//
// - GetAccountingJournalsBySourceQuery
//
// Repository:
//
// - AccountingJournalRepository.findByPostingSource()
//
// Posting source:
//
// - sourceType;
// - sourcePublicId.
//
// Responsibilities:
//
// - query journals by posting source type;
// - query journals by posting source public identity;
// - return the matching Accounting Journal aggregates.
//
// This handler does NOT:
//
// - modify aggregates;
// - persist anything;
// - access Prisma directly;
// - perform authorization;
// - publish domain events;
// - calculate accounting balances;
// - post or reverse journals;
// - interpret the business meaning of the source;
// - load the source aggregate.
//
// The posting source remains an opaque cross-domain reference.
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

import type GetAccountingJournalsBySourceQuery from '../queries/get-accounting-journals-by-source.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { AccountingJournalAggregate } from '../../domain/aggregates/accounting-journal.aggregate';

import type { AccountingJournalRepository } from '../../domain/repositories/accounting-journal.repository';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetAccountingJournalsBySourceHandler implements QueryHandler<
  GetAccountingJournalsBySourceQuery,
  AccountingJournalAggregate[]
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
   * Retrieves Accounting Journal aggregates associated with a posting source.
   */
  public async execute(
    query: GetAccountingJournalsBySourceQuery,
  ): Promise<AccountingJournalAggregate[]> {
    return this.accountingJournalRepository.findByPostingSource(
      query.sourceType,
      query.sourcePublicId,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAccountingJournalsBySourceHandler;
