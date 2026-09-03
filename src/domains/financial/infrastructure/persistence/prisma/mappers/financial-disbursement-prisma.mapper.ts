// -----------------------------------------------------------------------------
// Financial Disbursement Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps the complete Financial Disbursement aggregate:
//
// FinancialDisbursementAggregate
// ├── FinancialDisbursementEntity
// │   └── FinancialDisbursementAttemptEntity[]
// └── FinancialDisbursementDestinationEntity
//
// Persistence responsibilities:
//
// - Translate Prisma Financial Disbursement records into domain entities.
// - Rehydrate all Financial Disbursement Attempts.
// - Rehydrate the selected Financial Disbursement Destination.
// - Preserve internal database identities.
// - Preserve public domain identities.
// - Preserve source Financial Account internal identity.
// - Preserve source Financial Account public identity.
// - Preserve destination internal identity.
// - Preserve destination public identity.
// - Preserve amount and currency through Money.
// - Preserve disbursement lifecycle.
// - Preserve provider execution attempts.
// - Preserve destination configuration.
// - Preserve originating business references.
// - Preserve resulting Financial Transaction reference.
// - Translate the aggregate back into persistence structures.
//
// IMPORTANT:
//
// FinancialDisbursementDestinationEntity is NOT an owned child of the
// FinancialDisbursement aggregate.
//
// It belongs to the Financial Account boundary.
//
// Therefore:
//
// FinancialDisbursementAggregate
// ├── FinancialDisbursementEntity
// │   └── FinancialDisbursementAttemptEntity[]
// └── FinancialDisbursementDestinationEntity
//                         ↑
//                         │ associated entity
//                         │
//                  Financial Account boundary
//
// The mapper rehydrates the selected destination because the disbursement
// aggregate requires the destination configuration to validate aggregate
// consistency.
//
// The destination is nevertheless persisted as its own persistence structure.
// It is NOT persisted through a nested disbursement-owned relation.
//
// The mapper does NOT:
//
// - Query Prisma.
// - Execute provider APIs.
// - Communicate with external providers.
// - Move money.
// - Modify Financial Account balances.
// - Create Financial Transactions.
// - Post ledger entries.
// - Select providers.
// - Select destinations.
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
 * ├── FinancialDisbursementDestination
 * └── FinancialDisbursementAttempt[]
 *
 * The source Financial Account relation is required because the domain
 * disbursement entity stores both:
 *
 * - sourceAccountId      -> internal persistence identity
 * - sourceAccountPublicId -> public domain identity
 *
 * The destination relation is required because the aggregate contains the
 * selected destination entity.
 */
export type FinancialDisbursementWithRelations = PrismaFinancialDisbursement & {
  sourceAccount: PrismaFinancialAccount;

  destination: PrismaFinancialDisbursementDestination;

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
 * The destination is associated with the aggregate but belongs to the
 * Financial Account boundary, therefore it is exposed separately.
 */
export interface FinancialDisbursementPersistence {
  disbursement: ReturnType<
    typeof FinancialDisbursementPrismaMapper.toPersistence
  >;

  destination: ReturnType<
    typeof FinancialDisbursementPrismaMapper.destinationToPersistence
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
   * ├── FinancialDisbursementDestination
   * └── FinancialDisbursementAttempt[]
   *
   * Rehydration does not emit domain events.
   */
  public static toDomain(
    record: FinancialDisbursementWithRelations,
  ): FinancialDisbursementAggregate {
    const disbursement = this.toEntity(record);

    const destination = this.destinationToEntity(record.destination);

    return FinancialDisbursementAggregate.rehydrate(disbursement, destination);
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
    // Destination
    // -------------------------------------------------------------------------

    /**
     * The disbursement stores the internal destination identity.
     *
     * The destination entity itself is rehydrated separately because it belongs
     * to the Financial Account boundary.
     */
    const destinationId = new UniqueEntityId(record.destinationId);

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
        // Destination
        // ---------------------------------------------------------------------

        destinationId,

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

    const status = FinancialDisbursementAttemptStatus.create(
      toDomainDisbursementAttemptStatus(record.status),
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

    return new FinancialDisbursementAttemptEntity(
      {
        // ---------------------------------------------------------------------
        // Parent Aggregate Identity
        // ---------------------------------------------------------------------

        disbursementId: new UniqueEntityId(record.disbursementId),

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
        // Failure Diagnostics
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
        // IMPORTANT
        //
        // FinancialDisbursementAttemptStatus currently has no EXPIRED state,
        // and the supplied Prisma model does not persist cancelledAt.
        //
        // Therefore cancelledAt cannot be reconstructed from persistence.
        // ---------------------------------------------------------------------

        cancelledAt: undefined,

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
   * Both sourceAccountId and destinationId are already internal persistence
   * identities in the domain entity.
   *
   * Therefore the mapper does not perform any ID lookup.
   */
  public static toPersistence(entity: FinancialDisbursementEntity): {
    id: string;
    publicId: string;
    sourceAccountId: string;
    destinationId: string;
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
      // Destination
      // -----------------------------------------------------------------------

      destinationId: entity.destinationId.toString(),

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
   * The supplied Prisma model does not contain cancelledAt.
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
      // Parent Disbursement
      // -----------------------------------------------------------------------

      disbursementId: entity.disbursementId.toString(),

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

      currency: entity.amount.currency.value,

      // -----------------------------------------------------------------------
      // Failure Diagnostics
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
   * Ownership semantics remain explicit:
   *
   * FinancialDisbursement
   * ├── attempts[]       -> aggregate-owned persistence
   *
   * Destination
   * └── separate record   -> Financial Account boundary persistence
   *
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
      // Associated Destination
      // -----------------------------------------------------------------------

      destination: this.destinationToPersistence(aggregate.destination),

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
   * This method does not require the destination relation because it maps only
   * the disbursement entity itself.
   *
   * No fake destination relation is constructed.
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
        // Destination
        // ---------------------------------------------------------------------

        destinationId: new UniqueEntityId(record.destinationId),

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
      'destinationId' in record &&
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
