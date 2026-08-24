// -----------------------------------------------------------------------------
// Financial Payment Method Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps the complete Financial Payment Method aggregate:
//
// FinancialPaymentMethodAggregate
// └── FinancialPaymentMethodEntity
//
// Persistence responsibilities:
//
// - Translate Prisma Financial Payment Method records into domain entities.
// - Resolve the owning Financial Account relationship.
// - Preserve internal database identities.
// - Preserve public domain identities.
// - Preserve Financial Account ownership.
// - Preserve payment-method classification.
// - Preserve external provider identity.
// - Preserve provider-issued references.
// - Preserve safe display metadata.
// - Preserve default/active lifecycle state.
// - Preserve lifecycle timestamps.
// - Rehydrate the complete Financial Payment Method aggregate.
// - Translate the complete aggregate into Prisma persistence structures.
//
// IMPORTANT:
//
// Prisma stores the owning Financial Account relationship through:
//
//   FinancialPaymentMethod.accountId
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
// - Execute provider API calls.
// - Register payment instruments with providers.
// - Tokenize payment credentials.
// - Store raw payment credentials.
// - Execute Financial Payments.
// - Move money.
// - Modify Financial Account balances.
// - Modify sibling Financial Payment Methods.
// - Coordinate the account-level default-payment-method invariant.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type {
  FinancialAccount as PrismaFinancialAccount,
  FinancialPaymentMethod as PrismaFinancialPaymentMethod,
  FinancialPaymentMethodType as PrismaFinancialPaymentMethodType,
} from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { FinancialPaymentMethodAggregate } from '../../../../domain/aggregates/financial-payment-method.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { FinancialPaymentMethodEntity } from '../../../../domain/entities/financial-payment-method.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  FinancialAccountPublicId,
  FinancialPaymentMethodPublicId,
  FinancialPaymentMethodType,
  FinancialProvider,
  FinancialProviderReference,
} from '../../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Domain Value Types
// -----------------------------------------------------------------------------

import type { FinancialPaymentMethodTypeValue } from '../../../../domain/value-objects';

// =============================================================================
// Prisma → Domain Enum Conversion
// =============================================================================

/**
 * Converts a persisted Prisma FinancialPaymentMethodType into the
 * corresponding domain FinancialPaymentMethodTypeValue.
 *
 * Infrastructure enum types must not leak into the domain layer.
 */
function toDomainPaymentMethodType(
  value: PrismaFinancialPaymentMethodType,
): FinancialPaymentMethodTypeValue {
  switch (value) {
    case 'MOBILE_MONEY':
      return 'MOBILE_MONEY';

    case 'BANK':
      return 'BANK';

    case 'CARD':
      return 'CARD';

    case 'WALLET':
      return 'WALLET';

    case 'OTHER':
      return 'OTHER';

    default:
      throw new Error(
        `Invalid persisted Financial Payment Method type "${String(value)}".`,
      );
  }
}

// =============================================================================
// Prisma Graph Types
// =============================================================================

/**
 * Prisma Financial Payment Method record with its owning Financial Account.
 *
 * The relation is optional at the Prisma TypeScript level because a repository
 * may intentionally load the root record without relations.
 *
 * The FinancialPaymentMethodEntity, however, preserves both:
 *
 *   accountId
 *   accountPublicId
 *
 * Therefore complete domain rehydration requires the owning account.
 */
export type FinancialPaymentMethodWithAccount = PrismaFinancialPaymentMethod & {
  account?: PrismaFinancialAccount | null;
};

// =============================================================================
// Persistence Types
// =============================================================================

/**
 * Persistence structure for a Financial Payment Method aggregate.
 *
 * The aggregate currently contains exactly one entity.
 */
export interface FinancialPaymentMethodPersistence {
  paymentMethod: ReturnType<
    typeof FinancialPaymentMethodPrismaMapper.toPersistence
  >;
}

// =============================================================================
// Mapper
// =============================================================================

export class FinancialPaymentMethodPrismaMapper {
  // ===========================================================================
  // Prisma → Aggregate
  // ===========================================================================

  /**
   * Rehydrates the complete Financial Payment Method aggregate.
   *
   * Required persistence graph:
   *
   * FinancialPaymentMethod
   * └── FinancialAccount
   *
   * Rehydration does not emit domain events.
   */
  public static toDomain(
    record: FinancialPaymentMethodWithAccount,
  ): FinancialPaymentMethodAggregate {
    const entity = this.toEntity(record);

    return FinancialPaymentMethodAggregate.rehydrate(entity);
  }

  // ===========================================================================
  // Prisma → Domain Entity
  // ===========================================================================

  /**
   * Maps a persisted Prisma FinancialPaymentMethod record into a
   * FinancialPaymentMethodEntity.
   *
   * The owning FinancialAccount relation is required because the domain
   * preserves both the internal and public account identities.
   */
  public static toEntity(
    record: FinancialPaymentMethodWithAccount,
  ): FinancialPaymentMethodEntity {
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

    const publicId = new FinancialPaymentMethodPublicId(record.publicId);

    // -------------------------------------------------------------------------
    // Payment Method Type
    // -------------------------------------------------------------------------

    const type = FinancialPaymentMethodType.create(
      toDomainPaymentMethodType(record.type),
    );

    // -------------------------------------------------------------------------
    // External Provider
    // -------------------------------------------------------------------------

    const provider = FinancialProvider.create(record.provider);

    // -------------------------------------------------------------------------
    // Provider Reference
    // -------------------------------------------------------------------------

    /**
     * Prisma NULL becomes domain undefined.
     *
     * Provider references are reconstructed through the domain factory so
     * validation remains centralized in the value object.
     */
    const providerReference =
      record.providerReference !== null
        ? FinancialProviderReference.create(record.providerReference)
        : undefined;

    // -------------------------------------------------------------------------
    // Safe Display Metadata
    // -------------------------------------------------------------------------

    const displayName = record.displayName ?? undefined;

    const lastFour = record.lastFour ?? undefined;

    // -------------------------------------------------------------------------
    // Entity
    // -------------------------------------------------------------------------

    return new FinancialPaymentMethodEntity(
      {
        // ---------------------------------------------------------------------
        // Owning Financial Account
        // ---------------------------------------------------------------------

        accountId: new UniqueEntityId(account.id),

        accountPublicId: new FinancialAccountPublicId(account.publicId),

        // ---------------------------------------------------------------------
        // Classification
        // ---------------------------------------------------------------------

        type,

        // ---------------------------------------------------------------------
        // External Provider
        // ---------------------------------------------------------------------

        provider,

        // ---------------------------------------------------------------------
        // Provider Reference
        // ---------------------------------------------------------------------

        providerReference,

        // ---------------------------------------------------------------------
        // Safe Display Metadata
        // ---------------------------------------------------------------------

        displayName,

        lastFour,

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        isDefault: record.isDefault,

        isActive: record.isActive,

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
   * Converts a FinancialPaymentMethodEntity into its Prisma persistence shape.
   *
   * No database lookup is performed.
   *
   * The domain already contains the owning FinancialAccount's internal ID.
   */
  public static toPersistence(entity: FinancialPaymentMethodEntity): {
    id: string;
    publicId: string;
    accountId: string;
    type: PrismaFinancialPaymentMethodType;
    provider: string;
    providerReference: string | null;
    displayName: string | null;
    lastFour: string | null;
    isDefault: boolean;
    isActive: boolean;
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
      // Classification
      // -----------------------------------------------------------------------

      type: entity.type.value,

      // -----------------------------------------------------------------------
      // External Provider
      // -----------------------------------------------------------------------

      provider: entity.provider.value,

      // -----------------------------------------------------------------------
      // Provider Reference
      // -----------------------------------------------------------------------

      providerReference: entity.providerReference?.value ?? null,

      // -----------------------------------------------------------------------
      // Safe Display Metadata
      // -----------------------------------------------------------------------

      displayName: entity.displayName ?? null,

      lastFour: entity.lastFour ?? null,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      isDefault: entity.isDefault,

      isActive: entity.isActive,

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
   * Converts the complete FinancialPaymentMethodAggregate into its Prisma
   * persistence structure.
   *
   * The aggregate currently contains one FinancialPaymentMethodEntity.
   */
  public static aggregateToPersistence(
    aggregate: FinancialPaymentMethodAggregate,
  ): FinancialPaymentMethodPersistence {
    return {
      paymentMethod: this.toPersistence(aggregate.paymentMethod),
    };
  }

  // ===========================================================================
  // Prisma Component → Domain Entity
  // ===========================================================================

  /**
   * Maps a standalone Prisma FinancialPaymentMethod record and its owning
   * FinancialAccount into the domain entity.
   *
   * The owning FinancialAccount relation is required because the domain entity
   * preserves both:
   *
   *   accountId
   *   accountPublicId
   *
   * The mapper does not query Prisma. The repository is responsible for
   * loading the relation before invoking this method.
   *
   * Complete aggregate rehydration should use toDomain().
   */
  public static toDomainComponent(
    record: PrismaFinancialPaymentMethod,
    account: PrismaFinancialAccount,
  ): FinancialPaymentMethodEntity {
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
   *   FinancialPaymentMethod.accountId
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
    paymentMethodPublicId: string,
  ): PrismaFinancialAccount {
    // -------------------------------------------------------------------------
    // Relation Required
    // -------------------------------------------------------------------------

    if (account === undefined || account === null) {
      throw new Error(
        `Financial Payment Method "${paymentMethodPublicId}" cannot be rehydrated without its Financial Account relation.`,
      );
    }

    // -------------------------------------------------------------------------
    // Foreign-Key Consistency
    // -------------------------------------------------------------------------

    if (account.id !== accountId) {
      throw new Error(
        `Financial Payment Method "${paymentMethodPublicId}" contains an inconsistent Financial Account relation.`,
      );
    }

    // -------------------------------------------------------------------------
    // Valid Relation
    // -------------------------------------------------------------------------

    return account;
  }
}
