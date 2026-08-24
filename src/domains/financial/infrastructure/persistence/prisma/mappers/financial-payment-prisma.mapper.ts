// -----------------------------------------------------------------------------
// Financial Payment Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps the complete Financial Payment aggregate:
//
// FinancialPaymentAggregate
// ├── FinancialPaymentEntity
// └── FinancialPaymentAttemptEntity[]
//
// Persistence responsibilities:
//
// - Translate Prisma Financial Payment records into domain entities.
// - Resolve the owning Financial Account relationship.
// - Rehydrate all Financial Payment Attempts.
// - Preserve internal database identities.
// - Preserve public domain identities.
// - Preserve Financial Account ownership.
// - Preserve payment amount and currency.
// - Preserve payment lifecycle.
// - Preserve selected payment method identity.
// - Preserve provider execution attempts.
// - Preserve originating business references.
// - Preserve resulting Financial Transaction reference.
// - Translate the aggregate back into persistence structures.
//
// IMPORTANT:
//
// Prisma stores the Financial Payment foreign key through:
//
//   FinancialPayment.accountId
//
// The domain FinancialPaymentEntity stores:
//
//   accountId -> FinancialAccountPublicId
//
// Therefore the mapper does NOT resolve a public account identity back into
// an internal database ID.
//
// Repository/application infrastructure must supply the internal account ID
// when persistence requires it.
//
// The mapper does NOT:
//
// - Execute provider APIs.
// - Communicate with external providers.
// - Execute payments.
// - Move money.
// - Modify Financial Account balances.
// - Create Financial Transactions.
// - Post ledger entries.
// - Perform settlement.
// - Persist itself.
// - Query Prisma.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type {
  FinancialAccount as PrismaFinancialAccount,
  FinancialPayment as PrismaFinancialPayment,
  FinancialPaymentAttempt as PrismaFinancialPaymentAttempt,
  FinancialPaymentAttemptStatus as PrismaFinancialPaymentAttemptStatus,
  FinancialPaymentMethod as PrismaFinancialPaymentMethod,
  FinancialPaymentStatus as PrismaFinancialPaymentStatus,
} from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { FinancialPaymentAggregate } from '../../../../domain/aggregates/financial-payment.aggregate';

// -----------------------------------------------------------------------------
// Entities
// -----------------------------------------------------------------------------

import { FinancialPaymentEntity } from '../../../../domain/entities/financial-payment.entity';

import { FinancialPaymentAttemptEntity } from '../../../../domain/entities/financial-payment-attempt.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  Currency,
  FinancialAccountPublicId,
  FinancialPaymentAttemptPublicId,
  FinancialPaymentMethodPublicId,
  FinancialPaymentPublicId,
  FinancialPaymentStatus,
  FinancialPaymentAttemptStatus,
  FinancialProvider,
  FinancialProviderReference,
  FinancialReferencePublicId,
  FinancialReferenceType,
  Money,
} from '../../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Domain Value Types
// -----------------------------------------------------------------------------

import type { FinancialPaymentAttemptStatusValue } from '../../../../domain/value-objects';

// =============================================================================
// Prisma → Domain Enum Conversion
// =============================================================================

/**
 * Converts a persisted Prisma FinancialPaymentAttemptStatus into the
 * corresponding domain FinancialPaymentAttemptStatusValue.
 *
 * Infrastructure enum types must not leak into the domain layer.
 */
function toDomainPaymentAttemptStatus(
  value: PrismaFinancialPaymentAttemptStatus,
): FinancialPaymentAttemptStatusValue {
  switch (value) {
    case 'PENDING':
      return 'PENDING';

    case 'PROCESSING':
      return 'PROCESSING';

    case 'SUCCEEDED':
      return 'SUCCEEDED';

    case 'FAILED':
      return 'FAILED';

    case 'CANCELLED':
      return 'CANCELLED';

    case 'EXPIRED':
      return 'EXPIRED';

    default:
      throw new Error(
        `Invalid persisted Financial Payment Attempt status "${String(value)}".`,
      );
  }
}

// =============================================================================
// Prisma → Domain Payment Status
// =============================================================================

/**
 * Converts a persisted Prisma FinancialPaymentStatus into the corresponding
 * domain FinancialPaymentStatus value object.
 *
 * Infrastructure enum values are translated at the persistence boundary.
 */
function toDomainPaymentStatus(
  value: PrismaFinancialPaymentStatus,
): FinancialPaymentStatus {
  switch (value) {
    case 'PENDING':
      return FinancialPaymentStatus.create('PENDING');

    case 'PROCESSING':
      return FinancialPaymentStatus.create('PROCESSING');

    case 'SUCCEEDED':
      return FinancialPaymentStatus.create('SUCCEEDED');

    case 'FAILED':
      return FinancialPaymentStatus.create('FAILED');

    case 'CANCELLED':
      return FinancialPaymentStatus.create('CANCELLED');

    case 'EXPIRED':
      return FinancialPaymentStatus.create('EXPIRED');

    default:
      throw new Error(
        `Invalid persisted Financial Payment status "${String(value)}".`,
      );
  }
}

// =============================================================================
// Prisma Graph Types
// =============================================================================

/**
 * Prisma Financial Payment record with the complete domain rehydration graph.
 *
 * Required graph:
 *
 * FinancialPayment
 * ├── FinancialAccount
 * ├── FinancialPaymentMethod?
 * └── FinancialPaymentAttempt[]
 *
 * The payment method relation is optional because methodId itself is nullable.
 *
 * When methodId is present, the relation MUST also be loaded.
 */
export type FinancialPaymentWithRelations = PrismaFinancialPayment & {
  account: PrismaFinancialAccount | null;

  method: PrismaFinancialPaymentMethod | null;

  attempts: PrismaFinancialPaymentAttempt[];
};

// =============================================================================
// Persistence Types
// =============================================================================

/**
 * Persistence structure for a Financial Payment aggregate.
 *
 * The aggregate contains:
 *
 * - one FinancialPaymentEntity
 * - zero or more FinancialPaymentAttemptEntity children
 */
export interface FinancialPaymentPersistence {
  payment: ReturnType<typeof FinancialPaymentPrismaMapper.toPersistence>;

  attempts: ReturnType<
    typeof FinancialPaymentPrismaMapper.attemptToPersistence
  >[];
}

// =============================================================================
// Mapper
// =============================================================================

export class FinancialPaymentPrismaMapper {
  // ===========================================================================
  // Prisma → Aggregate
  // ===========================================================================

  /**
   * Rehydrates the complete Financial Payment aggregate.
   *
   * Required persistence graph:
   *
   * FinancialPayment
   * ├── FinancialAccount
   * ├── FinancialPaymentMethod?
   * └── FinancialPaymentAttempt[]
   *
   * Rehydration does not emit domain events.
   */
  public static toDomain(
    record: FinancialPaymentWithRelations,
  ): FinancialPaymentAggregate {
    const payment = this.toEntity(record);

    return FinancialPaymentAggregate.rehydrate(payment);
  }

  // ===========================================================================
  // Prisma → Domain Entity
  // ===========================================================================

  /**
   * Maps a persisted Prisma FinancialPayment record and its attempts into
   * the FinancialPaymentEntity.
   *
   * The owning FinancialAccount relation is required because the domain stores
   * the account's public identity rather than the internal persistence ID.
   */
  public static toEntity(
    record: FinancialPaymentWithRelations,
  ): FinancialPaymentEntity {
    // -------------------------------------------------------------------------
    // Owning Financial Account
    // -------------------------------------------------------------------------

    const account = this.resolveAccount(
      record.accountId,
      record.account,
      record.publicId,
    );

    // -------------------------------------------------------------------------
    // Payment Public Identity
    // -------------------------------------------------------------------------

    const publicId = new FinancialPaymentPublicId(record.publicId);

    // -------------------------------------------------------------------------
    // Money
    // -------------------------------------------------------------------------

    /**
     * Prisma:
     *
     *   amount   -> Int
     *   currency -> String
     *
     * Domain:
     *
     *   amount -> Money
     *   currency -> Currency
     *
     * Currency conversion MUST happen at the persistence boundary.
     */
    const amount = Money.create(
      record.amount,
      Currency.create(record.currency),
    );

    // -------------------------------------------------------------------------
    // Payment Status
    // -------------------------------------------------------------------------

    const status = toDomainPaymentStatus(record.status);

    // -------------------------------------------------------------------------
    // Payment Method
    // -------------------------------------------------------------------------

    const methodId =
      record.methodId !== null
        ? this.resolvePaymentMethodPublicId(
            record.methodId,
            record.method,
            record.publicId,
          )
        : undefined;

    // -------------------------------------------------------------------------
    // Business Reference
    // -------------------------------------------------------------------------

    const reference = this.resolveReference(
      record.referenceType,
      record.referencePublicId,
      record.publicId,
    );

    // -------------------------------------------------------------------------
    // Attempts
    // -------------------------------------------------------------------------

    const attempts = record.attempts.map((attempt) =>
      this.attemptToEntity(attempt),
    );

    // -------------------------------------------------------------------------
    // Entity
    // -------------------------------------------------------------------------

    return new FinancialPaymentEntity(
      {
        // ---------------------------------------------------------------------
        // Owning Financial Account
        // ---------------------------------------------------------------------

        accountId: new FinancialAccountPublicId(account.publicId),

        // ---------------------------------------------------------------------
        // Amount
        // ---------------------------------------------------------------------

        amount,

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        status,

        // ---------------------------------------------------------------------
        // Payment Method
        // ---------------------------------------------------------------------

        methodId,

        // ---------------------------------------------------------------------
        // Attempts
        // ---------------------------------------------------------------------

        attempts,

        // ---------------------------------------------------------------------
        // Resulting Financial Transaction
        // ---------------------------------------------------------------------

        transactionPublicId: record.transactionPublicId ?? undefined,

        // ---------------------------------------------------------------------
        // Business Reference
        // ---------------------------------------------------------------------

        referenceType: reference.referenceType,

        referencePublicId: reference.referencePublicId,

        // ---------------------------------------------------------------------
        // Lifecycle Timestamps
        // ---------------------------------------------------------------------

        initiatedAt: record.initiatedAt,

        completedAt: record.completedAt ?? undefined,

        failedAt: record.failedAt ?? undefined,

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
  // Prisma → Payment Attempt Entity
  // ===========================================================================

  /**
   * Maps a persisted Prisma FinancialPaymentAttempt into a child domain
   * FinancialPaymentAttemptEntity.
   *
   * The attempt remains structurally owned by its parent payment aggregate.
   */
  public static attemptToEntity(
    record: PrismaFinancialPaymentAttempt,
  ): FinancialPaymentAttemptEntity {
    // -------------------------------------------------------------------------
    // Money
    // -------------------------------------------------------------------------

    /**
     * Prisma stores currency as a string.
     *
     * The domain Money object requires Currency.
     */
    const amount = Money.create(
      record.amount,
      Currency.create(record.currency),
    );

    // -------------------------------------------------------------------------
    // Status
    // -------------------------------------------------------------------------

    const status = FinancialPaymentAttemptStatus.create(
      toDomainPaymentAttemptStatus(record.status),
    );

    // -------------------------------------------------------------------------
    // Provider
    // -------------------------------------------------------------------------

    const provider = FinancialProvider.create(record.provider);

    // -------------------------------------------------------------------------
    // Provider Reference
    // -------------------------------------------------------------------------

    const providerReference =
      record.providerReference !== null
        ? FinancialProviderReference.create(record.providerReference)
        : undefined;

    // -------------------------------------------------------------------------
    // Entity
    // -------------------------------------------------------------------------

    return new FinancialPaymentAttemptEntity(
      {
        // ---------------------------------------------------------------------
        // Parent Aggregate Identity
        // ---------------------------------------------------------------------

        paymentId: new UniqueEntityId(record.paymentId),

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        status,

        // ---------------------------------------------------------------------
        // Provider
        // ---------------------------------------------------------------------

        provider,

        providerReference,

        // ---------------------------------------------------------------------
        // Amount
        // ---------------------------------------------------------------------

        amount,

        // ---------------------------------------------------------------------
        // Failure Information
        // ---------------------------------------------------------------------

        failureCode: record.failureCode ?? undefined,

        failureMessage: record.failureMessage ?? undefined,

        // ---------------------------------------------------------------------
        // Execution Timestamps
        // ---------------------------------------------------------------------

        startedAt: record.startedAt ?? undefined,

        completedAt: record.completedAt ?? undefined,

        failedAt: record.failedAt ?? undefined,

        // ---------------------------------------------------------------------
        // IMPORTANT:
        //
        // The current Prisma FinancialPaymentAttempt model does not contain
        // cancelledAt or expiredAt columns.
        //
        // Therefore these values cannot currently be rehydrated from
        // persistence.
        // ---------------------------------------------------------------------

        cancelledAt: undefined,

        expiredAt: undefined,

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

      new FinancialPaymentAttemptPublicId(record.publicId),
    );
  }

  // ===========================================================================
  // Domain Entity → Prisma
  // ===========================================================================

  /**
   * Converts a FinancialPaymentEntity into its persistence shape.
   *
   * IMPORTANT:
   *
   * FinancialPaymentEntity.accountId contains the PUBLIC account identity.
   *
   * Prisma FinancialPayment.accountId requires the INTERNAL FinancialAccount.id.
   *
   * Therefore this method deliberately receives the already-resolved internal
   * account ID instead of performing a database lookup.
   *
   * Likewise, methodId is supplied separately because the domain stores the
   * payment method public identity while Prisma stores its internal ID.
   */
  public static toPersistence(
    entity: FinancialPaymentEntity,
    accountId: string,
    methodId?: string,
  ): {
    id: string;
    publicId: string;
    accountId: string;
    amount: number;
    currency: string;
    status: PrismaFinancialPaymentStatus;
    methodId: string | null;
    transactionPublicId: string | null;
    referenceType: string | null;
    referencePublicId: string | null;
    initiatedAt: Date;
    completedAt: Date | null;
    failedAt: Date | null;
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

      accountId,

      // -----------------------------------------------------------------------
      // Amount
      // -----------------------------------------------------------------------

      amount: entity.amount.amount,

      /**
       * Domain Currency -> Prisma String.
       *
       * This is the inverse of Currency.create(record.currency).
       */
      currency: entity.amount.currency.value,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: entity.status.value,

      // -----------------------------------------------------------------------
      // Payment Method
      // -----------------------------------------------------------------------

      /**
       * The domain stores the payment method PUBLIC ID.
       *
       * Prisma requires the payment method INTERNAL ID.
       *
       * The repository/application persistence layer resolves this ID before
       * calling the mapper.
       */
      methodId: methodId ?? null,

      // -----------------------------------------------------------------------
      // Resulting Transaction
      // -----------------------------------------------------------------------

      transactionPublicId: entity.transactionPublicId ?? null,

      // -----------------------------------------------------------------------
      // Business Reference
      // -----------------------------------------------------------------------

      referenceType: entity.referenceType?.value ?? null,

      referencePublicId: entity.referencePublicId?.value ?? null,

      // -----------------------------------------------------------------------
      // Lifecycle Timestamps
      // -----------------------------------------------------------------------

      initiatedAt: entity.initiatedAt,

      completedAt: entity.completedAt ?? null,

      failedAt: entity.failedAt ?? null,

      cancelledAt: entity.cancelledAt ?? null,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Payment Attempt → Prisma
  // ===========================================================================

  /**
   * Converts a FinancialPaymentAttemptEntity into its Prisma persistence
   * structure.
   *
   * The current Prisma schema does not persist cancelledAt or expiredAt.
   */
  public static attemptToPersistence(entity: FinancialPaymentAttemptEntity): {
    id: string;
    publicId: string;
    paymentId: string;
    status: PrismaFinancialPaymentAttemptStatus;
    provider: string;
    providerReference: string | null;
    amount: number;
    currency: string;
    failureCode: string | null;
    failureMessage: string | null;
    startedAt: Date | null;
    completedAt: Date | null;
    failedAt: Date | null;
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
      // Parent Payment
      // -----------------------------------------------------------------------

      paymentId: entity.paymentId.toString(),

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: entity.status.value,

      // -----------------------------------------------------------------------
      // Provider
      // -----------------------------------------------------------------------

      provider: entity.provider.value,

      providerReference: entity.providerReference?.value ?? null,

      // -----------------------------------------------------------------------
      // Amount
      // -----------------------------------------------------------------------

      amount: entity.amount.amount,

      /**
       * Domain Currency -> Prisma String.
       */
      currency: entity.amount.currency.value,

      // -----------------------------------------------------------------------
      // Failure
      // -----------------------------------------------------------------------

      failureCode: entity.failureCode ?? null,

      failureMessage: entity.failureMessage ?? null,

      // -----------------------------------------------------------------------
      // Execution Timestamps
      // -----------------------------------------------------------------------

      startedAt: entity.startedAt ?? null,

      completedAt: entity.completedAt ?? null,

      failedAt: entity.failedAt ?? null,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Aggregate → Persistence
  // ===========================================================================

  /**
   * Converts the complete FinancialPaymentAggregate into persistence
   * structures.
   *
   * The internal FinancialAccount ID must be supplied by the repository or
   * persistence application service because the domain intentionally stores
   * only the account public identity.
   *
   * The internal FinancialPaymentMethod ID is likewise supplied separately
   * when a payment method is attached.
   */
  public static aggregateToPersistence(
    aggregate: FinancialPaymentAggregate,
    accountId: string,
    methodId?: string,
  ): FinancialPaymentPersistence {
    return {
      payment: this.toPersistence(aggregate.payment, accountId, methodId),

      attempts: aggregate.attempts.map((attempt) =>
        this.attemptToPersistence(attempt),
      ),
    };
  }

  // ===========================================================================
  // Prisma Component → Domain Entity
  // ===========================================================================

  /**
   * Maps a standalone Prisma FinancialPayment record and its complete
   * persistence relationships into the FinancialPaymentEntity.
   *
   * The owning FinancialAccount is required.
   *
   * Attempts may be supplied as an empty collection when the repository
   * intentionally loads the payment without children.
   */
  public static toDomainComponent(
    record: PrismaFinancialPayment,
    account: PrismaFinancialAccount,
    attempts: PrismaFinancialPaymentAttempt[] = [],
    method?: PrismaFinancialPaymentMethod | null,
  ): FinancialPaymentEntity {
    return this.toEntity({
      ...record,
      account,
      method: method ?? null,
      attempts,
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
   *   FinancialPayment.accountId
   *              │
   *              ▼
   *   FinancialAccount.id
   *
   * Domain:
   *
   *   FinancialPayment.accountId
   *              │
   *              ▼
   *   FinancialAccount.publicId
   *
   * The mapper does not query Prisma.
   */
  private static resolveAccount(
    accountId: string,
    account: PrismaFinancialAccount | null,
    paymentPublicId: string,
  ): PrismaFinancialAccount {
    // -------------------------------------------------------------------------
    // Relation Required
    // -------------------------------------------------------------------------

    if (account === null) {
      throw new Error(
        `Financial Payment "${paymentPublicId}" cannot be rehydrated without its Financial Account relation.`,
      );
    }

    // -------------------------------------------------------------------------
    // Foreign-Key Consistency
    // -------------------------------------------------------------------------

    if (account.id !== accountId) {
      throw new Error(
        `Financial Payment "${paymentPublicId}" contains an inconsistent Financial Account relation.`,
      );
    }

    // -------------------------------------------------------------------------
    // Valid Relation
    // -------------------------------------------------------------------------

    return account;
  }

  // ===========================================================================
  // Payment Method Public Identity Resolution
  // ===========================================================================

  /**
   * Resolves and validates the payment method public identity.
   *
   * Persistence:
   *
   *   FinancialPayment.methodId
   *              │
   *              ▼
   *   FinancialPaymentMethod.id
   *
   * Domain:
   *
   *   FinancialPayment.methodId
   *              │
   *              ▼
   *   FinancialPaymentMethod.publicId
   *
   * The mapper does not query Prisma.
   */
  private static resolvePaymentMethodPublicId(
    methodId: string,
    method: PrismaFinancialPaymentMethod | null,
    paymentPublicId: string,
  ): FinancialPaymentMethodPublicId {
    // -------------------------------------------------------------------------
    // Relation Required
    // -------------------------------------------------------------------------

    if (method === null) {
      throw new Error(
        `Financial Payment "${paymentPublicId}" contains payment method "${methodId}", but the FinancialPaymentMethod relation was not loaded.`,
      );
    }

    // -------------------------------------------------------------------------
    // Foreign-Key Consistency
    // -------------------------------------------------------------------------

    if (method.id !== methodId) {
      throw new Error(
        `Financial Payment "${paymentPublicId}" contains an inconsistent Financial Payment Method relation.`,
      );
    }

    // -------------------------------------------------------------------------
    // Public Identity
    // -------------------------------------------------------------------------

    return new FinancialPaymentMethodPublicId(method.publicId);
  }

  // ===========================================================================
  // Business Reference Resolution
  // ===========================================================================

  /**
   * Reconstructs the optional business reference.
   *
   * referenceType and referencePublicId are an atomic pair.
   */
  private static resolveReference(
    referenceType: string | null,
    referencePublicId: string | null,
    paymentPublicId: string,
  ): {
    referenceType: FinancialReferenceType | undefined;
    referencePublicId: FinancialReferencePublicId | undefined;
  } {
    const hasType = referenceType !== null;

    const hasPublicId = referencePublicId !== null;

    // -------------------------------------------------------------------------
    // Both absent
    // -------------------------------------------------------------------------

    if (!hasType && !hasPublicId) {
      return {
        referenceType: undefined,
        referencePublicId: undefined,
      };
    }

    // -------------------------------------------------------------------------
    // Partial reference is invalid
    // -------------------------------------------------------------------------

    if (!hasType || !hasPublicId) {
      throw new Error(
        `Financial Payment "${paymentPublicId}" contains an incomplete business reference.`,
      );
    }

    // -------------------------------------------------------------------------
    // Complete reference
    // -------------------------------------------------------------------------

    return {
      referenceType: FinancialReferenceType.create(referenceType),

      referencePublicId: FinancialReferencePublicId.create(referencePublicId),
    };
  }
}
