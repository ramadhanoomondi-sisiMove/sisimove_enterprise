// -----------------------------------------------------------------------------
// sisiMove — Public Journey Mapper
// -----------------------------------------------------------------------------
//
// This mapper defines the application-layer representation of a Journey when
// the Journey crosses the public marketplace read boundary.
//
// IMPORTANT:
//
// JourneyEntity is the domain model.
// JourneyResponseMapper is the internal REST/domain response representation.
//
// Neither should be exposed directly by the public marketplace.
//
// The marketplace has a deliberately different contract:
//
//   JourneyEntity
//       ↓
//   PublicJourneyMapper
//       ↓
//   PublicJourney
//
// The public representation:
// - exposes only marketplace-safe Journey information;
// - renames the domain concept "corridor" to "route";
// - removes internal entity identifiers;
// - removes providerPublicId because provider identity is represented by the
//   composed public Traveller/Trust projection;
// - removes internal lifecycle timestamps and version;
// - does not expose booking, financial, settlement, or operational data.
//
// This mapper does NOT:
// - fetch Traveller data;
// - fetch Trust data;
// - query another bounded context;
// - decide whether a Journey is publicly visible.
//
// Public visibility belongs to the Journey repository's public-read boundary.
// Cross-domain enrichment belongs to the public Journey query handler.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain
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
// Public Marketplace Response
// -----------------------------------------------------------------------------

export interface PublicJourneyRoute {
  readonly origin: {
    readonly name: string;
    readonly latitude: number;
    readonly longitude: number;
  };

  readonly destination: {
    readonly name: string;
    readonly latitude: number;
    readonly longitude: number;
  };

  readonly waypoints: readonly PublicJourneyWaypoint[];
}

export interface PublicJourneyWaypoint {
  readonly publicId: string;
  readonly type: string;
  readonly sequence: number;
  readonly name: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly pickupAllowed: boolean;
  readonly dropoffAllowed: boolean;
}

export interface PublicJourneySchedule {
  readonly departureAt: Date;
  readonly arrivalAt: Date | null;
  readonly timezone: string;
}

export interface PublicJourneyVehicle {
  readonly publicId: string;
  readonly make: string;
  readonly model: string;
  readonly year: number | null;
  readonly color: string | null;
  readonly registration: string | null;
  readonly assetPublicId: string | null;
}

export interface PublicJourneyCapacity {
  readonly totalSeats: number;
  readonly bookedSeats: number;
  readonly availableSeats: number;
}

export interface PublicJourneyPricing {
  readonly amount: number;
  readonly currency: string;
}

export interface PublicJourneyPreferences {
  readonly smoking: string;
  readonly pets: string;
  readonly luggage: string;
  readonly conversation: string;
  readonly music: string;
}

export interface PublicJourneyAsset {
  readonly publicId: string;
  readonly assetPublicId: string;
  readonly type: string;
  readonly sortOrder: number;
}

export interface PublicJourneyProjection {
  readonly publicId: string;

  readonly route: PublicJourneyRoute;

  readonly schedule: PublicJourneySchedule;

  readonly vehicle: PublicJourneyVehicle;

  readonly capacity: PublicJourneyCapacity;

  readonly pricing: PublicJourneyPricing;

  readonly preferences: PublicJourneyPreferences | null;

  readonly assets: readonly PublicJourneyAsset[];
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export class PublicJourneyMapper {
  // ===========================================================================
  // Journey
  // ===========================================================================

  /**
   * Project a fully hydrated JourneyEntity into the public marketplace model.
   *
   * A published Journey must contain the mandatory components required by the
   * Journey aggregate before it can become publicly discoverable:
   *
   *   - corridor
   *   - schedule
   *   - vehicle
   *   - capacity
   *   - pricing
   *
   * The aggregate therefore guarantees these components for a valid published
   * Journey. We still validate at the application boundary instead of using
   * non-null assertions, because a malformed persistence record should fail
   * explicitly rather than produce an incomplete marketplace response.
   */
  public static fromEntity(entity: JourneyEntity): PublicJourneyProjection {
    const corridor = this.requireCorridor(entity);
    const schedule = this.requireSchedule(entity);
    const vehicle = this.requireVehicle(entity);
    const capacity = this.requireCapacity(entity);
    const pricing = this.requirePricing(entity);

    return {
      publicId: entity.publicId.value,

      route: this.fromCorridor(corridor),

      schedule: this.fromSchedule(schedule),

      vehicle: this.fromVehicle(vehicle),

      capacity: this.fromCapacity(capacity),

      pricing: this.fromPricing(pricing),

      preferences:
        entity.preferences !== undefined
          ? this.fromPreferences(entity.preferences)
          : null,

      assets: entity.assets.map((asset) => this.fromAsset(asset)),
    };
  }

  // ===========================================================================
  // Required Component Guards
  // ===========================================================================

  private static requireCorridor(entity: JourneyEntity): JourneyCorridorEntity {
    if (entity.corridor === undefined) {
      throw new Error(
        `Published Journey "${entity.publicId.value}" is missing its corridor.`,
      );
    }

    return entity.corridor;
  }

  private static requireSchedule(entity: JourneyEntity): JourneyScheduleEntity {
    if (entity.schedule === undefined) {
      throw new Error(
        `Published Journey "${entity.publicId.value}" is missing its schedule.`,
      );
    }

    return entity.schedule;
  }

  private static requireVehicle(entity: JourneyEntity): JourneyVehicleEntity {
    if (entity.vehicle === undefined) {
      throw new Error(
        `Published Journey "${entity.publicId.value}" is missing its vehicle.`,
      );
    }

    return entity.vehicle;
  }

  private static requireCapacity(entity: JourneyEntity): JourneyCapacityEntity {
    if (entity.capacity === undefined) {
      throw new Error(
        `Published Journey "${entity.publicId.value}" is missing its capacity.`,
      );
    }

    return entity.capacity;
  }

  private static requirePricing(entity: JourneyEntity): JourneyPricingEntity {
    if (entity.pricing === undefined) {
      throw new Error(
        `Published Journey "${entity.publicId.value}" is missing its pricing.`,
      );
    }

    return entity.pricing;
  }

  // ===========================================================================
  // Route
  // ===========================================================================

  /**
   * The public marketplace calls the Journey corridor a "route".
   *
   * This is a deliberate public-language transformation rather than a domain
   * rename. The Journey domain continues to use JourneyCorridorEntity.
   */
  private static fromCorridor(
    entity: JourneyCorridorEntity,
  ): PublicJourneyRoute {
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
        this.fromWaypoint(waypoint),
      ),
    };
  }

  // ===========================================================================
  // Waypoint
  // ===========================================================================

  private static fromWaypoint(
    entity: JourneyWaypointEntity,
  ): PublicJourneyWaypoint {
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

  private static fromSchedule(
    entity: JourneyScheduleEntity,
  ): PublicJourneySchedule {
    return {
      departureAt: entity.departureAt.value,

      arrivalAt: entity.arrivalAt?.value ?? null,

      timezone: entity.timezone.value,
    };
  }

  // ===========================================================================
  // Vehicle
  // ===========================================================================

  private static fromVehicle(
    entity: JourneyVehicleEntity,
  ): PublicJourneyVehicle {
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

  private static fromCapacity(
    entity: JourneyCapacityEntity,
  ): PublicJourneyCapacity {
    return {
      totalSeats: entity.totalSeats.value,

      bookedSeats: entity.bookedSeats.value,

      availableSeats: entity.availableSeats,
    };
  }

  // ===========================================================================
  // Pricing
  // ===========================================================================

  private static fromPricing(
    entity: JourneyPricingEntity,
  ): PublicJourneyPricing {
    return {
      amount: entity.amount.value,

      currency: entity.currency.value,
    };
  }

  // ===========================================================================
  // Preferences
  // ===========================================================================

  private static fromPreferences(
    entity: JourneyPreferencesEntity,
  ): PublicJourneyPreferences {
    return {
      smoking: entity.smoking.value,

      pets: entity.pets.value,

      luggage: entity.luggage.value,

      conversation: entity.conversation.value,

      music: entity.music.value,
    };
  }

  // ===========================================================================
  // Assets
  // ===========================================================================

  private static fromAsset(entity: JourneyAssetEntity): PublicJourneyAsset {
    return {
      publicId: entity.publicId.value,

      assetPublicId: entity.assetPublicId.value,

      type: entity.type.value,

      sortOrder: entity.sortOrder.value,
    };
  }
}
