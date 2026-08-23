// -----------------------------------------------------------------------------
// Financial Account Transactions — Get Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler responsible for retrieving Financial Transactions
// associated with an existing Financial Account.
//
// Aggregate boundaries:
//
// FinancialAccountAggregate
// ├── FinancialAccountEntity
// └── FinancialAccountBalanceEntity
//
// FinancialTransactionAggregate
// ├── FinancialTransactionEntity
// └── FinancialTransactionEntryEntity[]
//
// Financial Transactions are separate aggregate roots. They are therefore NOT
// loaded as children of FinancialAccountAggregate.
//
// The Financial Account is first verified through its repository. The account's
// opaque FinancialAccountReference is then used to query the Financial
// Transaction repository.
//
// Responsibilities:
//
// 1. Resolve the Financial Account.
// 2. Ensure the Financial Account exists.
// 3. Resolve its opaque FinancialAccountReference.
// 4. Retrieve Financial Transactions involving that account.
// 5. Return the matching Financial Transaction aggregates.
//
// The handler does NOT:
//
// - modify the Financial Account aggregate;
// - modify Financial Transaction aggregates;
// - create domain events;
// - manage account balances;
// - perform transaction lifecycle operations;
// - manage payments;
// - manage holds;
// - manage settlements;
// - manage withdrawals;
// - manage disbursements;
// - perform accounting.
//
// Query behavior belongs to the application layer.
// Repository access belongs to the query handler.
// Aggregate invariants remain inside their respective aggregates.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_ACCOUNT_TOKENS } from '../financial-account.tokens';

import { FINANCIAL_TRANSACTION_TOKENS } from '../financial-transaction.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetFinancialAccountTransactionsQuery } from '../queries/get-financial-account-transactions.query';

// -----------------------------------------------------------------------------
// Financial Account Domain
// -----------------------------------------------------------------------------

import type { FinancialAccountRepository } from '../../domain/repositories/financial-account.repository';

// -----------------------------------------------------------------------------
// Financial Transaction Domain
// -----------------------------------------------------------------------------

import type { FinancialTransactionAggregate } from '../../domain/aggregates/financial-transaction.aggregate';

import type { FinancialTransactionRepository } from '../../domain/repositories/financial-transaction.repository';

import { FinancialAccountReference } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialAccountNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieval of Financial Transactions associated with a Financial
 * Account.
 *
 * Financial Transactions remain independent aggregate roots.
 *
 * The Financial Account is used only to establish that the requested account
 * exists and to resolve the opaque FinancialAccountReference used by the
 * Financial Transaction repository.
 */
@Injectable()
export class GetFinancialAccountTransactionsHandler implements QueryHandler<
  GetFinancialAccountTransactionsQuery,
  FinancialTransactionAggregate[]
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(FINANCIAL_ACCOUNT_TOKENS.REPOSITORY)
    private readonly accountRepository: FinancialAccountRepository,

    @Inject(FINANCIAL_TRANSACTION_TOKENS.REPOSITORY)
    private readonly transactionRepository: FinancialTransactionRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetFinancialAccountTransactionsQuery,
  ): Promise<FinancialTransactionAggregate[]> {
    // -------------------------------------------------------------------------
    // 1. Load Financial Account aggregate
    // -------------------------------------------------------------------------

    const account = await this.accountRepository.findByPublicId(
      query.accountPublicId,
    );

    // -------------------------------------------------------------------------
    // 2. Ensure Financial Account exists
    // -------------------------------------------------------------------------

    if (account === null) {
      throw new FinancialAccountNotFoundException(query.accountPublicId.value);
    }

    // -------------------------------------------------------------------------
    // 3. Resolve opaque Financial Account reference
    // -------------------------------------------------------------------------
    //
    // Financial Transactions do not establish a persistence relation to the
    // Financial Account aggregate.
    //
    // The account is represented as an opaque cross-aggregate reference.
    //
    // The reference identifies the Financial Account itself:
    //
    // type    = FINANCIAL_ACCOUNT
    // publicId = FinancialAccount.publicId
    //
    // FinancialAccountReference has a private constructor, therefore its
    // factory must be used.
    // -------------------------------------------------------------------------

    const accountReference = FinancialAccountReference.create(
      'FINANCIAL_ACCOUNT',
      account.publicId.value,
    );

    // -------------------------------------------------------------------------
    // 4. Retrieve Financial Transactions
    // -------------------------------------------------------------------------
    //
    // findByAccount() returns Financial Transaction aggregates whose source
    // account or destination account matches the supplied opaque reference.
    //
    // Financial Transactions remain independent aggregate roots.
    // -------------------------------------------------------------------------

    return this.transactionRepository.findByAccount(accountReference);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialAccountTransactionsHandler;
