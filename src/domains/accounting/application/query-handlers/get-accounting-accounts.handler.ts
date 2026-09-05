// -----------------------------------------------------------------------------
// Accounting — Get Accounting Accounts Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving Accounting Account aggregates.
//
// Query:
//
// - GetAccountingAccountsQuery
//
// Supported filters:
//
// - status;
// - type.
//
// Repository capabilities:
//
// - findByStatus();
// - findByType();
// - findAllOrderedByCode().
//
// When both status and type are supplied, the handler uses one repository
// filter and applies the remaining filter in memory. No additional combined
// repository contract is required.
//
// This handler does NOT:
//
// - modify aggregates;
// - persist anything;
// - access Prisma directly;
// - perform authorization;
// - publish domain events;
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

import type GetAccountingAccountsQuery from '../queries/get-accounting-accounts.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { AccountingAccountAggregate } from '../../domain/aggregates/accounting-account.aggregate';

import type { AccountingAccountRepository } from '../../domain/repositories/accounting-account.repository';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetAccountingAccountsHandler implements QueryHandler<
  GetAccountingAccountsQuery,
  AccountingAccountAggregate[]
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
   * Retrieves Accounting Account aggregates using the supplied filters.
   *
   * If both filters are supplied, the repository performs the primary
   * filtering and the remaining filter is applied to the returned aggregate
   * collection.
   */
  public async execute(
    query: GetAccountingAccountsQuery,
  ): Promise<AccountingAccountAggregate[]> {
    // -------------------------------------------------------------------------
    // No filters
    // -------------------------------------------------------------------------

    if (query.status === undefined && query.type === undefined) {
      return this.accountingAccountRepository.findAllOrderedByCode();
    }

    // -------------------------------------------------------------------------
    // Status only
    // -------------------------------------------------------------------------

    if (query.status !== undefined && query.type === undefined) {
      return this.accountingAccountRepository.findByStatus(query.status);
    }

    // -------------------------------------------------------------------------
    // Type only
    // -------------------------------------------------------------------------

    if (query.status === undefined && query.type !== undefined) {
      return this.accountingAccountRepository.findByType(query.type);
    }

    // -------------------------------------------------------------------------
    // Status + Type
    // -------------------------------------------------------------------------
    //
    // The repository does not expose a combined status/type method.
    //
    // Use status as the primary repository filter and apply type against the
    // returned aggregate state.
    // -------------------------------------------------------------------------

    const aggregates = await this.accountingAccountRepository.findByStatus(
      query.status!,
    );

    return aggregates.filter((aggregate) => aggregate.type.equals(query.type));
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAccountingAccountsHandler;
