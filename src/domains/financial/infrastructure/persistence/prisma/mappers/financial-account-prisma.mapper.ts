// -----------------------------------------------------------------------------
// Financial Account Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps the complete Financial Account aggregate:
//
// FinancialAccountAggregate
// ├── FinancialAccountEntity
// └── FinancialAccountBalanceEntity
//
// Persistence responsibilities:
//
// - Translate Prisma Financial Account records into domain entities.
// - Translate Prisma Financial Account Balance records into domain entities.
// - Rehydrate the complete Financial Account aggregate.
// - Translate the complete aggregate into Prisma persistence structures.
// - Preserve internal database identities.
// - Preserve public domain identities.
// - Preserve FinancialAccountBalance.accountId ownership.
// - Preserve account/balance currency consistency.
// - Convert Prisma enum values into domain value objects.
//
// The mapper does NOT map:
//
// - transactions;
// - payments;
// - holds;
// - settlements;
// - withdrawals;
// - disbursements;
// - accounting entries.
//
// Those belong to their respective aggregate repositories.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type {
  FinancialAccount as PrismaFinancialAccount,
  FinancialAccountBalance as PrismaFinancialAccountBalance,
  FinancialAccountType as PrismaFinancialAccountType,
  FinancialAccountStatus as PrismaFinancialAccountStatus,
} from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { FinancialAccountAggregate } from '../../../../domain/aggregates/financial-account.aggregate';

// -----------------------------------------------------------------------------
// Entities
// -----------------------------------------------------------------------------

import { FinancialAccountEntity } from '../../../../domain/entities/financial-account.entity';
import { FinancialAccountBalanceEntity } from '../../../../domain/entities/financial-account-balance.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  FinancialAccountPublicId,
  FinancialAccountOwnerPublicId,
  FinancialAccountType,
  FinancialAccountStatus,
  FinancialAccountBalancePublicId,
  FinancialAccountAvailableAmount,
  FinancialAccountPendingAmount,
  FinancialAccountHeldAmount,
  FinancialAccountBalanceVersion,
  Currency,
} from '../../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Domain Value Types
// -----------------------------------------------------------------------------

import type {
  FinancialAccountTypeValue,
  FinancialAccountStatusValue,
} from '../../../../domain/value-objects';

// =============================================================================
// Prisma → Domain Enum Conversion
// =============================================================================

/**
 * Converts a persisted Prisma Financial Account type into
 * the domain FinancialAccountType value.
 */
function toFinancialAccountType(
  value: PrismaFinancialAccountType,
): FinancialAccountTypeValue {
  switch (value) {
    case 'USER':
      return 'USER';

    case 'PLATFORM':
      return 'PLATFORM';

    case 'MERCHANT':
      return 'MERCHANT';

    case 'HOLDING':
      return 'HOLDING';

    case 'SETTLEMENT':
      return 'SETTLEMENT';

    default:
      throw new Error(
        `Invalid persisted Financial Account type "${String(value)}".`,
      );
  }
}

/**
 * Converts a persisted Prisma Financial Account status into
 * the domain FinancialAccountStatus value.
 */
function toFinancialAccountStatus(
  value: PrismaFinancialAccountStatus,
): FinancialAccountStatusValue {
  switch (value) {
    case 'ACTIVE':
      return 'ACTIVE';

    case 'SUSPENDED':
      return 'SUSPENDED';

    case 'CLOSED':
      return 'CLOSED';

    default:
      throw new Error(
        `Invalid persisted Financial Account status "${String(value)}".`,
      );
  }
}

// =============================================================================
// Prisma Graph Types
// =============================================================================

/**
 * Prisma Financial Account record with its aggregate-owned balance.
 *
 * The balance relation is optional at the Prisma query level because some
 * repository queries may intentionally load only the FinancialAccount root.
 *
 * Complete aggregate rehydration requires the balance to be present.
 */
export type FinancialAccountWithBalance = PrismaFinancialAccount & {
  balance?: PrismaFinancialAccountBalance | null;
};

// =============================================================================
// Persistence Types
// =============================================================================

export interface FinancialAccountPersistence {
  account: ReturnType<typeof FinancialAccountPrismaMapper.accountToPersistence>;

  balance: ReturnType<typeof FinancialAccountPrismaMapper.balanceToPersistence>;
}

// =============================================================================
// Mapper
// =============================================================================

export class FinancialAccountPrismaMapper {
  // ===========================================================================
  // Aggregate → Domain
  // ===========================================================================

  /**
   * Rehydrates the complete Financial Account aggregate.
   *
   * The Financial Account aggregate requires exactly one balance entity.
   *
   * Aggregate consistency is ultimately validated by
   * FinancialAccountAggregate.rehydrate().
   */
  public static toDomain(
    record: FinancialAccountWithBalance,
  ): FinancialAccountAggregate {
    if (record.balance === null || record.balance === undefined) {
      throw new Error(
        `Financial Account "${record.publicId}" cannot be rehydrated without a balance.`,
      );
    }

    const account = this.accountToDomain(record);

    const balance = this.balanceToDomain(record.balance);

    return FinancialAccountAggregate.rehydrate(account, balance);
  }
  // ===========================================================================
  // Financial Account → Domain
  // ===========================================================================

  /**
   * Maps a persisted Prisma FinancialAccount record into
   * the FinancialAccountEntity.
   *
   * Persistence ID:
   *
   *   record.id
   *       ↓
   *   UniqueEntityId
   *
   * Public ID:
   *
   *   record.publicId
   *       ↓
   *   FinancialAccountPublicId
   *
   * Cross-domain owner reference:
   *
   *   record.ownerPublicId
   *       ↓
   *   FinancialAccountOwnerPublicId | undefined
   */
  public static accountToDomain(
    record: PrismaFinancialAccount,
  ): FinancialAccountEntity {
    const publicId = new FinancialAccountPublicId(record.publicId);

    const type = FinancialAccountType.create(
      toFinancialAccountType(record.type),
    );

    const status = FinancialAccountStatus.create(
      toFinancialAccountStatus(record.status),
    );

    const ownerPublicId =
      record.ownerPublicId === null
        ? undefined
        : FinancialAccountOwnerPublicId.create(record.ownerPublicId);

    const currency = Currency.create(record.currency);

    return FinancialAccountEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        publicId,

        // ---------------------------------------------------------------------
        // Account
        // ---------------------------------------------------------------------

        type,

        status,

        // ---------------------------------------------------------------------
        // Ownership
        // ---------------------------------------------------------------------

        ownerPublicId,

        // ---------------------------------------------------------------------
        // Currency
        // ---------------------------------------------------------------------

        currency,

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
  // Financial Account → Persistence
  // ===========================================================================

  /**
   * Maps the FinancialAccountEntity into its Prisma persistence shape.
   *
   * The mapper intentionally exposes the internal database ID separately
   * from the public domain identifier.
   */
  public static accountToPersistence(entity: FinancialAccountEntity): {
    id: string;
    publicId: string;
    type: PrismaFinancialAccountType;
    status: PrismaFinancialAccountStatus;
    ownerPublicId: string | null;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      // ---------------------------------------------------------------------
      // Identity
      // ---------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      // ---------------------------------------------------------------------
      // Account
      // ---------------------------------------------------------------------

      type: entity.type.value,

      status: entity.status.value,

      // ---------------------------------------------------------------------
      // Ownership
      // ---------------------------------------------------------------------

      ownerPublicId: entity.ownerPublicId?.value ?? null,

      // ---------------------------------------------------------------------
      // Currency
      // ---------------------------------------------------------------------

      currency: entity.currency.value,

      // ---------------------------------------------------------------------
      // Audit
      // ---------------------------------------------------------------------

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Financial Account Balance → Domain
  // ===========================================================================

  /**
   * Maps a persisted Prisma FinancialAccountBalance record into
   * FinancialAccountBalanceEntity.
   *
   * IMPORTANT:
   *
   * accountId is preserved as a UniqueEntityId.
   *
   * This allows the aggregate to enforce:
   *
   *   balance.accountId === account.id
   *
   * during rehydration.
   */
  public static balanceToDomain(
    record: PrismaFinancialAccountBalance,
  ): FinancialAccountBalanceEntity {
    // ---------------------------------------------------------------------------
    // Identity
    // ---------------------------------------------------------------------------

    const publicId = new FinancialAccountBalancePublicId(record.publicId);

    // ---------------------------------------------------------------------------
    // Aggregate Ownership
    // ---------------------------------------------------------------------------

    const accountId = new UniqueEntityId(record.accountId);

    // ---------------------------------------------------------------------------
    // Monetary State
    // ---------------------------------------------------------------------------

    const availableAmount = FinancialAccountAvailableAmount.create(
      record.availableAmount,
    );

    const pendingAmount = FinancialAccountPendingAmount.create(
      record.pendingAmount,
    );

    const heldAmount = FinancialAccountHeldAmount.create(record.heldAmount);

    // ---------------------------------------------------------------------------
    // Currency
    // ---------------------------------------------------------------------------

    const currency = Currency.create(record.currency);

    // ---------------------------------------------------------------------------
    // Optimistic Concurrency
    // ---------------------------------------------------------------------------

    const version = FinancialAccountBalanceVersion.create(record.version);

    // ---------------------------------------------------------------------------
    // Entity
    // ---------------------------------------------------------------------------

    return FinancialAccountBalanceEntity.rehydrate(
      {
        // -----------------------------------------------------------------------
        // Aggregate Ownership
        // -----------------------------------------------------------------------

        accountId,

        // -----------------------------------------------------------------------
        // Identity
        // -----------------------------------------------------------------------

        publicId,

        // -----------------------------------------------------------------------
        // Monetary State
        // -----------------------------------------------------------------------

        availableAmount,

        pendingAmount,

        heldAmount,

        // -----------------------------------------------------------------------
        // Currency
        // -----------------------------------------------------------------------

        currency,

        // -----------------------------------------------------------------------
        // Optimistic Concurrency
        // -----------------------------------------------------------------------

        version,

        // -----------------------------------------------------------------------
        // Audit
        // -----------------------------------------------------------------------

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      // -------------------------------------------------------------------------
      // Internal Persistence Identity
      // -------------------------------------------------------------------------

      new UniqueEntityId(record.id),
    );
  }

  // ===========================================================================
  // Financial Account Balance → Persistence
  // ===========================================================================

  /**
   * Maps FinancialAccountBalanceEntity into its Prisma persistence shape.
   *
   * accountId is explicitly persisted because the balance entity now owns
   * the internal ownership reference to FinancialAccount.
   */
  public static balanceToPersistence(entity: FinancialAccountBalanceEntity): {
    id: string;
    publicId: string;
    accountId: string;
    availableAmount: number;
    pendingAmount: number;
    heldAmount: number;
    currency: string;
    version: number;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      // ---------------------------------------------------------------------
      // Identity
      // ---------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      // ---------------------------------------------------------------------
      // Aggregate Ownership
      // ---------------------------------------------------------------------

      accountId: entity.accountId.toString(),

      // ---------------------------------------------------------------------
      // Monetary State
      // ---------------------------------------------------------------------

      availableAmount: entity.availableAmount.value,

      pendingAmount: entity.pendingAmount.value,

      heldAmount: entity.heldAmount.value,

      // ---------------------------------------------------------------------
      // Currency
      // ---------------------------------------------------------------------

      currency: entity.currency.value,

      // ---------------------------------------------------------------------
      // Optimistic Concurrency
      // ---------------------------------------------------------------------

      version: entity.version.value,

      // ---------------------------------------------------------------------
      // Audit
      // ---------------------------------------------------------------------

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Aggregate → Persistence
  // ===========================================================================

  /**
   * Converts the complete Financial Account aggregate into persistence
   * structures.
   *
   * The repository is responsible for persisting both structures atomically.
   *
   * Expected persistence boundary:
   *
   * FinancialAccount
   * └── FinancialAccountBalance
   *
   * The mapper does not perform database operations.
   */
  public static toPersistence(
    aggregate: FinancialAccountAggregate,
  ): FinancialAccountPersistence {
    return {
      account: this.accountToPersistence(aggregate.account),

      balance: this.balanceToPersistence(aggregate.balance),
    };
  }

  // ===========================================================================
  // Component Mapping
  // ===========================================================================

  /**
   * Maps an individual Prisma Financial Account component into its
   * corresponding domain entity.
   *
   * This method is useful for repository-level component operations.
   *
   * Complete aggregate rehydration must use toDomain().
   */
  public static toDomainComponent(
    record: PrismaFinancialAccount | PrismaFinancialAccountBalance,
  ): FinancialAccountEntity | FinancialAccountBalanceEntity {
    if (this.isFinancialAccountRecord(record)) {
      return this.accountToDomain(record);
    }

    if (this.isFinancialAccountBalanceRecord(record)) {
      return this.balanceToDomain(record);
    }

    throw new Error(
      'Unsupported Financial Account Prisma record supplied to mapper.',
    );
  }

  // ===========================================================================
  // Prisma Record Guards
  // ===========================================================================

  /**
   * Identifies a FinancialAccount Prisma record.
   *
   * FinancialAccount-specific fields are used instead of merely checking
   * common fields such as id, publicId, createdAt, and updatedAt.
   */
  private static isFinancialAccountRecord(
    record: PrismaFinancialAccount | PrismaFinancialAccountBalance,
  ): record is PrismaFinancialAccount {
    return (
      'type' in record &&
      'status' in record &&
      'ownerPublicId' in record &&
      'currency' in record
    );
  }

  /**
   * Identifies a FinancialAccountBalance Prisma record.
   */
  private static isFinancialAccountBalanceRecord(
    record: PrismaFinancialAccount | PrismaFinancialAccountBalance,
  ): record is PrismaFinancialAccountBalance {
    return (
      'accountId' in record &&
      'availableAmount' in record &&
      'pendingAmount' in record &&
      'heldAmount' in record &&
      'version' in record &&
      'currency' in record
    );
  }
}
