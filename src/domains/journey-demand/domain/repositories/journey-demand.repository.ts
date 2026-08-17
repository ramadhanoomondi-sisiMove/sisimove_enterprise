// src/domains/journey-demand/domain/repositories/journey-demand.repository.ts

// -----------------------------------------------------------------------------
// Journey Demand Aggregate
// -----------------------------------------------------------------------------

import type { JourneyDemandAggregate } from '../aggregates/journey-demand.aggregate';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { JourneyDemandEntity } from '../entities/journey-demand.entity';
import type { JourneyDemandCorridorEntity } from '../entities/journey-demand-corridor.entity';
import type { JourneyDemandWaypointEntity } from '../entities/journey-demand-waypoint.entity';
import type { JourneyDemandScheduleEntity } from '../entities/journey-demand-schedule.entity';
import type { JourneyDemandCapacityEntity } from '../entities/journey-demand-capacity.entity';
import type { JourneyDemandPricingEntity } from '../entities/journey-demand-pricing.entity';
import type { JourneyDemandParticipantEntity } from '../entities/journey-demand-participant.entity';

// -----------------------------------------------------------------------------
// Journey Demand Identity
// -----------------------------------------------------------------------------

import type { JourneyDemandId } from '../value-objects/journey-demand-id.vo';
import type { JourneyDemandPublicId } from '../value-objects/journey-demand-public-id.vo';

// -----------------------------------------------------------------------------
// Journey Demand Status
// -----------------------------------------------------------------------------

import type { JourneyDemandStatusValueObject } from '../value-objects/journey-demand-status.vo';

// -----------------------------------------------------------------------------
// Cross-Domain / Cross-Aggregate References
// -----------------------------------------------------------------------------

import type { RequesterPublicId } from '../value-objects/requester-public-id.vo';
import type { MemberPublicId } from '../value-objects/member-public-id.vo';
import type { MatchedJourneyPublicId } from '../value-objects/matched-journey-public-id.vo';

// -----------------------------------------------------------------------------
// Corridor
// -----------------------------------------------------------------------------

import type { JourneyDemandCorridorId } from '../value-objects/journey-demand-corridor-id.vo';
import type { JourneyDemandCorridorPublicId } from '../value-objects/journey-demand-corridor-public-id.vo';

// -----------------------------------------------------------------------------
// Waypoint
// -----------------------------------------------------------------------------

import type { JourneyDemandWaypointId } from '../value-objects/journey-demand-waypoint-id.vo';
import type { JourneyDemandWaypointPublicId } from '../value-objects/journey-demand-waypoint-public-id.vo';

// -----------------------------------------------------------------------------
// Schedule
// -----------------------------------------------------------------------------

import type { JourneyDemandScheduleId } from '../value-objects/journey-demand-schedule-id.vo';
import type { JourneyDemandSchedulePublicId } from '../value-objects/journey-demand-schedule-public-id.vo';

// -----------------------------------------------------------------------------
// Capacity
// -----------------------------------------------------------------------------

import type { JourneyDemandCapacityId } from '../value-objects/journey-demand-capacity-id.vo';
import type { JourneyDemandCapacityPublicId } from '../value-objects/journey-demand-capacity-public-id.vo';

// -----------------------------------------------------------------------------
// Pricing
// -----------------------------------------------------------------------------

import type { JourneyDemandPricingId } from '../value-objects/journey-demand-pricing-id.vo';
import type { JourneyDemandPricingPublicId } from '../value-objects/journey-demand-pricing-public-id.vo';

// -----------------------------------------------------------------------------
// Participant
// -----------------------------------------------------------------------------

import type { JourneyDemandParticipantId } from '../value-objects/journey-demand-participant-id.vo';
import type { JourneyDemandParticipantPublicId } from '../value-objects/journey-demand-participant-public-id.vo';
import type { JourneyDemandParticipantStatusValueObject } from '../value-objects/journey-demand-participant-status.vo';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

/**
 * Repository abstraction for the JourneyDemand aggregate.
 *
 * Aggregate boundary:
 *
 *   JourneyDemandAggregate
 *   ├── JourneyDemandEntity
 *   ├── JourneyDemandCorridorEntity?
 *   │   └── JourneyDemandWaypointEntity[]
 *   ├── JourneyDemandScheduleEntity?
 *   ├── JourneyDemandCapacityEntity?
 *   ├── JourneyDemandPricingEntity?
 *   └── JourneyDemandParticipantEntity[]
 *
 * Persistence mapping:
 *
 *   JourneyDemand
 *   ├── JourneyDemandCorridor       1:1
 *   │   └── JourneyDemandWaypoint[] 1:N
 *   ├── JourneyDemandSchedule       1:1
 *   ├── JourneyDemandCapacity       1:1
 *   ├── JourneyDemandPricing        1:1
 *   └── JourneyDemandParticipant[]  1:N
 *
 * Cross-domain references:
 *
 *   requesterPublicId      -> Identity.publicId
 *   memberPublicId         -> Identity.publicId
 *   matchedJourneyPublicId -> Journey.publicId
 *
 * These cross-domain references are intentionally NOT Prisma relations.
 *
 * The repository owns aggregate persistence and aggregate-scoped lookup.
 * Infrastructure implementations may optimize these operations using joins,
 * includes, transactions, indexes, or other persistence-specific mechanisms.
 *
 * Internal IDs and public IDs are deliberately kept distinct:
 *
 *   - Internal IDs  -> UniqueEntityId-derived value objects
 *   - Public IDs    -> strongly typed public identifier value objects
 */
export interface JourneyDemandRepository {
  // ===========================================================================
  // Aggregate Persistence
  // ===========================================================================

  /**
   * Persist the complete JourneyDemand aggregate.
   *
   * The implementation is responsible for synchronizing:
   *
   * - root demand
   * - corridor
   * - waypoints
   * - schedule
   * - capacity
   * - pricing
   * - participants
   * - aggregate version
   */
  save(aggregate: JourneyDemandAggregate): Promise<void>;

  /**
   * Find and fully rehydrate a JourneyDemand aggregate by internal ID.
   */
  findById(id: JourneyDemandId): Promise<JourneyDemandAggregate | null>;

  /**
   * Find and fully rehydrate a JourneyDemand aggregate by public ID.
   */
  findByPublicId(
    publicId: JourneyDemandPublicId,
  ): Promise<JourneyDemandAggregate | null>;

  /**
   * Delete a JourneyDemand aggregate.
   *
   * Infrastructure is responsible for preserving the persistence cascade
   * defined by the JourneyDemand aggregate schema.
   */
  delete(id: JourneyDemandId): Promise<void>;

  /**
   * Determine whether a JourneyDemand exists by internal ID.
   */
  exists(id: JourneyDemandId): Promise<boolean>;

  /**
   * Determine whether a JourneyDemand exists by public ID.
   */
  existsByPublicId(publicId: JourneyDemandPublicId): Promise<boolean>;

  // ===========================================================================
  // Root Journey Demand Queries
  // ===========================================================================

  /**
   * Find only the JourneyDemand root entity by internal ID.
   *
   * This does not rehydrate the aggregate.
   */
  findJourneyDemandById(
    id: JourneyDemandId,
  ): Promise<JourneyDemandEntity | null>;

  /**
   * Find only the JourneyDemand root entity by public ID.
   */
  findJourneyDemandByPublicId(
    publicId: JourneyDemandPublicId,
  ): Promise<JourneyDemandEntity | null>;

  /**
   * Find all JourneyDemand root entities.
   *
   * This does not rehydrate the aggregate.
   */
  findJourneyDemands(): Promise<JourneyDemandEntity[]>;

  /**
   * Find JourneyDemands belonging to a requester.
   *
   * Maps to JourneyDemand.requesterPublicId.
   */
  findJourneyDemandsByRequesterPublicId(
    requesterPublicId: RequesterPublicId,
  ): Promise<JourneyDemandEntity[]>;

  /**
   * Find JourneyDemands by lifecycle status.
   *
   * Maps to JourneyDemand.status.
   */
  findJourneyDemandsByStatus(
    status: JourneyDemandStatusValueObject,
  ): Promise<JourneyDemandEntity[]>;

  /**
   * Find JourneyDemands belonging to a requester with a given status.
   */
  findJourneyDemandsByRequesterAndStatus(
    requesterPublicId: RequesterPublicId,
    status: JourneyDemandStatusValueObject,
  ): Promise<JourneyDemandEntity[]>;

  /**
   * Determine whether a requester owns at least one JourneyDemand.
   */
  existsByRequesterPublicId(
    requesterPublicId: RequesterPublicId,
  ): Promise<boolean>;

  // ===========================================================================
  // Corridor
  // ===========================================================================

  /**
   * Find JourneyDemands associated with a specific aggregate-owned corridor
   * by internal corridor ID.
   */
  findJourneyDemandsByCorridorId(
    corridorId: JourneyDemandCorridorId,
  ): Promise<JourneyDemandEntity[]>;

  /**
   * Find the single corridor owned by a JourneyDemand.
   *
   * JourneyDemandCorridor.demandId is unique, therefore a JourneyDemand can
   * have at most one corridor.
   */
  findCorridor(
    journeyDemandId: JourneyDemandId,
  ): Promise<JourneyDemandCorridorEntity | null>;

  /**
   * Find the corridor by internal ID within a JourneyDemand.
   */
  findCorridorById(
    journeyDemandId: JourneyDemandId,
    corridorId: JourneyDemandCorridorId,
  ): Promise<JourneyDemandCorridorEntity | null>;

  /**
   * Find the corridor by public ID within a JourneyDemand.
   */
  findCorridorByPublicId(
    journeyDemandId: JourneyDemandId,
    corridorPublicId: JourneyDemandCorridorPublicId,
  ): Promise<JourneyDemandCorridorEntity | null>;

  /**
   * Determine whether a JourneyDemand has a corridor.
   */
  existsCorridor(journeyDemandId: JourneyDemandId): Promise<boolean>;

  // ===========================================================================
  // Waypoints
  // ===========================================================================

  /**
   * Find a waypoint by internal ID within a JourneyDemand aggregate.
   */
  findWaypointById(
    journeyDemandId: JourneyDemandId,
    waypointId: JourneyDemandWaypointId,
  ): Promise<JourneyDemandWaypointEntity | null>;

  /**
   * Find a waypoint by public ID within a JourneyDemand aggregate.
   */
  findWaypointByPublicId(
    journeyDemandId: JourneyDemandId,
    waypointPublicId: JourneyDemandWaypointPublicId,
  ): Promise<JourneyDemandWaypointEntity | null>;

  /**
   * Find all waypoints belonging to the JourneyDemand corridor.
   *
   * The implementation must preserve waypoint sequence ordering.
   */
  findWaypoints(
    journeyDemandId: JourneyDemandId,
  ): Promise<JourneyDemandWaypointEntity[]>;

  /**
   * Determine whether a waypoint exists by internal ID.
   */
  existsWaypoint(
    journeyDemandId: JourneyDemandId,
    waypointId: JourneyDemandWaypointId,
  ): Promise<boolean>;

  /**
   * Determine whether a waypoint exists by public ID.
   */
  existsWaypointByPublicId(
    journeyDemandId: JourneyDemandId,
    waypointPublicId: JourneyDemandWaypointPublicId,
  ): Promise<boolean>;

  /**
   * Determine whether the JourneyDemand corridor contains any waypoints.
   */
  existsWaypoints(journeyDemandId: JourneyDemandId): Promise<boolean>;

  // ===========================================================================
  // Schedule
  // ===========================================================================

  /**
   * Find the schedule owned by a JourneyDemand.
   *
   * JourneyDemandSchedule.demandId is unique, therefore a JourneyDemand can
   * have at most one schedule.
   */
  findSchedule(
    journeyDemandId: JourneyDemandId,
  ): Promise<JourneyDemandScheduleEntity | null>;

  /**
   * Find a schedule by internal ID within a JourneyDemand.
   */
  findScheduleById(
    journeyDemandId: JourneyDemandId,
    scheduleId: JourneyDemandScheduleId,
  ): Promise<JourneyDemandScheduleEntity | null>;

  /**
   * Find a schedule by public ID within a JourneyDemand.
   */
  findScheduleByPublicId(
    journeyDemandId: JourneyDemandId,
    schedulePublicId: JourneyDemandSchedulePublicId,
  ): Promise<JourneyDemandScheduleEntity | null>;

  /**
   * Find JourneyDemands associated with a specific JourneyDemand schedule
   * by internal schedule identifier.
   *
   * JourneyDemandSchedule.demandId is unique, so the result will normally
   * contain at most one JourneyDemand.
   */
  findJourneyDemandsByScheduleId(
    scheduleId: JourneyDemandScheduleId,
  ): Promise<JourneyDemandEntity[]>;

  /**
   * Determine whether a JourneyDemand has a schedule.
   */
  existsSchedule(journeyDemandId: JourneyDemandId): Promise<boolean>;

  // ===========================================================================
  // Capacity
  // ===========================================================================

  /**
   * Find the capacity configuration owned by a JourneyDemand.
   *
   * JourneyDemandCapacity.demandId is unique, therefore a JourneyDemand can
   * have at most one capacity component.
   */
  findCapacity(
    journeyDemandId: JourneyDemandId,
  ): Promise<JourneyDemandCapacityEntity | null>;

  /**
   * Find capacity by internal ID within a JourneyDemand.
   */
  findCapacityById(
    journeyDemandId: JourneyDemandId,
    capacityId: JourneyDemandCapacityId,
  ): Promise<JourneyDemandCapacityEntity | null>;

  /**
   * Find capacity by public ID within a JourneyDemand.
   */
  findCapacityByPublicId(
    journeyDemandId: JourneyDemandId,
    capacityPublicId: JourneyDemandCapacityPublicId,
  ): Promise<JourneyDemandCapacityEntity | null>;

  /**
   * Determine whether a JourneyDemand has capacity configured.
   */
  existsCapacity(journeyDemandId: JourneyDemandId): Promise<boolean>;

  // ===========================================================================
  // Pricing
  // ===========================================================================

  /**
   * Find the pricing configuration owned by a JourneyDemand.
   *
   * JourneyDemandPricing.demandId is unique, therefore a JourneyDemand can
   * have at most one pricing component.
   */
  findPricing(
    journeyDemandId: JourneyDemandId,
  ): Promise<JourneyDemandPricingEntity | null>;

  /**
   * Find pricing by internal ID within a JourneyDemand.
   */
  findPricingById(
    journeyDemandId: JourneyDemandId,
    pricingId: JourneyDemandPricingId,
  ): Promise<JourneyDemandPricingEntity | null>;

  /**
   * Find pricing by public ID within a JourneyDemand.
   */
  findPricingByPublicId(
    journeyDemandId: JourneyDemandId,
    pricingPublicId: JourneyDemandPricingPublicId,
  ): Promise<JourneyDemandPricingEntity | null>;

  /**
   * Determine whether a JourneyDemand has pricing configured.
   */
  existsPricing(journeyDemandId: JourneyDemandId): Promise<boolean>;

  // ===========================================================================
  // Participants
  // ===========================================================================

  /**
   * Find a participant by internal ID within a JourneyDemand.
   */
  findParticipantById(
    journeyDemandId: JourneyDemandId,
    participantId: JourneyDemandParticipantId,
  ): Promise<JourneyDemandParticipantEntity | null>;

  /**
   * Find a participant by public ID within a JourneyDemand.
   */
  findParticipantByPublicId(
    journeyDemandId: JourneyDemandId,
    participantPublicId: JourneyDemandParticipantPublicId,
  ): Promise<JourneyDemandParticipantEntity | null>;

  /**
   * Find all participants belonging to a JourneyDemand.
   */
  findParticipants(
    journeyDemandId: JourneyDemandId,
  ): Promise<JourneyDemandParticipantEntity[]>;

  /**
   * Find participants by participant lifecycle status.
   *
   * Maps to JourneyDemandParticipant.status.
   */
  findParticipantsByStatus(
    journeyDemandId: JourneyDemandId,
    status: JourneyDemandParticipantStatusValueObject,
  ): Promise<JourneyDemandParticipantEntity[]>;

  /**
   * Find the participant associated with a member.
   *
   * JourneyDemandParticipant.demandId + memberPublicId form the unique
   * participant identity inside a JourneyDemand.
   */
  findParticipantByMemberPublicId(
    journeyDemandId: JourneyDemandId,
    memberPublicId: MemberPublicId,
  ): Promise<JourneyDemandParticipantEntity | null>;

  /**
   * Determine whether a participant exists by internal ID.
   */
  existsParticipant(
    journeyDemandId: JourneyDemandId,
    participantId: JourneyDemandParticipantId,
  ): Promise<boolean>;

  /**
   * Determine whether a participant exists by public ID.
   */
  existsParticipantByPublicId(
    journeyDemandId: JourneyDemandId,
    participantPublicId: JourneyDemandParticipantPublicId,
  ): Promise<boolean>;

  /**
   * Determine whether a member participates in a JourneyDemand.
   */
  existsParticipantByMemberPublicId(
    journeyDemandId: JourneyDemandId,
    memberPublicId: MemberPublicId,
  ): Promise<boolean>;

  /**
   * Determine whether a JourneyDemand contains any participants.
   */
  existsParticipants(journeyDemandId: JourneyDemandId): Promise<boolean>;

  // ===========================================================================
  // Matching / Conversion
  // ===========================================================================

  /**
   * Find JourneyDemands matched to a specific Journey.
   *
   * Maps to JourneyDemand.matchedJourneyPublicId.
   *
   * The Journey reference is intentionally cross-domain and is not represented
   * as a Prisma relation.
   */
  findByMatchedJourneyPublicId(
    matchedJourneyPublicId: MatchedJourneyPublicId,
  ): Promise<JourneyDemandEntity[]>;

  /**
   * Determine whether at least one JourneyDemand has been matched to a
   * specific Journey.
   */
  existsByMatchedJourneyPublicId(
    matchedJourneyPublicId: MatchedJourneyPublicId,
  ): Promise<boolean>;
}
