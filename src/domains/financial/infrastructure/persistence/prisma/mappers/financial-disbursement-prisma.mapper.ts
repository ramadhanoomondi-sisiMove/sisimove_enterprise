// -----------------------------------------------------------------------------
// Financial Disbursement Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps the complete Financial Disbursement aggregate:
//
// FinancialDisbursementAggregate
// └── FinancialDisbursementEntity
//     ├── FinancialAccountWithdrawalDestination (immutable snapshot)
//     └── FinancialDisbursementAttemptEntity[]
//
// Persistence responsibilities:
//
// - Translate Prisma Financial Disbursement records into domain entities.
// - Rehydrate all Financial Disbursement Attempts.
// - Rehydrate the immutable withdrawal destination snapshot.
// - Preserve internal and public identities.
// - Preserve source Financial Account internal and public identities.
// - Preserve the originating Financial Account Withdrawal public ID.
// - Preserve destination type and value exactly as captured.
// - Preserve amount, currency, lifecycle, attempts and business references.
// - Translate the aggregate back into persistence structures.
//
// The disbursement does not reference a configured destination record.
// FinancialDisbursementDestinationEntity remains a separate Financial Account
// boundary entity; its standalone mapper methods are retained for saved
// destination workflows, but it is not part of this aggregate graph.
//
// The mapper does NOT:
//
// - Query Prisma.
// - Execute provider APIs or communicate with external providers.
// - Move money, modify account balances, create transactions or post ledger.
// - Select providers or destinations.
// - Decide retry policy.
// - Persist itself.
//
// Repository/application infrastructure remains responsible for database
// operations and transaction boundaries.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type {
  FinancialAccount as PrismaFinancialAccount,
  FinancialDisbursement as PrismaFinancialDisbursement,
  FinancialDisbursementAttempt as PrismaFinancialDisbursementAttempt,
  FinancialDisbursementAttemptStatus as PrismaFinancialDisbursementAttemptStatus,
  FinancialDisbursementDestination as PrismaFinancialDisbursementDestination,
  FinancialDisbursementDestinationType as PrismaFinancialDisbursementDestinationType,
  FinancialDisbursementStatus as PrismaFinancialDisbursementStatus,
} from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { FinancialDisbursementAggregate } from '../../../../domain/aggregates/financial-disbursement.aggregate';

// -----------------------------------------------------------------------------
// Entities
// -----------------------------------------------------------------------------

import { FinancialDisbursementEntity } from '../../../../domain/entities/financial-disbursement.entity';

import { FinancialDisbursementAttemptEntity } from '../../../../domain/entities/financial-disbursement-attempt.entity';

import { FinancialDisbursementDestinationEntity } from '../../../../domain/entities/financial-disbursement-destination.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  Currency,
  FinancialAccountPublicId,
  FinancialAccountWithdrawalDestination,
  FinancialDisbursementAttemptPublicId,
  FinancialDisbursementAttemptStatus,
  FinancialDisbursementDestinationPublicId,
  FinancialDisbursementDestinationType,
  FinancialDisbursementPublicId,
  FinancialDisbursementStatus,
  FinancialProvider,
  FinancialProviderReference,
  FinancialReferencePublicId,
  FinancialReferenceType,
  Money,
} from '../../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Domain Value Types
// -----------------------------------------------------------------------------

import type { FinancialDisbursementDestinationTypeValue } from '../../../../domain/value-objects';
import {
  FinancialDisbursementAttemptStatusValue,
  FinancialDisbursementStatusValue,
} from '../../../../domain/value-objects';

// =============================================================================
// Prisma → Domain Disbursement Status
// =============================================================================

/**
 * Converts a persisted Prisma FinancialDisbursementStatus into the
 * corresponding domain FinancialDisbursementStatusValue.
 *
 * IMPORTANT:
 *
 * FinancialDisbursementStatusValue is a domain enum.
 *
 * Therefore this mapper MUST return the enum members rather than raw string
 * literals. This prevents Prisma infrastructure enum values from leaking into
 * the domain layer while also preserving strict TypeScript compatibility.
 */
function toDomainDisbursementStatus(
  value: PrismaFinancialDisbursementStatus,
): FinancialDisbursementStatusValue {
  switch (value) {
    case 'PENDING':
      return FinancialDisbursementStatusValue.PENDING;

    case 'PROCESSING':
      return FinancialDisbursementStatusValue.PROCESSING;

    case 'COMPLETED':
      return FinancialDisbursementStatusValue.COMPLETED;

    case 'FAILED':
      return FinancialDisbursementStatusValue.FAILED;

    case 'CANCELLED':
      return FinancialDisbursementStatusValue.CANCELLED;

    default:
      throw new Error(
        `Invalid persisted Financial Disbursement status "${String(value)}".`,
      );
  }
}

// =============================================================================
// Prisma → Domain Attempt Status
// =============================================================================

/**
 * Converts a persisted Prisma FinancialDisbursementAttemptStatus into the
 * corresponding domain FinancialDisbursementAttemptStatusValue.
 *
 * IMPORTANT:
 *
 * FinancialDisbursementAttemptStatusValue is also a domain enum.
 *
 * Return the enum members explicitly rather than raw string literals so the
 * persistence boundary remains strictly typed.
 */
function toDomainDisbursementAttemptStatus(
  value: PrismaFinancialDisbursementAttemptStatus,
): FinancialDisbursementAttemptStatusValue {
  switch (value) {
    case 'PENDING':
      return FinancialDisbursementAttemptStatusValue.PENDING;

    case 'PROCESSING':
      return FinancialDisbursementAttemptStatusValue.PROCESSING;

    case 'SUCCEEDED':
      return FinancialDisbursementAttemptStatusValue.SUCCEEDED;

    case 'FAILED':
      return FinancialDisbursementAttemptStatusValue.FAILED;

    case 'CANCELLED':
      return FinancialDisbursementAttemptStatusValue.CANCELLED;

    default:
      throw new Error(
        `Invalid persisted Financial Disbursement Attempt status "${String(value)}".`,
      );
  }
}

// =============================================================================
// Prisma → Domain Destination Type
// =============================================================================

/**
 * Converts a persisted Prisma FinancialDisbursementDestinationType into the
 * corresponding domain FinancialDisbursementDestinationTypeValue.
 */
function toDomainDestinationType(
  value: PrismaFinancialDisbursementDestinationType,
): FinancialDisbursementDestinationTypeValue {
  switch (value) {
    case 'MOBILE_MONEY':
      return 'MOBILE_MONEY';

    case 'BANK_ACCOUNT':
      return 'BANK_ACCOUNT';

    case 'OTHER':
      return 'OTHER';

    default:
      throw new Error(
        `Invalid persisted Financial Disbursement Destination type "${String(value)}".`,
      );
  }
}

// =============================================================================
// Domain → Prisma Destination Type
// =============================================================================

/** Validates the snapshot destination type before persisting it to Prisma. */
function toPersistenceDestinationType(
  value: string,
): PrismaFinancialDisbursementDestinationType {
  switch (value.trim().toUpperCase()) {
    case 'MOBILE_MONEY':
      return 'MOBILE_MONEY';

    case 'BANK_ACCOUNT':
      return 'BANK_ACCOUNT';

    case 'OTHER':
      return 'OTHER';

    default:
      throw new Error(
        `Invalid domain Financial Disbursement destination type "${String(value)}".`,
      );
  }
}

// =============================================================================
// Prisma Graph Types
// =============================================================================

/**
 * Complete Prisma graph required for Financial Disbursement aggregate
 * rehydration.
 *
 * Graph:
 *
 * FinancialDisbursement
 * ├── FinancialAccount
 * └── FinancialDisbursementAttempt[]
 *
 * The source Financial Account relation is required because the domain
 * disbursement entity stores both:
 *
 * - sourceAccountId       -> internal persistence identity
 * - sourceAccountPublicId -> public domain identity
 *
 * Destination type and value are persisted directly on the disbursement row.
 *
 * withdrawalPublicId is persisted as an opaque cross-domain public ID.
 */
export type FinancialDisbursementWithRelations = PrismaFinancialDisbursement & {
  sourceAccount: PrismaFinancialAccount;
  attempts: PrismaFinancialDisbursementAttempt[];
};

// =============================================================================
// Persistence Types
// =============================================================================

/**
 * Persistence structure for the complete Financial Disbursement aggregate.
 *
 * The disbursement owns its attempts.
 *
 * The immutable destination snapshot and originating withdrawal public ID
 * are persisted on the disbursement row.
 *
 * Configured Financial Account destinations are not part of this structure.
 */
export interface FinancialDisbursementPersistence {
  disbursement: ReturnType<
    typeof FinancialDisbursementPrismaMapper.toPersistence
  >;

  attempts: ReturnType<
    typeof FinancialDisbursementPrismaMapper.attemptToPersistence
  >[];
}

// =============================================================================
// Mapper
// =============================================================================

export class FinancialDisbursementPrismaMapper {
  // ===========================================================================
  // Prisma → Aggregate
  // ===========================================================================

  /**
   * Rehydrates the complete Financial Disbursement aggregate.
   *
   * Required persistence graph:
   *
   * FinancialDisbursement
   * ├── FinancialAccount
   * └── FinancialDisbursementAttempt[]
   *
   * Rehydration does not emit domain events.
   */
  public static toDomain(
    record: FinancialDisbursementWithRelations,
  ): FinancialDisbursementAggregate {
    const disbursement = this.toEntity(record);

    return FinancialDisbursementAggregate.rehydrate(disbursement);
  }

  // ===========================================================================
  // Prisma → Disbursement Entity
  // ===========================================================================

  /**
   * Maps a persisted Prisma FinancialDisbursement and its aggregate-owned
   * attempts into FinancialDisbursementEntity.
   *
   * The source Financial Account relation is required because the domain
   * entity carries both the internal account identity and its public identity.
   */
  public static toEntity(
    record: FinancialDisbursementWithRelations,
  ): FinancialDisbursementEntity {
    // -------------------------------------------------------------------------
    // Source Financial Account
    // -------------------------------------------------------------------------

    const sourceAccountPublicId = this.resolveSourceAccountPublicId(
      record.sourceAccountId,
      record.sourceAccount,
      record.publicId,
    );

    // -------------------------------------------------------------------------
    // Immutable Withdrawal Destination Snapshot
    // -------------------------------------------------------------------------

    const destination = FinancialAccountWithdrawalDestination.create(
      record.destinationType,
      record.destinationValue,
    );

    // -------------------------------------------------------------------------
    // Public Disbursement Identity
    // -------------------------------------------------------------------------

    const publicId = new FinancialDisbursementPublicId(record.publicId);

    // -------------------------------------------------------------------------
    // Money
    // -------------------------------------------------------------------------

    const amount = Money.create(
      record.amount,
      Currency.create(record.currency),
    );

    // -------------------------------------------------------------------------
    // Status
    // -------------------------------------------------------------------------

    const status = FinancialDisbursementStatus.create(
      toDomainDisbursementStatus(record.status),
    );

    // -------------------------------------------------------------------------
    // Business Reference
    // -------------------------------------------------------------------------

    const reference = this.resolveReference(
      record.referenceType,
      record.referencePublicId,
      record.publicId,
    );

    // -------------------------------------------------------------------------
    // Financial Transaction Reference
    // -------------------------------------------------------------------------

    const transactionPublicId =
      record.transactionPublicId !== null
        ? FinancialReferencePublicId.create(record.transactionPublicId)
        : undefined;

    // -------------------------------------------------------------------------
    // Attempts
    // -------------------------------------------------------------------------

    const attempts = record.attempts.map((attempt) =>
      this.attemptToEntity(attempt),
    );

    // -------------------------------------------------------------------------
    // Entity
    // -------------------------------------------------------------------------

    return new FinancialDisbursementEntity(
      {
        // ---------------------------------------------------------------------
        // Source Financial Account
        // ---------------------------------------------------------------------

        sourceAccountId: new UniqueEntityId(record.sourceAccountId),

        sourceAccountPublicId,

        // ---------------------------------------------------------------------
        // Immutable Withdrawal Destination Snapshot
        // ---------------------------------------------------------------------

        destination,

        // ---------------------------------------------------------------------
        // Originating Financial Account Withdrawal
        // ---------------------------------------------------------------------

        withdrawalPublicId: record.withdrawalPublicId ?? undefined,

        // ---------------------------------------------------------------------
        // Amount
        // ---------------------------------------------------------------------

        amount,

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        status,

        // ---------------------------------------------------------------------
        // Attempts
        // ---------------------------------------------------------------------

        attempts,

        // ---------------------------------------------------------------------
        // Business Reference
        // ---------------------------------------------------------------------

        referenceType: reference.referenceType,

        referencePublicId: reference.referencePublicId,

        // ---------------------------------------------------------------------
        // Financial Transaction
        // ---------------------------------------------------------------------

        transactionPublicId,

        // ---------------------------------------------------------------------
        // Lifecycle Timestamps
        // ---------------------------------------------------------------------

        requestedAt: record.requestedAt,

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
  // Prisma → Attempt Entity
  // ===========================================================================

  /**
   * Maps a persisted Prisma FinancialDisbursementAttempt into its domain
   * child entity.
   */
  public static attemptToEntity(
    record: PrismaFinancialDisbursementAttempt,
  ): FinancialDisbursementAttemptEntity {
    const amount = Money.create(
      record.amount,
      Currency.create(record.currency),
    );

    const status = FinancialDisbursementAttemptStatus.create(
      toDomainDisbursementAttemptStatus(record.status),
    );

    const provider = FinancialProvider.create(record.provider);

    const providerReference =
      record.providerReference !== null
        ? FinancialProviderReference.create(record.providerReference)
        : undefined;

    return new FinancialDisbursementAttemptEntity(
      {
        disbursementId: new UniqueEntityId(record.disbursementId),
        status,
        provider,
        providerReference,

        // Safaricom B2C callback correlation identifiers.
        providerOriginatorConversationId:
          record.providerOriginatorConversationId ?? undefined,
        providerConversationId: record.providerConversationId ?? undefined,
        providerTransactionId: record.providerTransactionId ?? undefined,

        amount,

        failureCode: record.failureCode ?? undefined,
        failureMessage: record.failureMessage ?? undefined,

        startedAt: record.startedAt ?? undefined,
        completedAt: record.completedAt ?? undefined,
        failedAt: record.failedAt ?? undefined,
        cancelledAt: record.cancelledAt ?? undefined,

        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),
      new FinancialDisbursementAttemptPublicId(record.publicId),
    );
  }

  // ===========================================================================
  // Prisma → Destination Entity
  // ===========================================================================

  /**
   * Maps a persisted Prisma FinancialDisbursementDestination into its domain
   * entity.
   *
   * The destination remains an independently persisted Financial Account
   * boundary entity.
   */
  public static destinationToEntity(
    record: PrismaFinancialDisbursementDestination,
  ): FinancialDisbursementDestinationEntity {
    // -------------------------------------------------------------------------
    // Destination Type
    // -------------------------------------------------------------------------

    const type = FinancialDisbursementDestinationType.create(
      toDomainDestinationType(record.type),
    );

    // -------------------------------------------------------------------------
    // Provider
    // -------------------------------------------------------------------------

    const provider = FinancialProvider.create(record.provider);

    // -------------------------------------------------------------------------
    // Provider Reference
    // -------------------------------------------------------------------------

    const providerReference = FinancialProviderReference.create(
      record.providerReference,
    );

    // -------------------------------------------------------------------------
    // Entity
    // -------------------------------------------------------------------------

    return FinancialDisbursementDestinationEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Owning Financial Account
        // ---------------------------------------------------------------------

        accountId: new UniqueEntityId(record.accountId),

        // ---------------------------------------------------------------------
        // Destination
        // ---------------------------------------------------------------------

        type,

        provider,

        providerReference,

        // ---------------------------------------------------------------------
        // Presentation Metadata
        // ---------------------------------------------------------------------

        displayName: record.displayName ?? undefined,

        maskedReference: record.maskedReference ?? undefined,

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

      new FinancialDisbursementDestinationPublicId(record.publicId),
    );
  }

  // ===========================================================================
  // Disbursement Entity → Prisma
  // ===========================================================================

  /**
   * Converts FinancialDisbursementEntity into its Prisma persistence shape.
   *
   * The sourceAccountId is an internal persistence identity. The destination
   * is an immutable type/value snapshot and requires no destination ID lookup.
   *
   * withdrawalPublicId is stored as an opaque public ID reference. It is not
   * a Prisma relation to the Financial Account Withdrawal aggregate.
   */
  public static toPersistence(entity: FinancialDisbursementEntity): {
    id: string;
    publicId: string;
    sourceAccountId: string;
    destinationType: PrismaFinancialDisbursementDestinationType;
    destinationValue: string;
    withdrawalPublicId: string | null;
    amount: number;
    currency: string;
    status: PrismaFinancialDisbursementStatus;
    referenceType: string | null;
    referencePublicId: string | null;
    transactionPublicId: string | null;
    requestedAt: Date;
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
      // Source Financial Account
      // -----------------------------------------------------------------------

      sourceAccountId: entity.sourceAccountId.toString(),

      // -----------------------------------------------------------------------
      // Immutable Withdrawal Destination Snapshot
      // -----------------------------------------------------------------------

      destinationType: toPersistenceDestinationType(entity.destinationType),

      destinationValue: entity.destinationValue,

      // -----------------------------------------------------------------------
      // Originating Financial Account Withdrawal
      // -----------------------------------------------------------------------

      withdrawalPublicId: entity.withdrawalPublicId ?? null,

      // -----------------------------------------------------------------------
      // Amount
      // -----------------------------------------------------------------------

      amount: entity.amount.amount,

      currency: entity.amount.currency.value,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: entity.status.value,

      // -----------------------------------------------------------------------
      // Business Reference
      // -----------------------------------------------------------------------

      referenceType: entity.referenceType?.value ?? null,

      referencePublicId: entity.referencePublicId?.value ?? null,

      // -----------------------------------------------------------------------
      // Financial Transaction
      // -----------------------------------------------------------------------

      transactionPublicId: entity.transactionPublicId?.value ?? null,

      // -----------------------------------------------------------------------
      // Lifecycle Timestamps
      // -----------------------------------------------------------------------

      requestedAt: entity.requestedAt,

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
  // Attempt → Prisma
  // ===========================================================================

  /**
   * Converts FinancialDisbursementAttemptEntity into its Prisma persistence
   * structure.
   *
   * Provider callback identifiers and all attempt lifecycle timestamps are
   * persisted and rehydrated without loss.
   */
  public static attemptToPersistence(
    entity: FinancialDisbursementAttemptEntity,
  ): {
    id: string;
    publicId: string;
    disbursementId: string;
    status: PrismaFinancialDisbursementAttemptStatus;
    provider: string;
    providerReference: string | null;
    providerOriginatorConversationId: string | null;
    providerConversationId: string | null;
    providerTransactionId: string | null;
    amount: number;
    currency: string;
    failureCode: string | null;
    failureMessage: string | null;
    startedAt: Date | null;
    completedAt: Date | null;
    failedAt: Date | null;
    cancelledAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: entity.id.toString(),
      publicId: entity.publicId.value,
      disbursementId: entity.disbursementId.toString(),

      status: entity.status.value,

      provider: entity.provider.value,
      providerReference: entity.providerReference?.value ?? null,

      providerOriginatorConversationId:
        entity.providerOriginatorConversationId ?? null,
      providerConversationId: entity.providerConversationId ?? null,
      providerTransactionId: entity.providerTransactionId ?? null,

      amount: entity.amount.amount,
      currency: entity.amount.currency.value,

      failureCode: entity.failureCode ?? null,
      failureMessage: entity.failureMessage ?? null,

      startedAt: entity.startedAt ?? null,
      completedAt: entity.completedAt ?? null,
      failedAt: entity.failedAt ?? null,
      cancelledAt: entity.cancelledAt ?? null,

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Destination → Prisma
  // ===========================================================================

  /**
   * Converts FinancialDisbursementDestinationEntity into its Prisma
   * persistence structure.
   *
   * IMPORTANT:
   *
   * The destination belongs to the Financial Account boundary.
   *
   * This method exists only so infrastructure can persist the associated
   * destination when the owning Financial Account workflow requires it.
   *
   * The disbursement repository must not interpret this as aggregate ownership.
   */
  public static destinationToPersistence(
    entity: FinancialDisbursementDestinationEntity,
  ): {
    id: string;
    publicId: string;
    accountId: string;
    type: PrismaFinancialDisbursementDestinationType;
    provider: string;
    providerReference: string;
    displayName: string | null;
    maskedReference: string | null;
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
      // Destination
      // -----------------------------------------------------------------------

      type: entity.type.value,

      provider: entity.provider.value,

      providerReference: entity.providerReference.value,

      // -----------------------------------------------------------------------
      // Presentation Metadata
      // -----------------------------------------------------------------------

      displayName: entity.displayName ?? null,

      maskedReference: entity.maskedReference ?? null,

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
  // Aggregate → Persistence
  // ===========================================================================

  /**
   * Converts the complete FinancialDisbursementAggregate into persistence
   * structures.
   *
   * The disbursement row stores the immutable destination snapshot and
   * originating withdrawal public ID, and attempts remain aggregate-owned
   * persistence records.
   *
   * Configured Financial Account destinations are not part of this aggregate.
   * No database operation is performed here.
   */
  public static aggregateToPersistence(
    aggregate: FinancialDisbursementAggregate,
  ): FinancialDisbursementPersistence {
    return {
      // -----------------------------------------------------------------------
      // Disbursement
      // -----------------------------------------------------------------------

      disbursement: this.toPersistence(aggregate.disbursement),

      // -----------------------------------------------------------------------
      // Aggregate-Owned Attempts
      // -----------------------------------------------------------------------

      attempts: aggregate.attempts.map((attempt) =>
        this.attemptToPersistence(attempt),
      ),
    };
  }

  // ===========================================================================
  // Prisma Component → Domain
  // ===========================================================================

  /**
   * Maps a standalone Prisma Financial Disbursement component into its
   * corresponding domain entity.
   *
   * Complete aggregate rehydration must use toDomain().
   */
  public static toDomainComponent(
    record:
      | PrismaFinancialDisbursement
      | PrismaFinancialDisbursementAttempt
      | PrismaFinancialDisbursementDestination,
    options?: {
      sourceAccountPublicId?: FinancialAccountPublicId;
      attempts?: PrismaFinancialDisbursementAttempt[];
    },
  ):
    | FinancialDisbursementEntity
    | FinancialDisbursementAttemptEntity
    | FinancialDisbursementDestinationEntity {
    // -------------------------------------------------------------------------
    // Financial Disbursement
    // -------------------------------------------------------------------------

    if (this.isFinancialDisbursementRecord(record)) {
      if (options?.sourceAccountPublicId === undefined) {
        throw new Error(
          `Financial Disbursement "${record.publicId}" requires sourceAccountPublicId for component rehydration.`,
        );
      }

      return this.disbursementToDomainComponent(
        record,
        options.sourceAccountPublicId,
        options.attempts ?? [],
      );
    }

    // -------------------------------------------------------------------------
    // Financial Disbursement Attempt
    // -------------------------------------------------------------------------

    if (this.isFinancialDisbursementAttemptRecord(record)) {
      return this.attemptToEntity(record);
    }

    // -------------------------------------------------------------------------
    // Financial Disbursement Destination
    // -------------------------------------------------------------------------

    if (this.isFinancialDisbursementDestinationRecord(record)) {
      return this.destinationToEntity(record);
    }

    throw new Error(
      'Unsupported Financial Disbursement Prisma record supplied to mapper.',
    );
  }

  // ===========================================================================
  // Standalone Disbursement Component
  // ===========================================================================

  /**
   * Maps a standalone Prisma FinancialDisbursement into a
   * FinancialDisbursementEntity.
   *
   * IMPORTANT:
   *
   * The destination type and value are read directly from the disbursement
   * record and rehydrated as an immutable value object.
   *
   * The originating withdrawal public ID is also rehydrated when present.
   */
  public static disbursementToDomainComponent(
    record: PrismaFinancialDisbursement,
    sourceAccountPublicId: FinancialAccountPublicId,
    attempts: PrismaFinancialDisbursementAttempt[] = [],
  ): FinancialDisbursementEntity {
    // -------------------------------------------------------------------------
    // Public Identity
    // -------------------------------------------------------------------------

    const publicId = new FinancialDisbursementPublicId(record.publicId);

    // -------------------------------------------------------------------------
    // Money
    // -------------------------------------------------------------------------

    const amount = Money.create(
      record.amount,
      Currency.create(record.currency),
    );

    // -------------------------------------------------------------------------
    // Status
    // -------------------------------------------------------------------------

    const status = FinancialDisbursementStatus.create(
      toDomainDisbursementStatus(record.status),
    );

    // -------------------------------------------------------------------------
    // Business Reference
    // -------------------------------------------------------------------------

    const reference = this.resolveReference(
      record.referenceType,
      record.referencePublicId,
      record.publicId,
    );

    // -------------------------------------------------------------------------
    // Transaction Reference
    // -------------------------------------------------------------------------

    const transactionPublicId =
      record.transactionPublicId !== null
        ? FinancialReferencePublicId.create(record.transactionPublicId)
        : undefined;

    // -------------------------------------------------------------------------
    // Entity
    // -------------------------------------------------------------------------

    return new FinancialDisbursementEntity(
      {
        // ---------------------------------------------------------------------
        // Source Financial Account
        // ---------------------------------------------------------------------

        sourceAccountId: new UniqueEntityId(record.sourceAccountId),

        sourceAccountPublicId,

        // ---------------------------------------------------------------------
        // Immutable Withdrawal Destination Snapshot
        // ---------------------------------------------------------------------

        destination: FinancialAccountWithdrawalDestination.create(
          record.destinationType,
          record.destinationValue,
        ),

        // ---------------------------------------------------------------------
        // Originating Financial Account Withdrawal
        // ---------------------------------------------------------------------

        withdrawalPublicId: record.withdrawalPublicId ?? undefined,

        // ---------------------------------------------------------------------
        // Amount
        // ---------------------------------------------------------------------

        amount,

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        status,

        // ---------------------------------------------------------------------
        // Attempts
        // ---------------------------------------------------------------------

        attempts: attempts.map((attempt) => this.attemptToEntity(attempt)),

        // ---------------------------------------------------------------------
        // Business Reference
        // ---------------------------------------------------------------------

        referenceType: reference.referenceType,

        referencePublicId: reference.referencePublicId,

        // ---------------------------------------------------------------------
        // Financial Transaction
        // ---------------------------------------------------------------------

        transactionPublicId,

        // ---------------------------------------------------------------------
        // Lifecycle Timestamps
        // ---------------------------------------------------------------------

        requestedAt: record.requestedAt,

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
  // Source Financial Account Resolution
  // ===========================================================================

  /**
   * Resolves and validates the source Financial Account relation.
   *
   * Persistence:
   *
   *   FinancialDisbursement.sourceAccountId
   *                    │
   *                    ▼
   *             FinancialAccount.id
   *
   * Domain:
   *
   *   sourceAccountId       -> UniqueEntityId
   *   sourceAccountPublicId -> FinancialAccountPublicId
   *
   * The mapper does not query Prisma.
   */
  private static resolveSourceAccountPublicId(
    sourceAccountId: string,
    sourceAccount: PrismaFinancialAccount | null | undefined,
    disbursementPublicId: string,
  ): FinancialAccountPublicId {
    // -------------------------------------------------------------------------
    // Relation Required
    // -------------------------------------------------------------------------

    if (sourceAccount === null || sourceAccount === undefined) {
      throw new Error(
        `Financial Disbursement "${disbursementPublicId}" cannot be rehydrated without its source Financial Account relation.`,
      );
    }

    // -------------------------------------------------------------------------
    // Foreign-Key Consistency
    // -------------------------------------------------------------------------

    if (sourceAccount.id !== sourceAccountId) {
      throw new Error(
        `Financial Disbursement "${disbursementPublicId}" contains an inconsistent source Financial Account relation.`,
      );
    }

    // -------------------------------------------------------------------------
    // Public Identity
    // -------------------------------------------------------------------------

    return new FinancialAccountPublicId(sourceAccount.publicId);
  }

  // ===========================================================================
  // Business Reference Resolution
  // ===========================================================================

  /**
   * Reconstructs the optional business reference.
   *
   * referenceType and referencePublicId form an atomic pair.
   */
  private static resolveReference(
    referenceType: string | null,
    referencePublicId: string | null,
    disbursementPublicId: string,
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
        `Financial Disbursement "${disbursementPublicId}" contains an incomplete business reference.`,
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

  // ===========================================================================
  // Prisma Record Guards
  // ===========================================================================

  /**
   * Identifies a FinancialDisbursement Prisma record.
   *
   * FinancialDisbursement-specific fields are used instead of generic fields
   * shared by all Prisma records.
   */
  private static isFinancialDisbursementRecord(
    record:
      | PrismaFinancialDisbursement
      | PrismaFinancialDisbursementAttempt
      | PrismaFinancialDisbursementDestination,
  ): record is PrismaFinancialDisbursement {
    return (
      'sourceAccountId' in record &&
      'destinationType' in record &&
      'destinationValue' in record &&
      'requestedAt' in record &&
      'transactionPublicId' in record
    );
  }

  /**
   * Identifies a FinancialDisbursementAttempt Prisma record.
   */
  private static isFinancialDisbursementAttemptRecord(
    record:
      | PrismaFinancialDisbursement
      | PrismaFinancialDisbursementAttempt
      | PrismaFinancialDisbursementDestination,
  ): record is PrismaFinancialDisbursementAttempt {
    return (
      'disbursementId' in record &&
      'failureCode' in record &&
      'failureMessage' in record &&
      'startedAt' in record &&
      'failedAt' in record
    );
  }

  /**
   * Identifies a FinancialDisbursementDestination Prisma record.
   */
  private static isFinancialDisbursementDestinationRecord(
    record:
      | PrismaFinancialDisbursement
      | PrismaFinancialDisbursementAttempt
      | PrismaFinancialDisbursementDestination,
  ): record is PrismaFinancialDisbursementDestination {
    return (
      'accountId' in record &&
      'providerReference' in record &&
      'isDefault' in record &&
      'isActive' in record
    );
  }
}
