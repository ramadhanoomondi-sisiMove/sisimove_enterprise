// -----------------------------------------------------------------------------
// Financial Transaction Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps the complete Financial Transaction aggregate:
//
// FinancialTransactionAggregate
// ├── FinancialTransactionEntity
// └── FinancialTransactionEntryEntity[]
//
// Persistence responsibilities:
//
// - Translate Prisma Financial Transaction records into domain entities.
// - Translate Prisma Financial Transaction Entry records into domain entities.
// - Resolve persisted FinancialAccount foreign keys into opaque
//   FinancialAccountReference value objects.
// - Rehydrate the complete Financial Transaction aggregate.
// - Translate the complete aggregate into Prisma persistence structures.
// - Preserve internal database identities.
// - Preserve public domain identities.
// - Preserve transaction/entry ownership.
// - Preserve transaction and entry monetary values.
// - Preserve lifecycle timestamps.
// - Preserve opaque business references.
// - Preserve opaque Accounting Journal references.
//
// IMPORTANT:
//
// Prisma stores account relationships using internal FinancialAccount.id:
//
//   FinancialTransaction.sourceAccountId
//   FinancialTransaction.destinationAccountId
//   FinancialTransactionEntry.accountId
//
// The domain intentionally stores these as:
//
//   FinancialAccountReference
//
// Therefore:
//
// Prisma → Domain
//   FinancialAccount.id/publicId
//       ↓
//   FinancialAccountReference
//
// Domain → Prisma
//   FinancialAccountReference.publicId
//       ↓
//   infrastructure-provided internal account ID
//
// This mapper does NOT query the database.
//
// The repository/infrastructure layer is responsible for resolving domain
// account references into internal Prisma account IDs before persistence.
//
// Accounting remains outside the Financial bounded context.
//
// accountingJournalPublicId is therefore mapped only as an opaque identifier.
//
// The mapper does NOT map:
//
// - Financial Accounts
// - Financial Account Balances
// - Payments
// - Payment Attempts
// - Holds
// - Withdrawals
// - Settlements
// - Disbursements
// - Disbursement Attempts
//
// Those belong to their respective aggregate mappers.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type {
  FinancialTransaction as PrismaFinancialTransaction,
  FinancialTransactionEntry as PrismaFinancialTransactionEntry,
  FinancialTransactionType as PrismaFinancialTransactionType,
  FinancialTransactionStatus as PrismaFinancialTransactionStatus,
  FinancialTransactionEntryType as PrismaFinancialTransactionEntryType,
  FinancialBalanceType as PrismaFinancialBalanceType,
  FinancialAccount as PrismaFinancialAccount,
} from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { FinancialTransactionAggregate } from '../../../../domain/aggregates/financial-transaction.aggregate';

// -----------------------------------------------------------------------------
// Entities
// -----------------------------------------------------------------------------

import { FinancialTransactionEntity } from '../../../../domain/entities/financial-transaction.entity';

import { FinancialTransactionEntryEntity } from '../../../../domain/entities/financial-transaction-entry.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  Currency,
  Money,
  FinancialAccountReference,
  FinancialTransactionPublicId,
  FinancialTransactionType,
  FinancialTransactionStatus,
  FinancialTransactionReference,
  FinancialTransactionEntryPublicId,
  FinancialTransactionEntryType,
  FinancialBalanceType,
} from '../../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Domain Value Types
// -----------------------------------------------------------------------------

import type {
  FinancialTransactionTypeValue,
  FinancialTransactionStatusValue,
  FinancialTransactionEntryTypeValue,
  FinancialBalanceTypeValue,
} from '../../../../domain/value-objects';

// =============================================================================
// Prisma → Domain Enum Conversion
// =============================================================================

/**
 * Converts a persisted Prisma Financial Transaction type into the
 * corresponding domain FinancialTransactionType value.
 */
function toFinancialTransactionType(
  value: PrismaFinancialTransactionType,
): FinancialTransactionTypeValue {
  switch (value) {
    case 'PAYMENT':
      return 'PAYMENT';

    case 'TRANSFER':
      return 'TRANSFER';

    case 'HOLD':
      return 'HOLD';

    case 'RELEASE':
      return 'RELEASE';

    case 'CAPTURE':
      return 'CAPTURE';

    case 'SETTLEMENT':
      return 'SETTLEMENT';

    case 'DISBURSEMENT':
      return 'DISBURSEMENT';

    case 'REFUND':
      return 'REFUND';

    case 'REVERSAL':
      return 'REVERSAL';

    case 'ADJUSTMENT':
      return 'ADJUSTMENT';

    default:
      throw new Error(
        `Invalid persisted Financial Transaction type "${String(value)}".`,
      );
  }
}

/**
 * Converts a persisted Prisma Financial Transaction status into the
 * corresponding domain FinancialTransactionStatus value.
 */
function toFinancialTransactionStatus(
  value: PrismaFinancialTransactionStatus,
): FinancialTransactionStatusValue {
  switch (value) {
    case 'PENDING':
      return 'PENDING';

    case 'COMPLETED':
      return 'COMPLETED';

    case 'FAILED':
      return 'FAILED';

    case 'REVERSED':
      return 'REVERSED';

    case 'CANCELLED':
      return 'CANCELLED';

    default:
      throw new Error(
        `Invalid persisted Financial Transaction status "${String(value)}".`,
      );
  }
}

/**
 * Converts a persisted Prisma Financial Transaction Entry type into the
 * corresponding domain value.
 */
function toFinancialTransactionEntryType(
  value: PrismaFinancialTransactionEntryType,
): FinancialTransactionEntryTypeValue {
  switch (value) {
    case 'DEBIT':
      return 'DEBIT';

    case 'CREDIT':
      return 'CREDIT';

    default:
      throw new Error(
        `Invalid persisted Financial Transaction Entry type "${String(value)}".`,
      );
  }
}

/**
 * Converts a persisted Prisma Financial Balance type into the corresponding
 * domain value.
 */
function toFinancialBalanceType(
  value: PrismaFinancialBalanceType,
): FinancialBalanceTypeValue {
  switch (value) {
    case 'AVAILABLE':
      return 'AVAILABLE';

    case 'PENDING':
      return 'PENDING';

    case 'HELD':
      return 'HELD';

    default:
      throw new Error(
        `Invalid persisted Financial Balance type "${String(value)}".`,
      );
  }
}

// =============================================================================
// Prisma Graph Types
// =============================================================================

/**
 * Prisma Financial Transaction record with all aggregate-owned persistence
 * data and the Financial Account records required to resolve account
 * references.
 *
 * The relations are optional at the TypeScript type level because repository
 * queries may intentionally load only the transaction root.
 *
 * Complete aggregate rehydration requires:
 *
 * - entries
 * - sourceAccount when sourceAccountId is present
 * - destinationAccount when destinationAccountId is present
 * - entry.account
 */
export type FinancialTransactionWithRelations = PrismaFinancialTransaction & {
  sourceAccount?: PrismaFinancialAccount | null;

  destinationAccount?: PrismaFinancialAccount | null;

  entries?: FinancialTransactionEntryWithAccount[];
};

/**
 * Prisma Financial Transaction Entry with its required Financial Account
 * relation.
 */
export type FinancialTransactionEntryWithAccount =
  PrismaFinancialTransactionEntry & {
    account?: PrismaFinancialAccount | null;
  };

// =============================================================================
// Persistence Resolution
// =============================================================================

/**
 * Internal account identity resolution supplied by infrastructure.
 *
 * The domain knows only FinancialAccountReference.publicId.
 *
 * Prisma persistence requires FinancialAccount.id.
 *
 * The mapper therefore receives this mapping from infrastructure rather than
 * performing database access itself.
 *
 * Key:
 *   FinancialAccount.publicId
 *
 * Value:
 *   FinancialAccount.id
 */
export type FinancialAccountIdMap = ReadonlyMap<string, string>;

// =============================================================================
// Persistence Types
// =============================================================================

export interface FinancialTransactionPersistence {
  transaction: ReturnType<
    typeof FinancialTransactionPrismaMapper.transactionToPersistence
  >;

  entries: ReturnType<
    typeof FinancialTransactionPrismaMapper.entryToPersistence
  >[];
}

// =============================================================================
// Mapper
// =============================================================================

export class FinancialTransactionPrismaMapper {
  // ===========================================================================
  // Aggregate → Domain
  // ===========================================================================

  /**
   * Rehydrates the complete Financial Transaction aggregate.
   *
   * Required persistence graph:
   *
   * FinancialTransaction
   * ├── sourceAccount
   * ├── destinationAccount
   * └── entries[]
   *      └── account
   */
  public static toDomain(
    record: FinancialTransactionWithRelations,
  ): FinancialTransactionAggregate {
    const transaction = this.transactionToDomain(record);

    const entries = record.entries;

    if (entries === undefined) {
      throw new Error(
        `Financial Transaction "${record.publicId}" cannot be rehydrated without its entries collection.`,
      );
    }

    const domainEntries = entries.map((entry) =>
      this.entryToDomain(entry, record.currency),
    );

    return FinancialTransactionAggregate.rehydrate(transaction, domainEntries);
  }

  // ===========================================================================
  // Financial Transaction → Domain
  // ===========================================================================

  /**
   * Maps a persisted Prisma FinancialTransaction record into the
   * FinancialTransactionEntity.
   *
   * Account foreign keys are intentionally converted through the related
   * FinancialAccount.publicId rather than exposing internal database IDs to
   * the domain.
   */
  public static transactionToDomain(
    record: FinancialTransactionWithRelations,
  ): FinancialTransactionEntity {
    // -------------------------------------------------------------------------
    // Public Identity
    // -------------------------------------------------------------------------

    const publicId = new FinancialTransactionPublicId(record.publicId);

    // -------------------------------------------------------------------------
    // Classification
    // -------------------------------------------------------------------------

    const type = FinancialTransactionType.create(
      toFinancialTransactionType(record.type),
    );

    const status = FinancialTransactionStatus.create(
      toFinancialTransactionStatus(record.status),
    );

    // -------------------------------------------------------------------------
    // Currency
    // -------------------------------------------------------------------------

    const currency = Currency.create(record.currency);

    const amount = Money.create(record.amount, currency);

    // -------------------------------------------------------------------------
    // Source Account
    // -------------------------------------------------------------------------

    const sourceAccount = this.accountReferenceFromRecord(
      record.sourceAccountId,
      record.sourceAccount,
      'sourceAccount',
      record.publicId,
    );

    // -------------------------------------------------------------------------
    // Destination Account
    // -------------------------------------------------------------------------

    const destinationAccount = this.accountReferenceFromRecord(
      record.destinationAccountId,
      record.destinationAccount,
      'destinationAccount',
      record.publicId,
    );

    // -------------------------------------------------------------------------
    // Business Reference
    // -------------------------------------------------------------------------

    const reference = this.referenceFromPersistence(
      record.referenceType,
      record.referencePublicId,
    );

    // -------------------------------------------------------------------------
    // Entity
    // -------------------------------------------------------------------------

    return FinancialTransactionEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        publicId,

        // ---------------------------------------------------------------------
        // Classification
        // ---------------------------------------------------------------------

        type,

        status,

        // ---------------------------------------------------------------------
        // Account References
        // ---------------------------------------------------------------------

        sourceAccount,

        destinationAccount,

        // ---------------------------------------------------------------------
        // Amount
        // ---------------------------------------------------------------------

        amount,

        // ---------------------------------------------------------------------
        // Business Reference
        // ---------------------------------------------------------------------

        reference,

        // ---------------------------------------------------------------------
        // Accounting Reference
        // ---------------------------------------------------------------------

        accountingJournalPublicId:
          record.accountingJournalPublicId ?? undefined,

        // ---------------------------------------------------------------------
        // Lifecycle Timestamps
        // ---------------------------------------------------------------------

        completedAt: record.completedAt ?? undefined,

        failedAt: record.failedAt ?? undefined,

        reversedAt: record.reversedAt ?? undefined,

        cancelledAt: record.cancelledAt ?? undefined,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      // -----------------------------------------------------------------------
      // Internal Persistence Identity
      // -----------------------------------------------------------------------

      new UniqueEntityId(record.id),
    );
  }

  // ===========================================================================
  // Financial Transaction Entry → Domain
  // ===========================================================================

  /**
   * Maps a persisted Prisma FinancialTransactionEntry record into its
   * aggregate-owned FinancialTransactionEntryEntity.
   *
   * Entry currency is intentionally taken from the parent transaction.
   *
   * The Prisma entry table does not contain an independent currency column.
   *
   * The FinancialAccountReference is reconstructed from the persisted
   * FinancialAccount relation:
   *
   *   FinancialAccount.type
   *       ↓
   *   FinancialAccountReference.type
   *
   *   FinancialAccount.publicId
   *       ↓
   *   FinancialAccountReference.publicId
   *
   * The Financial domain keeps this reference opaque and does not embed
   * the FinancialAccountEntity inside the transaction entry.
   */
  public static entryToDomain(
    record: FinancialTransactionEntryWithAccount,
    transactionCurrency: string,
  ): FinancialTransactionEntryEntity {
    // -------------------------------------------------------------------------
    // Public Identity
    // -------------------------------------------------------------------------

    const publicId = new FinancialTransactionEntryPublicId(record.publicId);

    // -------------------------------------------------------------------------
    // Parent Transaction
    // -------------------------------------------------------------------------

    /**
     * FinancialTransactionEntry.transactionId is the internal persistence
     * identity of the owning FinancialTransaction aggregate.
     */
    const transactionId = new UniqueEntityId(record.transactionId);

    // -------------------------------------------------------------------------
    // Account Reference
    // -------------------------------------------------------------------------

    /**
     * The transaction entry requires its FinancialAccount reference in order
     * to identify the account affected by the movement.
     *
     * The relation must be loaded by the repository.
     */
    if (record.account === undefined || record.account === null) {
      throw new Error(
        `Financial Transaction Entry "${record.publicId}" cannot be rehydrated without its Financial Account relation.`,
      );
    }

    /**
     * FinancialAccountReference.create() requires:
     *
     *   create(type, publicId)
     *
     * The FinancialAccount type is preserved as the reference type while
     * the FinancialAccount publicId identifies the referenced account.
     *
     * Example:
     *
     *   PLATFORM + "account-public-id"
     *       ↓
     *   FinancialAccountReference
     */
    const account = FinancialAccountReference.create(
      record.account.type,
      record.account.publicId,
    );

    // -------------------------------------------------------------------------
    // Classification
    // -------------------------------------------------------------------------

    const type = FinancialTransactionEntryType.create(
      toFinancialTransactionEntryType(record.type),
    );

    const balanceType = FinancialBalanceType.create(
      toFinancialBalanceType(record.balanceType),
    );

    // -------------------------------------------------------------------------
    // Amount
    // -------------------------------------------------------------------------

    /**
     * Transaction entries do not persist their own currency.
     *
     * Currency therefore comes from the parent FinancialTransaction.
     */
    const currency = Currency.create(transactionCurrency);

    const amount = Money.create(record.amount, currency);

    // -------------------------------------------------------------------------
    // Entity
    // -------------------------------------------------------------------------

    return FinancialTransactionEntryEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        publicId,

        // ---------------------------------------------------------------------
        // Parent Transaction
        // ---------------------------------------------------------------------

        transactionId,

        // ---------------------------------------------------------------------
        // Account
        // ---------------------------------------------------------------------

        account,

        // ---------------------------------------------------------------------
        // Classification
        // ---------------------------------------------------------------------

        type,

        balanceType,

        // ---------------------------------------------------------------------
        // Amount
        // ---------------------------------------------------------------------

        amount,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: record.createdAt,
      },

      // -----------------------------------------------------------------------
      // Internal Persistence Identity
      // -----------------------------------------------------------------------

      new UniqueEntityId(record.id),
    );
  }
  // ===========================================================================
  // Financial Transaction → Persistence
  // ===========================================================================

  /**
   * Maps the FinancialTransactionEntity into its Prisma persistence shape.
   *
   * Account references are converted from domain FinancialAccountReference
   * values into internal Prisma FinancialAccount IDs using the resolution map
   * supplied by infrastructure.
   *
   * The mapper never exposes or persists the domain account reference directly.
   *
   * Domain:
   *
   *   FinancialAccountReference
   *   ├── type
   *   └── publicId
   *
   * Persistence:
   *
   *   FinancialAccount.id
   *
   * The account ID resolution is therefore an infrastructure concern.
   */
  public static transactionToPersistence(
    entity: FinancialTransactionEntity,
    accountIds: FinancialAccountIdMap,
  ): {
    id: string;
    publicId: string;
    type: PrismaFinancialTransactionType;
    status: PrismaFinancialTransactionStatus;
    sourceAccountId: string | null;
    destinationAccountId: string | null;
    amount: number;
    currency: string;
    referenceType: string | null;
    referencePublicId: string | null;
    accountingJournalPublicId: string | null;
    completedAt: Date | null;
    failedAt: Date | null;
    reversedAt: Date | null;
    cancelledAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      // -----------------------------------------------------------------------
      // Classification
      // -----------------------------------------------------------------------

      type: entity.type.value,

      status: entity.status.value,

      // -----------------------------------------------------------------------
      // Account References
      // -----------------------------------------------------------------------

      sourceAccountId: this.resolveAccountId(
        entity.sourceAccount,
        accountIds,
        'source account',
      ),

      destinationAccountId: this.resolveAccountId(
        entity.destinationAccount,
        accountIds,
        'destination account',
      ),

      // -----------------------------------------------------------------------
      // Amount
      // -----------------------------------------------------------------------

      amount: entity.amount.amount,

      currency: entity.amount.currency.value,

      // -----------------------------------------------------------------------
      // Business Reference
      // -----------------------------------------------------------------------

      referenceType: entity.reference?.type ?? null,

      referencePublicId: entity.reference?.publicId ?? null,

      // -----------------------------------------------------------------------
      // Accounting Reference
      // -----------------------------------------------------------------------

      accountingJournalPublicId: entity.accountingJournalPublicId ?? null,

      // -----------------------------------------------------------------------
      // Lifecycle Timestamps
      // -----------------------------------------------------------------------

      completedAt: entity.completedAt ?? null,

      failedAt: entity.failedAt ?? null,

      reversedAt: entity.reversedAt ?? null,

      cancelledAt: entity.cancelledAt ?? null,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }
  // ===========================================================================
  // Financial Transaction Entry → Persistence
  // ===========================================================================

  /**
   * Maps an aggregate-owned FinancialTransactionEntryEntity into its Prisma
   * persistence shape.
   *
   * The entry currency is intentionally NOT persisted separately because
   * FinancialTransactionEntry inherits the transaction currency.
   */
  public static entryToPersistence(
    entity: FinancialTransactionEntryEntity,
    accountIds: FinancialAccountIdMap,
  ): {
    id: string;
    publicId: string;
    transactionId: string;
    accountId: string;
    type: PrismaFinancialTransactionEntryType;
    balanceType: PrismaFinancialBalanceType;
    amount: number;
    createdAt: Date;
  } {
    const accountId = this.resolveAccountId(
      entity.account,
      accountIds,
      'transaction entry account',
    );

    if (accountId === null) {
      throw new Error(
        `Financial Transaction Entry "${entity.publicId.value}" requires an account.`,
      );
    }

    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      // -----------------------------------------------------------------------
      // Aggregate Ownership
      // -----------------------------------------------------------------------

      transactionId: entity.transactionId.toString(),

      // -----------------------------------------------------------------------
      // Account
      // -----------------------------------------------------------------------

      accountId,

      // -----------------------------------------------------------------------
      // Classification
      // -----------------------------------------------------------------------

      type: entity.type.value,

      balanceType: entity.balanceType.value,

      // -----------------------------------------------------------------------
      // Amount
      // -----------------------------------------------------------------------

      amount: entity.amount.amount,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt,
    };
  }

  // ===========================================================================
  // Aggregate → Persistence
  // ===========================================================================

  /**
   * Converts the complete Financial Transaction aggregate into persistence
   * structures.
   *
   * Expected persistence boundary:
   *
   * FinancialTransaction
   * └── FinancialTransactionEntry[]
   *
   * The repository must persist both the transaction and entries atomically.
   */
  public static toPersistence(
    aggregate: FinancialTransactionAggregate,
    accountIds: FinancialAccountIdMap,
  ): FinancialTransactionPersistence {
    return {
      transaction: this.transactionToPersistence(
        aggregate.transaction,
        accountIds,
      ),

      entries: aggregate.entries.map((entry) =>
        this.entryToPersistence(entry, accountIds),
      ),
    };
  }

  // ===========================================================================
  // Component Mapping
  // ===========================================================================

  /**
   * Maps an individual Prisma transaction component into its corresponding
   * domain entity.
   *
   * Complete aggregate rehydration should use toDomain().
   *
   * When mapping a standalone FinancialTransaction record, account relations
   * and transaction entries are intentionally omitted because they are not
   * available and are not required for transaction-root mapping.
   *
   * When mapping a standalone FinancialTransactionEntry record, the caller
   * must provide:
   *
   * - the related FinancialAccount;
   * - the parent transaction currency.
   */
  public static toDomainComponent(
    record: PrismaFinancialTransaction | PrismaFinancialTransactionEntry,
    account?: PrismaFinancialAccount,
    transactionCurrency?: string,
  ): FinancialTransactionEntity | FinancialTransactionEntryEntity {
    // =========================================================================
    // Financial Transaction
    // =========================================================================

    if (this.isFinancialTransactionRecord(record)) {
      return this.transactionToDomain(record);
    }

    // =========================================================================
    // Financial Transaction Entry
    // =========================================================================

    if (this.isFinancialTransactionEntryRecord(record)) {
      if (account === undefined) {
        throw new Error(
          `Financial Transaction Entry "${record.publicId}" requires its Financial Account relation for domain mapping.`,
        );
      }

      if (transactionCurrency === undefined) {
        throw new Error(
          `Financial Transaction Entry "${record.publicId}" requires its parent transaction currency for domain mapping.`,
        );
      }

      return this.entryToDomain(
        {
          ...record,
          account,
        },
        transactionCurrency,
      );
    }

    // =========================================================================
    // Unsupported Component
    // =========================================================================

    throw new Error(
      'Unsupported Financial Transaction Prisma record supplied to mapper.',
    );
  }

  // ===========================================================================
  // Account Reference Mapping
  // ===========================================================================

  /**
   * Converts a persisted FinancialAccount foreign key and loaded account
   * relation into the domain's opaque FinancialAccountReference.
   *
   * The internal FinancialAccount.id is deliberately not exposed to the
   * domain.
   *
   * Persistence:
   *
   *   FinancialAccount.id
   *   FinancialAccount.type
   *   FinancialAccount.publicId
   *
   *                  ↓
   *
   * Domain:
   *
   *   FinancialAccountReference
   *   ├── type
   *   └── publicId
   *
   * The internal database ID is used only to verify that the loaded relation
   * matches the foreign-key value persisted on the transaction.
   */
  private static accountReferenceFromRecord(
    accountId: string | null,
    account: PrismaFinancialAccount | null | undefined,
    fieldName: string,
    transactionPublicId: string,
  ): FinancialAccountReference | undefined {
    // =========================================================================
    // No Account Reference
    // =========================================================================

    if (accountId === null) {
      /**
       * If the foreign-key column is null, a loaded relation would represent
       * an inconsistent Prisma graph.
       */
      if (account !== undefined && account !== null) {
        throw new Error(
          `Financial Transaction "${transactionPublicId}" contains a ${fieldName} relation without a ${fieldName} ID.`,
        );
      }

      return undefined;
    }

    // =========================================================================
    // Account Relation Required
    // =========================================================================

    /**
     * A non-null foreign key requires the corresponding FinancialAccount
     * relation to be loaded before the transaction can be mapped into the
     * domain.
     */
    if (account === undefined || account === null) {
      throw new Error(
        `Financial Transaction "${transactionPublicId}" cannot resolve ${fieldName} "${accountId}" because the Financial Account relation was not loaded.`,
      );
    }

    // =========================================================================
    // Foreign-Key Consistency
    // =========================================================================

    /**
     * Ensure the loaded relation actually represents the account referenced
     * by the persisted foreign key.
     */
    if (account.id !== accountId) {
      throw new Error(
        `Financial Transaction "${transactionPublicId}" contains an inconsistent ${fieldName} relation.`,
      );
    }

    // =========================================================================
    // Domain Reference
    // =========================================================================

    /**
     * The domain receives an opaque FinancialAccountReference.
     *
     * The persistence-layer account ID remains inside infrastructure.
     */
    return FinancialAccountReference.create(account.type, account.publicId);
  }

  // ===========================================================================
  // Business Reference Mapping
  // ===========================================================================

  /**
   * Reconstructs the optional business reference from its persisted
   * type/public-ID pair.
   *
   * Prisma intentionally stores the reference as two nullable scalar fields.
   */
  private static referenceFromPersistence(
    referenceType: string | null,
    referencePublicId: string | null,
  ): FinancialTransactionReference | undefined {
    if (referenceType === null && referencePublicId === null) {
      return undefined;
    }

    if (referenceType === null || referencePublicId === null) {
      throw new Error(
        'Financial Transaction contains an incomplete business reference. Both referenceType and referencePublicId are required.',
      );
    }

    return FinancialTransactionReference.create(
      referenceType,
      referencePublicId,
    );
  }

  // ===========================================================================
  // Account ID Resolution
  // ===========================================================================

  /**
   * Resolves a domain FinancialAccountReference into the internal Prisma
   * FinancialAccount.id.
   *
   * The mapper performs no database access.
   *
   * Missing mappings are treated as infrastructure/persistence errors rather
   * than silently persisted as null.
   */
  private static resolveAccountId(
    account: FinancialAccountReference | undefined,
    accountIds: FinancialAccountIdMap,
    description: string,
  ): string | null {
    if (account === undefined) {
      return null;
    }

    const accountId = accountIds.get(account.publicId);

    if (accountId === undefined) {
      throw new Error(
        `Unable to resolve ${description} "${account.publicId}" to a persisted Financial Account ID.`,
      );
    }

    return accountId;
  }

  // ===========================================================================
  // Prisma Record Guards
  // ===========================================================================

  /**
   * Identifies a FinancialTransaction Prisma record.
   *
   * Transaction-specific fields are used instead of merely checking common
   * persistence fields.
   */
  private static isFinancialTransactionRecord(
    record: PrismaFinancialTransaction | PrismaFinancialTransactionEntry,
  ): record is PrismaFinancialTransaction {
    return (
      'status' in record &&
      'sourceAccountId' in record &&
      'destinationAccountId' in record &&
      'referenceType' in record &&
      'referencePublicId' in record &&
      'accountingJournalPublicId' in record
    );
  }

  /**
   * Identifies a FinancialTransactionEntry Prisma record.
   */
  private static isFinancialTransactionEntryRecord(
    record: PrismaFinancialTransaction | PrismaFinancialTransactionEntry,
  ): record is PrismaFinancialTransactionEntry {
    return (
      'transactionId' in record &&
      'accountId' in record &&
      'balanceType' in record
    );
  }
}
