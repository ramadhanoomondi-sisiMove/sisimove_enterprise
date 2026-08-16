// src/domains/journey/presentation/rest/mappers/journey-response.mapper.ts

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import type { JourneyAggregate } from '../../../domain/aggregates/journey.aggregate';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { JourneyEntity } from '../../../domain/entities/journey.entity';
import type { JourneyCorridorEntity } from '../../../domain/entities/journey-corridor.entity';
import type { JourneyWaypointEntity } from '../../../domain/entities/journey-waypoint.entity';
import type { JourneyScheduleEntity } from '../../../domain/entities/journey-schedule.entity';
import type { JourneyVehicleEntity } from '../../../domain/entities/journey-vehicle.entity';
import type { JourneyCapacityEntity } from '../../../domain/entities/journey-capacity.entity';
import type { JourneyPricingEntity } from '../../../domain/entities/journey-pricing.entity';
import type { JourneyPreferencesEntity } from '../../../domain/entities/journey-preferences.entity';
import type { JourneyAssetEntity } from '../../../domain/entities/journey-asset.entity';

// -----------------------------------------------------------------------------
// Response Types
// -----------------------------------------------------------------------------

export interface JourneyResponse {
  id: string;
  publicId: string;

  providerPublicId: string;

  status: string;

  publishedAt: Date | null;
  startedAt: Date | null;
  completionRequestedAt: Date | null;
  completedAt: Date | null;
  cancelledAt: Date | null;
  expiredAt: Date | null;

  version: number;

  corridor: JourneyCorridorResponse | null;
  schedule: JourneyScheduleResponse | null;
  vehicle: JourneyVehicleResponse | null;
  capacity: JourneyCapacityResponse | null;
  pricing: JourneyPricingResponse | null;
  preferences: JourneyPreferencesResponse | null;

  assets: JourneyAssetResponse[];

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Corridor Response
// -----------------------------------------------------------------------------

export interface JourneyCorridorResponse {
  id: string;
  publicId: string;

  originName: string;
  destinationName: string;

  originLatitude: number;
  originLongitude: number;

  destinationLatitude: number;
  destinationLongitude: number;

  corridorKey: string | null;

  waypoints: JourneyWaypointResponse[];

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Waypoint Response
// -----------------------------------------------------------------------------

export interface JourneyWaypointResponse {
  id: string;
  publicId: string;

  type: string;
  sequence: number;

  name: string;

  latitude: number;
  longitude: number;

  pickupAllowed: boolean;
  dropoffAllowed: boolean;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Schedule Response
// -----------------------------------------------------------------------------

export interface JourneyScheduleResponse {
  id: string;
  publicId: string;

  departureAt: Date;
  arrivalAt: Date | null;

  timezone: string;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Vehicle Response
// -----------------------------------------------------------------------------

export interface JourneyVehicleResponse {
  id: string;
  publicId: string;

  make: string;
  model: string;
  year: number | null;
  color: string | null;
  registration: string | null;

  assetPublicId: string | null;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Capacity Response
// -----------------------------------------------------------------------------

export interface JourneyCapacityResponse {
  id: string;
  publicId: string;

  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Pricing Response
// -----------------------------------------------------------------------------

export interface JourneyPricingResponse {
  id: string;
  publicId: string;

  amount: number;
  currency: string;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Preferences Response
// -----------------------------------------------------------------------------

export interface JourneyPreferencesResponse {
  id: string;
  publicId: string;

  smoking: string;
  pets: string;
  luggage: string;
  conversation: string;
  music: string;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Asset Response
// -----------------------------------------------------------------------------

export interface JourneyAssetResponse {
  id: string;
  publicId: string;

  assetPublicId: string;

  type: string;
  sortOrder: number;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export class JourneyResponseMapper {
  // ===========================================================================
  // Aggregate
  // ===========================================================================

  static fromAggregate(aggregate: JourneyAggregate): JourneyResponse {
    return {
      ...this.fromEntity(aggregate.journey),

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
  // Journey
  // ===========================================================================

  static fromEntity(
    entity: JourneyEntity,
  ): Omit<
    JourneyResponse,
    | 'corridor'
    | 'schedule'
    | 'vehicle'
    | 'capacity'
    | 'pricing'
    | 'preferences'
    | 'assets'
  > {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      providerPublicId: entity.providerPublicId.value,

      status: entity.status.value,

      publishedAt: entity.publishedAt ?? null,

      startedAt: entity.startedAt ?? null,

      completionRequestedAt: entity.completionRequestedAt ?? null,

      completedAt: entity.completedAt ?? null,

      cancelledAt: entity.cancelledAt ?? null,

      expiredAt: entity.expiredAt ?? null,

      version: entity.version,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Corridor
  // ===========================================================================

  static fromCorridorEntity(
    entity: JourneyCorridorEntity,
  ): JourneyCorridorResponse {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      originName: entity.originName.value,

      destinationName: entity.destinationName.value,

      originLatitude: entity.originLatitude.value,

      originLongitude: entity.originLongitude.value,

      destinationLatitude: entity.destinationLatitude.value,

      destinationLongitude: entity.destinationLongitude.value,

      corridorKey: entity.corridorKey?.value ?? null,

      waypoints: entity.waypoints.map((waypoint) =>
        this.fromWaypointEntity(waypoint),
      ),

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Waypoint
  // ===========================================================================

  static fromWaypointEntity(
    entity: JourneyWaypointEntity,
  ): JourneyWaypointResponse {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      type: entity.type.value,

      sequence: entity.sequence.value,

      name: entity.name.value,

      latitude: entity.latitude.value,

      longitude: entity.longitude.value,

      pickupAllowed: entity.pickupAllowed,

      dropoffAllowed: entity.dropoffAllowed,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Schedule
  // ===========================================================================

  static fromScheduleEntity(
    entity: JourneyScheduleEntity,
  ): JourneyScheduleResponse {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      departureAt: entity.departureAt.value,

      arrivalAt: entity.arrivalAt?.value ?? null,

      timezone: entity.timezone.value,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Vehicle
  // ===========================================================================

  static fromVehicleEntity(
    entity: JourneyVehicleEntity,
  ): JourneyVehicleResponse {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      make: entity.make.value,

      model: entity.model.value,

      year: entity.year?.value ?? null,

      color: entity.color?.value ?? null,

      registration: entity.registration?.value ?? null,

      assetPublicId: entity.assetPublicId?.value ?? null,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Capacity
  // ===========================================================================

  static fromCapacityEntity(
    entity: JourneyCapacityEntity,
  ): JourneyCapacityResponse {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      totalSeats: entity.totalSeats.value,

      bookedSeats: entity.bookedSeats.value,

      availableSeats: entity.availableSeats,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Pricing
  // ===========================================================================

  static fromPricingEntity(
    entity: JourneyPricingEntity,
  ): JourneyPricingResponse {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      amount: entity.amount.value,

      currency: entity.currency.value,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Preferences
  // ===========================================================================

  static fromPreferencesEntity(
    entity: JourneyPreferencesEntity,
  ): JourneyPreferencesResponse {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      smoking: entity.smoking.value,

      pets: entity.pets.value,

      luggage: entity.luggage.value,

      conversation: entity.conversation.value,

      music: entity.music.value,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Asset
  // ===========================================================================

  static fromAssetEntity(entity: JourneyAssetEntity): JourneyAssetResponse {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      assetPublicId: entity.assetPublicId.value,

      type: entity.type.value,

      sortOrder: entity.sortOrder.value,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Individual Responses
  // ===========================================================================

  static fromCorridor(entity: JourneyCorridorEntity): JourneyCorridorResponse {
    return this.fromCorridorEntity(entity);
  }

  static fromWaypoints(
    entities: JourneyWaypointEntity[],
  ): JourneyWaypointResponse[] {
    return entities.map((entity) => this.fromWaypointEntity(entity));
  }

  static fromWaypoint(entity: JourneyWaypointEntity): JourneyWaypointResponse {
    return this.fromWaypointEntity(entity);
  }

  static fromSchedule(entity: JourneyScheduleEntity): JourneyScheduleResponse {
    return this.fromScheduleEntity(entity);
  }

  static fromVehicle(entity: JourneyVehicleEntity): JourneyVehicleResponse {
    return this.fromVehicleEntity(entity);
  }

  static fromCapacity(entity: JourneyCapacityEntity): JourneyCapacityResponse {
    return this.fromCapacityEntity(entity);
  }

  static fromPricing(entity: JourneyPricingEntity): JourneyPricingResponse {
    return this.fromPricingEntity(entity);
  }

  static fromPreferences(
    entity: JourneyPreferencesEntity,
  ): JourneyPreferencesResponse {
    return this.fromPreferencesEntity(entity);
  }

  static fromAsset(entity: JourneyAssetEntity): JourneyAssetResponse {
    return this.fromAssetEntity(entity);
  }

  static fromAssets(entities: JourneyAssetEntity[]): JourneyAssetResponse[] {
    return entities.map((entity) => this.fromAssetEntity(entity));
  }
}
