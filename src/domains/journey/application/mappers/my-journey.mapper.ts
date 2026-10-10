// -----------------------------------------------------------------------------
// sisiMove — Authenticated My Journey Mapper
// -----------------------------------------------------------------------------

import type { JourneyAggregate } from '../../domain/aggregates/journey.aggregate';

import type { JourneyEntity } from '../../domain/entities/journey.entity';
import type { JourneyCorridorEntity } from '../../domain/entities/journey-corridor.entity';
import type { JourneyWaypointEntity } from '../../domain/entities/journey-waypoint.entity';
import type { JourneyScheduleEntity } from '../../domain/entities/journey-schedule.entity';
import type { JourneyVehicleEntity } from '../../domain/entities/journey-vehicle.entity';
import type { JourneyCapacityEntity } from '../../domain/entities/journey-capacity.entity';
import type { JourneyPricingEntity } from '../../domain/entities/journey-pricing.entity';
import type { JourneyPreferencesEntity } from '../../domain/entities/journey-preferences.entity';
import type { JourneyAssetEntity } from '../../domain/entities/journey-asset.entity';

import type { JourneyBookingResponse } from '../../../journey-booking/presentation/rest/mappers/journey-booking-response.mapper';

import type { JourneyBoardingResponse } from '../../../journey-boarding/presentation/rest/mappers/journey-boarding-response.mapper';

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
  MyJourneyAssetReferenceResponse,
} from '../responses/my-journey.response';

export class MyJourneyMapper {
  // ===========================================================================
  // Aggregate
  // ===========================================================================

  public static fromAggregate(
    aggregate: JourneyAggregate,
    vehicleAsset: MyJourneyAssetReferenceResponse | null = null,
    bookings: readonly JourneyBookingResponse[] = [],
    boarding: JourneyBoardingResponse | null = null,
    unreadMessagesCount = 0,
  ): MyJourneyResponse {
    return {
      publicId: aggregate.journey.publicId.value,

      status: aggregate.status.value,

      publishedAt: aggregate.publishedAt ?? null,

      startedAt: aggregate.startedAt ?? null,

      completionRequestedAt: aggregate.completionRequestedAt ?? null,

      completedAt: aggregate.completedAt ?? null,

      cancelledAt: aggregate.cancelledAt ?? null,

      expiredAt: aggregate.expiredAt ?? null,

      createdAt: aggregate.journey.createdAt,

      updatedAt: aggregate.journey.updatedAt,

      route: aggregate.corridor
        ? this.fromCorridorEntity(aggregate.corridor)
        : null,

      schedule: aggregate.schedule
        ? this.fromScheduleEntity(aggregate.schedule)
        : null,

      vehicle: aggregate.vehicle
        ? this.fromVehicleEntity(aggregate.vehicle, vehicleAsset)
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

      bookings,

      unreadMessagesCount,

      boarding,
    };
  }

  // ===========================================================================
  // Collection
  // ===========================================================================

  public static fromAggregates(
    aggregates: readonly JourneyAggregate[],
  ): readonly MyJourneyResponse[] {
    return aggregates.map((aggregate) => this.fromAggregate(aggregate));
  }

  // ===========================================================================
  // Journey Entity
  // ===========================================================================

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
    asset: MyJourneyAssetReferenceResponse | null = null,
  ): MyJourneyVehicleResponse {
    return {
      publicId: entity.publicId.value,

      make: entity.make.value,

      model: entity.model.value,

      year: entity.year?.value ?? null,

      color: entity.color?.value ?? null,

      registration: entity.registration?.value ?? null,

      assetPublicId: entity.assetPublicId?.value ?? null,

      asset,
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
  // Journey Asset
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
  // Convenience Mappers
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
    asset: MyJourneyAssetReferenceResponse | null = null,
  ): MyJourneyVehicleResponse {
    return this.fromVehicleEntity(entity, asset);
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
