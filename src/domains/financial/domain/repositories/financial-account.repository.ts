// -----------------------------------------------------------------------------
// Financial Account Repository
// -----------------------------------------------------------------------------
//
// Domain repository contract for the Financial Account aggregate.
//
// Responsibilities:
// - Financial Account aggregate persistence and rehydration
// - Aggregate identity lookup
// - Owner lookup
// - Account lifecycle queries
// - Account type and currency queries
// - Aggregate-owned balance lookup
// - Balance state queries
//
// Persistence concerns such as:
// - Prisma models
// - relations/includes
// - joins
// - database transactions
// - pagination
// - indexing
// - optimistic concurrency
// - query optimization
//
// belong to infrastructure.
//
// The following are separate aggregate roots and are intentionally NOT
// exposed through this repository:
//
// - FinancialTransactionAggregate
// - FinancialPaymentAggregate
// - FinancialAccountHoldAggregate
// - FinancialSettlementAggregate
// - FinancialAccountWithdrawalAggregate
// - FinancialDisbursementAggregate
//
// Cross-domain references such as ownerPublicId remain strongly typed
// identifiers and are not modeled as domain relations.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { FinancialAccountAggregate } from '../aggregates/financial-account.aggregate';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { FinancialAccountEntity } from '../entities/financial-account.entity';

import type { FinancialAccountBalanceEntity } from '../entities/financial-account-balance.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  FinancialAccountPublicId,
  FinancialAccountOwnerPublicId,
  FinancialAccountType,
  FinancialAccountStatus,
  FinancialAccountBalancePublicId,
  Currency,
} from '../value-objects';

// =============================================================================
// Financial Account Repository
// =============================================================================

/**
 * Domain repository contract for the Financial Account aggregate.
 *
 * Aggregate boundary:
 *
 * FinancialAccountAggregate
 * ├── FinancialAccountEntity
 * └── FinancialAccountBalanceEntity
 *
 * FinancialAccountBalanceEntity is an entity owned by the Financial Account
 * aggregate and is therefore never persisted as an independent aggregate.
 *
 * The repository exposes aggregate persistence and read capabilities only.
 *
 * The following remain separate aggregate roots:
 *
 * - FinancialTransactionAggregate
 * - FinancialPaymentAggregate
 * - FinancialAccountHoldAggregate
 * - FinancialSettlementAggregate
 * - FinancialAccountWithdrawalAggregate
 * - FinancialDisbursementAggregate
 */
export interface FinancialAccountRepository {
  // ===========================================================================
  // Aggregate Persistence
  // ===========================================================================

  /**
   * Persists the complete Financial Account aggregate.
   *
   * The Financial Account entity and its aggregate-owned balance must be
   * persisted atomically by infrastructure.
   *
   * FinancialAccountBalanceEntity.version is used by infrastructure for
   * optimistic concurrency control.
   */
  save(aggregate: FinancialAccountAggregate): Promise<void>;

  /**
   * Finds and rehydrates a Financial Account aggregate by internal identity.
   */
  findById(id: UniqueEntityId): Promise<FinancialAccountAggregate | null>;

  /**
   * Finds and rehydrates a Financial Account aggregate by public identity.
   */
  findByPublicId(
    publicId: FinancialAccountPublicId,
  ): Promise<FinancialAccountAggregate | null>;

  /**
   * Deletes a Financial Account aggregate by internal identity.
   *
   * Infrastructure is responsible for handling the aggregate-owned balance.
   */
  delete(id: UniqueEntityId): Promise<void>;

  /**
   * Determines whether a Financial Account exists by internal identity.
   */
  exists(id: UniqueEntityId): Promise<boolean>;

  /**
   * Determines whether a Financial Account exists by public identity.
   */
  existsByPublicId(publicId: FinancialAccountPublicId): Promise<boolean>;

  // ===========================================================================
  // Account Root Queries
  // ===========================================================================

  /**
   * Finds the Financial Account root entity by internal identity.
   *
   * Does not rehydrate the complete aggregate.
   */
  findAccountById(id: UniqueEntityId): Promise<FinancialAccountEntity | null>;

  /**
   * Finds the Financial Account root entity by public identity.
   *
   * Does not rehydrate the complete aggregate.
   */
  findAccountByPublicId(
    publicId: FinancialAccountPublicId,
  ): Promise<FinancialAccountEntity | null>;

  /**
   * Returns Financial Account root entities.
   */
  findAccounts(): Promise<FinancialAccountEntity[]>;

  // ===========================================================================
  // Owner Queries
  // ===========================================================================

  /**
   * Finds the Financial Account aggregate belonging to an owner.
   *
   * ownerPublicId is a cross-domain identity reference.
   *
   * The current Financial domain invariant allows one Financial Account
   * for the relevant owner/account context.
   */
  findByOwnerPublicId(
    ownerPublicId: FinancialAccountOwnerPublicId,
  ): Promise<FinancialAccountAggregate | null>;

  /**
   * Determines whether an owner has a Financial Account.
   */
  existsByOwnerPublicId(
    ownerPublicId: FinancialAccountOwnerPublicId,
  ): Promise<boolean>;

  /**
   * Finds an owner's Financial Account with the specified lifecycle status.
   */
  findByOwnerPublicIdAndStatus(
    ownerPublicId: FinancialAccountOwnerPublicId,
    status: FinancialAccountStatus,
  ): Promise<FinancialAccountAggregate | null>;

  /**
   * Determines whether an owner has a Financial Account with the specified
   * lifecycle status.
   */
  existsByOwnerPublicIdAndStatus(
    ownerPublicId: FinancialAccountOwnerPublicId,
    status: FinancialAccountStatus,
  ): Promise<boolean>;

  // ===========================================================================
  // Account Classification Queries
  // ===========================================================================

  /**
   * Finds Financial Accounts by account type.
   */
  findAccountsByType(
    type: FinancialAccountType,
  ): Promise<FinancialAccountEntity[]>;

  /**
   * Finds Financial Accounts by lifecycle status.
   */
  findAccountsByStatus(
    status: FinancialAccountStatus,
  ): Promise<FinancialAccountEntity[]>;

  /**
   * Finds Financial Accounts using a specific currency.
   */
  findAccountsByCurrency(currency: Currency): Promise<FinancialAccountEntity[]>;

  /**
   * Finds Financial Accounts by type and lifecycle status.
   */
  findAccountsByTypeAndStatus(
    type: FinancialAccountType,
    status: FinancialAccountStatus,
  ): Promise<FinancialAccountEntity[]>;

  /**
   * Finds Financial Accounts by currency and lifecycle status.
   */
  findAccountsByCurrencyAndStatus(
    currency: Currency,
    status: FinancialAccountStatus,
  ): Promise<FinancialAccountEntity[]>;

  // ===========================================================================
  // Currency Compatibility
  // ===========================================================================

  /**
   * Determines whether an account uses the specified currency.
   */
  usesCurrency(accountId: UniqueEntityId, currency: Currency): Promise<boolean>;

  /**
   * Determines whether an account identified by public identity uses the
   * specified currency.
   */
  usesCurrencyByPublicId(
    accountPublicId: FinancialAccountPublicId,
    currency: Currency,
  ): Promise<boolean>;

  // ===========================================================================
  // Account Lifecycle Queries
  // ===========================================================================

  /**
   * Finds active Financial Accounts.
   */
  findActiveAccounts(): Promise<FinancialAccountEntity[]>;

  /**
   * Finds suspended Financial Accounts.
   */
  findSuspendedAccounts(): Promise<FinancialAccountEntity[]>;

  /**
   * Finds closed Financial Accounts.
   */
  findClosedAccounts(): Promise<FinancialAccountEntity[]>;

  /**
   * Counts Financial Accounts by lifecycle status.
   */
  countByStatus(status: FinancialAccountStatus): Promise<number>;

  /**
   * Counts all Financial Accounts.
   */
  count(): Promise<number>;

  // ===========================================================================
  // Aggregate-Owned Balance Queries
  // ===========================================================================

  /**
   * Finds the balance belonging to a Financial Account.
   *
   * The balance remains an entity inside the Financial Account aggregate.
   */
  findBalanceByAccountId(
    accountId: UniqueEntityId,
  ): Promise<FinancialAccountBalanceEntity | null>;

  /**
   * Finds the balance belonging to a Financial Account identified by its
   * public identity.
   */
  findBalanceByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<FinancialAccountBalanceEntity | null>;

  /**
   * Finds a Financial Account balance by its public identity.
   */
  findBalanceByPublicId(
    publicId: FinancialAccountBalancePublicId,
  ): Promise<FinancialAccountBalanceEntity | null>;

  /**
   * Determines whether a Financial Account has its aggregate-owned balance.
   */
  existsBalance(accountId: UniqueEntityId): Promise<boolean>;

  /**
   * Finds and rehydrates the Financial Account aggregate that owns a balance.
   */
  findByBalancePublicId(
    balancePublicId: FinancialAccountBalancePublicId,
  ): Promise<FinancialAccountAggregate | null>;

  // ===========================================================================
  // Balance State Queries
  // ===========================================================================

  /**
   * Finds accounts with a positive available balance.
   */
  findAccountsWithAvailableFunds(): Promise<FinancialAccountEntity[]>;

  /**
   * Finds accounts with a positive pending balance.
   */
  findAccountsWithPendingFunds(): Promise<FinancialAccountEntity[]>;

  /**
   * Finds accounts with a positive held balance.
   */
  findAccountsWithHeldFunds(): Promise<FinancialAccountEntity[]>;

  /**
   * Finds accounts whose complete monetary state is zero.
   *
   * available = 0
   * pending   = 0
   * held      = 0
   */
  findZeroBalanceAccounts(): Promise<FinancialAccountEntity[]>;

  /**
   * Determines whether an account has at least the requested available funds.
   *
   * Amounts are represented using the Financial domain's integer minor-unit
   * convention.
   */
  hasAvailableFunds(
    accountId: UniqueEntityId,
    amount: number,
  ): Promise<boolean>;

  /**
   * Determines whether an account has at least the requested pending funds.
   */
  hasPendingFunds(accountId: UniqueEntityId, amount: number): Promise<boolean>;

  /**
   * Determines whether an account has at least the requested held funds.
   */
  hasHeldFunds(accountId: UniqueEntityId, amount: number): Promise<boolean>;

  // ===========================================================================
  // Balance State Aggregation
  // ===========================================================================

  /**
   * Counts accounts with a positive available balance.
   */
  countAccountsWithAvailableFunds(): Promise<number>;

  /**
   * Counts accounts with a positive pending balance.
   */
  countAccountsWithPendingFunds(): Promise<number>;

  /**
   * Counts accounts with a positive held balance.
   */
  countAccountsWithHeldFunds(): Promise<number>;

  /**
   * Counts accounts whose complete monetary state is zero.
   */
  countZeroBalanceAccounts(): Promise<number>;
}
