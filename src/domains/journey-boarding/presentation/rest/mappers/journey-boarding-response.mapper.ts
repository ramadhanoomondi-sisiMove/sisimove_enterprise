/**
 * Path:
 * src/domains/journey-boarding/presentation/rest/mappers/journey-boarding-response.mapper.ts
 *
 * sisiMove — Journey Boarding REST Response Mapper
 *
 * Architectural rules:
 * - The domain stores the Journey's internal database ID.
 * - REST responses expose the Journey's public ID as `journeyId`.
 * - The mapper never accesses repositories or performs database queries.
 * - Callers must supply the resolved public Journey ID.
 * - Missing public-ID mappings fail explicitly rather than leaking internal IDs.
 */

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
 * `journeyId` is the public identifier of the associated Journey.
 */
export interface JourneyBoardingResponse {
  publicId: string;
  journeyId: string;
  providerPublicId: string;

  status: string;

  boardingStartedAt: Date | undefined;
  journeyStartedAt: Date | undefined;
  cancelledAt: Date | undefined;

  version: number;

  participants: JourneyBoardingParticipantResponse[];
  events: JourneyBoardingEventResponse[];

  createdAt: Date;
  updatedAt: Date;
}

/**
 * REST representation of a Journey Boarding participant.
 */
export interface JourneyBoardingParticipantResponse {
  publicId: string;
  boardingId: string;
  memberPublicId: string;
  bookingPublicId: string | undefined;

  role: string;
  status: string;

  expectedAt: Date;
  boardedAt: Date | undefined;
  withdrawnAt: Date | undefined;
  noShowAt: Date | undefined;
  removedAt: Date | undefined;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * REST representation of a historical Journey Boarding event.
 */
export interface JourneyBoardingEventResponse {
  publicId: string;
  boardingId: string;

  type: string;

  memberPublicId: string | undefined;
  bookingPublicId: string | undefined;
  actorPublicId: string | undefined;

  occurredAt: Date;
  metadata: Record<string, unknown> | undefined;

  createdAt: Date;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export class JourneyBoardingResponseMapper {
  // ===========================================================================
  // Aggregate
  // ===========================================================================

  /**
   * Maps a fully rehydrated Journey Boarding aggregate.
   *
   * `journeyPublicId` must be resolved by the application/query layer.
   * Do not pass the internal Journey database ID here.
   */
  public static toResponse(
    aggregate: JourneyBoardingAggregate,
    journeyPublicId: string,
  ): JourneyBoardingResponse {
    return this.fromEntity(
      aggregate.journeyBoarding,
      journeyPublicId,
      aggregate.participants,
      aggregate.events,
    );
  }

  // ===========================================================================
  // Entity
  // ===========================================================================

  /**
   * Maps the boarding root entity and its separately supplied child collections.
   *
   * The public Journey ID is mandatory because JourneyBoardingEntity stores
   * only the internal Journey database ID.
   */
  public static fromEntity(
    boarding: JourneyBoardingEntity,
    journeyPublicId: string,
    participants: readonly JourneyBoardingParticipantEntity[] = [],
    events: readonly JourneyBoardingEventEntity[] = [],
  ): JourneyBoardingResponse {
    const normalizedJourneyPublicId =
      this.requireJourneyPublicId(journeyPublicId);

    return {
      // Identity
      publicId: boarding.publicId.value,
      journeyId: normalizedJourneyPublicId,
      providerPublicId: boarding.providerPublicId.value,

      // Lifecycle
      status: boarding.status.value,
      boardingStartedAt: boarding.boardingStartedAt,
      journeyStartedAt: boarding.journeyStartedAt,
      cancelledAt: boarding.cancelledAt,
      version: boarding.version,

      // Aggregate-owned children
      participants: this.mapParticipants(participants),
      events: this.mapEvents(events),

      // Audit
      createdAt: boarding.createdAt,
      updatedAt: boarding.updatedAt,
    };
  }

  // ===========================================================================
  // Aggregate Collection
  // ===========================================================================

  /**
   * Maps a collection of rehydrated aggregates.
   *
   * `journeyPublicIds` is keyed by the internal Journey ID stored in each
   * boarding entity. Its values must be the corresponding public Journey IDs.
   *
   * Example:
   * new Map([
   *   ['internal-journey-id-1', 'JNY-ABC123'],
   * ])
   */
  public static fromAggregates(
    aggregates: readonly JourneyBoardingAggregate[],
    journeyPublicIds: ReadonlyMap<string, string>,
  ): JourneyBoardingResponse[] {
    return aggregates.map((aggregate) => {
      const internalJourneyId = aggregate.journeyBoarding.journeyId.value;

      const journeyPublicId = this.getJourneyPublicId(
        journeyPublicIds,
        internalJourneyId,
      );

      return this.toResponse(aggregate, journeyPublicId);
    });
  }

  // ===========================================================================
  // Entity Collection
  // ===========================================================================

  /**
   * Maps boarding root entities when the caller has resolved their Journey
   * public IDs.
   *
   * Participants and events are empty because this method receives root
   * entities only.
   */
  public static fromEntities(
    boardings: readonly JourneyBoardingEntity[],
    journeyPublicIds: ReadonlyMap<string, string>,
  ): JourneyBoardingResponse[] {
    return boardings.map((boarding) => {
      const internalJourneyId = boarding.journeyId.value;

      const journeyPublicId = this.getJourneyPublicId(
        journeyPublicIds,
        internalJourneyId,
      );

      return this.fromEntity(boarding, journeyPublicId);
    });
  }

  // ===========================================================================
  // Journey Public-ID Resolution
  // ===========================================================================

  private static getJourneyPublicId(
    journeyPublicIds: ReadonlyMap<string, string>,
    internalJourneyId: string,
  ): string {
    const journeyPublicId = journeyPublicIds.get(internalJourneyId);

    if (journeyPublicId === undefined) {
      throw new Error(
        `Missing public Journey ID mapping for internal Journey ID: ${internalJourneyId}`,
      );
    }

    return this.requireJourneyPublicId(journeyPublicId);
  }

  private static requireJourneyPublicId(journeyPublicId: string): string {
    const normalized = journeyPublicId.trim();

    if (!normalized) {
      throw new Error(
        'Journey public ID is required to create a Journey Boarding response.',
      );
    }

    return normalized;
  }

  // ===========================================================================
  // Participants
  // ===========================================================================

  private static mapParticipants(
    participants: readonly JourneyBoardingParticipantEntity[],
  ): JourneyBoardingParticipantResponse[] {
    return participants.map((participant) => this.mapParticipant(participant));
  }

  private static mapParticipant(
    participant: JourneyBoardingParticipantEntity,
  ): JourneyBoardingParticipantResponse {
    return {
      publicId: participant.publicId.value,
      boardingId: participant.boardingId.value,
      memberPublicId: participant.memberPublicId.value,
      bookingPublicId: participant.bookingPublicId?.value,

      role: participant.role.value,
      status: participant.status.value,

      expectedAt: participant.expectedAt,
      boardedAt: participant.boardedAt,
      withdrawnAt: participant.withdrawnAt,
      noShowAt: participant.noShowAt,
      removedAt: participant.removedAt,

      createdAt: participant.createdAt,
      updatedAt: participant.updatedAt,
    };
  }

  /**
   * Maps participant entities into their public REST response contract.
   *
   * Used by the dedicated participants endpoint so internal entity
   * properties and value-object structures are never exposed over HTTP.
   */
  public static participantsToResponse(
    participants: readonly JourneyBoardingParticipantEntity[],
  ): JourneyBoardingParticipantResponse[] {
    return this.mapParticipants(participants);
  }

  // ===========================================================================
  // Events
  // ===========================================================================

  private static mapEvents(
    events: readonly JourneyBoardingEventEntity[],
  ): JourneyBoardingEventResponse[] {
    return events.map((event) => this.mapEvent(event));
  }

  private static mapEvent(
    event: JourneyBoardingEventEntity,
  ): JourneyBoardingEventResponse {
    return {
      publicId: event.publicId.value,
      boardingId: event.boardingId.value,

      type: event.type.value,

      memberPublicId: event.memberPublicId?.value,
      bookingPublicId: event.bookingPublicId?.value,
      actorPublicId: event.actorPublicId?.value,

      occurredAt: event.occurredAt,
      metadata: event.metadata,

      createdAt: event.createdAt,
    };
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JourneyBoardingResponseMapper;
