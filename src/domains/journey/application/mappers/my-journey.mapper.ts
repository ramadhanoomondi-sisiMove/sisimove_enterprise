// -----------------------------------------------------------------------------
// sisiMove — Authenticated My Journey Mapper
// -----------------------------------------------------------------------------
//
// Maps a JourneyAggregate into the authenticated "My Journey" HTTP
// projection.
//
// Architectural boundary:
//
//     JourneyAggregate
//           │
//           ▼
//     MyJourneyMapper
//           │
//           ▼
//     MyJourneyResponse
//           │
//           ▼
//     GET /journeys/me
//
// This mapper is intentionally separate from:
//
//     PublicJourneyMapper
//
// and:
//
//     JourneyResponseMapper
//
// because each mapper serves a different boundary.
//
// PublicJourneyMapper:
//   - marketplace-safe projection
//   - only represents publicly discoverable Journeys
//   - requires the mandatory publication components
//   - omits lifecycle/ownership information
//
// JourneyResponseMapper:
//   - internal/general REST representation
//   - exposes internal entity identifiers
//   - exposes providerPublicId
//   - exposes version
//
// MyJourneyMapper:
//   - authenticated owner projection
//   - may represent draft, published, active, completed, cancelled, or
//     expired Journeys
//   - includes lifecycle information
//   - does not expose providerPublicId
//   - does not expose internal entity IDs
//   - does not expose aggregate version
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// This mapper is an APPLICATION/HTTP projection mapper.
//
// It must NOT:
//   - query TravellerProfile
//   - query Trust
//   - query Assets
//   - query Prisma
//   - perform authorization
//   - derive ownership from request data
//   - expose domain value objects
//   - expose UniqueEntityId
//   - expose providerPublicId
//   - expose aggregate version
//
// Ownership has already been established before this mapper is called:
//
//     GetJourneysByProviderQuery(identity.identityPublicId)
//
// The mapper's responsibility is representation only.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import type { JourneyAggregate } from '../../domain/aggregates/journey.aggregate';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { JourneyEntity } from '../../domain/entities/journey.entity';
import type { JourneyCorridorEntity } from '../../domain/entities/journey-corridor.entity';
import type { JourneyWaypointEntity } from '../../domain/entities/journey-waypoint.entity';
import type { JourneyScheduleEntity } from '../../domain/entities/journey-schedule.entity';
import type { JourneyVehicleEntity } from '../../domain/entities/journey-vehicle.entity';
import type { JourneyCapacityEntity } from '../../domain/entities/journey-capacity.entity';
import type { JourneyPricingEntity } from '../../domain/entities/journey-pricing.entity';
import type { JourneyPreferencesEntity } from '../../domain/entities/journey-preferences.entity';
import type { JourneyAssetEntity } from '../../domain/entities/journey-asset.entity';

// -----------------------------------------------------------------------------
// Application Response
// -----------------------------------------------------------------------------

import type {
  MyJourneyResponse,
  MyJourneyRouteResponse,
  MyJourneyWaypointResponse,
  MyJourneyScheduleResponse,
  MyJourneyVehicleResponse,
  MyJourneyCapacityResponse,
  MyJourneyPricingResponse,
  MyJourneyPreferencesResponse,
  MyJourneyAssetResponse,
} from '../responses/my-journey.response';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export class MyJourneyMapper {
  // ===========================================================================
  // Aggregate
  // ===========================================================================

  /**
   * Project a JourneyAggregate into the authenticated owner's Journey view.
   *
   * Unlike the public marketplace projection, this method intentionally allows
   * incomplete Journey aggregates.
   *
   * A Journey may legitimately be in DRAFT state and therefore may not yet
   * contain:
   *
   *   - corridor
   *   - schedule
   *   - vehicle
   *   - capacity
   *   - pricing
   *
   * Consequently, these components are represented as null when absent.
   *
   * This is important because GET /journeys/me is an ownership/lifecycle
   * endpoint, not a public-discovery endpoint.
   */
  public static fromAggregate(aggregate: JourneyAggregate): MyJourneyResponse {
    return {
      // -----------------------------------------------------------------------
      // Journey identity
      // -----------------------------------------------------------------------
      //
      // Only the stable public Journey identifier crosses the HTTP boundary.
      //
      // Internal UniqueEntityId is intentionally excluded.
      //
      publicId: aggregate.journey.publicId.value,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------
      //
      // The authenticated owner needs the Journey's current lifecycle state.
      //
      // The domain value object itself never crosses the application/HTTP
      // boundary.
      //
      status: aggregate.status.value,

      publishedAt: aggregate.publishedAt ?? null,

      startedAt: aggregate.startedAt ?? null,

      completionRequestedAt: aggregate.completionRequestedAt ?? null,

      completedAt: aggregate.completedAt ?? null,

      cancelledAt: aggregate.cancelledAt ?? null,

      expiredAt: aggregate.expiredAt ?? null,

      // -----------------------------------------------------------------------
      // Journey timestamps
      // -----------------------------------------------------------------------

      createdAt: aggregate.journey.createdAt,

      updatedAt: aggregate.journey.updatedAt,

      // -----------------------------------------------------------------------
      // Journey components
      // -----------------------------------------------------------------------
      //
      // These are nullable because authenticated "My Journeys" includes
      // incomplete/draft Journeys.
      //
      corridor: aggregate.corridor
        ? this.fromCorridorEntity(aggregate.corridor)
        : null,

      schedule: aggregate.schedule
        ? this.fromScheduleEntity(aggregate.schedule)
        : null,

      vehicle: aggregate.vehicle
        ? this.fromVehicleEntity(aggregate.vehicle)
        : null,

      capacity: aggregate.capacity
        ? this.fromCapacityEntity(aggregate.capacity)
        : null,

      pricing: aggregate.pricing
        ? this.fromPricingEntity(aggregate.pricing)
        : null,

      preferences: aggregate.preferences
        ? this.fromPreferencesEntity(aggregate.preferences)
        : null,

      assets: aggregate.assets.map((asset) => this.fromAssetEntity(asset)),
    };
  }

  // ===========================================================================
  // Collection
  // ===========================================================================

  /**
   * Project multiple authenticated Journeys.
   *
   * Used by:
   *
   *     GET /journeys/me
   *
   * The ownership constraint is established by the query handler before this
   * mapper is invoked.
   */
  public static fromAggregates(
    aggregates: readonly JourneyAggregate[],
  ): readonly MyJourneyResponse[] {
    return aggregates.map((aggregate) => this.fromAggregate(aggregate));
  }

  // ===========================================================================
  // Journey Entity
  // ===========================================================================

  /**
   * Maps the aggregate's root Journey entity into the safe authenticated
   * representation.
   *
   * This method intentionally does NOT expose:
   *
   *   - entity.id
   *   - providerPublicId
   *   - version
   *
   * Ownership has already been established by the authenticated query boundary.
   */
  public static fromEntity(
    entity: JourneyEntity,
  ): Pick<
    MyJourneyResponse,
    | 'publicId'
    | 'status'
    | 'publishedAt'
    | 'startedAt'
    | 'completionRequestedAt'
    | 'completedAt'
    | 'cancelledAt'
    | 'expiredAt'
    | 'createdAt'
    | 'updatedAt'
  > {
    return {
      publicId: entity.publicId.value,

      status: entity.status.value,

      publishedAt: entity.publishedAt ?? null,

      startedAt: entity.startedAt ?? null,

      completionRequestedAt: entity.completionRequestedAt ?? null,

      completedAt: entity.completedAt ?? null,

      cancelledAt: entity.cancelledAt ?? null,

      expiredAt: entity.expiredAt ?? null,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Corridor
  // ===========================================================================

  /**
   * Maps the Journey corridor into the authenticated Journey representation.
   *
   * Unlike the public mapper, this mapper retains the domain concept as
   * "corridor" because the authenticated owner is operating the Journey,
   * rather than consuming the marketplace language.
   */
  public static fromCorridorEntity(
    entity: JourneyCorridorEntity,
  ): MyJourneyRouteResponse {
    return {
      origin: {
        name: entity.originName.value,
        latitude: entity.originLatitude.value,
        longitude: entity.originLongitude.value,
      },

      destination: {
        name: entity.destinationName.value,
        latitude: entity.destinationLatitude.value,
        longitude: entity.destinationLongitude.value,
      },

      waypoints: entity.waypoints.map((waypoint) =>
        this.fromWaypointEntity(waypoint),
      ),
    };
  }

  // ===========================================================================
  // Waypoint
  // ===========================================================================

  public static fromWaypointEntity(
    entity: JourneyWaypointEntity,
  ): MyJourneyWaypointResponse {
    return {
      publicId: entity.publicId.value,

      type: entity.type.value,

      sequence: entity.sequence.value,

      name: entity.name.value,

      latitude: entity.latitude.value,

      longitude: entity.longitude.value,

      pickupAllowed: entity.pickupAllowed,

      dropoffAllowed: entity.dropoffAllowed,
    };
  }

  // ===========================================================================
  // Schedule
  // ===========================================================================

  public static fromScheduleEntity(
    entity: JourneyScheduleEntity,
  ): MyJourneyScheduleResponse {
    return {
      publicId: entity.publicId.value,

      departureAt: entity.departureAt.value,

      arrivalAt: entity.arrivalAt?.value ?? null,

      timezone: entity.timezone.value,
    };
  }

  // ===========================================================================
  // Vehicle
  // ===========================================================================

  public static fromVehicleEntity(
    entity: JourneyVehicleEntity,
  ): MyJourneyVehicleResponse {
    return {
      publicId: entity.publicId.value,

      make: entity.make.value,

      model: entity.model.value,

      year: entity.year?.value ?? null,

      color: entity.color?.value ?? null,

      registration: entity.registration?.value ?? null,

      assetPublicId: entity.assetPublicId?.value ?? null,
    };
  }

  // ===========================================================================
  // Capacity
  // ===========================================================================

  public static fromCapacityEntity(
    entity: JourneyCapacityEntity,
  ): MyJourneyCapacityResponse {
    return {
      publicId: entity.publicId.value,

      totalSeats: entity.totalSeats.value,

      bookedSeats: entity.bookedSeats.value,

      availableSeats: entity.availableSeats,
    };
  }

  // ===========================================================================
  // Pricing
  // ===========================================================================

  public static fromPricingEntity(
    entity: JourneyPricingEntity,
  ): MyJourneyPricingResponse {
    return {
      publicId: entity.publicId.value,

      amount: entity.amount.value,

      currency: entity.currency.value,
    };
  }

  // ===========================================================================
  // Preferences
  // ===========================================================================

  public static fromPreferencesEntity(
    entity: JourneyPreferencesEntity,
  ): MyJourneyPreferencesResponse {
    return {
      publicId: entity.publicId.value,

      smoking: entity.smoking.value,

      pets: entity.pets.value,

      luggage: entity.luggage.value,

      conversation: entity.conversation.value,

      music: entity.music.value,
    };
  }

  // ===========================================================================
  // Asset
  // ===========================================================================

  public static fromAssetEntity(
    entity: JourneyAssetEntity,
  ): MyJourneyAssetResponse {
    return {
      publicId: entity.publicId.value,

      assetPublicId: entity.assetPublicId.value,

      type: entity.type.value,

      sortOrder: entity.sortOrder.value,
    };
  }

  // ===========================================================================
  // Individual Convenience Mappers
  // ===========================================================================

  public static fromCorridor(
    entity: JourneyCorridorEntity,
  ): MyJourneyRouteResponse {
    return this.fromCorridorEntity(entity);
  }

  public static fromWaypoint(
    entity: JourneyWaypointEntity,
  ): MyJourneyWaypointResponse {
    return this.fromWaypointEntity(entity);
  }

  public static fromWaypoints(
    entities: readonly JourneyWaypointEntity[],
  ): readonly MyJourneyWaypointResponse[] {
    return entities.map((entity) => this.fromWaypointEntity(entity));
  }

  public static fromSchedule(
    entity: JourneyScheduleEntity,
  ): MyJourneyScheduleResponse {
    return this.fromScheduleEntity(entity);
  }

  public static fromVehicle(
    entity: JourneyVehicleEntity,
  ): MyJourneyVehicleResponse {
    return this.fromVehicleEntity(entity);
  }

  public static fromCapacity(
    entity: JourneyCapacityEntity,
  ): MyJourneyCapacityResponse {
    return this.fromCapacityEntity(entity);
  }

  public static fromPricing(
    entity: JourneyPricingEntity,
  ): MyJourneyPricingResponse {
    return this.fromPricingEntity(entity);
  }

  public static fromPreferences(
    entity: JourneyPreferencesEntity,
  ): MyJourneyPreferencesResponse {
    return this.fromPreferencesEntity(entity);
  }

  public static fromAsset(entity: JourneyAssetEntity): MyJourneyAssetResponse {
    return this.fromAssetEntity(entity);
  }

  public static fromAssets(
    entities: readonly JourneyAssetEntity[],
  ): readonly MyJourneyAssetResponse[] {
    return entities.map((entity) => this.fromAssetEntity(entity));
  }
}
