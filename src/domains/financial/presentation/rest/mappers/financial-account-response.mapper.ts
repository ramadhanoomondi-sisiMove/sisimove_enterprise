// -----------------------------------------------------------------------------
// Financial Account — REST Response Mapper
// -----------------------------------------------------------------------------
//
// Maps Financial Account domain objects into REST response representations.
//
// Aggregate boundary:
//
// FinancialAccountAggregate
// ├── FinancialAccountEntity
// └── FinancialAccountBalanceEntity
//
// IMPORTANT:
//
// FinancialAccountBalanceEntity is owned by the FinancialAccountAggregate.
// It is therefore mapped through the aggregate when a complete account
// response is required.
//
// Domain entities, aggregate roots, Entity IDs, and Value Objects are never
// exposed directly through the REST boundary.
//
// Value Objects are converted to their primitive representations here.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { FinancialAccountAggregate } from '../../../domain/aggregates/financial-account.aggregate';

import type { FinancialAccountEntity } from '../../../domain/entities/financial-account.entity';

import type { FinancialAccountBalanceEntity } from '../../../domain/entities/financial-account-balance.entity';

// -----------------------------------------------------------------------------
// Response Types
// -----------------------------------------------------------------------------

/**
 * REST representation of a Financial Account aggregate.
 *
 * The balance is included because FinancialAccountBalanceEntity is part of
 * the Financial Account aggregate boundary.
 */
export interface FinancialAccountResponse {
  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of the Financial Account.
   */
  publicId: string;

  /**
   * Public identity of the owning Identity/entity.
   *
   * Undefined for accounts that intentionally have no owner, such as certain
   * platform/system accounts.
   */
  ownerPublicId: string | undefined;

  // ===========================================================================
  // Account
  // ===========================================================================

  /**
   * Financial Account classification.
   */
  type: string;

  /**
   * Current lifecycle status.
   */
  status: string;

  /**
   * Currency in which the account is denominated.
   */
  currency: string;

  // ===========================================================================
  // Balance
  // ===========================================================================

  balance: FinancialAccountBalanceResponse;

  // ===========================================================================
  // Audit
  // ===========================================================================

  createdAt: Date;

  updatedAt: Date;
}

/**
 * REST representation of an aggregate-owned Financial Account balance.
 */
export interface FinancialAccountBalanceResponse {
  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of the balance entity.
   */
  publicId: string;

  /**
   * Public identity of the owning Financial Account.
   */
  accountPublicId: string;

  // ===========================================================================
  // Monetary State
  // ===========================================================================

  /**
   * Funds currently available for normal financial operations.
   *
   * Amount is represented in integer minor units.
   */
  availableAmount: number;

  /**
   * Funds received by the account but not yet available for normal use.
   *
   * Amount is represented in integer minor units.
   */
  pendingAmount: number;

  /**
   * Funds reserved against the account.
   *
   * Amount is represented in integer minor units.
   */
  heldAmount: number;

  /**
   * Total monetary state:
   *
   * available + pending + held
   */
  totalAmount: number;

  /**
   * Currency in which the balance is denominated.
   */
  currency: string;

  /**
   * Optimistic concurrency version of the balance.
   */
  version: number;

  // ===========================================================================
  // Audit
  // ===========================================================================

  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

/**
 * Maps Financial Account domain objects into REST response objects.
 *
 * Preferred usage:
 *
 *     FinancialAccountResponseMapper.toResponse(aggregate)
 *
 * for complete aggregate responses.
 *
 * The mapper also supports mapping root entities and balance entities
 * independently when a query explicitly returns only those domain objects.
 */
export class FinancialAccountResponseMapper {
  // ===========================================================================
  // Aggregate
  // ===========================================================================

  /**
   * Maps a fully rehydrated Financial Account aggregate.
   *
   * This is the preferred mapper for Financial Account detail responses
   * because the aggregate owns both the account and its balance.
   */
  public static toResponse(
    aggregate: FinancialAccountAggregate,
  ): FinancialAccountResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: aggregate.account.publicId.value,

      ownerPublicId: aggregate.account.ownerPublicId?.value,

      // -----------------------------------------------------------------------
      // Account
      // -----------------------------------------------------------------------

      type: aggregate.account.type.value,

      status: aggregate.account.status.value,

      currency: aggregate.account.currency.value,

      // -----------------------------------------------------------------------
      // Balance
      // -----------------------------------------------------------------------

      balance: this.mapBalance(aggregate.account, aggregate.balance),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: aggregate.account.createdAt,

      updatedAt: aggregate.account.updatedAt,
    };
  }

  // ===========================================================================
  // Entity
  // ===========================================================================

  /**
   * Maps a Financial Account root entity together with its aggregate-owned
   * balance entity.
   *
   * The balance is supplied explicitly because FinancialAccountEntity does
   * not own the balance property.
   */
  public static fromEntity(
    account: FinancialAccountEntity,
    balance: FinancialAccountBalanceEntity,
  ): FinancialAccountResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: account.publicId.value,

      ownerPublicId: account.ownerPublicId?.value,

      // -----------------------------------------------------------------------
      // Account
      // -----------------------------------------------------------------------

      type: account.type.value,

      status: account.status.value,

      currency: account.currency.value,

      // -----------------------------------------------------------------------
      // Balance
      // -----------------------------------------------------------------------

      balance: this.mapBalance(account, balance),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: account.createdAt,

      updatedAt: account.updatedAt,
    };
  }

  // ===========================================================================
  // Aggregate Collection
  // ===========================================================================

  /**
   * Maps a collection of Financial Account aggregates.
   */
  public static fromAggregates(
    aggregates: readonly FinancialAccountAggregate[],
  ): FinancialAccountResponse[] {
    return aggregates.map((aggregate) => this.toResponse(aggregate));
  }

  // ===========================================================================
  // Entity Collection
  // ===========================================================================

  /**
   * Maps Financial Account root entities together with their corresponding
   * aggregate-owned balance entities.
   *
   * The arrays must contain matching account/balance pairs.
   */
  public static fromEntities(
    accounts: readonly FinancialAccountEntity[],
    balances: readonly FinancialAccountBalanceEntity[],
  ): FinancialAccountResponse[] {
    if (accounts.length !== balances.length) {
      throw new Error(
        'Financial Account response mapping requires matching account and balance collections.',
      );
    }

    return accounts.map((account, index) => {
      const balance = balances[index];

      if (balance === undefined) {
        throw new Error(
          'Financial Account balance is missing for the account being mapped.',
        );
      }

      return this.fromEntity(account, balance);
    });
  }

  // ===========================================================================
  // Balance
  // ===========================================================================

  /**
   * Maps the aggregate-owned Financial Account balance.
   *
   * The account is supplied separately because the balance entity stores the
   * internal accountId rather than the Financial Account public identifier.
   */
  private static mapBalance(
    account: FinancialAccountEntity,
    balance: FinancialAccountBalanceEntity,
  ): FinancialAccountBalanceResponse {
    // -------------------------------------------------------------------------
    // Aggregate Integrity
    // -------------------------------------------------------------------------

    if (!balance.accountId.equals(account.id)) {
      throw new Error(
        'Financial Account balance does not belong to the Financial Account being mapped.',
      );
    }

    if (!balance.currency.equals(account.currency)) {
      throw new Error('Financial Account and balance currencies do not match.');
    }

    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: balance.publicId.value,

      accountPublicId: account.publicId.value,

      // -----------------------------------------------------------------------
      // Monetary State
      // -----------------------------------------------------------------------

      availableAmount: balance.availableAmount.value,

      pendingAmount: balance.pendingAmount.value,

      heldAmount: balance.heldAmount.value,

      totalAmount: balance.totalAmount(),

      currency: balance.currency.value,

      version: balance.version.value,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: balance.createdAt,

      updatedAt: balance.updatedAt,
    };
  }

  /**
   * Maps an aggregate-owned balance entity when only the balance itself is
   * available.
   *
   * This method is useful for the dedicated
   * GetFinancialAccountBalanceQuery response.
   *
   * Because the balance entity only stores the internal accountId, it cannot
   * expose the Financial Account public identifier without the owning account.
   */
  public static balanceFromEntity(
    balance: FinancialAccountBalanceEntity,
  ): Omit<FinancialAccountBalanceResponse, 'accountPublicId'> {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: balance.publicId.value,

      // -----------------------------------------------------------------------
      // Monetary State
      // -----------------------------------------------------------------------

      availableAmount: balance.availableAmount.value,

      pendingAmount: balance.pendingAmount.value,

      heldAmount: balance.heldAmount.value,

      totalAmount: balance.totalAmount(),

      currency: balance.currency.value,

      version: balance.version.value,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: balance.createdAt,

      updatedAt: balance.updatedAt,
    };
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialAccountResponseMapper;
