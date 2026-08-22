//infrastructure/persistence/prisma/mappers/journey-boading-prisma.mapper.ts
// -----------------------------------------------------------------------------
// Journey Boarding Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps the complete Journey Boarding aggregate persistence graph:
//
// JourneyBoarding
// ├── JourneyBoardingParticipant[]
// └── JourneyBoardingEvent[]
//
// Persistence responsibilities:
// - Translate Prisma persistence records into domain entities.
// - Translate domain entities into Prisma persistence structures.
// - Preserve the distinction between internal database IDs and public IDs.
// - Rehydrate the complete Journey Boarding aggregate through its aggregate
//   root so domain invariants remain authoritative.
//
// Important identifier rule:
//
// Prisma:
//   JourneyBoarding.id                    -> internal database identity
//   JourneyBoardingParticipant.boardingId -> JourneyBoarding.id
//   JourneyBoardingEvent.boardingId       -> JourneyBoarding.id
//
// Domain:
//   JourneyBoardingEntity.id           -> UniqueEntityId
//   JourneyBoardingEntity.publicId     -> JourneyBoardingPublicId
//   Participant.boardingId             -> JourneyBoardingPublicId
//   Event.boardingId                   -> JourneyBoardingPublicId
//
// Therefore participant/event boardingId values MUST NOT be mapped directly
// from Prisma's internal boardingId. The owning JourneyBoarding.publicId is
// required during aggregate graph rehydration.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type {
  JourneyBoarding as PrismaJourneyBoarding,
  JourneyBoardingEvent as PrismaJourneyBoardingEvent,
  JourneyBoardingParticipant as PrismaJourneyBoardingParticipant,
  JourneyBoardingEventType as PrismaJourneyBoardingEventType,
  JourneyBoardingParticipantRole as PrismaJourneyBoardingParticipantRole,
  JourneyBoardingParticipantStatus as PrismaJourneyBoardingParticipantStatus,
  JourneyBoardingStatus as PrismaJourneyBoardingStatus,
  Prisma,
} from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import { JourneyBoardingAggregate } from '../../../../domain/aggregates/journey-boarding.aggregate';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import { JourneyBoardingEntity } from '../../../../domain/entities/journey-boarding.entity';

import { JourneyBoardingParticipantEntity } from '../../../../domain/entities/journey-boarding-participant.entity';

import { JourneyBoardingEventEntity } from '../../../../domain/entities/journey-boarding-event.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyBoardingActorPublicId,
  JourneyBoardingBookingPublicId,
  JourneyBoardingEventPublicId,
  JourneyBoardingEventType,
  JourneyBoardingJourneyId,
  JourneyBoardingMemberPublicId,
  JourneyBoardingParticipantPublicId,
  JourneyBoardingParticipantRole,
  JourneyBoardingParticipantStatus,
  JourneyBoardingProviderPublicId,
  JourneyBoardingPublicId,
  JourneyBoardingStatus,
} from '../../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Domain Value Types
// -----------------------------------------------------------------------------

import type {
  JourneyBoardingEventTypeValue,
  JourneyBoardingParticipantRoleValue,
  JourneyBoardingParticipantStatusValue,
  JourneyBoardingStatusValue,
} from '../../../../domain/value-objects';

// =============================================================================
// Prisma → Domain Value Conversion
// =============================================================================

/**
 * Converts a persisted Prisma Journey Boarding status into the domain
 * Journey Boarding status value.
 */
function toJourneyBoardingStatus(
  value: PrismaJourneyBoardingStatus,
): JourneyBoardingStatusValue {
  switch (value) {
    case 'NOT_STARTED':
      return 'NOT_STARTED';

    case 'BOARDING':
      return 'BOARDING';

    case 'STARTED':
      return 'STARTED';

    case 'CANCELLED':
      return 'CANCELLED';

    default:
      throw new Error(
        `Invalid persisted Journey Boarding status "${String(value)}".`,
      );
  }
}

/**
 * Converts a persisted Prisma participant role into the domain participant
 * role value.
 */
function toJourneyBoardingParticipantRole(
  value: PrismaJourneyBoardingParticipantRole,
): JourneyBoardingParticipantRoleValue {
  switch (value) {
    case 'PROVIDER':
      return 'PROVIDER';

    case 'PASSENGER':
      return 'PASSENGER';

    default:
      throw new Error(
        `Invalid persisted Journey Boarding participant role "${String(value)}".`,
      );
  }
}

/**
 * Converts a persisted Prisma participant status into the domain participant
 * status value.
 */
function toJourneyBoardingParticipantStatus(
  value: PrismaJourneyBoardingParticipantStatus,
): JourneyBoardingParticipantStatusValue {
  switch (value) {
    case 'EXPECTED':
      return 'EXPECTED';

    case 'BOARDED':
      return 'BOARDED';

    case 'WITHDRAWN':
      return 'WITHDRAWN';

    case 'NO_SHOW':
      return 'NO_SHOW';

    case 'REMOVED':
      return 'REMOVED';

    default:
      throw new Error(
        `Invalid persisted Journey Boarding participant status "${String(value)}".`,
      );
  }
}

/**
 * Converts a persisted Prisma boarding event type into the domain event
 * type value.
 */
function toJourneyBoardingEventType(
  value: PrismaJourneyBoardingEventType,
): JourneyBoardingEventTypeValue {
  switch (value) {
    case 'BOARDING_OPENED':
      return 'BOARDING_OPENED';

    case 'PROVIDER_BOARDED':
      return 'PROVIDER_BOARDED';

    case 'PASSENGER_BOARDED':
      return 'PASSENGER_BOARDED';

    case 'PASSENGER_NO_SHOW':
      return 'PASSENGER_NO_SHOW';

    case 'BOARDING_WITHDRAWN':
      return 'BOARDING_WITHDRAWN';

    case 'PARTICIPANT_REMOVED':
      return 'PARTICIPANT_REMOVED';

    case 'JOURNEY_STARTED':
      return 'JOURNEY_STARTED';

    case 'BOARDING_CANCELLED':
      return 'BOARDING_CANCELLED';

    default:
      throw new Error(
        `Invalid persisted Journey Boarding event type "${String(value)}".`,
      );
  }
}

// =============================================================================
// Prisma Graph Types
// =============================================================================

/**
 * Prisma Journey Boarding record with its aggregate-owned children.
 *
 * Relations remain optional so the mapper can also be used with a root-only
 * query. Complete aggregate rehydration should normally load both relations.
 */
export type JourneyBoardingWithComponents = PrismaJourneyBoarding & {
  participants?: PrismaJourneyBoardingParticipant[];
  events?: PrismaJourneyBoardingEvent[];
};

// =============================================================================
// Persistence Types
// =============================================================================

export interface JourneyBoardingPersistence {
  journeyBoarding: ReturnType<
    typeof JourneyBoardingPrismaMapper.boardingToPersistence
  >;

  participants: ReturnType<
    typeof JourneyBoardingPrismaMapper.participantToPersistence
  >[];

  events: ReturnType<typeof JourneyBoardingPrismaMapper.eventToPersistence>[];
}

// =============================================================================
// Mapper
// =============================================================================

export class JourneyBoardingPrismaMapper {
  // ===========================================================================
  // Aggregate → Domain
  // ===========================================================================

  /**
   * Rehydrates the complete Journey Boarding aggregate.
   *
   * The owning boarding public ID is propagated into every participant and
   * historical event because Prisma stores their foreign keys using the
   * internal JourneyBoarding.id.
   */
  public static toDomain(
    record: JourneyBoardingWithComponents,
  ): JourneyBoardingAggregate {
    const boarding = this.boardingToDomain(record);

    const participants =
      record.participants?.map((participant) =>
        this.participantToDomain(participant, boarding.publicId),
      ) ?? [];

    const events =
      record.events?.map((event) =>
        this.eventToDomain(event, boarding.publicId),
      ) ?? [];

    return JourneyBoardingAggregate.rehydrate(boarding, participants, events);
  }

  // ===========================================================================
  // Journey Boarding
  // ===========================================================================

  /**
   * Maps a persisted Journey Boarding root into the domain entity.
   */
  public static boardingToDomain(
    record: PrismaJourneyBoarding,
  ): JourneyBoardingEntity {
    const publicId = new JourneyBoardingPublicId(record.publicId);

    return JourneyBoardingEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        publicId,

        // ---------------------------------------------------------------------
        // Journey
        // ---------------------------------------------------------------------

        journeyId: JourneyBoardingJourneyId.create(record.journeyId),

        // ---------------------------------------------------------------------
        // Provider
        // ---------------------------------------------------------------------

        providerPublicId: new JourneyBoardingProviderPublicId(
          record.providerPublicId,
        ),

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        status: JourneyBoardingStatus.create(
          toJourneyBoardingStatus(record.status),
        ),

        boardingStartedAt: record.boardingStartedAt ?? undefined,

        journeyStartedAt: record.journeyStartedAt ?? undefined,

        cancelledAt: record.cancelledAt ?? undefined,

        // ---------------------------------------------------------------------
        // Version
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
   * Maps the domain Journey Boarding root into Prisma persistence shape.
   */
  public static boardingToPersistence(entity: JourneyBoardingEntity): {
    id: string;
    publicId: string;
    journeyId: string;
    providerPublicId: string;
    status: PrismaJourneyBoardingStatus;
    boardingStartedAt: Date | null;
    journeyStartedAt: Date | null;
    cancelledAt: Date | null;
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
      // Journey
      // -----------------------------------------------------------------------

      journeyId: entity.journeyId.value,

      // -----------------------------------------------------------------------
      // Provider
      // -----------------------------------------------------------------------

      providerPublicId: entity.providerPublicId.value,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: entity.status.value,

      boardingStartedAt: entity.boardingStartedAt ?? null,

      journeyStartedAt: entity.journeyStartedAt ?? null,

      cancelledAt: entity.cancelledAt ?? null,

      // -----------------------------------------------------------------------
      // Version
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
   * Converts the complete aggregate into persistence structures.
   *
   * Child Prisma foreign keys deliberately use the aggregate's internal
   * database ID rather than its public ID.
   */
  public static toPersistence(
    aggregate: JourneyBoardingAggregate,
  ): JourneyBoardingPersistence {
    const boarding = aggregate.journeyBoarding;

    const boardingId = boarding.id.toString();

    return {
      journeyBoarding: this.boardingToPersistence(boarding),

      participants: aggregate.participants.map((participant) =>
        this.participantToPersistence(participant, boardingId),
      ),

      events: aggregate.events.map((event) =>
        this.eventToPersistence(event, boardingId),
      ),
    };
  }

  // ===========================================================================
  // Participant
  // ===========================================================================

  /**
   * Maps a persisted participant into the domain entity.
   *
   * IMPORTANT:
   *
   * `record.boardingId` is Prisma's internal JourneyBoarding.id.
   * It MUST NOT be assigned to the domain participant's `boardingId`,
   * which represents JourneyBoardingPublicId.
   */
  private static participantToDomain(
    record: PrismaJourneyBoardingParticipant,
    boardingPublicId: JourneyBoardingPublicId,
  ): JourneyBoardingParticipantEntity {
    const publicId = new JourneyBoardingParticipantPublicId(record.publicId);

    return JourneyBoardingParticipantEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        publicId,

        // ---------------------------------------------------------------------
        // Boarding
        // ---------------------------------------------------------------------

        boardingId: boardingPublicId,

        // ---------------------------------------------------------------------
        // Member
        // ---------------------------------------------------------------------

        memberPublicId: new JourneyBoardingMemberPublicId(
          record.memberPublicId,
        ),

        // ---------------------------------------------------------------------
        // Booking
        // ---------------------------------------------------------------------

        bookingPublicId:
          record.bookingPublicId !== null
            ? new JourneyBoardingBookingPublicId(record.bookingPublicId)
            : undefined,

        // ---------------------------------------------------------------------
        // Role
        // ---------------------------------------------------------------------

        role: JourneyBoardingParticipantRole.create(
          toJourneyBoardingParticipantRole(record.role),
        ),

        // ---------------------------------------------------------------------
        // Status
        // ---------------------------------------------------------------------

        status: JourneyBoardingParticipantStatus.create(
          toJourneyBoardingParticipantStatus(record.status),
        ),

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        expectedAt: record.expectedAt,

        boardedAt: record.boardedAt ?? undefined,

        withdrawnAt: record.withdrawnAt ?? undefined,

        noShowAt: record.noShowAt ?? undefined,

        removedAt: record.removedAt ?? undefined,

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
   * Maps a participant into Prisma persistence shape.
   *
   * `boardingId` is the internal JourneyBoarding.id required by Prisma.
   */
  public static participantToPersistence(
    entity: JourneyBoardingParticipantEntity,
    boardingId: string,
  ): {
    id: string;
    publicId: string;
    boardingId: string;
    memberPublicId: string;
    bookingPublicId: string | null;
    role: PrismaJourneyBoardingParticipantRole;
    status: PrismaJourneyBoardingParticipantStatus;
    expectedAt: Date;
    boardedAt: Date | null;
    withdrawnAt: Date | null;
    noShowAt: Date | null;
    removedAt: Date | null;
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
      // Relationship
      // -----------------------------------------------------------------------

      boardingId,

      // -----------------------------------------------------------------------
      // Member
      // -----------------------------------------------------------------------

      memberPublicId: entity.memberPublicId.value,

      // -----------------------------------------------------------------------
      // Booking
      // -----------------------------------------------------------------------

      bookingPublicId: entity.bookingPublicId?.value ?? null,

      // -----------------------------------------------------------------------
      // Role
      // -----------------------------------------------------------------------

      role: entity.role.value,

      // -----------------------------------------------------------------------
      // Status
      // -----------------------------------------------------------------------

      status: entity.status.value,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      expectedAt: entity.expectedAt,

      boardedAt: entity.boardedAt ?? null,

      withdrawnAt: entity.withdrawnAt ?? null,

      noShowAt: entity.noShowAt ?? null,

      removedAt: entity.removedAt ?? null,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Event
  // ===========================================================================

  /**
   * Converts Prisma JSON metadata into the domain metadata representation.
   *
   * The domain event metadata is intentionally object-shaped. Scalar and
   * array Prisma JSON values therefore do not enter the domain as metadata.
   */
  private static toDomainMetadata(
    metadata: PrismaJourneyBoardingEvent['metadata'],
  ): Record<string, unknown> | undefined {
    if (metadata === null || typeof metadata !== 'object') {
      return undefined;
    }

    if (Array.isArray(metadata)) {
      return undefined;
    }

    return JSON.parse(JSON.stringify(metadata)) as Record<string, unknown>;
  }

  /**
   * Converts domain metadata into a Prisma-compatible JSON value.
   *
   * JSON serialization is used to ensure the persistence boundary does not
   * retain references to mutable domain objects.
   */
  private static toPersistenceMetadata(
    metadata: Record<string, unknown> | undefined,
  ): Prisma.InputJsonValue | null {
    if (metadata === undefined) {
      return null;
    }

    return JSON.parse(JSON.stringify(metadata)) as Prisma.InputJsonValue;
  }

  /**
   * Maps a persisted boarding event into the domain entity.
   *
   * IMPORTANT:
   *
   * `record.boardingId` is Prisma's internal JourneyBoarding.id.
   * The owning boarding public ID is therefore supplied explicitly.
   */
  private static eventToDomain(
    record: PrismaJourneyBoardingEvent,
    boardingPublicId: JourneyBoardingPublicId,
  ): JourneyBoardingEventEntity {
    const publicId = new JourneyBoardingEventPublicId(record.publicId);

    return JourneyBoardingEventEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        publicId,

        // ---------------------------------------------------------------------
        // Boarding
        // ---------------------------------------------------------------------

        boardingId: boardingPublicId,

        // ---------------------------------------------------------------------
        // Event Type
        // ---------------------------------------------------------------------

        type: JourneyBoardingEventType.create(
          toJourneyBoardingEventType(record.type),
        ),

        // ---------------------------------------------------------------------
        // Member
        // ---------------------------------------------------------------------

        memberPublicId:
          record.memberPublicId !== null
            ? new JourneyBoardingMemberPublicId(record.memberPublicId)
            : undefined,

        // ---------------------------------------------------------------------
        // Booking
        // ---------------------------------------------------------------------

        bookingPublicId:
          record.bookingPublicId !== null
            ? new JourneyBoardingBookingPublicId(record.bookingPublicId)
            : undefined,

        // ---------------------------------------------------------------------
        // Actor
        // ---------------------------------------------------------------------

        actorPublicId:
          record.actorPublicId !== null
            ? new JourneyBoardingActorPublicId(record.actorPublicId)
            : undefined,

        // ---------------------------------------------------------------------
        // Occurrence
        // ---------------------------------------------------------------------

        occurredAt: record.occurredAt,

        // ---------------------------------------------------------------------
        // Metadata
        // ---------------------------------------------------------------------

        metadata: this.toDomainMetadata(record.metadata),

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: record.createdAt,
      },

      new UniqueEntityId(record.id),

      publicId,
    );
  }

  /**
   * Maps a boarding event into Prisma persistence shape.
   */
  public static eventToPersistence(
    entity: JourneyBoardingEventEntity,
    boardingId: string,
  ): {
    id: string;
    publicId: string;
    boardingId: string;
    type: PrismaJourneyBoardingEventType;
    memberPublicId: string | null;
    bookingPublicId: string | null;
    actorPublicId: string | null;
    occurredAt: Date;
    metadata: Prisma.InputJsonValue | null;
    createdAt: Date;
  } {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      // -----------------------------------------------------------------------
      // Relationship
      // -----------------------------------------------------------------------

      boardingId,

      // -----------------------------------------------------------------------
      // Event Type
      // -----------------------------------------------------------------------

      type: entity.type.value,

      // -----------------------------------------------------------------------
      // Member
      // -----------------------------------------------------------------------

      memberPublicId: entity.memberPublicId?.value ?? null,

      // -----------------------------------------------------------------------
      // Booking
      // -----------------------------------------------------------------------

      bookingPublicId: entity.bookingPublicId?.value ?? null,

      // -----------------------------------------------------------------------
      // Actor
      // -----------------------------------------------------------------------

      actorPublicId: entity.actorPublicId?.value ?? null,

      // -----------------------------------------------------------------------
      // Occurrence
      // -----------------------------------------------------------------------

      occurredAt: entity.occurredAt,

      // -----------------------------------------------------------------------
      // Metadata
      // -----------------------------------------------------------------------

      metadata: this.toPersistenceMetadata(entity.metadata),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt,
    };
  }

  // ===========================================================================
  // Aggregate Graph Component Mapping
  // ===========================================================================

  /**
   * Rehydrates a participant when its owning boarding public ID is known.
   */
  public static toParticipantDomain(
    record: PrismaJourneyBoardingParticipant,
    boardingPublicId: JourneyBoardingPublicId,
  ): JourneyBoardingParticipantEntity {
    return this.participantToDomain(record, boardingPublicId);
  }

  /**
   * Rehydrates a historical boarding event when its owning boarding public ID
   * is known.
   */
  public static toEventDomain(
    record: PrismaJourneyBoardingEvent,
    boardingPublicId: JourneyBoardingPublicId,
  ): JourneyBoardingEventEntity {
    return this.eventToDomain(record, boardingPublicId);
  }

  // ===========================================================================
  // Component Mapping
  // ===========================================================================

  /**
   * Converts an individual persisted Journey Boarding component.
   *
   * For participant/event records, `boardingPublicId` is mandatory because
   * Prisma's `boardingId` is an internal database foreign key.
   */
  public static toDomainComponent(
    record:
      | PrismaJourneyBoarding
      | PrismaJourneyBoardingParticipant
      | PrismaJourneyBoardingEvent,
    boardingPublicId?: JourneyBoardingPublicId,
  ):
    | JourneyBoardingEntity
    | JourneyBoardingParticipantEntity
    | JourneyBoardingEventEntity {
    // -------------------------------------------------------------------------
    // Journey Boarding
    // -------------------------------------------------------------------------

    if (this.isJourneyBoardingRecord(record)) {
      return this.boardingToDomain(record);
    }

    // -------------------------------------------------------------------------
    // Participant
    // -------------------------------------------------------------------------

    if (this.isParticipantRecord(record)) {
      if (boardingPublicId === undefined) {
        throw new Error(
          'Journey Boarding public ID is required when mapping a participant.',
        );
      }

      return this.participantToDomain(record, boardingPublicId);
    }

    // -------------------------------------------------------------------------
    // Event
    // -------------------------------------------------------------------------

    if (this.isEventRecord(record)) {
      if (boardingPublicId === undefined) {
        throw new Error(
          'Journey Boarding public ID is required when mapping a boarding event.',
        );
      }

      return this.eventToDomain(record, boardingPublicId);
    }

    throw new Error(
      'Unsupported Journey Boarding Prisma record supplied to mapper.',
    );
  }

  // ===========================================================================
  // Prisma Record Guards
  // ===========================================================================

  /**
   * Identifies a JourneyBoarding Prisma root record.
   */
  private static isJourneyBoardingRecord(
    record:
      | PrismaJourneyBoarding
      | PrismaJourneyBoardingParticipant
      | PrismaJourneyBoardingEvent,
  ): record is PrismaJourneyBoarding {
    return (
      'journeyId' in record &&
      'providerPublicId' in record &&
      'status' in record &&
      'version' in record
    );
  }

  /**
   * Identifies a JourneyBoardingParticipant Prisma record.
   */
  private static isParticipantRecord(
    record:
      | PrismaJourneyBoarding
      | PrismaJourneyBoardingParticipant
      | PrismaJourneyBoardingEvent,
  ): record is PrismaJourneyBoardingParticipant {
    return (
      'memberPublicId' in record &&
      'role' in record &&
      'expectedAt' in record &&
      'boardingId' in record
    );
  }

  /**
   * Identifies a JourneyBoardingEvent Prisma record.
   */
  private static isEventRecord(
    record:
      | PrismaJourneyBoarding
      | PrismaJourneyBoardingParticipant
      | PrismaJourneyBoardingEvent,
  ): record is PrismaJourneyBoardingEvent {
    return (
      'type' in record &&
      'occurredAt' in record &&
      'boardingId' in record &&
      !('role' in record)
    );
  }
}
