// -----------------------------------------------------------------------------
// Accounting — Get Accounting Journals Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving Accounting Journal aggregates.
//
// Query:
//
// - GetAccountingJournalsQuery
//
// Supported filters:
//
// - status;
// - currency;
// - period public identifier.
//
// Repository capabilities:
//
// - findByStatus();
// - findByCurrency();
// - findByPeriodPublicId();
// - findAllOrderedByCreatedAt().
//
// When multiple filters are supplied, the handler uses one repository filter
// as the primary filter and applies the remaining filters in memory.
//
// This keeps the repository contract focused and avoids introducing combined
// persistence-specific query methods for application-level filtering.
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
// - validate Accounting Account or Accounting Period aggregates.
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

import type GetAccountingJournalsQuery from '../queries/get-accounting-journals.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { AccountingJournalAggregate } from '../../domain/aggregates/accounting-journal.aggregate';

import type { AccountingJournalRepository } from '../../domain/repositories/accounting-journal.repository';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetAccountingJournalsHandler implements QueryHandler<
  GetAccountingJournalsQuery,
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
   * Retrieves Accounting Journal aggregates using the supplied filters.
   *
   * When multiple filters are supplied, the repository performs the primary
   * filtering and the remaining filters are applied against aggregate state.
   */
  public async execute(
    query: GetAccountingJournalsQuery,
  ): Promise<AccountingJournalAggregate[]> {
    // -------------------------------------------------------------------------
    // No filters
    // -------------------------------------------------------------------------

    if (
      query.status === undefined &&
      query.currency === undefined &&
      query.periodPublicId === undefined
    ) {
      return this.accountingJournalRepository.findAllOrderedByCreatedAt();
    }

    // -------------------------------------------------------------------------
    // Status only
    // -------------------------------------------------------------------------

    if (
      query.status !== undefined &&
      query.currency === undefined &&
      query.periodPublicId === undefined
    ) {
      return this.accountingJournalRepository.findByStatus(query.status);
    }

    // -------------------------------------------------------------------------
    // Currency only
    // -------------------------------------------------------------------------

    if (
      query.status === undefined &&
      query.currency !== undefined &&
      query.periodPublicId === undefined
    ) {
      return this.accountingJournalRepository.findByCurrency(query.currency);
    }

    // -------------------------------------------------------------------------
    // Period only
    // -------------------------------------------------------------------------

    if (
      query.status === undefined &&
      query.currency === undefined &&
      query.periodPublicId !== undefined
    ) {
      return this.accountingJournalRepository.findByPeriodPublicId(
        query.periodPublicId,
      );
    }

    // -------------------------------------------------------------------------
    // Multiple filters
    // -------------------------------------------------------------------------
    //
    // Select one repository filter as the primary query and apply the
    // remaining filters against the returned aggregate collection.
    //
    // Status is used first when available because it is a direct aggregate
    // state filter and keeps the subsequent in-memory filtering simple.
    // -------------------------------------------------------------------------

    let aggregates: AccountingJournalAggregate[];

    if (query.status !== undefined) {
      aggregates = await this.accountingJournalRepository.findByStatus(
        query.status,
      );
    } else if (query.currency !== undefined) {
      aggregates = await this.accountingJournalRepository.findByCurrency(
        query.currency,
      );
    } else {
      aggregates = await this.accountingJournalRepository.findByPeriodPublicId(
        query.periodPublicId!,
      );
    }

    // -------------------------------------------------------------------------
    // Currency filter
    // -------------------------------------------------------------------------

    if (query.currency !== undefined) {
      aggregates = aggregates.filter((aggregate) =>
        aggregate.currency.equals(query.currency),
      );
    }

    // -------------------------------------------------------------------------
    // Period filter
    // -------------------------------------------------------------------------

    if (query.periodPublicId !== undefined) {
      aggregates = aggregates.filter(
        (aggregate) =>
          aggregate.periodPublicId?.equals(query.periodPublicId) === true,
      );
    }

    return aggregates;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAccountingJournalsHandler;
