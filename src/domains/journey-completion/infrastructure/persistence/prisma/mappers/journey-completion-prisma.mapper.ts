// -----------------------------------------------------------------------------
// Journey Completion Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps the complete Journey Completion aggregate persistence graph:
//
// JourneyCompletion
// ├── JourneyCompletionConfirmation[]
// └── JourneyCompletionDispute[]
//
// JourneySettlement is intentionally NOT mapped as an aggregate-owned child.
//
// JourneySettlement is a separate aggregate and therefore has its own Prisma
// mapper and repository boundary.
//
// Persistence responsibilities:
// - Translate Prisma persistence records into domain entities.
// - Translate domain entities into Prisma persistence structures.
// - Preserve the distinction between internal database IDs and public IDs.
// - Rehydrate the complete Journey Completion aggregate through its aggregate
//   root so domain invariants remain authoritative.
//
// Important identifier rule:
//
// Prisma:
//   JourneyCompletion.id
//   JourneyCompletionConfirmation.completionId
//   JourneyCompletionDispute.completionId
//
// Domain:
//   JourneyCompletionEntity.id       -> UniqueEntityId
//   JourneyCompletionEntity.publicId -> JourneyCompletionPublicId
//   Confirmation.completionId        -> JourneyCompletionPublicId
//   Dispute.completionId             -> JourneyCompletionPublicId
//
// Therefore confirmation/dispute completionId values MUST NOT be mapped
// directly from Prisma's internal completionId. The owning
// JourneyCompletion.publicId is required during aggregate graph rehydration.
//
// Entity rehydration:
//
// JourneyCompletionEntity.rehydrate(
//   props,
//   UniqueEntityId,
//   JourneyCompletionPublicId,
// )
//
// JourneyCompletionConfirmationEntity.rehydrate(
//   props,
//   UniqueEntityId,
//   JourneyCompletionConfirmationPublicId,
// )
//
// JourneyCompletionDisputeEntity.rehydrate(
//   props,
//   UniqueEntityId,
//   JourneyCompletionDisputePublicId,
// )
//
// JourneyCompletionEntity owns its aggregate-child collections through its
// JourneyCompletionProps:
//
//   confirmations
//   disputes
//
// Therefore the mapper builds the child entities first, then supplies them
// to JourneyCompletionEntity.rehydrate().
//
// The aggregate itself is rehydrated with:
//
//   JourneyCompletionAggregate.rehydrate(completion)
//
// JourneyCompletionAggregate.rehydrate() accepts the already rehydrated root
// entity because the complete aggregate-owned graph is represented by the
// JourneyCompletionEntity.
//
// Settlement boundary:
//
// JourneySettlement.completionId is intentionally NOT represented in this
// mapper. JourneySettlement is a separate aggregate and must be persisted,
// loaded, and mapped independently.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type {
  JourneyCompletion as PrismaJourneyCompletion,
  JourneyCompletionConfirmation as PrismaJourneyCompletionConfirmation,
  JourneyCompletionDispute as PrismaJourneyCompletionDispute,
  JourneyCompletionConfirmationRole as PrismaJourneyCompletionConfirmationRole,
  JourneyCompletionConfirmationStatus as PrismaJourneyCompletionConfirmationStatus,
  JourneyCompletionDisputeReason as PrismaJourneyCompletionDisputeReason,
  JourneyCompletionDisputeStatus as PrismaJourneyCompletionDisputeStatus,
} from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import { JourneyCompletionAggregate } from '../../../../domain/aggregates/journey-completion.aggregate';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import { JourneyCompletionEntity } from '../../../../domain/entities/journey-completion.entity';

import { JourneyCompletionConfirmationEntity } from '../../../../domain/entities/journey-completion-confirmation.entity';

import { JourneyCompletionDisputeEntity } from '../../../../domain/entities/journey-completion-dispute.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyCompletionBookingPublicId,
  JourneyCompletionConfirmationPublicId,
  JourneyCompletionConfirmationRole,
  JourneyCompletionConfirmationStatus,
  JourneyCompletionDisputeDescription,
  JourneyCompletionDisputePublicId,
  JourneyCompletionDisputeReason,
  JourneyCompletionDisputeResolutionSummary,
  JourneyCompletionDisputeStatus,
  JourneyCompletionJourneyPublicId,
  JourneyCompletionMemberPublicId,
  JourneyCompletionProviderPublicId,
  JourneyCompletionPublicId,
  JourneyCompletionStatus,
} from '../../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Domain Value Types
// -----------------------------------------------------------------------------

import type {
  JourneyCompletionConfirmationRoleValue,
  JourneyCompletionConfirmationStatusValue,
  JourneyCompletionDisputeReasonValue,
  JourneyCompletionDisputeStatusValue,
  JourneyCompletionStatusValue,
} from '../../../../domain/value-objects';

// =============================================================================
// Prisma → Domain Value Conversion
// =============================================================================

/**
 * Converts a persisted Prisma Journey Completion status into the domain
 * Journey Completion status value.
 */
function toJourneyCompletionStatus(
  value: PrismaJourneyCompletion['status'],
): JourneyCompletionStatusValue {
  switch (value) {
    case 'PENDING':
      return 'PENDING';

    case 'CONFIRMATION_REQUIRED':
      return 'CONFIRMATION_REQUIRED';

    case 'CONFIRMED':
      return 'CONFIRMED';

    case 'DISPUTED':
      return 'DISPUTED';

    case 'CANCELLED':
      return 'CANCELLED';

    default:
      throw new Error(
        `Invalid persisted Journey Completion status "${String(value)}".`,
      );
  }
}

/**
 * Converts a persisted Prisma confirmation role into the domain
 * confirmation role value.
 */
function toJourneyCompletionConfirmationRole(
  value: PrismaJourneyCompletionConfirmationRole,
): JourneyCompletionConfirmationRoleValue {
  switch (value) {
    case 'PROVIDER':
      return 'PROVIDER';

    case 'PASSENGER':
      return 'PASSENGER';

    default:
      throw new Error(
        `Invalid persisted Journey Completion confirmation role "${String(value)}".`,
      );
  }
}

/**
 * Converts a persisted Prisma confirmation status into the domain
 * confirmation status value.
 */
function toJourneyCompletionConfirmationStatus(
  value: PrismaJourneyCompletionConfirmationStatus,
): JourneyCompletionConfirmationStatusValue {
  switch (value) {
    case 'CONFIRMED':
      return 'CONFIRMED';

    case 'WITHDRAWN':
      return 'WITHDRAWN';

    default:
      throw new Error(
        `Invalid persisted Journey Completion confirmation status "${String(value)}".`,
      );
  }
}

/**
 * Converts a persisted Prisma dispute status into the domain
 * dispute status value.
 */
function toJourneyCompletionDisputeStatus(
  value: PrismaJourneyCompletionDisputeStatus,
): JourneyCompletionDisputeStatusValue {
  switch (value) {
    case 'OPEN':
      return 'OPEN';

    case 'UNDER_REVIEW':
      return 'UNDER_REVIEW';

    case 'RESOLVED':
      return 'RESOLVED';

    case 'REJECTED':
      return 'REJECTED';

    case 'WITHDRAWN':
      return 'WITHDRAWN';

    default:
      throw new Error(
        `Invalid persisted Journey Completion dispute status "${String(value)}".`,
      );
  }
}

/**
 * Converts a persisted Prisma dispute reason into the domain
 * dispute reason value.
 */
function toJourneyCompletionDisputeReason(
  value: PrismaJourneyCompletionDisputeReason,
): JourneyCompletionDisputeReasonValue {
  switch (value) {
    case 'JOURNEY_NOT_COMPLETED':
      return 'JOURNEY_NOT_COMPLETED';

    case 'PASSENGER_DID_NOT_TRAVEL':
      return 'PASSENGER_DID_NOT_TRAVEL';

    case 'PROVIDER_DID_NOT_TRAVEL':
      return 'PROVIDER_DID_NOT_TRAVEL';

    case 'WRONG_DESTINATION':
      return 'WRONG_DESTINATION';

    case 'EARLY_TERMINATION':
      return 'EARLY_TERMINATION';

    case 'SAFETY_ISSUE':
      return 'SAFETY_ISSUE';

    case 'OTHER':
      return 'OTHER';

    default:
      throw new Error(
        `Invalid persisted Journey Completion dispute reason "${String(value)}".`,
      );
  }
}

// =============================================================================
// Prisma Graph Types
// =============================================================================

/**
 * Prisma Journey Completion record with its aggregate-owned children.
 *
 * Relations remain optional so the mapper can also be used with root-only
 * queries.
 *
 * Complete aggregate rehydration should normally load both confirmations
 * and disputes.
 *
 * JourneySettlement is intentionally excluded because it is a separate
 * aggregate.
 */
export type JourneyCompletionWithComponents = PrismaJourneyCompletion & {
  confirmations?: PrismaJourneyCompletionConfirmation[];

  disputes?: PrismaJourneyCompletionDispute[];
};

// =============================================================================
// Persistence Types
// =============================================================================

export interface JourneyCompletionPersistence {
  journeyCompletion: ReturnType<
    typeof JourneyCompletionPrismaMapper.completionToPersistence
  >;

  confirmations: ReturnType<
    typeof JourneyCompletionPrismaMapper.confirmationToPersistence
  >[];

  disputes: ReturnType<
    typeof JourneyCompletionPrismaMapper.disputeToPersistence
  >[];
}

// =============================================================================
// Mapper
// =============================================================================

export class JourneyCompletionPrismaMapper {
  // ===========================================================================
  // Prisma → Aggregate
  // ===========================================================================

  /**
   * Rehydrates the complete Journey Completion aggregate.
   *
   * Children are first converted into domain entities.
   *
   * The children are then supplied to JourneyCompletionEntity.rehydrate()
   * because confirmations and disputes are part of JourneyCompletionProps.
   *
   * Finally the completed root entity is passed to
   * JourneyCompletionAggregate.rehydrate().
   *
   * JourneySettlement is intentionally not loaded or rehydrated here.
   */
  public static toDomain(
    record: JourneyCompletionWithComponents,
  ): JourneyCompletionAggregate {
    const completionPublicId = new JourneyCompletionPublicId(record.publicId);

    // -------------------------------------------------------------------------
    // Rehydrate aggregate-owned children first.
    // -------------------------------------------------------------------------

    const confirmations =
      record.confirmations?.map((confirmation) =>
        this.confirmationToDomain(confirmation, completionPublicId),
      ) ?? [];

    const disputes =
      record.disputes?.map((dispute) =>
        this.disputeToDomain(dispute, completionPublicId),
      ) ?? [];

    // -------------------------------------------------------------------------
    // Rehydrate the root with the complete aggregate-owned graph.
    //
    // JourneyCompletionEntity.rehydrate() requires:
    //
    //   1. JourneyCompletionProps
    //   2. UniqueEntityId
    //   3. JourneyCompletionPublicId
    //
    // confirmations and disputes are part of JourneyCompletionProps.
    // -------------------------------------------------------------------------

    const completion = this.completionToDomain(record, confirmations, disputes);

    // -------------------------------------------------------------------------
    // Let the aggregate remain responsible for aggregate invariants.
    //
    // JourneyCompletionAggregate.rehydrate() accepts the already complete
    // root entity.
    // -------------------------------------------------------------------------

    return JourneyCompletionAggregate.rehydrate(completion);
  }

  // ===========================================================================
  // Journey Completion
  // ===========================================================================

  /**
   * Maps a persisted Journey Completion root into the domain entity.
   *
   * When child entities are not supplied, empty collections are used.
   *
   * This supports:
   *
   * - root-only persistence queries
   * - complete aggregate graph rehydration
   */
  public static completionToDomain(
    record: PrismaJourneyCompletion,
    confirmations: JourneyCompletionConfirmationEntity[] = [],
    disputes: JourneyCompletionDisputeEntity[] = [],
  ): JourneyCompletionEntity {
    const publicId = new JourneyCompletionPublicId(record.publicId);

    return JourneyCompletionEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        publicId,

        // ---------------------------------------------------------------------
        // Cross-domain references
        // ---------------------------------------------------------------------

        journeyPublicId: new JourneyCompletionJourneyPublicId(
          record.journeyPublicId,
        ),

        providerPublicId: new JourneyCompletionProviderPublicId(
          record.providerPublicId,
        ),

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        status: JourneyCompletionStatus.create(
          toJourneyCompletionStatus(record.status),
        ),

        completionRequestedAt: record.completionRequestedAt ?? undefined,

        confirmedAt: record.confirmedAt ?? undefined,

        disputedAt: record.disputedAt ?? undefined,

        cancelledAt: record.cancelledAt ?? undefined,

        // ---------------------------------------------------------------------
        // Confirmation tracking
        // ---------------------------------------------------------------------

        requiredConfirmations: record.requiredConfirmations,

        confirmedCount: record.confirmedCount,

        // ---------------------------------------------------------------------
        // Aggregate-owned children
        // ---------------------------------------------------------------------

        confirmations,

        disputes,

        // ---------------------------------------------------------------------
        // Aggregate version
        // ---------------------------------------------------------------------

        version: record.version,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),

      publicId,
    );
  }

  /**
   * Maps the domain Journey Completion root into Prisma persistence shape.
   */
  public static completionToPersistence(entity: JourneyCompletionEntity): {
    id: string;
    publicId: string;
    journeyPublicId: string;
    providerPublicId: string;
    status: PrismaJourneyCompletion['status'];
    completionRequestedAt: Date | null;
    confirmedAt: Date | null;
    disputedAt: Date | null;
    cancelledAt: Date | null;
    requiredConfirmations: number;
    confirmedCount: number;
    version: number;
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
      // Cross-domain references
      // -----------------------------------------------------------------------

      journeyPublicId: entity.journeyPublicId.value,

      providerPublicId: entity.providerPublicId.value,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: entity.status.value,

      completionRequestedAt: entity.completionRequestedAt ?? null,

      confirmedAt: entity.confirmedAt ?? null,

      disputedAt: entity.disputedAt ?? null,

      cancelledAt: entity.cancelledAt ?? null,

      // -----------------------------------------------------------------------
      // Confirmation tracking
      // -----------------------------------------------------------------------

      requiredConfirmations: entity.requiredConfirmations,

      confirmedCount: entity.confirmedCount,

      // -----------------------------------------------------------------------
      // Aggregate version
      // -----------------------------------------------------------------------

      version: entity.version,

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
   * Converts the complete Journey Completion aggregate into persistence
   * structures.
   *
   * Child Prisma foreign keys deliberately use the aggregate's internal
   * database ID rather than its public ID.
   *
   * JourneySettlement is intentionally excluded because it is a separate
   * aggregate.
   */
  public static toPersistence(
    aggregate: JourneyCompletionAggregate,
  ): JourneyCompletionPersistence {
    const completion = aggregate.journeyCompletion;

    const completionId = completion.id.toString();

    const confirmations = aggregate.confirmations.map((confirmation) =>
      this.confirmationToPersistence(confirmation, completionId),
    );

    const disputes = aggregate.disputes.map((dispute) =>
      this.disputeToPersistence(dispute, completionId),
    );

    return {
      journeyCompletion: this.completionToPersistence(completion),

      confirmations,

      disputes,
    };
  }

  // ===========================================================================
  // Confirmation
  // ===========================================================================

  /**
   * Maps a persisted confirmation into the domain entity.
   *
   * IMPORTANT:
   *
   * `record.completionId` is Prisma's internal JourneyCompletion.id.
   *
   * It MUST NOT be assigned directly to the domain confirmation's
   * `completionId`, which represents JourneyCompletionPublicId.
   *
   * The owning completion public ID is therefore supplied explicitly.
   */
  private static confirmationToDomain(
    record: PrismaJourneyCompletionConfirmation,
    completionPublicId: JourneyCompletionPublicId,
  ): JourneyCompletionConfirmationEntity {
    const publicId = new JourneyCompletionConfirmationPublicId(record.publicId);

    return JourneyCompletionConfirmationEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        publicId,

        // ---------------------------------------------------------------------
        // Journey Completion
        // ---------------------------------------------------------------------

        completionId: completionPublicId,

        // ---------------------------------------------------------------------
        // Member
        // ---------------------------------------------------------------------

        memberPublicId: new JourneyCompletionMemberPublicId(
          record.memberPublicId,
        ),

        // ---------------------------------------------------------------------
        // Booking
        // ---------------------------------------------------------------------

        bookingPublicId:
          record.bookingPublicId !== null
            ? new JourneyCompletionBookingPublicId(record.bookingPublicId)
            : undefined,

        // ---------------------------------------------------------------------
        // Confirmation
        // ---------------------------------------------------------------------

        role: JourneyCompletionConfirmationRole.create(
          toJourneyCompletionConfirmationRole(record.role),
        ),

        status: JourneyCompletionConfirmationStatus.create(
          toJourneyCompletionConfirmationStatus(record.status),
        ),

        confirmedAt: record.confirmedAt,

        withdrawnAt: record.withdrawnAt ?? undefined,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),

      publicId,
    );
  }

  /**
   * Maps a confirmation into Prisma persistence shape.
   *
   * `completionId` is the internal JourneyCompletion.id required by Prisma.
   */
  public static confirmationToPersistence(
    entity: JourneyCompletionConfirmationEntity,
    completionId: string,
  ): {
    id: string;
    publicId: string;
    completionId: string;
    memberPublicId: string;
    bookingPublicId: string | null;
    role: PrismaJourneyCompletionConfirmationRole;
    status: PrismaJourneyCompletionConfirmationStatus;
    confirmedAt: Date;
    withdrawnAt: Date | null;
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
      // Internal Prisma relationship
      // -----------------------------------------------------------------------

      completionId,

      // -----------------------------------------------------------------------
      // Member
      // -----------------------------------------------------------------------

      memberPublicId: entity.memberPublicId.value,

      // -----------------------------------------------------------------------
      // Booking
      // -----------------------------------------------------------------------

      bookingPublicId: entity.bookingPublicId?.value ?? null,

      // -----------------------------------------------------------------------
      // Confirmation
      // -----------------------------------------------------------------------

      role: entity.role.value,

      status: entity.status.value,

      confirmedAt: entity.confirmedAt,

      withdrawnAt: entity.withdrawnAt ?? null,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Dispute
  // ===========================================================================

  /**
   * Maps a persisted dispute into the domain entity.
   *
   * IMPORTANT:
   *
   * `record.completionId` is Prisma's internal JourneyCompletion.id.
   *
   * The owning JourneyCompletion.publicId is therefore supplied explicitly.
   *
   * Nullable textual fields are represented by domain value objects:
   *
   *   description
   *   resolutionSummary
   */
  private static disputeToDomain(
    record: PrismaJourneyCompletionDispute,
    completionPublicId: JourneyCompletionPublicId,
  ): JourneyCompletionDisputeEntity {
    const publicId = new JourneyCompletionDisputePublicId(record.publicId);

    return JourneyCompletionDisputeEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        publicId,

        // ---------------------------------------------------------------------
        // Journey Completion
        // ---------------------------------------------------------------------

        completionId: completionPublicId,

        // ---------------------------------------------------------------------
        // Raised By
        // ---------------------------------------------------------------------

        raisedByPublicId: new JourneyCompletionMemberPublicId(
          record.raisedByPublicId,
        ),

        // ---------------------------------------------------------------------
        // Dispute
        // ---------------------------------------------------------------------

        reason: JourneyCompletionDisputeReason.create(
          toJourneyCompletionDisputeReason(record.reason),
        ),

        description:
          record.description !== null
            ? JourneyCompletionDisputeDescription.create(record.description)
            : undefined,

        status: JourneyCompletionDisputeStatus.create(
          toJourneyCompletionDisputeStatus(record.status),
        ),

        // ---------------------------------------------------------------------
        // Resolution
        // ---------------------------------------------------------------------

        resolvedByPublicId:
          record.resolvedByPublicId !== null
            ? new JourneyCompletionMemberPublicId(record.resolvedByPublicId)
            : undefined,

        resolutionSummary:
          record.resolutionSummary !== null
            ? JourneyCompletionDisputeResolutionSummary.create(
                record.resolutionSummary,
              )
            : undefined,

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        openedAt: record.openedAt,

        resolvedAt: record.resolvedAt ?? undefined,

        rejectedAt: record.rejectedAt ?? undefined,

        withdrawnAt: record.withdrawnAt ?? undefined,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),

      publicId,
    );
  }

  /**
   * Maps a dispute into Prisma persistence shape.
   *
   * `completionId` is the internal JourneyCompletion.id required by Prisma.
   *
   * Domain value objects are serialized through `.value`.
   */
  public static disputeToPersistence(
    entity: JourneyCompletionDisputeEntity,
    completionId: string,
  ): {
    id: string;
    publicId: string;
    completionId: string;
    raisedByPublicId: string;
    reason: PrismaJourneyCompletionDisputeReason;
    description: string | null;
    status: PrismaJourneyCompletionDisputeStatus;
    resolvedByPublicId: string | null;
    resolutionSummary: string | null;
    openedAt: Date;
    resolvedAt: Date | null;
    rejectedAt: Date | null;
    withdrawnAt: Date | null;
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
      // Internal Prisma relationship
      // -----------------------------------------------------------------------

      completionId,

      // -----------------------------------------------------------------------
      // Raised By
      // -----------------------------------------------------------------------

      raisedByPublicId: entity.raisedByPublicId.value,

      // -----------------------------------------------------------------------
      // Dispute
      // -----------------------------------------------------------------------

      reason: entity.reason.value,

      description: entity.description?.value ?? null,

      status: entity.status.value,

      // -----------------------------------------------------------------------
      // Resolution
      // -----------------------------------------------------------------------

      resolvedByPublicId: entity.resolvedByPublicId?.value ?? null,

      resolutionSummary: entity.resolutionSummary?.value ?? null,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      openedAt: entity.openedAt,

      resolvedAt: entity.resolvedAt ?? null,

      rejectedAt: entity.rejectedAt ?? null,

      withdrawnAt: entity.withdrawnAt ?? null,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Aggregate Graph Component Mapping
  // ===========================================================================

  /**
   * Rehydrates a Journey Completion confirmation when its owning completion
   * public ID is known.
   */
  public static toConfirmationDomain(
    record: PrismaJourneyCompletionConfirmation,
    completionPublicId: JourneyCompletionPublicId,
  ): JourneyCompletionConfirmationEntity {
    return this.confirmationToDomain(record, completionPublicId);
  }

  /**
   * Rehydrates a Journey Completion dispute when its owning completion
   * public ID is known.
   */
  public static toDisputeDomain(
    record: PrismaJourneyCompletionDispute,
    completionPublicId: JourneyCompletionPublicId,
  ): JourneyCompletionDisputeEntity {
    return this.disputeToDomain(record, completionPublicId);
  }

  // ===========================================================================
  // Component Mapping
  // ===========================================================================

  /**
   * Converts an individual persisted Journey Completion component.
   *
   * For confirmation/dispute records, `completionPublicId` is mandatory
   * because Prisma's `completionId` is an internal database foreign key.
   */
  public static toDomainComponent(
    record:
      | PrismaJourneyCompletion
      | PrismaJourneyCompletionConfirmation
      | PrismaJourneyCompletionDispute,
    completionPublicId?: JourneyCompletionPublicId,
  ):
    | JourneyCompletionEntity
    | JourneyCompletionConfirmationEntity
    | JourneyCompletionDisputeEntity {
    // -------------------------------------------------------------------------
    // Journey Completion
    // -------------------------------------------------------------------------

    if (this.isJourneyCompletionRecord(record)) {
      return this.completionToDomain(record);
    }

    // -------------------------------------------------------------------------
    // Confirmation
    // -------------------------------------------------------------------------

    if (this.isConfirmationRecord(record)) {
      if (completionPublicId === undefined) {
        throw new Error(
          'Journey Completion public ID is required when mapping a confirmation.',
        );
      }

      return this.confirmationToDomain(record, completionPublicId);
    }

    // -------------------------------------------------------------------------
    // Dispute
    // -------------------------------------------------------------------------

    if (this.isDisputeRecord(record)) {
      if (completionPublicId === undefined) {
        throw new Error(
          'Journey Completion public ID is required when mapping a dispute.',
        );
      }

      return this.disputeToDomain(record, completionPublicId);
    }

    throw new Error(
      'Unsupported Journey Completion Prisma record supplied to mapper.',
    );
  }

  // ===========================================================================
  // Prisma Record Guards
  // ===========================================================================

  /**
   * Identifies a JourneyCompletion Prisma root record.
   */
  private static isJourneyCompletionRecord(
    record:
      | PrismaJourneyCompletion
      | PrismaJourneyCompletionConfirmation
      | PrismaJourneyCompletionDispute,
  ): record is PrismaJourneyCompletion {
    return (
      'journeyPublicId' in record &&
      'providerPublicId' in record &&
      'requiredConfirmations' in record &&
      'confirmedCount' in record &&
      'version' in record
    );
  }

  /**
   * Identifies a JourneyCompletionConfirmation Prisma record.
   */
  private static isConfirmationRecord(
    record:
      | PrismaJourneyCompletion
      | PrismaJourneyCompletionConfirmation
      | PrismaJourneyCompletionDispute,
  ): record is PrismaJourneyCompletionConfirmation {
    return (
      'memberPublicId' in record &&
      'role' in record &&
      'status' in record &&
      'confirmedAt' in record &&
      'completionId' in record
    );
  }

  /**
   * Identifies a JourneyCompletionDispute Prisma record.
   */
  private static isDisputeRecord(
    record:
      | PrismaJourneyCompletion
      | PrismaJourneyCompletionConfirmation
      | PrismaJourneyCompletionDispute,
  ): record is PrismaJourneyCompletionDispute {
    return (
      'raisedByPublicId' in record &&
      'reason' in record &&
      'resolutionSummary' in record &&
      'completionId' in record &&
      !('role' in record)
    );
  }
}
