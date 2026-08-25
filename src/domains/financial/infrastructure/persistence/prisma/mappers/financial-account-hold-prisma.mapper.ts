// -----------------------------------------------------------------------------
// Financial Account Hold Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps the complete Financial Account Hold aggregate:
//
// FinancialAccountHoldAggregate
// └── FinancialAccountHoldEntity
//
// Persistence responsibilities:
//
// - Translate Prisma Financial Account Hold records into domain entities.
// - Resolve the owning Financial Account relationship.
// - Preserve internal database identities.
// - Preserve public domain identities.
// - Preserve Financial Account ownership.
// - Preserve held amount.
// - Preserve currency.
// - Preserve hold lifecycle status.
// - Preserve optional business reference.
// - Preserve hold transaction reference.
// - Preserve release transaction reference.
// - Preserve capture transaction reference.
// - Preserve optional expiry.
// - Preserve lifecycle timestamps.
// - Rehydrate the complete Financial Account Hold aggregate.
// - Translate the complete aggregate into Prisma persistence structures.
//
// IMPORTANT:
//
// Prisma stores the owning Financial Account relationship through:
//
//   FinancialAccountHold.accountId
//
// The domain stores:
//
//   accountId
//   accountPublicId
//
// The mapper does not query the database.
//
// The repository/infrastructure layer is responsible for loading the owning
// FinancialAccount relation when complete domain rehydration is required.
//
// The mapper does NOT:
//
// - Modify Financial Account balances.
// - Create Financial Transactions.
// - Execute Financial Transactions.
// - Execute payment provider calls.
// - Communicate with external providers.
// - Coordinate other Financial Account Holds.
// - Coordinate Financial Account state.
// - Move money.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type {
  FinancialAccount as PrismaFinancialAccount,
  FinancialAccountHold as PrismaFinancialAccountHold,
  FinancialAccountHoldStatus as PrismaFinancialAccountHoldStatus,
} from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { FinancialAccountHoldAggregate } from '../../../../domain/aggregates/financial-account-hold.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { FinancialAccountHoldEntity } from '../../../../domain/entities/financial-account-hold.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  FinancialAccountHeldAmount,
  FinancialAccountHoldPublicId,
  FinancialAccountHoldStatus,
  FinancialAccountPublicId,
  FinancialHoldExpiry,
  FinancialHoldReference,
} from '../../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Domain Value Types
// -----------------------------------------------------------------------------

import { FinancialAccountHoldStatusValue } from '../../../../domain/value-objects';

// =============================================================================
// Prisma → Domain Enum Conversion
// =============================================================================

/**
 * Converts a persisted Prisma FinancialAccountHoldStatus into the
 * corresponding domain FinancialAccountHoldStatusValue.
 *
 * Infrastructure enum types must not leak into the domain layer.
 */
function toDomainHoldStatus(
  value: PrismaFinancialAccountHoldStatus,
): FinancialAccountHoldStatusValue {
  switch (value) {
    case 'ACTIVE':
      return FinancialAccountHoldStatusValue.ACTIVE;

    case 'RELEASED':
      return FinancialAccountHoldStatusValue.RELEASED;

    case 'CAPTURED':
      return FinancialAccountHoldStatusValue.CAPTURED;

    case 'CANCELLED':
      return FinancialAccountHoldStatusValue.CANCELLED;

    default:
      throw new Error(
        `Invalid persisted Financial Account Hold status "${String(value)}".`,
      );
  }
}

// =============================================================================
// Prisma Graph Types
// =============================================================================

/**
 * Prisma Financial Account Hold record with its owning Financial Account.
 *
 * The relation is optional at the Prisma TypeScript level because repository
 * queries may intentionally load the hold without its relation.
 *
 * Complete domain rehydration requires the owning FinancialAccount because
 * FinancialAccountHoldEntity preserves both:
 *
 *   accountId
 *   accountPublicId
 */
export type FinancialAccountHoldWithAccount = PrismaFinancialAccountHold & {
  account?: PrismaFinancialAccount | null;
};

// =============================================================================
// Persistence Types
// =============================================================================

/**
 * Persistence structure for a Financial Account Hold aggregate.
 *
 * The aggregate currently contains exactly one entity.
 */
export interface FinancialAccountHoldPersistence {
  hold: ReturnType<typeof FinancialAccountHoldPrismaMapper.toPersistence>;
}

// =============================================================================
// Mapper
// =============================================================================

export class FinancialAccountHoldPrismaMapper {
  // ===========================================================================
  // Prisma → Aggregate
  // ===========================================================================

  /**
   * Rehydrates the complete Financial Account Hold aggregate.
   *
   * Required persistence graph:
   *
   * FinancialAccountHold
   * └── FinancialAccount
   *
   * Rehydration does not emit domain events.
   */
  public static toDomain(
    record: FinancialAccountHoldWithAccount,
  ): FinancialAccountHoldAggregate {
    const entity = this.toEntity(record);

    return FinancialAccountHoldAggregate.rehydrate(entity);
  }

  // ===========================================================================
  // Prisma → Domain Entity
  // ===========================================================================

  /**
   * Maps a persisted Prisma FinancialAccountHold record into a
   * FinancialAccountHoldEntity.
   *
   * The owning FinancialAccount relation is required because the domain
   * preserves both the internal and public account identities.
   */
  public static toEntity(
    record: FinancialAccountHoldWithAccount,
  ): FinancialAccountHoldEntity {
    // -------------------------------------------------------------------------
    // Owning Financial Account
    // -------------------------------------------------------------------------

    const account = this.resolveAccount(
      record.accountId,
      record.account,
      record.publicId,
    );

    // -------------------------------------------------------------------------
    // Public Identity
    // -------------------------------------------------------------------------

    const publicId = new FinancialAccountHoldPublicId(record.publicId);

    // -------------------------------------------------------------------------
    // Held Amount
    // -------------------------------------------------------------------------

    const amount = FinancialAccountHeldAmount.create(record.amount);

    // -------------------------------------------------------------------------
    // Hold Status
    // -------------------------------------------------------------------------

    const status = FinancialAccountHoldStatus.create(
      toDomainHoldStatus(record.status),
    );

    // -------------------------------------------------------------------------
    // Business Reference
    // -------------------------------------------------------------------------

    /**
     * Prisma NULL values become domain undefined.
     *
     * The reference is reconstructed through its domain factory so all
     * reference validation remains centralized in the value object.
     */
    const reference =
      record.referenceType !== null && record.referencePublicId !== null
        ? FinancialHoldReference.create(
            record.referenceType,
            record.referencePublicId,
          )
        : undefined;

    // -------------------------------------------------------------------------
    // Expiry
    // -------------------------------------------------------------------------

    /**
     * Prisma NULL becomes domain undefined.
     */
    const expiresAt =
      record.expiresAt !== null
        ? FinancialHoldExpiry.create(record.expiresAt)
        : undefined;

    // -------------------------------------------------------------------------
    // Transaction References
    // -------------------------------------------------------------------------

    /**
     * Prisma NULL becomes domain undefined.
     *
     * Transaction public IDs are opaque cross-aggregate references.
     *
     * They are deliberately not converted into Financial Transaction
     * aggregates or domain entities here.
     */
    const holdTransactionPublicId = record.holdTransactionPublicId ?? undefined;

    const releaseTransactionPublicId =
      record.releaseTransactionPublicId ?? undefined;

    const captureTransactionPublicId =
      record.captureTransactionPublicId ?? undefined;

    // -------------------------------------------------------------------------
    // Entity
    // -------------------------------------------------------------------------

    return new FinancialAccountHoldEntity(
      {
        // ---------------------------------------------------------------------
        // Owning Financial Account
        // ---------------------------------------------------------------------

        accountId: new UniqueEntityId(account.id),

        accountPublicId: new FinancialAccountPublicId(account.publicId),

        // ---------------------------------------------------------------------
        // Held Amount
        // ---------------------------------------------------------------------

        amount,

        // ---------------------------------------------------------------------
        // Currency
        // ---------------------------------------------------------------------

        currency: record.currency,

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        status,

        // ---------------------------------------------------------------------
        // Business Reference
        // ---------------------------------------------------------------------

        reference,

        // ---------------------------------------------------------------------
        // Transaction References
        // ---------------------------------------------------------------------

        holdTransactionPublicId,

        releaseTransactionPublicId,

        captureTransactionPublicId,

        // ---------------------------------------------------------------------
        // Expiry
        // ---------------------------------------------------------------------

        expiresAt,

        // ---------------------------------------------------------------------
        // Lifecycle Timestamps
        // ---------------------------------------------------------------------

        releasedAt: record.releasedAt ?? undefined,

        capturedAt: record.capturedAt ?? undefined,

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

      // -----------------------------------------------------------------------
      // Public Domain Identity
      // -----------------------------------------------------------------------

      publicId,
    );
  }

  // ===========================================================================
  // Domain Entity → Prisma
  // ===========================================================================

  /**
   * Converts a FinancialAccountHoldEntity into its Prisma persistence shape.
   *
   * No database lookup is performed.
   *
   * The domain already contains the owning Financial Account's internal ID.
   */
  public static toPersistence(entity: FinancialAccountHoldEntity): {
    id: string;
    publicId: string;
    accountId: string;
    amount: number;
    currency: string;
    status: PrismaFinancialAccountHoldStatus;
    referenceType: string | null;
    referencePublicId: string | null;
    holdTransactionPublicId: string | null;
    releaseTransactionPublicId: string | null;
    captureTransactionPublicId: string | null;
    expiresAt: Date | null;
    releasedAt: Date | null;
    capturedAt: Date | null;
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
      // Owning Financial Account
      // -----------------------------------------------------------------------

      accountId: entity.accountId.toString(),

      // -----------------------------------------------------------------------
      // Held Amount
      // -----------------------------------------------------------------------

      amount: entity.amountValue,

      // -----------------------------------------------------------------------
      // Currency
      // -----------------------------------------------------------------------

      currency: entity.currency,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: entity.status.value,

      // -----------------------------------------------------------------------
      // Business Reference
      // -----------------------------------------------------------------------

      referenceType: entity.reference?.type ?? null,

      referencePublicId: entity.reference?.publicId ?? null,

      // -----------------------------------------------------------------------
      // Transaction References
      // -----------------------------------------------------------------------

      holdTransactionPublicId: entity.holdTransactionPublicId ?? null,

      releaseTransactionPublicId: entity.releaseTransactionPublicId ?? null,

      captureTransactionPublicId: entity.captureTransactionPublicId ?? null,

      // -----------------------------------------------------------------------
      // Expiry
      // -----------------------------------------------------------------------

      expiresAt: entity.expiresAt?.value ?? null,

      // -----------------------------------------------------------------------
      // Lifecycle Timestamps
      // -----------------------------------------------------------------------

      releasedAt: entity.releasedAt ?? null,

      capturedAt: entity.capturedAt ?? null,

      cancelledAt: entity.cancelledAt ?? null,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Aggregate → Prisma
  // ===========================================================================

  /**
   * Converts the complete FinancialAccountHoldAggregate into its Prisma
   * persistence structure.
   *
   * The aggregate currently contains one FinancialAccountHoldEntity.
   */
  public static aggregateToPersistence(
    aggregate: FinancialAccountHoldAggregate,
  ): FinancialAccountHoldPersistence {
    return {
      hold: this.toPersistence(aggregate.hold),
    };
  }

  // ===========================================================================
  // Prisma Component → Domain Entity
  // ===========================================================================

  /**
   * Maps a standalone Prisma FinancialAccountHold record and its owning
   * FinancialAccount into the domain entity.
   *
   * The owning FinancialAccount relation is required because the domain
   * entity preserves both:
   *
   *   accountId
   *   accountPublicId
   *
   * The mapper does not query Prisma.
   *
   * The repository is responsible for loading the relation before invoking
   * this method.
   *
   * Complete aggregate rehydration should use toDomain().
   */
  public static toDomainComponent(
    record: PrismaFinancialAccountHold,
    account: PrismaFinancialAccount,
  ): FinancialAccountHoldEntity {
    return this.toEntity({
      ...record,
      account,
    });
  }

  // ===========================================================================
  // Owning Financial Account Resolution
  // ===========================================================================

  /**
   * Resolves and validates the owning FinancialAccount relation.
   *
   * Persistence:
   *
   *   FinancialAccountHold.accountId
   *              │
   *              ▼
   *   FinancialAccount.id
   *
   * Domain:
   *
   *   accountId
   *   accountPublicId
   *
   * The mapper does not query Prisma.
   */
  private static resolveAccount(
    accountId: string,
    account: PrismaFinancialAccount | null | undefined,
    holdPublicId: string,
  ): PrismaFinancialAccount {
    // -------------------------------------------------------------------------
    // Relation Required
    // -------------------------------------------------------------------------

    if (account === undefined || account === null) {
      throw new Error(
        `Financial Account Hold "${holdPublicId}" cannot be rehydrated without its Financial Account relation.`,
      );
    }

    // -------------------------------------------------------------------------
    // Foreign-Key Consistency
    // -------------------------------------------------------------------------

    if (account.id !== accountId) {
      throw new Error(
        `Financial Account Hold "${holdPublicId}" contains an inconsistent Financial Account relation.`,
      );
    }

    // -------------------------------------------------------------------------
    // Valid Relation
    // -------------------------------------------------------------------------

    return account;
  }
}
