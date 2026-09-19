// -----------------------------------------------------------------------------
// sisiMove — My Journey Demand Response
// -----------------------------------------------------------------------------
//
// Authenticated owner projection for the Journey Demand bounded context.
//
// This response represents Journey Demands belonging to the currently
// authenticated requester.
//
// It is intentionally separate from:
//
//     JourneyDemandResponse
//         General REST/domain response.
//
//     PublicJourneyDemandResponse
//         Anonymous marketplace projection.
//
// The "My Demand" projection is an authenticated ownership boundary.
// Ownership is established by the application query using the authenticated
// identity before this mapper is invoked.
//
// The mapper:
// - converts domain entities into transport-safe primitives;
// - exposes Journey Demand lifecycle state;
// - exposes the Demand's owned components;
// - does not authorize;
// - does not query Prisma;
// - does not fetch Traveller Profile;
// - does not fetch Trust;
// - does not fetch marketplace data;
// - does not determine ownership.
//
// -----------------------------------------------------------------------------

import type { JourneyDemandAggregate } from '../../domain/aggregates/journey-demand.aggregate';

import type { JourneyDemandEntity } from '../../domain/entities/journey-demand.entity';

import type { JourneyDemandCorridorEntity } from '../../domain/entities/journey-demand-corridor.entity';

import type { JourneyDemandWaypointEntity } from '../../domain/entities/journey-demand-waypoint.entity';

import type { JourneyDemandScheduleEntity } from '../../domain/entities/journey-demand-schedule.entity';

import type { JourneyDemandCapacityEntity } from '../../domain/entities/journey-demand-capacity.entity';

import type { JourneyDemandPricingEntity } from '../../domain/entities/journey-demand-pricing.entity';

import type { JourneyDemandParticipantEntity } from '../../domain/entities/journey-demand-participant.entity';

// =============================================================================
// Response Types
// =============================================================================

export interface MyJourneyDemandWaypointResponse {
  readonly publicId: string;
  readonly type: string;
  readonly sequence: number;
  readonly name: string;

  readonly coordinates: {
    readonly latitude: number;
    readonly longitude: number;
  };

  readonly pickupRequired: boolean;
  readonly dropoffRequired: boolean;

  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface MyJourneyDemandCorridorResponse {
  readonly publicId: string;

  readonly originName: string;
  readonly destinationName: string;

  readonly originCoordinates: {
    readonly latitude: number;
    readonly longitude: number;
  };

  readonly destinationCoordinates: {
    readonly latitude: number;
    readonly longitude: number;
  };

  readonly corridorKey: string | undefined;

  readonly waypoints: readonly MyJourneyDemandWaypointResponse[];

  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface MyJourneyDemandScheduleResponse {
  readonly publicId: string;

  readonly scheduleWindow: {
    readonly earliestDeparture: string;
    readonly latestDeparture: string;
  };

  readonly arrivalWindow: {
    readonly targetArrival: string | undefined;
    readonly maximumArrival: string | undefined;
  };

  readonly timezone: string;

  readonly hasTargetArrival: boolean;
  readonly hasMaximumArrival: boolean;
  readonly hasArrivalConstraint: boolean;
  readonly hasDepartureWindow: boolean;

  readonly isExactDepartureTime: boolean;
  readonly isExactArrivalTime: boolean;

  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface MyJourneyDemandCapacityResponse {
  readonly publicId: string;

  readonly requestedSeats: number;
  readonly matchedSeats: number;
  readonly remainingSeats: number;

  readonly hasCapacity: boolean;
  readonly isFull: boolean;
  readonly isEmpty: boolean;
  readonly isPartiallyMatched: boolean;
  readonly isFullyMatched: boolean;

  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface MyJourneyDemandPricingResponse {
  readonly publicId: string;

  readonly maximumPricePerSeat: number | undefined;
  readonly preferredPricePerSeat: number | undefined;

  readonly currency: string;

  readonly hasMaximumPrice: boolean;
  readonly hasPreferredPrice: boolean;
  readonly hasPriceConstraint: boolean;

  readonly hasMaximumPriceConstraint: boolean;
  readonly hasPreferredPriceConstraint: boolean;

  readonly isUnconstrained: boolean;
  readonly isPreferredPriceOnly: boolean;
  readonly isMaximumPriceOnly: boolean;
  readonly hasPreferredAndMaximumPrice: boolean;

  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface MyJourneyDemandParticipantResponse {
  readonly publicId: string;
  readonly memberPublicId: string;

  readonly seats: number;
  readonly status: string;

  readonly joinedAt: string;
  readonly withdrawnAt: string | undefined;
  readonly removedAt: string | undefined;

  readonly isActive: boolean;
  readonly isWithdrawn: boolean;
  readonly isRemoved: boolean;

  readonly canParticipate: boolean;
  readonly hasWithdrawn: boolean;
  readonly hasBeenRemoved: boolean;

  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface MyJourneyDemandResponse {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  readonly publicId: string;

  // ---------------------------------------------------------------------------
  // Ownership
  // ---------------------------------------------------------------------------

  /**
   * The requester identifier is retained because this is an authenticated
   * owner-facing response.
   *
   * It is NOT supplied by the client to establish ownership.
   *
   * Ownership is established before mapping by the authenticated query
   * boundary.
   */
  readonly requesterPublicId: string;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  readonly status: string;

  readonly publishedAt: string | undefined;
  readonly matchedAt: string | undefined;
  readonly convertedAt: string | undefined;
  readonly fulfilledAt: string | undefined;
  readonly cancelledAt: string | undefined;
  readonly expiredAt: string | undefined;

  readonly version: number;

  // ---------------------------------------------------------------------------
  // Matching
  // ---------------------------------------------------------------------------

  readonly matchedJourneyPublicId: string | undefined;

  // ---------------------------------------------------------------------------
  // Components
  // ---------------------------------------------------------------------------

  readonly corridor: MyJourneyDemandCorridorResponse | undefined;
  readonly schedule: MyJourneyDemandScheduleResponse | undefined;
  readonly capacity: MyJourneyDemandCapacityResponse | undefined;
  readonly pricing: MyJourneyDemandPricingResponse | undefined;

  readonly participants: readonly MyJourneyDemandParticipantResponse[];

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  readonly isDraft: boolean;
  readonly isOpen: boolean;
  readonly isMatched: boolean;
  readonly isConverted: boolean;
  readonly isFulfilled: boolean;
  readonly isCancelled: boolean;
  readonly isExpired: boolean;
  readonly isPublished: boolean;
  readonly isTerminal: boolean;
  readonly isActive: boolean;

  readonly hasMatchedJourney: boolean;
  readonly hasCorridor: boolean;
  readonly hasSchedule: boolean;
  readonly hasCapacity: boolean;
  readonly hasPricing: boolean;
  readonly hasParticipants: boolean;

  readonly participantCount: number;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  readonly createdAt: string;
  readonly updatedAt: string;
}

// =============================================================================
// Mapper
// =============================================================================

export class MyJourneyDemandMapper {
  private constructor() {}

  // ===========================================================================
  // Aggregate
  // ===========================================================================

  /**
   * Maps an owned Journey Demand aggregate into the authenticated
   * My Journey Demand response.
   *
   * Ownership is NOT established here.
   *
   * The query handler must already have restricted the aggregate to the
   * authenticated requester.
   */
  public static fromAggregate(
    aggregate: JourneyDemandAggregate,
  ): MyJourneyDemandResponse {
    return MyJourneyDemandMapper.fromEntity(aggregate.journeyDemand);
  }

  /**
   * Maps multiple owned Journey Demand aggregates.
   */
  public static fromAggregates(
    aggregates: readonly JourneyDemandAggregate[],
  ): readonly MyJourneyDemandResponse[] {
    return aggregates.map((aggregate) =>
      MyJourneyDemandMapper.fromAggregate(aggregate),
    );
  }

  // ===========================================================================
  // Entity
  // ===========================================================================

  public static fromEntity(
    entity: JourneyDemandEntity,
  ): MyJourneyDemandResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: MyJourneyDemandMapper.publicId(entity.publicId),

      // -----------------------------------------------------------------------
      // Ownership
      // -----------------------------------------------------------------------

      requesterPublicId: MyJourneyDemandMapper.publicId(
        entity.requesterPublicId,
      ),

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: MyJourneyDemandMapper.value(entity.status),

      publishedAt: MyJourneyDemandMapper.optionalDate(entity.publishedAt),
      matchedAt: MyJourneyDemandMapper.optionalDate(entity.matchedAt),
      convertedAt: MyJourneyDemandMapper.optionalDate(entity.convertedAt),
      fulfilledAt: MyJourneyDemandMapper.optionalDate(entity.fulfilledAt),
      cancelledAt: MyJourneyDemandMapper.optionalDate(entity.cancelledAt),
      expiredAt: MyJourneyDemandMapper.optionalDate(entity.expiredAt),

      version: entity.version,

      // -----------------------------------------------------------------------
      // Matching
      // -----------------------------------------------------------------------

      matchedJourneyPublicId:
        entity.matchedJourneyPublicId !== undefined
          ? MyJourneyDemandMapper.publicId(entity.matchedJourneyPublicId)
          : undefined,

      // -----------------------------------------------------------------------
      // Components
      // -----------------------------------------------------------------------

      corridor:
        entity.corridor !== undefined
          ? MyJourneyDemandMapper.corridor(entity.corridor)
          : undefined,

      schedule:
        entity.schedule !== undefined
          ? MyJourneyDemandMapper.schedule(entity.schedule)
          : undefined,

      capacity:
        entity.capacity !== undefined
          ? MyJourneyDemandMapper.capacity(entity.capacity)
          : undefined,

      pricing:
        entity.pricing !== undefined
          ? MyJourneyDemandMapper.pricing(entity.pricing)
          : undefined,

      participants: entity.participants.map((participant) =>
        MyJourneyDemandMapper.participant(participant),
      ),

      // -----------------------------------------------------------------------
      // State
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
  ): MyJourneyDemandCorridorResponse {
    return {
      publicId: MyJourneyDemandMapper.publicId(entity.publicId),

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

      corridorKey:
        entity.corridorKey !== undefined
          ? MyJourneyDemandMapper.value(entity.corridorKey)
          : undefined,

      waypoints: entity
        .getOrderedWaypoints()
        .map((waypoint) => MyJourneyDemandMapper.waypoint(waypoint)),

      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  // ===========================================================================
  // Waypoint
  // ===========================================================================

  public static waypoint(
    entity: JourneyDemandWaypointEntity,
  ): MyJourneyDemandWaypointResponse {
    return {
      publicId: MyJourneyDemandMapper.publicId(entity.publicId),

      type: MyJourneyDemandMapper.value(entity.type),

      sequence: entity.sequence.value,

      name: entity.name.value,

      coordinates: {
        latitude: entity.coordinates.latitude,
        longitude: entity.coordinates.longitude,
      },

      pickupRequired: entity.pickupRequired,
      dropoffRequired: entity.dropoffRequired,

      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  // ===========================================================================
  // Schedule
  // ===========================================================================

  public static schedule(
    entity: JourneyDemandScheduleEntity,
  ): MyJourneyDemandScheduleResponse {
    return {
      publicId: MyJourneyDemandMapper.publicId(entity.publicId),

      scheduleWindow: {
        earliestDeparture: entity.earliestDeparture.toISOString(),
        latestDeparture: entity.latestDeparture.toISOString(),
      },

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

      timezone: MyJourneyDemandMapper.value(entity.timezone),

      hasTargetArrival: entity.hasTargetArrival(),
      hasMaximumArrival: entity.hasMaximumArrival(),
      hasArrivalConstraint: entity.hasArrivalConstraint(),
      hasDepartureWindow: entity.hasDepartureWindow(),

      isExactDepartureTime: entity.isExactDepartureTime(),
      isExactArrivalTime: entity.isExactArrivalTime(),

      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  // ===========================================================================
  // Capacity
  // ===========================================================================

  public static capacity(
    entity: JourneyDemandCapacityEntity,
  ): MyJourneyDemandCapacityResponse {
    return {
      publicId: MyJourneyDemandMapper.publicId(entity.publicId),

      requestedSeats: entity.requestedSeats.value,
      matchedSeats: entity.matchedSeats,
      remainingSeats: entity.remainingSeats,

      hasCapacity: entity.hasCapacity(),
      isFull: entity.isFull(),
      isEmpty: entity.isEmpty(),
      isPartiallyMatched: entity.isPartiallyMatched(),
      isFullyMatched: entity.isFullyMatched(),

      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  // ===========================================================================
  // Pricing
  // ===========================================================================

  public static pricing(
    entity: JourneyDemandPricingEntity,
  ): MyJourneyDemandPricingResponse {
    return {
      publicId: MyJourneyDemandMapper.publicId(entity.publicId),

      maximumPricePerSeat:
        entity.maximumPricePerSeat !== undefined
          ? entity.maximumPricePerSeat.value
          : undefined,

      preferredPricePerSeat:
        entity.preferredPricePerSeat !== undefined
          ? entity.preferredPricePerSeat.value
          : undefined,

      currency: MyJourneyDemandMapper.value(entity.currency),

      hasMaximumPrice: entity.hasMaximumPrice(),
      hasPreferredPrice: entity.hasPreferredPrice(),
      hasPriceConstraint: entity.hasPriceConstraint(),

      hasMaximumPriceConstraint: entity.hasMaximumPriceConstraint(),
      hasPreferredPriceConstraint: entity.hasPreferredPriceConstraint(),

      isUnconstrained: entity.isUnconstrained(),
      isPreferredPriceOnly: entity.isPreferredPriceOnly(),
      isMaximumPriceOnly: entity.isMaximumPriceOnly(),
      hasPreferredAndMaximumPrice: entity.hasPreferredAndMaximumPrice(),

      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  // ===========================================================================
  // Participant
  // ===========================================================================

  public static participant(
    entity: JourneyDemandParticipantEntity,
  ): MyJourneyDemandParticipantResponse {
    return {
      publicId: MyJourneyDemandMapper.publicId(entity.publicId),

      memberPublicId: MyJourneyDemandMapper.publicId(entity.memberPublicId),

      seats: entity.seatCount(),

      status: MyJourneyDemandMapper.value(entity.status),

      joinedAt: entity.joinedAt.toISOString(),

      withdrawnAt:
        entity.withdrawnAt !== undefined
          ? entity.withdrawnAt.toISOString()
          : undefined,

      removedAt:
        entity.removedAt !== undefined
          ? entity.removedAt.toISOString()
          : undefined,

      isActive: entity.isActive(),
      isWithdrawn: entity.isWithdrawn(),
      isRemoved: entity.isRemoved(),

      canParticipate: entity.canParticipate(),
      hasWithdrawn: entity.hasWithdrawn(),
      hasBeenRemoved: entity.hasBeenRemoved(),

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

export default MyJourneyDemandMapper;
