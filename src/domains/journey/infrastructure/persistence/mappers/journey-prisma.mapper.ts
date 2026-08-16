// src/domains/journey/infrastructure/persistence/mappers/journey-prisma.mapper.ts

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type {
  Journey as PrismaJourney,
  JourneyAsset as PrismaJourneyAsset,
  JourneyCapacity as PrismaJourneyCapacity,
  JourneyCorridor as PrismaJourneyCorridor,
  JourneyPreferences as PrismaJourneyPreferences,
  JourneyPricing as PrismaJourneyPricing,
  JourneySchedule as PrismaJourneySchedule,
  JourneyVehicle as PrismaJourneyVehicle,
  JourneyWaypoint as PrismaJourneyWaypoint,
} from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import { JourneyEntity } from '../../../domain/entities/journey.entity';
import { JourneyAssetEntity } from '../../../domain/entities/journey-asset.entity';
import { JourneyCapacityEntity } from '../../../domain/entities/journey-capacity.entity';
import { JourneyCorridorEntity } from '../../../domain/entities/journey-corridor.entity';
import { JourneyPreferencesEntity } from '../../../domain/entities/journey-preferences.entity';
import { JourneyPricingEntity } from '../../../domain/entities/journey-pricing.entity';
import { JourneyScheduleEntity } from '../../../domain/entities/journey-schedule.entity';
import { JourneyVehicleEntity } from '../../../domain/entities/journey-vehicle.entity';
import { JourneyWaypointEntity } from '../../../domain/entities/journey-waypoint.entity';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { JourneyAggregate } from '../../../domain/aggregates/journey.aggregate';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyAssetPublicId,
  JourneyAssetPublicIdReference,
  JourneyAssetSortOrder,
  JourneyAssetType,
  JourneyAssetTypeValueObject,
  JourneyBookedSeats,
  JourneyCapacityPublicId,
  JourneyTotalSeats,
  JourneyCorridorKey,
  JourneyCorridorPublicId,
  JourneyCurrency,
  JourneyLatitude,
  JourneyLongitude,
  JourneyLocationName,
  JourneyConversationPreference,
  JourneyConversationPreferenceValueObject,
  JourneyDepartureAt,
  JourneyArrivalAt,
  JourneyPreferencesPublicId,
  JourneyPricingAmount,
  JourneyPricingPublicId,
  JourneyProviderPublicId,
  JourneySchedulePublicId,
  JourneyTimezone,
  JourneyMusicPreference,
  JourneyMusicPreferenceValueObject,
  JourneyPetsPolicy,
  JourneyPetsPolicyValueObject,
  JourneySmokingPolicy,
  JourneySmokingPolicyValueObject,
  JourneyLuggagePolicy,
  JourneyLuggagePolicyValueObject,
  JourneyPublicId,
  JourneyStatus,
  JourneyStatusValueObject,
  JourneyVehicleAssetPublicId,
  JourneyVehicleColor,
  JourneyVehicleMake,
  JourneyVehicleModel,
  JourneyVehiclePublicId,
  JourneyVehicleRegistration,
  JourneyVehicleYear,
  JourneyWaypointPublicId,
  JourneyWaypointSequence,
  JourneyWaypointType,
  JourneyWaypointTypeValueObject,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Prisma → Domain enum conversion
// -----------------------------------------------------------------------------

function toJourneyStatus(value: string): JourneyStatus {
  if (!Object.values(JourneyStatus).includes(value as JourneyStatus)) {
    throw new Error(`Invalid persisted JourneyStatus "${value}".`);
  }

  return value as JourneyStatus;
}

function toJourneyWaypointType(value: string): JourneyWaypointType {
  if (
    !Object.values(JourneyWaypointType).includes(value as JourneyWaypointType)
  ) {
    throw new Error(`Invalid persisted JourneyWaypointType "${value}".`);
  }

  return value as JourneyWaypointType;
}

function toJourneySmokingPolicy(value: string): JourneySmokingPolicy {
  if (
    !Object.values(JourneySmokingPolicy).includes(value as JourneySmokingPolicy)
  ) {
    throw new Error(`Invalid persisted JourneySmokingPolicy "${value}".`);
  }

  return value as JourneySmokingPolicy;
}

function toJourneyPetsPolicy(value: string): JourneyPetsPolicy {
  if (!Object.values(JourneyPetsPolicy).includes(value as JourneyPetsPolicy)) {
    throw new Error(`Invalid persisted JourneyPetsPolicy "${value}".`);
  }

  return value as JourneyPetsPolicy;
}

function toJourneyLuggagePolicy(value: string): JourneyLuggagePolicy {
  if (
    !Object.values(JourneyLuggagePolicy).includes(value as JourneyLuggagePolicy)
  ) {
    throw new Error(`Invalid persisted JourneyLuggagePolicy "${value}".`);
  }

  return value as JourneyLuggagePolicy;
}

function toJourneyConversationPreference(
  value: string,
): JourneyConversationPreference {
  if (
    !Object.values(JourneyConversationPreference).includes(
      value as JourneyConversationPreference,
    )
  ) {
    throw new Error(
      `Invalid persisted JourneyConversationPreference "${value}".`,
    );
  }

  return value as JourneyConversationPreference;
}

function toJourneyMusicPreference(value: string): JourneyMusicPreference {
  if (
    !Object.values(JourneyMusicPreference).includes(
      value as JourneyMusicPreference,
    )
  ) {
    throw new Error(`Invalid persisted JourneyMusicPreference "${value}".`);
  }

  return value as JourneyMusicPreference;
}

function toJourneyAssetType(value: string): JourneyAssetType {
  if (!Object.values(JourneyAssetType).includes(value as JourneyAssetType)) {
    throw new Error(`Invalid persisted JourneyAssetType "${value}".`);
  }

  return value as JourneyAssetType;
}

// -----------------------------------------------------------------------------
// Prisma Types
// -----------------------------------------------------------------------------

export type JourneyWithComponents = PrismaJourney & {
  corridor?:
    | (PrismaJourneyCorridor & {
        waypoints?: PrismaJourneyWaypoint[];
      })
    | null;

  schedule?: PrismaJourneySchedule | null;

  vehicle?: PrismaJourneyVehicle | null;

  capacity?: PrismaJourneyCapacity | null;

  pricing?: PrismaJourneyPricing | null;

  preferences?: PrismaJourneyPreferences | null;

  assets?: PrismaJourneyAsset[];
};

// -----------------------------------------------------------------------------
// Persistence Types
// -----------------------------------------------------------------------------

export interface JourneyPersistence {
  journey: {
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

    createdAt: Date;
    updatedAt: Date;

    vehicleId: string | null;
  };

  corridor?: ReturnType<(typeof JourneyPrismaMapper)['corridorToPersistence']>;
  schedule?: ReturnType<(typeof JourneyPrismaMapper)['scheduleToPersistence']>;
  vehicle?: ReturnType<(typeof JourneyPrismaMapper)['vehicleToPersistence']>;
  capacity?: ReturnType<(typeof JourneyPrismaMapper)['capacityToPersistence']>;
  pricing?: ReturnType<(typeof JourneyPrismaMapper)['pricingToPersistence']>;
  preferences?: ReturnType<
    (typeof JourneyPrismaMapper)['preferencesToPersistence']
  >;

  assets: ReturnType<(typeof JourneyPrismaMapper)['assetToPersistence']>[];
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export class JourneyPrismaMapper {
  // ===========================================================================
  // Journey
  // ===========================================================================

  public static toDomain(record: JourneyWithComponents): JourneyEntity {
    const corridor =
      record.corridor !== undefined && record.corridor !== null
        ? this.corridorToDomain(record.corridor)
        : undefined;

    const schedule =
      record.schedule !== undefined && record.schedule !== null
        ? this.scheduleToDomain(record.schedule)
        : undefined;

    const vehicle =
      record.vehicle !== undefined && record.vehicle !== null
        ? this.vehicleToDomain(record.vehicle)
        : undefined;

    const capacity =
      record.capacity !== undefined && record.capacity !== null
        ? this.capacityToDomain(record.capacity)
        : undefined;

    const pricing =
      record.pricing !== undefined && record.pricing !== null
        ? this.pricingToDomain(record.pricing)
        : undefined;

    const preferences =
      record.preferences !== undefined && record.preferences !== null
        ? this.preferencesToDomain(record.preferences)
        : undefined;

    const assets =
      record.assets?.map((asset) => this.assetToDomain(asset)) ?? [];

    return JourneyEntity.rehydrate(
      {
        publicId: new JourneyPublicId(record.publicId),

        providerPublicId: new JourneyProviderPublicId(record.providerPublicId),

        status: new JourneyStatusValueObject(toJourneyStatus(record.status)),

        publishedAt: record.publishedAt ?? undefined,
        startedAt: record.startedAt ?? undefined,
        completionRequestedAt: record.completionRequestedAt ?? undefined,
        completedAt: record.completedAt ?? undefined,
        cancelledAt: record.cancelledAt ?? undefined,
        expiredAt: record.expiredAt ?? undefined,

        version: record.version,

        corridor,
        schedule,
        vehicle,
        capacity,
        pricing,
        preferences,

        assets,

        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),
    );
  }

  // ===========================================================================
  // Journey Persistence
  // ===========================================================================

  public static toPersistence(aggregate: JourneyAggregate): JourneyPersistence {
    const journey = aggregate.journey;

    const persistence: JourneyPersistence = {
      journey: {
        id: aggregate.id.toString(),

        publicId: journey.publicId.value,

        providerPublicId: journey.providerPublicId.value,

        status: journey.status.value,

        publishedAt: journey.publishedAt ?? null,
        startedAt: journey.startedAt ?? null,
        completionRequestedAt: journey.completionRequestedAt ?? null,
        completedAt: journey.completedAt ?? null,
        cancelledAt: journey.cancelledAt ?? null,
        expiredAt: journey.expiredAt ?? null,

        version: journey.version,

        createdAt: journey.createdAt,
        updatedAt: journey.updatedAt,

        vehicleId: aggregate.vehicle?.id.toString() ?? null,
      },

      assets: aggregate.assets.map((asset) =>
        this.assetToPersistence(asset, aggregate.id.toString()),
      ),
    };

    // -------------------------------------------------------------------------
    // Optional aggregate components
    //
    // IMPORTANT:
    // With exactOptionalPropertyTypes enabled, do NOT emit:
    //
    //   corridor: undefined
    //
    // Instead, omit the property completely.
    // -------------------------------------------------------------------------

    if (aggregate.corridor !== undefined) {
      persistence.corridor = this.corridorToPersistence(
        aggregate.corridor,
        aggregate.id.toString(),
      );
    }

    if (aggregate.schedule !== undefined) {
      persistence.schedule = this.scheduleToPersistence(
        aggregate.schedule,
        aggregate.id.toString(),
      );
    }

    if (aggregate.vehicle !== undefined) {
      persistence.vehicle = this.vehicleToPersistence(aggregate.vehicle);
    }

    if (aggregate.capacity !== undefined) {
      persistence.capacity = this.capacityToPersistence(
        aggregate.capacity,
        aggregate.id.toString(),
      );
    }

    if (aggregate.pricing !== undefined) {
      persistence.pricing = this.pricingToPersistence(
        aggregate.pricing,
        aggregate.id.toString(),
      );
    }

    if (aggregate.preferences !== undefined) {
      persistence.preferences = this.preferencesToPersistence(
        aggregate.preferences,
        aggregate.id.toString(),
      );
    }

    return persistence;
  }

  // ===========================================================================
  // Corridor
  // ===========================================================================

  private static corridorToDomain(
    record: PrismaJourneyCorridor & {
      waypoints?: PrismaJourneyWaypoint[];
    },
  ): JourneyCorridorEntity {
    const waypoints =
      record.waypoints?.map((waypoint) => this.waypointToDomain(waypoint)) ??
      [];

    return JourneyCorridorEntity.rehydrate(
      {
        publicId: new JourneyCorridorPublicId(record.publicId),

        originName: new JourneyLocationName(record.originName),

        destinationName: new JourneyLocationName(record.destinationName),

        originLatitude: new JourneyLatitude(Number(record.originLatitude)),

        originLongitude: new JourneyLongitude(Number(record.originLongitude)),

        destinationLatitude: new JourneyLatitude(
          Number(record.destinationLatitude),
        ),

        destinationLongitude: new JourneyLongitude(
          Number(record.destinationLongitude),
        ),

        corridorKey:
          record.corridorKey !== null
            ? new JourneyCorridorKey(record.corridorKey)
            : undefined,

        waypoints,

        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),
    );
  }

  private static corridorToPersistence(
    entity: JourneyCorridorEntity,
    journeyId: string,
  ) {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      journeyId,

      originName: entity.originName.value,
      destinationName: entity.destinationName.value,

      originLatitude: entity.originLatitude.value,
      originLongitude: entity.originLongitude.value,

      destinationLatitude: entity.destinationLatitude.value,
      destinationLongitude: entity.destinationLongitude.value,

      corridorKey: entity.corridorKey?.value ?? null,

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,

      waypoints: entity.waypoints.map((waypoint) =>
        this.waypointToPersistence(waypoint, entity.id.toString()),
      ),
    };
  }

  // ===========================================================================
  // Waypoint
  // ===========================================================================

  private static waypointToDomain(
    record: PrismaJourneyWaypoint,
  ): JourneyWaypointEntity {
    return JourneyWaypointEntity.rehydrate(
      {
        publicId: new JourneyWaypointPublicId(record.publicId),

        type: new JourneyWaypointTypeValueObject(
          toJourneyWaypointType(record.type),
        ),

        sequence: new JourneyWaypointSequence(record.sequence),

        name: new JourneyLocationName(record.name),

        latitude: new JourneyLatitude(Number(record.latitude)),

        longitude: new JourneyLongitude(Number(record.longitude)),

        pickupAllowed: record.pickupAllowed,
        dropoffAllowed: record.dropoffAllowed,

        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),
    );
  }

  private static waypointToPersistence(
    entity: JourneyWaypointEntity,
    corridorId: string,
  ) {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      corridorId,

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

  private static scheduleToDomain(
    record: PrismaJourneySchedule,
  ): JourneyScheduleEntity {
    return JourneyScheduleEntity.rehydrate(
      {
        publicId: new JourneySchedulePublicId(record.publicId),

        departureAt: new JourneyDepartureAt(record.departureAt),

        arrivalAt:
          record.arrivalAt !== null
            ? new JourneyArrivalAt(record.arrivalAt)
            : undefined,

        timezone: new JourneyTimezone(record.timezone),

        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),
    );
  }

  private static scheduleToPersistence(
    entity: JourneyScheduleEntity,
    journeyId: string,
  ) {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      journeyId,

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

  private static vehicleToDomain(
    record: PrismaJourneyVehicle,
  ): JourneyVehicleEntity {
    return JourneyVehicleEntity.rehydrate(
      {
        publicId: new JourneyVehiclePublicId(record.publicId),

        make: new JourneyVehicleMake(record.make),

        model: new JourneyVehicleModel(record.model),

        year:
          record.year !== null
            ? new JourneyVehicleYear(record.year)
            : undefined,

        color:
          record.color !== null
            ? new JourneyVehicleColor(record.color)
            : undefined,

        registration:
          record.registration !== null
            ? new JourneyVehicleRegistration(record.registration)
            : undefined,

        assetPublicId:
          record.assetPublicId !== null
            ? new JourneyVehicleAssetPublicId(record.assetPublicId)
            : undefined,

        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),
    );
  }

  private static vehicleToPersistence(entity: JourneyVehicleEntity) {
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

  private static capacityToDomain(
    record: PrismaJourneyCapacity,
  ): JourneyCapacityEntity {
    return JourneyCapacityEntity.rehydrate(
      {
        publicId: new JourneyCapacityPublicId(record.publicId),

        totalSeats: new JourneyTotalSeats(record.totalSeats),

        bookedSeats: new JourneyBookedSeats(record.bookedSeats),

        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),
    );
  }

  private static capacityToPersistence(
    entity: JourneyCapacityEntity,
    journeyId: string,
  ) {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      journeyId,

      totalSeats: entity.totalSeats.value,
      bookedSeats: entity.bookedSeats.value,

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Pricing
  // ===========================================================================

  private static pricingToDomain(
    record: PrismaJourneyPricing,
  ): JourneyPricingEntity {
    return JourneyPricingEntity.rehydrate(
      {
        publicId: new JourneyPricingPublicId(record.publicId),

        amount: new JourneyPricingAmount(record.amount),

        currency: new JourneyCurrency(record.currency),

        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),
    );
  }

  private static pricingToPersistence(
    entity: JourneyPricingEntity,
    journeyId: string,
  ) {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      journeyId,

      amount: entity.amount.value,

      currency: entity.currency.value,

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Preferences
  // ===========================================================================

  private static preferencesToDomain(
    record: PrismaJourneyPreferences,
  ): JourneyPreferencesEntity {
    return JourneyPreferencesEntity.rehydrate(
      {
        publicId: new JourneyPreferencesPublicId(record.publicId),

        smoking: new JourneySmokingPolicyValueObject(
          toJourneySmokingPolicy(record.smoking),
        ),

        pets: new JourneyPetsPolicyValueObject(
          toJourneyPetsPolicy(record.pets),
        ),

        luggage: new JourneyLuggagePolicyValueObject(
          toJourneyLuggagePolicy(record.luggage),
        ),

        conversation: new JourneyConversationPreferenceValueObject(
          toJourneyConversationPreference(record.conversation),
        ),

        music: new JourneyMusicPreferenceValueObject(
          toJourneyMusicPreference(record.music),
        ),

        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),
    );
  }

  private static preferencesToPersistence(
    entity: JourneyPreferencesEntity,
    journeyId: string,
  ) {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      journeyId,

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

  private static assetToDomain(record: PrismaJourneyAsset): JourneyAssetEntity {
    return JourneyAssetEntity.rehydrate(
      {
        publicId: new JourneyAssetPublicId(record.publicId),

        assetPublicId: new JourneyAssetPublicIdReference(record.assetPublicId),

        type: new JourneyAssetTypeValueObject(toJourneyAssetType(record.type)),

        sortOrder: new JourneyAssetSortOrder(record.sortOrder),

        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),
    );
  }

  private static assetToPersistence(
    entity: JourneyAssetEntity,
    journeyId: string,
  ) {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      journeyId,

      assetPublicId: entity.assetPublicId.value,

      type: entity.type.value,

      sortOrder: entity.sortOrder.value,

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Component Mapping
  // ===========================================================================

  public static toDomainComponent(
    record:
      | PrismaJourneyCorridor
      | PrismaJourneySchedule
      | PrismaJourneyVehicle
      | PrismaJourneyCapacity
      | PrismaJourneyPricing
      | PrismaJourneyPreferences
      | PrismaJourneyAsset
      | PrismaJourneyWaypoint,
  ):
    | JourneyCorridorEntity
    | JourneyScheduleEntity
    | JourneyVehicleEntity
    | JourneyCapacityEntity
    | JourneyPricingEntity
    | JourneyPreferencesEntity
    | JourneyAssetEntity
    | JourneyWaypointEntity {
    // -------------------------------------------------------------------------
    // Corridor
    // -------------------------------------------------------------------------

    if ('originName' in record) {
      return this.corridorToDomain(record);
    }

    // -------------------------------------------------------------------------
    // Schedule
    // -------------------------------------------------------------------------

    if ('departureAt' in record) {
      return this.scheduleToDomain(record);
    }

    // -------------------------------------------------------------------------
    // Vehicle
    // -------------------------------------------------------------------------

    if ('make' in record && 'model' in record) {
      return this.vehicleToDomain(record);
    }

    // -------------------------------------------------------------------------
    // Capacity
    // -------------------------------------------------------------------------

    if ('totalSeats' in record) {
      return this.capacityToDomain(record);
    }

    // -------------------------------------------------------------------------
    // Pricing
    // -------------------------------------------------------------------------

    if ('amount' in record && 'currency' in record) {
      return this.pricingToDomain(record);
    }

    // -------------------------------------------------------------------------
    // Preferences
    // -------------------------------------------------------------------------

    if ('smoking' in record && 'pets' in record && 'luggage' in record) {
      return this.preferencesToDomain(record);
    }

    // -------------------------------------------------------------------------
    // Asset
    // -------------------------------------------------------------------------

    if ('assetPublicId' in record && 'sortOrder' in record) {
      return this.assetToDomain(record);
    }

    // -------------------------------------------------------------------------
    // Waypoint
    // -------------------------------------------------------------------------

    return this.waypointToDomain(record);
  }
}
