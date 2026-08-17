// src/domains/journey-demand/presentation/rest/mappers/journey-demand-response.mapper.ts

// -----------------------------------------------------------------------------
// Journey Demand Response Mapper
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import type { JourneyDemandAggregate } from '../../domain/aggregates/journey-demand.aggregate';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { JourneyDemandEntity } from '../../domain/entities/journey-demand.entity';

import type { JourneyDemandCorridorEntity } from '../../domain/entities/journey-demand-corridor.entity';

import type { JourneyDemandWaypointEntity } from '../../domain/entities/journey-demand-waypoint.entity';

import type { JourneyDemandScheduleEntity } from '../../domain/entities/journey-demand-schedule.entity';

import type { JourneyDemandCapacityEntity } from '../../domain/entities/journey-demand-capacity.entity';

import type { JourneyDemandPricingEntity } from '../../domain/entities/journey-demand-pricing.entity';

import type { JourneyDemandParticipantEntity } from '../../domain/entities/journey-demand-participant.entity';

// -----------------------------------------------------------------------------
// Response Types
// -----------------------------------------------------------------------------

export interface JourneyDemandWaypointResponse {
  publicId: string;

  type: string;

  sequence: number;

  name: string;

  coordinates: {
    latitude: number;
    longitude: number;
  };

  pickupRequired: boolean;

  dropoffRequired: boolean;

  createdAt: string;

  updatedAt: string;
}

export interface JourneyDemandCorridorResponse {
  publicId: string;

  originName: string;

  destinationName: string;

  originCoordinates: {
    latitude: number;
    longitude: number;
  };

  destinationCoordinates: {
    latitude: number;
    longitude: number;
  };

  corridorKey: string | undefined;

  waypoints: JourneyDemandWaypointResponse[];

  createdAt: string;

  updatedAt: string;
}

export interface JourneyDemandScheduleResponse {
  publicId: string;

  scheduleWindow: {
    earliestDeparture: string;
    latestDeparture: string;
  };

  arrivalWindow: {
    targetArrival: string | undefined;
    maximumArrival: string | undefined;
  };

  timezone: string;

  hasTargetArrival: boolean;

  hasMaximumArrival: boolean;

  hasArrivalConstraint: boolean;

  hasDepartureWindow: boolean;

  isExactDepartureTime: boolean;

  isExactArrivalTime: boolean;

  createdAt: string;

  updatedAt: string;
}

export interface JourneyDemandCapacityResponse {
  publicId: string;

  requestedSeats: number;

  matchedSeats: number;

  remainingSeats: number;

  hasCapacity: boolean;

  isFull: boolean;

  isEmpty: boolean;

  isPartiallyMatched: boolean;

  isFullyMatched: boolean;

  createdAt: string;

  updatedAt: string;
}

export interface JourneyDemandPricingResponse {
  publicId: string;

  maximumPricePerSeat: number | undefined;

  preferredPricePerSeat: number | undefined;

  currency: string;

  hasMaximumPrice: boolean;

  hasPreferredPrice: boolean;

  hasPriceConstraint: boolean;

  hasMaximumPriceConstraint: boolean;

  hasPreferredPriceConstraint: boolean;

  isUnconstrained: boolean;

  isPreferredPriceOnly: boolean;

  isMaximumPriceOnly: boolean;

  hasPreferredAndMaximumPrice: boolean;

  createdAt: string;

  updatedAt: string;
}

export interface JourneyDemandParticipantResponse {
  publicId: string;

  memberPublicId: string;

  seats: number;

  status: string;

  joinedAt: string;

  withdrawnAt: string | undefined;

  removedAt: string | undefined;

  isActive: boolean;

  isWithdrawn: boolean;

  isRemoved: boolean;

  canParticipate: boolean;

  hasWithdrawn: boolean;

  hasBeenRemoved: boolean;

  createdAt: string;

  updatedAt: string;
}

export interface JourneyDemandResponse {
  publicId: string;

  requesterPublicId: string;

  status: string;

  matchedJourneyPublicId: string | undefined;

  corridor: JourneyDemandCorridorResponse | undefined;

  schedule: JourneyDemandScheduleResponse | undefined;

  capacity: JourneyDemandCapacityResponse | undefined;

  pricing: JourneyDemandPricingResponse | undefined;

  participants: JourneyDemandParticipantResponse[];

  publishedAt: string | undefined;

  matchedAt: string | undefined;

  convertedAt: string | undefined;

  fulfilledAt: string | undefined;

  cancelledAt: string | undefined;

  expiredAt: string | undefined;

  version: number;

  isDraft: boolean;

  isOpen: boolean;

  isMatched: boolean;

  isConverted: boolean;

  isFulfilled: boolean;

  isCancelled: boolean;

  isExpired: boolean;

  isPublished: boolean;

  isTerminal: boolean;

  isActive: boolean;

  hasMatchedJourney: boolean;

  hasCorridor: boolean;

  hasSchedule: boolean;

  hasCapacity: boolean;

  hasPricing: boolean;

  hasParticipants: boolean;

  participantCount: number;

  createdAt: string;

  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export class JourneyDemandResponseMapper {
  private constructor() {}

  // ===========================================================================
  // Aggregate
  // ===========================================================================

  /**
   * Maps the Journey Demand aggregate to its REST response representation.
   *
   * The aggregate exposes the canonical JourneyDemandEntity through the
   * `journeyDemand` getter. The mapper deliberately uses that public
   * aggregate API rather than accessing AggregateRoot internals.
   */
  public static toResponse(
    aggregate: JourneyDemandAggregate,
  ): JourneyDemandResponse {
    return JourneyDemandResponseMapper.fromEntity(aggregate.journeyDemand);
  }

  // ===========================================================================
  // Entity
  // ===========================================================================

  public static fromEntity(entity: JourneyDemandEntity): JourneyDemandResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: JourneyDemandResponseMapper.publicId(entity.publicId),

      // -----------------------------------------------------------------------
      // Requester
      // -----------------------------------------------------------------------

      requesterPublicId: JourneyDemandResponseMapper.publicId(
        entity.requesterPublicId,
      ),

      // -----------------------------------------------------------------------
      // Lifecycle Status
      // -----------------------------------------------------------------------

      status: JourneyDemandResponseMapper.value(entity.status),

      // -----------------------------------------------------------------------
      // Matching
      // -----------------------------------------------------------------------

      matchedJourneyPublicId:
        entity.matchedJourneyPublicId !== undefined
          ? JourneyDemandResponseMapper.publicId(entity.matchedJourneyPublicId)
          : undefined,

      // -----------------------------------------------------------------------
      // Demand Components
      // -----------------------------------------------------------------------

      corridor:
        entity.corridor !== undefined
          ? JourneyDemandResponseMapper.corridor(entity.corridor)
          : undefined,

      schedule:
        entity.schedule !== undefined
          ? JourneyDemandResponseMapper.schedule(entity.schedule)
          : undefined,

      capacity:
        entity.capacity !== undefined
          ? JourneyDemandResponseMapper.capacity(entity.capacity)
          : undefined,

      pricing:
        entity.pricing !== undefined
          ? JourneyDemandResponseMapper.pricing(entity.pricing)
          : undefined,

      // -----------------------------------------------------------------------
      // Participants
      // -----------------------------------------------------------------------

      participants: entity.participants.map((participant) =>
        JourneyDemandResponseMapper.participant(participant),
      ),

      // -----------------------------------------------------------------------
      // Lifecycle Timestamps
      // -----------------------------------------------------------------------

      publishedAt: JourneyDemandResponseMapper.optionalDate(entity.publishedAt),

      matchedAt: JourneyDemandResponseMapper.optionalDate(entity.matchedAt),

      convertedAt: JourneyDemandResponseMapper.optionalDate(entity.convertedAt),

      fulfilledAt: JourneyDemandResponseMapper.optionalDate(entity.fulfilledAt),

      cancelledAt: JourneyDemandResponseMapper.optionalDate(entity.cancelledAt),

      expiredAt: JourneyDemandResponseMapper.optionalDate(entity.expiredAt),

      // -----------------------------------------------------------------------
      // Version
      // -----------------------------------------------------------------------

      version: entity.version,

      // -----------------------------------------------------------------------
      // State Queries
      // -----------------------------------------------------------------------

      isDraft: entity.isDraft(),

      isOpen: entity.isOpen(),

      isMatched: entity.isMatched(),

      isConverted: entity.isConverted(),

      isFulfilled: entity.isFulfilled(),

      isCancelled: entity.isCancelled(),

      isExpired: entity.isExpired(),

      isPublished: entity.isPublished(),

      isTerminal: entity.isTerminal(),

      isActive: entity.isActive(),

      hasMatchedJourney: entity.hasMatchedJourney(),

      hasCorridor: entity.hasCorridor(),

      hasSchedule: entity.hasSchedule(),

      hasCapacity: entity.hasCapacity(),

      hasPricing: entity.hasPricing(),

      hasParticipants: entity.hasParticipants(),

      participantCount: entity.participantCount(),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt.toISOString(),

      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  // ===========================================================================
  // Corridor
  // ===========================================================================

  public static corridor(
    entity: JourneyDemandCorridorEntity,
  ): JourneyDemandCorridorResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: JourneyDemandResponseMapper.publicId(entity.publicId),

      // -----------------------------------------------------------------------
      // Origin / Destination
      // -----------------------------------------------------------------------

      originName: entity.originName.value,

      destinationName: entity.destinationName.value,

      originCoordinates: {
        latitude: entity.originCoordinates.latitude,

        longitude: entity.originCoordinates.longitude,
      },

      destinationCoordinates: {
        latitude: entity.destinationCoordinates.latitude,

        longitude: entity.destinationCoordinates.longitude,
      },

      // -----------------------------------------------------------------------
      // Matching Key
      // -----------------------------------------------------------------------

      corridorKey:
        entity.corridorKey !== undefined
          ? JourneyDemandResponseMapper.value(entity.corridorKey)
          : undefined,

      // -----------------------------------------------------------------------
      // Waypoints
      // -----------------------------------------------------------------------

      waypoints: entity
        .getOrderedWaypoints()
        .map((waypoint) => JourneyDemandResponseMapper.waypoint(waypoint)),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt.toISOString(),

      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  // ===========================================================================
  // Waypoint
  // ===========================================================================

  public static waypoint(
    entity: JourneyDemandWaypointEntity,
  ): JourneyDemandWaypointResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: JourneyDemandResponseMapper.publicId(entity.publicId),

      // -----------------------------------------------------------------------
      // Waypoint
      // -----------------------------------------------------------------------

      type: JourneyDemandResponseMapper.value(entity.type),

      sequence: entity.sequence.value,

      name: entity.name.value,

      coordinates: {
        latitude: entity.coordinates.latitude,

        longitude: entity.coordinates.longitude,
      },

      // -----------------------------------------------------------------------
      // Requirements
      // -----------------------------------------------------------------------

      pickupRequired: entity.pickupRequired,

      dropoffRequired: entity.dropoffRequired,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt.toISOString(),

      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  // ===========================================================================
  // Schedule
  // ===========================================================================

  public static schedule(
    entity: JourneyDemandScheduleEntity,
  ): JourneyDemandScheduleResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: JourneyDemandResponseMapper.publicId(entity.publicId),

      // -----------------------------------------------------------------------
      // Departure
      // -----------------------------------------------------------------------

      scheduleWindow: {
        earliestDeparture: entity.earliestDeparture.toISOString(),

        latestDeparture: entity.latestDeparture.toISOString(),
      },

      // -----------------------------------------------------------------------
      // Arrival
      // -----------------------------------------------------------------------

      arrivalWindow: {
        targetArrival:
          entity.targetArrival !== undefined
            ? entity.targetArrival.toISOString()
            : undefined,

        maximumArrival:
          entity.maximumArrival !== undefined
            ? entity.maximumArrival.toISOString()
            : undefined,
      },

      // -----------------------------------------------------------------------
      // Timezone
      // -----------------------------------------------------------------------

      timezone: JourneyDemandResponseMapper.value(entity.timezone),

      // -----------------------------------------------------------------------
      // Scheduling State
      // -----------------------------------------------------------------------

      hasTargetArrival: entity.hasTargetArrival(),

      hasMaximumArrival: entity.hasMaximumArrival(),

      hasArrivalConstraint: entity.hasArrivalConstraint(),

      hasDepartureWindow: entity.hasDepartureWindow(),

      isExactDepartureTime: entity.isExactDepartureTime(),

      isExactArrivalTime: entity.isExactArrivalTime(),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt.toISOString(),

      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  // ===========================================================================
  // Capacity
  // ===========================================================================

  public static capacity(
    entity: JourneyDemandCapacityEntity,
  ): JourneyDemandCapacityResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: JourneyDemandResponseMapper.publicId(entity.publicId),

      // -----------------------------------------------------------------------
      // Capacity
      // -----------------------------------------------------------------------

      requestedSeats: entity.requestedSeats.value,

      matchedSeats: entity.matchedSeats,

      remainingSeats: entity.remainingSeats,

      // -----------------------------------------------------------------------
      // Capacity State
      // -----------------------------------------------------------------------

      hasCapacity: entity.hasCapacity(),

      isFull: entity.isFull(),

      isEmpty: entity.isEmpty(),

      isPartiallyMatched: entity.isPartiallyMatched(),

      isFullyMatched: entity.isFullyMatched(),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt.toISOString(),

      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  // ===========================================================================
  // Pricing
  // ===========================================================================

  public static pricing(
    entity: JourneyDemandPricingEntity,
  ): JourneyDemandPricingResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: JourneyDemandResponseMapper.publicId(entity.publicId),

      // -----------------------------------------------------------------------
      // Price Constraints
      // -----------------------------------------------------------------------

      maximumPricePerSeat:
        entity.maximumPricePerSeat !== undefined
          ? entity.maximumPricePerSeat.value
          : undefined,

      preferredPricePerSeat:
        entity.preferredPricePerSeat !== undefined
          ? entity.preferredPricePerSeat.value
          : undefined,

      currency: JourneyDemandResponseMapper.value(entity.currency),

      // -----------------------------------------------------------------------
      // Pricing State
      // -----------------------------------------------------------------------

      hasMaximumPrice: entity.hasMaximumPrice(),

      hasPreferredPrice: entity.hasPreferredPrice(),

      hasPriceConstraint: entity.hasPriceConstraint(),

      hasMaximumPriceConstraint: entity.hasMaximumPriceConstraint(),

      hasPreferredPriceConstraint: entity.hasPreferredPriceConstraint(),

      isUnconstrained: entity.isUnconstrained(),

      isPreferredPriceOnly: entity.isPreferredPriceOnly(),

      isMaximumPriceOnly: entity.isMaximumPriceOnly(),

      hasPreferredAndMaximumPrice: entity.hasPreferredAndMaximumPrice(),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt.toISOString(),

      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  // ===========================================================================
  // Participant
  // ===========================================================================

  public static participant(
    entity: JourneyDemandParticipantEntity,
  ): JourneyDemandParticipantResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: JourneyDemandResponseMapper.publicId(entity.publicId),

      // -----------------------------------------------------------------------
      // Member
      // -----------------------------------------------------------------------

      memberPublicId: JourneyDemandResponseMapper.publicId(
        entity.memberPublicId,
      ),

      // -----------------------------------------------------------------------
      // Participation
      // -----------------------------------------------------------------------

      seats: entity.seatCount(),

      status: JourneyDemandResponseMapper.value(entity.status),

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      joinedAt: entity.joinedAt.toISOString(),

      withdrawnAt:
        entity.withdrawnAt !== undefined
          ? entity.withdrawnAt.toISOString()
          : undefined,

      removedAt:
        entity.removedAt !== undefined
          ? entity.removedAt.toISOString()
          : undefined,

      // -----------------------------------------------------------------------
      // Lifecycle State
      // -----------------------------------------------------------------------

      isActive: entity.isActive(),

      isWithdrawn: entity.isWithdrawn(),

      isRemoved: entity.isRemoved(),

      canParticipate: entity.canParticipate(),

      hasWithdrawn: entity.hasWithdrawn(),

      hasBeenRemoved: entity.hasBeenRemoved(),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt.toISOString(),

      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  // ===========================================================================
  // Primitive Helpers
  // ===========================================================================

  private static publicId(value: { value: string }): string {
    return value.value;
  }

  private static value(value: { value: string }): string {
    return value.value;
  }

  private static optionalDate(date: Date | undefined): string | undefined {
    return date !== undefined ? date.toISOString() : undefined;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JourneyDemandResponseMapper;
