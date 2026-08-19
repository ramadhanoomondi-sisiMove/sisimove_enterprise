// src/domains/journey-boarding/presentation/rest/mappers/journey-boarding-response.mapper.ts

// -----------------------------------------------------------------------------
// Journey Boarding — REST Response Mapper
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyBoardingAggregate } from '../../../domain/aggregates/journey-boarding.aggregate';

import type { JourneyBoardingEntity } from '../../../domain/entities/journey-boarding.entity';

import type { JourneyBoardingParticipantEntity } from '../../../domain/entities/journey-boarding-participant.entity';

import type { JourneyBoardingEventEntity } from '../../../domain/entities/journey-boarding-event.entity';

// -----------------------------------------------------------------------------
// Response Types
// -----------------------------------------------------------------------------

/**
 * REST representation of a Journey Boarding aggregate.
 *
 * Domain value objects are converted to primitives at the presentation
 * boundary. Domain entities and UniqueEntityId instances are never exposed
 * directly through the HTTP response.
 */
export interface JourneyBoardingResponse {
  // ===========================================================================
  // Identity
  // ===========================================================================

  publicId: string;

  journeyId: string;

  providerPublicId: string;

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  status: string;

  boardingStartedAt: Date | undefined;

  journeyStartedAt: Date | undefined;

  cancelledAt: Date | undefined;

  version: number;

  // ===========================================================================
  // Participants
  // ===========================================================================

  participants: JourneyBoardingParticipantResponse[];

  // ===========================================================================
  // Events
  // ===========================================================================

  events: JourneyBoardingEventResponse[];

  // ===========================================================================
  // Audit
  // ===========================================================================

  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Participant Response
// -----------------------------------------------------------------------------

/**
 * REST representation of a Journey Boarding participant.
 */
export interface JourneyBoardingParticipantResponse {
  // ===========================================================================
  // Identity
  // ===========================================================================

  publicId: string;

  boardingId: string;

  memberPublicId: string;

  bookingPublicId: string | undefined;

  // ===========================================================================
  // Boarding
  // ===========================================================================

  role: string;

  status: string;

  expectedAt: Date;

  boardedAt: Date | undefined;

  withdrawnAt: Date | undefined;

  noShowAt: Date | undefined;

  removedAt: Date | undefined;

  // ===========================================================================
  // Audit
  // ===========================================================================

  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Event Response
// -----------------------------------------------------------------------------

/**
 * REST representation of a historical Journey Boarding event.
 */
export interface JourneyBoardingEventResponse {
  // ===========================================================================
  // Identity
  // ===========================================================================

  publicId: string;

  boardingId: string;

  // ===========================================================================
  // Event
  // ===========================================================================

  type: string;

  memberPublicId: string | undefined;

  bookingPublicId: string | undefined;

  actorPublicId: string | undefined;

  occurredAt: Date;

  metadata: Record<string, unknown> | undefined;

  // ===========================================================================
  // Audit
  // ===========================================================================

  createdAt: Date;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

/**
 * Maps Journey Boarding domain objects into REST response objects.
 *
 * IMPORTANT:
 *
 * `JourneyBoardingEntity` owns only the root boarding state.
 *
 * Participants and historical boarding events belong to
 * `JourneyBoardingAggregate`, not `JourneyBoardingEntity`.
 *
 * Therefore:
 *
 *     aggregate.participants
 *     aggregate.events
 *
 * must be used when mapping a complete aggregate.
 *
 * Do NOT attempt:
 *
 *     boarding.participants
 *     boarding.events
 *
 * because those properties intentionally do not exist on
 * JourneyBoardingEntity.
 */
export class JourneyBoardingResponseMapper {
  // ===========================================================================
  // Aggregate
  // ===========================================================================

  /**
   * Maps a fully rehydrated Journey Boarding aggregate.
   *
   * This is the preferred mapper for detail responses because it preserves
   * the complete aggregate-owned participant and event collections.
   */
  public static toResponse(
    aggregate: JourneyBoardingAggregate,
  ): JourneyBoardingResponse {
    return this.fromEntity(
      aggregate.journeyBoarding,
      aggregate.participants,
      aggregate.events,
    );
  }

  // ===========================================================================
  // Entity
  // ===========================================================================

  /**
   * Maps the Journey Boarding root entity.
   *
   * Participants and events are supplied separately because they are owned
   * by the aggregate rather than by JourneyBoardingEntity.
   *
   * The defaults allow callers that only have the root entity to safely map
   * the root without pretending that the entity itself owns child collections.
   */
  public static fromEntity(
    boarding: JourneyBoardingEntity,
    participants: readonly JourneyBoardingParticipantEntity[] = [],
    events: readonly JourneyBoardingEventEntity[] = [],
  ): JourneyBoardingResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: boarding.publicId.value,

      journeyId: boarding.journeyId.value,

      providerPublicId: boarding.providerPublicId.value,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: boarding.status.value,

      boardingStartedAt: boarding.boardingStartedAt,

      journeyStartedAt: boarding.journeyStartedAt,

      cancelledAt: boarding.cancelledAt,

      version: boarding.version,

      // -----------------------------------------------------------------------
      // Participants
      // -----------------------------------------------------------------------

      participants: this.mapParticipants(participants),

      // -----------------------------------------------------------------------
      // Events
      // -----------------------------------------------------------------------

      events: this.mapEvents(events),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: boarding.createdAt,

      updatedAt: boarding.updatedAt,
    };
  }

  // ===========================================================================
  // Aggregate Collection
  // ===========================================================================

  /**
   * Maps a collection of Journey Boarding aggregates.
   *
   * Use this when the repository/application layer returns fully rehydrated
   * aggregates.
   */
  public static fromAggregates(
    aggregates: readonly JourneyBoardingAggregate[],
  ): JourneyBoardingResponse[] {
    return aggregates.map((aggregate) => this.toResponse(aggregate));
  }

  // ===========================================================================
  // Entity Collection
  // ===========================================================================

  /**
   * Maps a collection of Journey Boarding root entities.
   *
   * Since root entities do not contain participants/events, those collections
   * will be empty unless child collections are mapped through `fromEntity`
   * individually.
   */
  public static fromEntities(
    boardings: readonly JourneyBoardingEntity[],
  ): JourneyBoardingResponse[] {
    return boardings.map((boarding) => this.fromEntity(boarding));
  }

  // ===========================================================================
  // Aggregate Child Collections
  // ===========================================================================

  /**
   * Maps aggregate-owned participants.
   */
  private static mapParticipants(
    participants: readonly JourneyBoardingParticipantEntity[],
  ): JourneyBoardingParticipantResponse[] {
    return participants.map((participant) => this.mapParticipant(participant));
  }

  /**
   * Maps a single Journey Boarding participant.
   */
  private static mapParticipant(
    participant: JourneyBoardingParticipantEntity,
  ): JourneyBoardingParticipantResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: participant.publicId.value,

      boardingId: participant.boardingId.value,

      memberPublicId: participant.memberPublicId.value,

      bookingPublicId: participant.bookingPublicId?.value,

      // -----------------------------------------------------------------------
      // Boarding
      // -----------------------------------------------------------------------

      role: participant.role.value,

      status: participant.status.value,

      expectedAt: participant.expectedAt,

      boardedAt: participant.boardedAt,

      withdrawnAt: participant.withdrawnAt,

      noShowAt: participant.noShowAt,

      removedAt: participant.removedAt,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: participant.createdAt,

      updatedAt: participant.updatedAt,
    };
  }

  // ===========================================================================
  // Aggregate Event History
  // ===========================================================================

  /**
   * Maps aggregate-owned historical events.
   */
  private static mapEvents(
    events: readonly JourneyBoardingEventEntity[],
  ): JourneyBoardingEventResponse[] {
    return events.map((event) => this.mapEvent(event));
  }

  /**
   * Maps a single Journey Boarding historical event.
   */
  private static mapEvent(
    event: JourneyBoardingEventEntity,
  ): JourneyBoardingEventResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: event.publicId.value,

      boardingId: event.boardingId.value,

      // -----------------------------------------------------------------------
      // Event
      // -----------------------------------------------------------------------

      type: event.type.value,

      memberPublicId: event.memberPublicId?.value,

      bookingPublicId: event.bookingPublicId?.value,

      actorPublicId: event.actorPublicId?.value,

      occurredAt: event.occurredAt,

      metadata: event.metadata,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: event.createdAt,
    };
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JourneyBoardingResponseMapper;
