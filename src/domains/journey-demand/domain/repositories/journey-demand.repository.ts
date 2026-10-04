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
// Public Discovery Filters
// -----------------------------------------------------------------------------

/**
 * Filters supported by the public Journey Demand marketplace.
 *
 * Public discovery is intentionally different from the internal/root
 * JourneyDemand queries below.
 *
 * The absence of filters means:
 *
 *   "return all Journey Demands currently eligible for public discovery."
 *
 * The filter values remain primitive because they represent query criteria,
 * not persisted domain state.
 *
 * Route filters:
 *
 *   from -> origin name/query
 *   to   -> destination name/query
 *
 * Schedule filter:
 *
 *   date -> requested travel date
 *
 * Price filters:
 *
 *   minPrice -> minimum acceptable maximum price per passenger seat
 *   maxPrice -> maximum acceptable maximum price per passenger seat
 *
 * Price boundaries are inclusive:
 *
 *   minPrice <= maximumPricePerSeat <= maxPrice
 *
 * Either boundary may be omitted independently.
 *
 * Journey Demand pricing is requester-side pricing. The relevant marketplace
 * field is JourneyDemandPricing.maximumPricePerSeat, which represents the
 * highest amount the requester is willing to pay for one passenger seat.
 *
 * Currency:
 *
 *   KES
 *
 * Pagination is also a query concern and therefore remains outside the
 * JourneyDemand aggregate.
 */
export interface PublicJourneyDemandFilters {
  // ===========================================================================
  // Route
  // ===========================================================================

  /**
   * Origin search value.
   *
   * Implementations may apply this as a case-insensitive partial match or
   * equivalent persistence-supported route search.
   */
  readonly from?: string;

  /**
   * Destination search value.
   *
   * Implementations may apply this as a case-insensitive partial match or
   * equivalent persistence-supported route search.
   */
  readonly to?: string;

  // ===========================================================================
  // Schedule
  // ===========================================================================

  /**
   * Requested travel date.
   *
   * The repository is responsible for translating the query date into the
   * persistence-layer schedule boundary appropriate for public discovery.
   */
  readonly date?: string;

  // ===========================================================================
  // Price
  // ===========================================================================

  /**
   * Minimum maximum-price-per-seat accepted by the marketplace filter.
   *
   * Inclusive:
   *
   *   maximumPricePerSeat >= minPrice
   */
  readonly minPrice?: number;

  /**
   * Maximum maximum-price-per-seat accepted by the marketplace filter.
   *
   * Inclusive:
   *
   *   maximumPricePerSeat <= maxPrice
   */
  readonly maxPrice?: number;

  // ===========================================================================
  // Pagination
  // ===========================================================================

  /**
   * Maximum number of public Journey Demands to return.
   */
  readonly limit?: number;

  /**
   * Number of public Journey Demands to skip before returning results.
   */
  readonly offset?: number;
}

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
 *   - Internal IDs -> UniqueEntityId-derived value objects
 *   - Public IDs   -> strongly typed public identifier value objects
 *
 * Public discovery is deliberately represented by dedicated repository
 * operations. A JourneyDemand may exist and be addressable by public ID while
 * still not being eligible for anonymous/public discovery.
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
   *
   * This is a generic domain lookup and does not imply public discoverability.
   */
  findByPublicId(
    publicId: JourneyDemandPublicId,
  ): Promise<JourneyDemandAggregate | null>;

  /**
   * Find and fully rehydrate all JourneyDemand aggregates belonging to a
   * requester.
   *
   * This is the aggregate-oriented counterpart to
   * findJourneyDemandsByRequesterPublicId(), which intentionally returns only
   * root entities.
   *
   * The requester constraint is applied by the repository itself.
   *
   * The returned aggregates include their owned components:
   *
   * - corridor
   * - waypoints
   * - schedule
   * - capacity
   * - pricing
   * - participants
   *
   * This operation is intended for authenticated requester-owned application
   * surfaces such as "My Journey Demands".
   */
  findByRequesterPublicId(
    requesterPublicId: RequesterPublicId,
  ): Promise<JourneyDemandAggregate[]>;

  /**
   * Find and fully rehydrate a JourneyDemand aggregate that is eligible for
   * public discovery by public ID.
   *
   * The infrastructure implementation must enforce the public visibility
   * rules of the JourneyDemand domain.
   *
   * This operation is intentionally separate from findByPublicId().
   *
   * A valid public ID alone must never be treated as permission to expose a
   * JourneyDemand through the anonymous/public marketplace.
   */
  findPublicJourneyDemandByPublicId(
    publicId: JourneyDemandPublicId,
  ): Promise<JourneyDemandAggregate | null>;

  /**
   * Find and fully rehydrate all JourneyDemand aggregates eligible for
   * anonymous/public marketplace discovery.
   *
   * This is the collection counterpart to
   * findPublicJourneyDemandByPublicId().
   *
   * An omitted filters argument means:
   *
   *   "return all publicly discoverable Journey Demands."
   *
   * The implementation must enforce public visibility independently of the
   * supplied filters. Filters narrow an already-public collection; they must
   * never make a private/non-discoverable JourneyDemand public.
   *
   * Supported discovery filters:
   *
   * - origin
   * - destination
   * - requested travel date
   * - minimum maximum-price-per-seat
   * - maximum maximum-price-per-seat
   * - pagination
   *
   * Price filtering is applied against:
   *
   *   JourneyDemandPricing.maximumPricePerSeat
   *
   * with inclusive boundaries:
   *
   *   minPrice <= maximumPricePerSeat <= maxPrice
   *
   * The returned objects are aggregates rather than root entities because the
   * public application query composes:
   *
   * - requester reference
   * - route and waypoints
   * - schedule
   * - capacity
   * - pricing
   * - participants
   *
   * Infrastructure should perform this as efficiently as possible using its
   * persistence capabilities rather than requiring one database query per
   * aggregate component.
   */
  findPublicJourneyDemands(
    filters?: PublicJourneyDemandFilters,
  ): Promise<JourneyDemandAggregate[]>;

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
   * Find only the JourneyDemand root entity by public ID when it belongs to
   * the specified requester.
   *
   * This is the ownership-scoped counterpart to
   * findJourneyDemandByPublicId().
   *
   * The requester constraint is part of the repository lookup itself so that
   * the application layer never loads an arbitrary JourneyDemand and then
   * performs an ownership check after retrieval.
   *
   * A null result means either:
   *
   * - the JourneyDemand does not exist; or
   * - the JourneyDemand does not belong to the requester.
   *
   * The repository deliberately does not distinguish those cases at this
   * boundary.
   */
  findJourneyDemandByRequesterAndPublicId(
    requesterPublicId: RequesterPublicId,
    publicId: JourneyDemandPublicId,
  ): Promise<JourneyDemandEntity | null>;

  /**
   * Find all JourneyDemand root entities.
   *
   * This does not rehydrate the aggregate and is therefore not the public
   * marketplace collection operation.
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
