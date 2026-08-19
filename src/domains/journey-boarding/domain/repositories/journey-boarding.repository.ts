// -----------------------------------------------------------------------------
// Journey Boarding Repository
// -----------------------------------------------------------------------------
//
// Domain repository contract for the Journey Boarding aggregate.
//
// Responsibilities:
// - Aggregate persistence and rehydration
// - Aggregate-scoped lookup
// - Root Journey Boarding queries
// - Participant queries
// - Boarding event history queries
//
// Persistence concerns such as Prisma includes, joins, transactions,
// pagination, indexing, and query optimization belong to infrastructure.
//
// Cross-domain references such as journeyId, providerPublicId,
// memberPublicId, and bookingPublicId are represented by Journey Boarding
// value objects and remain identifiers only.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { JourneyBoardingAggregate } from '../aggregates/journey-boarding.aggregate';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { JourneyBoardingEntity } from '../entities/journey-boarding.entity';

import type { JourneyBoardingParticipantEntity } from '../entities/journey-boarding-participant.entity';

import type { JourneyBoardingEventEntity } from '../entities/journey-boarding-event.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyBoardingPublicId } from '../value-objects/journey-boarding-public-id.vo';

import type { JourneyBoardingJourneyId } from '../value-objects/journey-boarding-journey-id.vo';

import type { JourneyBoardingProviderPublicId } from '../value-objects/journey-boarding-provider-public-id.vo';

import type { JourneyBoardingMemberPublicId } from '../value-objects/journey-boarding-member-public-id.vo';

import type { JourneyBoardingBookingPublicId } from '../value-objects/journey-boarding-booking-public-id.vo';

import type { JourneyBoardingParticipantPublicId } from '../value-objects/journey-boarding-participant-public-id.vo';

import type { JourneyBoardingParticipantRole } from '../value-objects/journey-boarding-participant-role.vo';

import type { JourneyBoardingParticipantStatus } from '../value-objects/journey-boarding-participant-status.vo';

import type { JourneyBoardingStatus } from '../value-objects/journey-boarding-status.vo';

import type { JourneyBoardingEventPublicId } from '../value-objects/journey-boarding-event-public-id.vo';

import type { JourneyBoardingEventType } from '../value-objects/journey-boarding-event-type.vo';

// =============================================================================
// Journey Boarding Repository
// =============================================================================

/**
 * Domain repository contract for the Journey Boarding aggregate.
 *
 * Aggregate boundary:
 *
 * JourneyBoardingAggregate
 * ├── JourneyBoardingEntity
 * ├── JourneyBoardingParticipantEntity[]
 * └── JourneyBoardingEventEntity[]
 *
 * The repository exposes both aggregate-level persistence operations and
 * aggregate-scoped read queries.
 *
 * Cross-domain identities are represented by value objects only.
 */
export interface JourneyBoardingRepository {
  // ===========================================================================
  // Aggregate Persistence
  // ===========================================================================

  /**
   * Persists the complete Journey Boarding aggregate.
   *
   * Infrastructure is responsible for persisting the root entity,
   * participants, and historical boarding events atomically.
   */
  save(aggregate: JourneyBoardingAggregate): Promise<void>;

  /**
   * Finds and rehydrates a Journey Boarding aggregate by internal ID.
   */
  findById(id: UniqueEntityId): Promise<JourneyBoardingAggregate | null>;

  /**
   * Finds and rehydrates a Journey Boarding aggregate by public ID.
   */
  findByPublicId(
    publicId: JourneyBoardingPublicId,
  ): Promise<JourneyBoardingAggregate | null>;

  /**
   * Deletes a Journey Boarding aggregate by internal ID.
   *
   * Infrastructure is responsible for deleting all aggregate-owned
   * participants and historical events according to persistence rules.
   */
  delete(id: UniqueEntityId): Promise<void>;

  /**
   * Determines whether a Journey Boarding exists by internal ID.
   */
  exists(id: UniqueEntityId): Promise<boolean>;

  /**
   * Determines whether a Journey Boarding exists by public ID.
   */
  existsByPublicId(publicId: JourneyBoardingPublicId): Promise<boolean>;

  // ===========================================================================
  // Root Journey Boarding Queries
  // ===========================================================================

  /**
   * Finds the Journey Boarding root entity by internal ID.
   *
   * This query does not imply aggregate rehydration.
   */
  findJourneyBoardingById(
    id: UniqueEntityId,
  ): Promise<JourneyBoardingEntity | null>;

  /**
   * Finds the Journey Boarding root entity by public ID.
   *
   * This query does not imply aggregate rehydration.
   */
  findJourneyBoardingByPublicId(
    publicId: JourneyBoardingPublicId,
  ): Promise<JourneyBoardingEntity | null>;

  /**
   * Returns all Journey Boarding root entities.
   */
  findJourneyBoardings(): Promise<JourneyBoardingEntity[]>;

  /**
   * Finds the Journey Boarding associated with a Journey.
   *
   * A Journey owns at most one Journey Boarding aggregate.
   */
  findJourneyBoardingByJourneyId(
    journeyId: JourneyBoardingJourneyId,
  ): Promise<JourneyBoardingEntity | null>;

  /**
   * Determines whether a Journey already has a Journey Boarding.
   */
  existsByJourneyId(journeyId: JourneyBoardingJourneyId): Promise<boolean>;

  /**
   * Finds Journey Boardings by lifecycle status.
   */
  findJourneyBoardingsByStatus(
    status: JourneyBoardingStatus,
  ): Promise<JourneyBoardingEntity[]>;

  /**
   * Finds Journey Boardings belonging to a provider.
   */
  findJourneyBoardingsByProviderPublicId(
    providerPublicId: JourneyBoardingProviderPublicId,
  ): Promise<JourneyBoardingEntity[]>;

  /**
   * Finds Journey Boardings belonging to a provider with a specific status.
   */
  findJourneyBoardingsByProviderAndStatus(
    providerPublicId: JourneyBoardingProviderPublicId,
    status: JourneyBoardingStatus,
  ): Promise<JourneyBoardingEntity[]>;

  /**
   * Finds Journey Boardings for a Journey with a specific lifecycle status.
   */
  findJourneyBoardingsByJourneyAndStatus(
    journeyId: JourneyBoardingJourneyId,
    status: JourneyBoardingStatus,
  ): Promise<JourneyBoardingEntity[]>;

  /**
   * Finds the active Journey Boarding for a Journey.
   *
   * Active means the aggregate has not reached STARTED or CANCELLED.
   */
  findActiveByJourneyId(
    journeyId: JourneyBoardingJourneyId,
  ): Promise<JourneyBoardingAggregate | null>;

  /**
   * Determines whether a Journey has an active Journey Boarding.
   */
  existsActiveByJourneyId(
    journeyId: JourneyBoardingJourneyId,
  ): Promise<boolean>;

  // ===========================================================================
  // Participant Queries
  // ===========================================================================

  /**
   * Finds a participant by internal ID.
   */
  findParticipantById(
    id: UniqueEntityId,
  ): Promise<JourneyBoardingParticipantEntity | null>;

  /**
   * Finds a participant by public ID within its owning Journey Boarding.
   */
  findParticipantByPublicId(
    journeyBoardingId: UniqueEntityId,
    participantPublicId: JourneyBoardingParticipantPublicId,
  ): Promise<JourneyBoardingParticipantEntity | null>;

  /**
   * Finds a participant by member public ID within a Journey Boarding.
   */
  findParticipantByMemberPublicId(
    journeyBoardingId: UniqueEntityId,
    memberPublicId: JourneyBoardingMemberPublicId,
  ): Promise<JourneyBoardingParticipantEntity | null>;

  /**
   * Finds a participant by Journey Booking public ID within a
   * Journey Boarding.
   */
  findParticipantByBookingPublicId(
    journeyBoardingId: UniqueEntityId,
    bookingPublicId: JourneyBoardingBookingPublicId,
  ): Promise<JourneyBoardingParticipantEntity | null>;

  /**
   * Finds all participants belonging to a Journey Boarding.
   */
  findParticipants(
    journeyBoardingId: UniqueEntityId,
  ): Promise<JourneyBoardingParticipantEntity[]>;

  /**
   * Finds participants by role within a Journey Boarding.
   */
  findParticipantsByRole(
    journeyBoardingId: UniqueEntityId,
    role: JourneyBoardingParticipantRole,
  ): Promise<JourneyBoardingParticipantEntity[]>;

  /**
   * Finds participants by status within a Journey Boarding.
   */
  findParticipantsByStatus(
    journeyBoardingId: UniqueEntityId,
    status: JourneyBoardingParticipantStatus,
  ): Promise<JourneyBoardingParticipantEntity[]>;

  /**
   * Finds the provider participant within a Journey Boarding.
   */
  findProviderParticipant(
    journeyBoardingId: UniqueEntityId,
  ): Promise<JourneyBoardingParticipantEntity | null>;

  /**
   * Finds all passenger participants within a Journey Boarding.
   */
  findPassengerParticipants(
    journeyBoardingId: UniqueEntityId,
  ): Promise<JourneyBoardingParticipantEntity[]>;

  /**
   * Finds all participants belonging to a member across Journey Boardings.
   */
  findParticipantsByMemberPublicId(
    memberPublicId: JourneyBoardingMemberPublicId,
  ): Promise<JourneyBoardingParticipantEntity[]>;

  /**
   * Finds all participants associated with a Journey Booking across
   * Journey Boardings.
   */
  findParticipantsByBookingPublicId(
    bookingPublicId: JourneyBoardingBookingPublicId,
  ): Promise<JourneyBoardingParticipantEntity[]>;

  /**
   * Determines whether a participant exists within a Journey Boarding.
   */
  existsParticipant(
    journeyBoardingId: UniqueEntityId,
    participantPublicId: JourneyBoardingParticipantPublicId,
  ): Promise<boolean>;

  /**
   * Determines whether a member is already a participant within a
   * Journey Boarding.
   */
  existsParticipantByMemberPublicId(
    journeyBoardingId: UniqueEntityId,
    memberPublicId: JourneyBoardingMemberPublicId,
  ): Promise<boolean>;

  /**
   * Determines whether a Journey Booking is already represented by a
   * participant within a Journey Boarding.
   */
  existsParticipantByBookingPublicId(
    journeyBoardingId: UniqueEntityId,
    bookingPublicId: JourneyBoardingBookingPublicId,
  ): Promise<boolean>;

  /**
   * Counts all participants belonging to a Journey Boarding.
   */
  countParticipants(journeyBoardingId: UniqueEntityId): Promise<number>;

  /**
   * Counts passenger participants belonging to a Journey Boarding.
   */
  countPassengerParticipants(
    journeyBoardingId: UniqueEntityId,
  ): Promise<number>;

  /**
   * Counts boarded participants belonging to a Journey Boarding.
   */
  countBoardedParticipants(journeyBoardingId: UniqueEntityId): Promise<number>;

  /**
   * Counts expected participants belonging to a Journey Boarding.
   */
  countExpectedParticipants(journeyBoardingId: UniqueEntityId): Promise<number>;

  /**
   * Counts withdrawn participants belonging to a Journey Boarding.
   */
  countWithdrawnParticipants(
    journeyBoardingId: UniqueEntityId,
  ): Promise<number>;

  /**
   * Counts no-show participants belonging to a Journey Boarding.
   */
  countNoShowParticipants(journeyBoardingId: UniqueEntityId): Promise<number>;

  /**
   * Counts removed participants belonging to a Journey Boarding.
   */
  countRemovedParticipants(journeyBoardingId: UniqueEntityId): Promise<number>;

  // ===========================================================================
  // Participant State Queries
  // ===========================================================================

  /**
   * Finds boarded participants.
   */
  findBoardedParticipants(
    journeyBoardingId: UniqueEntityId,
  ): Promise<JourneyBoardingParticipantEntity[]>;

  /**
   * Finds expected participants.
   */
  findExpectedParticipants(
    journeyBoardingId: UniqueEntityId,
  ): Promise<JourneyBoardingParticipantEntity[]>;

  /**
   * Finds withdrawn participants.
   */
  findWithdrawnParticipants(
    journeyBoardingId: UniqueEntityId,
  ): Promise<JourneyBoardingParticipantEntity[]>;

  /**
   * Finds no-show participants.
   */
  findNoShowParticipants(
    journeyBoardingId: UniqueEntityId,
  ): Promise<JourneyBoardingParticipantEntity[]>;

  /**
   * Finds removed participants.
   */
  findRemovedParticipants(
    journeyBoardingId: UniqueEntityId,
  ): Promise<JourneyBoardingParticipantEntity[]>;

  /**
   * Determines whether the provider has boarded.
   */
  isProviderBoarded(journeyBoardingId: UniqueEntityId): Promise<boolean>;

  /**
   * Determines whether a passenger participant has boarded.
   */
  isPassengerBoarded(
    journeyBoardingId: UniqueEntityId,
    participantPublicId: JourneyBoardingParticipantPublicId,
  ): Promise<boolean>;

  // ===========================================================================
  // Boarding Event History
  // ===========================================================================

  /**
   * Finds a boarding event by internal ID.
   */
  findEventById(id: UniqueEntityId): Promise<JourneyBoardingEventEntity | null>;

  /**
   * Finds a boarding event by public ID within its owning Journey Boarding.
   */
  findEventByPublicId(
    journeyBoardingId: UniqueEntityId,
    eventPublicId: JourneyBoardingEventPublicId,
  ): Promise<JourneyBoardingEventEntity | null>;

  /**
   * Finds all historical boarding events belonging to a Journey Boarding.
   */
  findEvents(
    journeyBoardingId: UniqueEntityId,
  ): Promise<JourneyBoardingEventEntity[]>;

  /**
   * Finds historical boarding events associated with a Journey.
   */
  findEventsByJourneyId(
    journeyId: JourneyBoardingJourneyId,
  ): Promise<JourneyBoardingEventEntity[]>;

  /**
   * Finds historical boarding events associated with a participant.
   */
  findEventsByParticipantPublicId(
    participantPublicId: JourneyBoardingParticipantPublicId,
  ): Promise<JourneyBoardingEventEntity[]>;

  /**
   * Finds historical boarding events associated with a member.
   */
  findEventsByMemberPublicId(
    memberPublicId: JourneyBoardingMemberPublicId,
  ): Promise<JourneyBoardingEventEntity[]>;

  /**
   * Finds historical boarding events associated with a Journey Booking.
   */
  findEventsByBookingPublicId(
    bookingPublicId: JourneyBoardingBookingPublicId,
  ): Promise<JourneyBoardingEventEntity[]>;

  /**
   * Finds historical boarding events by event type within a Journey Boarding.
   */
  findEventsByType(
    journeyBoardingId: UniqueEntityId,
    eventType: JourneyBoardingEventType,
  ): Promise<JourneyBoardingEventEntity[]>;

  /**
   * Determines whether a historical event exists within a Journey Boarding.
   */
  existsEvent(
    journeyBoardingId: UniqueEntityId,
    eventPublicId: JourneyBoardingEventPublicId,
  ): Promise<boolean>;

  /**
   * Counts historical boarding events belonging to a Journey Boarding.
   */
  countEvents(journeyBoardingId: UniqueEntityId): Promise<number>;
}
