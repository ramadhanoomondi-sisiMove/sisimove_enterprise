// -----------------------------------------------------------------------------
// Financial Transaction — REST Response Mapper
// -----------------------------------------------------------------------------
//
// Maps Financial Transaction domain objects into REST response
// representations.
//
// Aggregate boundary:
//
// FinancialTransactionAggregate
// ├── FinancialTransactionEntity
// └── FinancialTransactionEntryEntity[]
//
// IMPORTANT:
//
// Domain entities, aggregate roots, Entity IDs, and Value Objects are never
// exposed directly through the REST boundary.
//
// Value Objects are converted to their primitive representations here.
//
// FinancialAccountReference is exposed only through its public identifier.
// The Financial Account aggregate itself is NOT traversed.
//
// FinancialTransactionEntryEntity is mapped as part of the transaction
// aggregate because transaction entries belong to the aggregate boundary.
//
// FinancialTransactionReference is serialized through its existing domain
// representation. The Value Object is intentionally NOT modified.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { FinancialTransactionAggregate } from '../../../domain/aggregates/financial-transaction.aggregate';

import type { FinancialTransactionEntity } from '../../../domain/entities/financial-transaction.entity';

import type { FinancialTransactionEntryEntity } from '../../../domain/entities/financial-transaction-entry.entity';

// -----------------------------------------------------------------------------
// Response Types
// -----------------------------------------------------------------------------

/**
 * REST representation of a Financial Transaction aggregate.
 *
 * The transaction entries are included because they are owned by the
 * FinancialTransactionAggregate.
 */
export interface FinancialTransactionResponse {
  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of the Financial Transaction.
   */
  publicId: string;

  // ===========================================================================
  // Transaction
  // ===========================================================================

  /**
   * Business classification of the transaction.
   */
  type: string;

  /**
   * Current lifecycle status.
   */
  status: string;

  /**
   * Transaction amount in integer minor units.
   */
  amount: number;

  /**
   * Currency in which the transaction is denominated.
   */
  currency: string;

  // ===========================================================================
  // Account References
  // ===========================================================================

  /**
   * Public identifier of the source Financial Account.
   *
   * Undefined when the transaction originates outside the platform.
   */
  sourceAccountPublicId: string | undefined;

  /**
   * Public identifier of the destination Financial Account.
   *
   * Undefined when the transaction terminates outside the platform.
   */
  destinationAccountPublicId: string | undefined;

  // ===========================================================================
  // Business Reference
  // ===========================================================================

  /**
   * Serialized business reference.
   *
   * The FinancialTransactionReference Value Object serializes itself as:
   *
   *     TYPE:PUBLIC_ID
   *
   * Example:
   *
   *     JOURNEY_BOOKING:JBK-ABC12345
   */
  reference: string | undefined;

  // ===========================================================================
  // Accounting Reference
  // ===========================================================================

  /**
   * Public identifier of the associated Accounting Journal.
   *
   * This remains an opaque cross-domain reference.
   */
  accountingJournalPublicId: string | undefined;

  // ===========================================================================
  // Entries
  // ===========================================================================

  /**
   * Account-level financial movements belonging to this transaction.
   */
  entries: FinancialTransactionEntryResponse[];

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  /**
   * Timestamp at which the transaction completed.
   */
  completedAt: Date | undefined;

  /**
   * Timestamp at which the transaction failed.
   */
  failedAt: Date | undefined;

  /**
   * Timestamp at which the transaction was reversed.
   */
  reversedAt: Date | undefined;

  /**
   * Timestamp at which the transaction was cancelled.
   */
  cancelledAt: Date | undefined;

  // ===========================================================================
  // Audit
  // ===========================================================================

  createdAt: Date;

  updatedAt: Date;
}

/**
 * REST representation of a Financial Transaction Entry.
 *
 * The entry exposes the referenced Financial Account through its public
 * identifier only. The Financial Account aggregate is not embedded.
 */
export interface FinancialTransactionEntryResponse {
  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of the transaction entry.
   */
  publicId: string;

  // ===========================================================================
  // Account
  // ===========================================================================

  /**
   * Public identifier of the Financial Account affected by this entry.
   */
  accountPublicId: string;

  // ===========================================================================
  // Entry Classification
  // ===========================================================================

  /**
   * Debit or credit direction.
   */
  type: string;

  /**
   * Balance bucket affected by this entry.
   */
  balanceType: string;

  // ===========================================================================
  // Amount
  // ===========================================================================

  /**
   * Entry amount in integer minor units.
   */
  amount: number;

  /**
   * Currency of the entry.
   */
  currency: string;

  // ===========================================================================
  // Audit
  // ===========================================================================

  createdAt: Date;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

/**
 * Maps Financial Transaction domain objects into REST response objects.
 *
 * Preferred usage:
 *
 *     FinancialTransactionResponseMapper.toResponse(aggregate)
 *
 * for complete Financial Transaction aggregate responses.
 *
 * The mapper also supports mapping the root transaction entity and entries
 * independently when a query explicitly returns those domain objects.
 */
export class FinancialTransactionResponseMapper {
  // ===========================================================================
  // Aggregate
  // ===========================================================================

  /**
   * Maps a fully rehydrated Financial Transaction aggregate.
   *
   * This is the preferred mapper for Financial Transaction detail responses
   * because the aggregate owns both the transaction and its entries.
   */
  public static toResponse(
    aggregate: FinancialTransactionAggregate,
  ): FinancialTransactionResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: aggregate.transaction.publicId.value,

      // -----------------------------------------------------------------------
      // Transaction
      // -----------------------------------------------------------------------

      type: aggregate.transaction.type.value,

      status: aggregate.transaction.status.value,

      amount: aggregate.transaction.amount.amount,

      currency: aggregate.transaction.amount.currency.value,

      // -----------------------------------------------------------------------
      // Account References
      // -----------------------------------------------------------------------

      sourceAccountPublicId: aggregate.transaction.sourceAccount?.publicId,

      destinationAccountPublicId:
        aggregate.transaction.destinationAccount?.publicId,

      // -----------------------------------------------------------------------
      // Business Reference
      // -----------------------------------------------------------------------

      reference: aggregate.transaction.reference?.toString(),

      // -----------------------------------------------------------------------
      // Accounting Reference
      // -----------------------------------------------------------------------

      accountingJournalPublicId:
        aggregate.transaction.accountingJournalPublicId,

      // -----------------------------------------------------------------------
      // Entries
      // -----------------------------------------------------------------------

      entries: aggregate.entries.map((entry) => this.entryToResponse(entry)),

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      completedAt: aggregate.transaction.completedAt,

      failedAt: aggregate.transaction.failedAt,

      reversedAt: aggregate.transaction.reversedAt,

      cancelledAt: aggregate.transaction.cancelledAt,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: aggregate.transaction.createdAt,

      updatedAt: aggregate.transaction.updatedAt,
    };
  }

  // ===========================================================================
  // Entity
  // ===========================================================================

  /**
   * Maps a Financial Transaction root entity together with its aggregate-owned
   * entries.
   *
   * The entries are supplied explicitly because FinancialTransactionEntity
   * does not own the entries collection.
   */
  public static fromEntity(
    transaction: FinancialTransactionEntity,
    entries: readonly FinancialTransactionEntryEntity[],
  ): FinancialTransactionResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: transaction.publicId.value,

      // -----------------------------------------------------------------------
      // Transaction
      // -----------------------------------------------------------------------

      type: transaction.type.value,

      status: transaction.status.value,

      amount: transaction.amount.amount,

      currency: transaction.amount.currency.value,

      // -----------------------------------------------------------------------
      // Account References
      // -----------------------------------------------------------------------

      sourceAccountPublicId: transaction.sourceAccount?.publicId,

      destinationAccountPublicId: transaction.destinationAccount?.publicId,

      // -----------------------------------------------------------------------
      // Business Reference
      // -----------------------------------------------------------------------

      reference: transaction.reference?.toString(),

      // -----------------------------------------------------------------------
      // Accounting Reference
      // -----------------------------------------------------------------------

      accountingJournalPublicId: transaction.accountingJournalPublicId,

      // -----------------------------------------------------------------------
      // Entries
      // -----------------------------------------------------------------------

      entries: entries.map((entry) => this.entryToResponse(entry)),

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      completedAt: transaction.completedAt,

      failedAt: transaction.failedAt,

      reversedAt: transaction.reversedAt,

      cancelledAt: transaction.cancelledAt,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: transaction.createdAt,

      updatedAt: transaction.updatedAt,
    };
  }

  // ===========================================================================
  // Aggregate Collection
  // ===========================================================================

  /**
   * Maps a collection of Financial Transaction aggregates.
   */
  public static fromAggregates(
    aggregates: readonly FinancialTransactionAggregate[],
  ): FinancialTransactionResponse[] {
    return aggregates.map((aggregate) => this.toResponse(aggregate));
  }

  // ===========================================================================
  // Entity Collection
  // ===========================================================================

  /**
   * Maps Financial Transaction root entities together with their
   * corresponding aggregate-owned entries.
   *
   * Each entry is matched using the internal transaction identity.
   */
  public static fromEntities(
    transactions: readonly FinancialTransactionEntity[],
    entries: readonly FinancialTransactionEntryEntity[],
  ): FinancialTransactionResponse[] {
    return transactions.map((transaction) => {
      const transactionEntries = entries.filter((entry) =>
        entry.belongsToTransaction(transaction.id),
      );

      return this.fromEntity(transaction, transactionEntries);
    });
  }

  // ===========================================================================
  // Entry
  // ===========================================================================

  /**
   * Maps a Financial Transaction Entry entity into its REST representation.
   *
   * The entry's internal transaction ID is intentionally not exposed.
   */
  public static entryToResponse(
    entry: FinancialTransactionEntryEntity,
  ): FinancialTransactionEntryResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: entry.publicId.value,

      // -----------------------------------------------------------------------
      // Account
      // -----------------------------------------------------------------------

      accountPublicId: entry.account.publicId,

      // -----------------------------------------------------------------------
      // Entry Classification
      // -----------------------------------------------------------------------

      type: entry.type.value,

      balanceType: entry.balanceType.value,

      // -----------------------------------------------------------------------
      // Amount
      // -----------------------------------------------------------------------

      amount: entry.amount.amount,

      currency: entry.amount.currency.value,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entry.createdAt,
    };
  }

  // ===========================================================================
  // Entry Collection
  // ===========================================================================

  /**
   * Maps a collection of Financial Transaction Entry entities.
   *
   * Useful for dedicated transaction-entry query responses.
   */
  public static entriesFromEntities(
    entries: readonly FinancialTransactionEntryEntity[],
  ): FinancialTransactionEntryResponse[] {
    return entries.map((entry) => this.entryToResponse(entry));
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialTransactionResponseMapper;
