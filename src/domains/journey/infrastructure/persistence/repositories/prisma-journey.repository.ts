// src/domains/journey/infrastructure/persistence/repositories/prisma-journey.repository.ts

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';
import type { Prisma, $Enums } from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PrismaService } from '../../../../../infrastructure/database/prisma/prisma.service';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { JourneyAggregate } from '../../../domain/aggregates/journey.aggregate';

// -----------------------------------------------------------------------------
// Entities
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
// Repository
// -----------------------------------------------------------------------------

import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type {
  JourneyAssetId,
  JourneyAssetPublicId,
  JourneyAssetPublicIdReference,
  JourneyCapacityId,
  JourneyCapacityPublicId,
  JourneyCorridorId,
  JourneyCorridorPublicId,
  JourneyId,
  JourneyPreferencesId,
  JourneyPreferencesPublicId,
  JourneyPricingId,
  JourneyPricingPublicId,
  JourneyProviderPublicId,
  JourneyPublicId,
  JourneyScheduleId,
  JourneySchedulePublicId,
  JourneyStatusValueObject,
  JourneyVehicleId,
  JourneyVehiclePublicId,
  JourneyWaypointId,
  JourneyWaypointPublicId,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import {
  JourneyPrismaMapper,
  type JourneyWithComponents,
} from '../mappers/journey-prisma.mapper';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

@Injectable()
export class PrismaJourneyRepository implements JourneyRepository {
  public constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Prisma Enum Boundary
  // ===========================================================================

  private toPrismaJourneyStatus(value: string): $Enums.JourneyStatus {
    return value as $Enums.JourneyStatus;
  }

  private toPrismaJourneyWaypointType(
    value: string,
  ): $Enums.JourneyWaypointType {
    return value as $Enums.JourneyWaypointType;
  }

  private toPrismaJourneySmokingPolicy(
    value: string,
  ): $Enums.JourneySmokingPolicy {
    return value as $Enums.JourneySmokingPolicy;
  }

  private toPrismaJourneyPetsPolicy(value: string): $Enums.JourneyPetsPolicy {
    return value as $Enums.JourneyPetsPolicy;
  }

  private toPrismaJourneyLuggagePolicy(
    value: string,
  ): $Enums.JourneyLuggagePolicy {
    return value as $Enums.JourneyLuggagePolicy;
  }

  private toPrismaJourneyConversationPreference(
    value: string,
  ): $Enums.JourneyConversationPreference {
    return value as $Enums.JourneyConversationPreference;
  }

  private toPrismaJourneyMusicPreference(
    value: string,
  ): $Enums.JourneyMusicPreference {
    return value as $Enums.JourneyMusicPreference;
  }

  private toPrismaJourneyAssetType(value: string): $Enums.JourneyAssetType {
    return value as $Enums.JourneyAssetType;
  }

  // ===========================================================================
  // Include Graph
  // ===========================================================================

  private readonly include = {
    corridor: {
      include: {
        waypoints: {
          orderBy: {
            sequence: 'asc' as const,
          },
        },
      },
    },

    schedule: true,

    vehicle: true,

    capacity: true,

    pricing: true,

    preferences: true,

    assets: {
      orderBy: {
        sortOrder: 'asc' as const,
      },
    },
  } satisfies Prisma.JourneyInclude;

  // ===========================================================================
  // Aggregate Persistence
  // ===========================================================================

  public async save(aggregate: JourneyAggregate): Promise<void> {
    const persistence = JourneyPrismaMapper.toPersistence(aggregate);

    await this.prisma.$transaction(async (tx) => {
      const journeyId = persistence.journey.id;

      // -----------------------------------------------------------------------
      // Journey
      // -----------------------------------------------------------------------

      await tx.journey.upsert({
        where: {
          id: journeyId,
        },

        create: {
          id: persistence.journey.id,
          publicId: persistence.journey.publicId,
          providerPublicId: persistence.journey.providerPublicId,

          status: this.toPrismaJourneyStatus(persistence.journey.status),

          publishedAt: persistence.journey.publishedAt,
          startedAt: persistence.journey.startedAt,
          completionRequestedAt: persistence.journey.completionRequestedAt,
          completedAt: persistence.journey.completedAt,
          cancelledAt: persistence.journey.cancelledAt,
          expiredAt: persistence.journey.expiredAt,

          version: persistence.journey.version,

          createdAt: persistence.journey.createdAt,
          updatedAt: persistence.journey.updatedAt,

          vehicleId: persistence.journey.vehicleId,
        },

        update: {
          publicId: persistence.journey.publicId,
          providerPublicId: persistence.journey.providerPublicId,

          status: this.toPrismaJourneyStatus(persistence.journey.status),

          publishedAt: persistence.journey.publishedAt,
          startedAt: persistence.journey.startedAt,
          completionRequestedAt: persistence.journey.completionRequestedAt,
          completedAt: persistence.journey.completedAt,
          cancelledAt: persistence.journey.cancelledAt,
          expiredAt: persistence.journey.expiredAt,

          version: persistence.journey.version,
          updatedAt: persistence.journey.updatedAt,

          vehicleId: persistence.journey.vehicleId,
        },
      });

      // -----------------------------------------------------------------------
      // Corridor
      // -----------------------------------------------------------------------

      if (persistence.corridor !== undefined) {
        const corridor = persistence.corridor;

        await tx.journeyCorridor.upsert({
          where: {
            id: corridor.id,
          },

          create: {
            id: corridor.id,
            publicId: corridor.publicId,

            journeyId: corridor.journeyId,

            originName: corridor.originName,
            destinationName: corridor.destinationName,

            originLatitude: corridor.originLatitude,
            originLongitude: corridor.originLongitude,

            destinationLatitude: corridor.destinationLatitude,
            destinationLongitude: corridor.destinationLongitude,

            corridorKey: corridor.corridorKey,

            createdAt: corridor.createdAt,
            updatedAt: corridor.updatedAt,
          },

          update: {
            publicId: corridor.publicId,

            originName: corridor.originName,
            destinationName: corridor.destinationName,

            originLatitude: corridor.originLatitude,
            originLongitude: corridor.originLongitude,

            destinationLatitude: corridor.destinationLatitude,
            destinationLongitude: corridor.destinationLongitude,

            corridorKey: corridor.corridorKey,

            updatedAt: corridor.updatedAt,
          },
        });

        // ---------------------------------------------------------------------
        // Replace waypoint set
        // ---------------------------------------------------------------------

        await tx.journeyWaypoint.deleteMany({
          where: {
            corridorId: corridor.id,
          },
        });

        const waypoints = aggregate.waypoints;

        if (waypoints.length > 0) {
          await tx.journeyWaypoint.createMany({
            data: waypoints.map((waypoint) => ({
              id: waypoint.id.toString(),
              publicId: waypoint.publicId.value,

              corridorId: corridor.id,

              type: this.toPrismaJourneyWaypointType(waypoint.type.value),

              sequence: waypoint.sequence.value,

              name: waypoint.name.value,

              latitude: waypoint.latitude.value,
              longitude: waypoint.longitude.value,

              pickupAllowed: waypoint.pickupAllowed,
              dropoffAllowed: waypoint.dropoffAllowed,

              createdAt: waypoint.createdAt,
              updatedAt: waypoint.updatedAt,
            })),
          });
        }
      } else {
        await tx.journeyCorridor.deleteMany({
          where: {
            journeyId,
          },
        });
      }

      // -----------------------------------------------------------------------
      // Schedule
      // -----------------------------------------------------------------------

      if (persistence.schedule !== undefined) {
        await tx.journeySchedule.upsert({
          where: {
            id: persistence.schedule.id,
          },

          create: persistence.schedule,

          update: {
            publicId: persistence.schedule.publicId,

            departureAt: persistence.schedule.departureAt,
            arrivalAt: persistence.schedule.arrivalAt,

            timezone: persistence.schedule.timezone,

            updatedAt: persistence.schedule.updatedAt,
          },
        });
      } else {
        await tx.journeySchedule.deleteMany({
          where: {
            journeyId,
          },
        });
      }

      // -----------------------------------------------------------------------
      // Vehicle
      // -----------------------------------------------------------------------

      if (persistence.vehicle !== undefined) {
        await tx.journeyVehicle.upsert({
          where: {
            id: persistence.vehicle.id,
          },

          create: persistence.vehicle,

          update: {
            publicId: persistence.vehicle.publicId,

            make: persistence.vehicle.make,
            model: persistence.vehicle.model,

            year: persistence.vehicle.year,
            color: persistence.vehicle.color,
            registration: persistence.vehicle.registration,

            assetPublicId: persistence.vehicle.assetPublicId,

            updatedAt: persistence.vehicle.updatedAt,
          },
        });
      } else {
        await tx.journey.update({
          where: {
            id: journeyId,
          },

          data: {
            vehicleId: null,
          },
        });
      }

      // -----------------------------------------------------------------------
      // Capacity
      // -----------------------------------------------------------------------

      if (persistence.capacity !== undefined) {
        await tx.journeyCapacity.upsert({
          where: {
            id: persistence.capacity.id,
          },

          create: persistence.capacity,

          update: {
            publicId: persistence.capacity.publicId,

            totalSeats: persistence.capacity.totalSeats,
            bookedSeats: persistence.capacity.bookedSeats,

            updatedAt: persistence.capacity.updatedAt,
          },
        });
      } else {
        await tx.journeyCapacity.deleteMany({
          where: {
            journeyId,
          },
        });
      }

      // -----------------------------------------------------------------------
      // Pricing
      // -----------------------------------------------------------------------

      if (persistence.pricing !== undefined) {
        await tx.journeyPricing.upsert({
          where: {
            id: persistence.pricing.id,
          },

          create: persistence.pricing,

          update: {
            publicId: persistence.pricing.publicId,

            amount: persistence.pricing.amount,
            currency: persistence.pricing.currency,

            updatedAt: persistence.pricing.updatedAt,
          },
        });
      } else {
        await tx.journeyPricing.deleteMany({
          where: {
            journeyId,
          },
        });
      }

      // -----------------------------------------------------------------------
      // Preferences
      // -----------------------------------------------------------------------

      if (persistence.preferences !== undefined) {
        await tx.journeyPreferences.upsert({
          where: {
            id: persistence.preferences.id,
          },

          create: {
            ...persistence.preferences,

            smoking: this.toPrismaJourneySmokingPolicy(
              persistence.preferences.smoking,
            ),

            pets: this.toPrismaJourneyPetsPolicy(persistence.preferences.pets),

            luggage: this.toPrismaJourneyLuggagePolicy(
              persistence.preferences.luggage,
            ),

            conversation: this.toPrismaJourneyConversationPreference(
              persistence.preferences.conversation,
            ),

            music: this.toPrismaJourneyMusicPreference(
              persistence.preferences.music,
            ),
          },

          update: {
            publicId: persistence.preferences.publicId,

            smoking: this.toPrismaJourneySmokingPolicy(
              persistence.preferences.smoking,
            ),

            pets: this.toPrismaJourneyPetsPolicy(persistence.preferences.pets),

            luggage: this.toPrismaJourneyLuggagePolicy(
              persistence.preferences.luggage,
            ),

            conversation: this.toPrismaJourneyConversationPreference(
              persistence.preferences.conversation,
            ),

            music: this.toPrismaJourneyMusicPreference(
              persistence.preferences.music,
            ),

            updatedAt: persistence.preferences.updatedAt,
          },
        });
      } else {
        await tx.journeyPreferences.deleteMany({
          where: {
            journeyId,
          },
        });
      }

      // -----------------------------------------------------------------------
      // Assets
      // -----------------------------------------------------------------------

      await tx.journeyAsset.deleteMany({
        where: {
          journeyId,
        },
      });

      if (persistence.assets.length > 0) {
        await tx.journeyAsset.createMany({
          data: persistence.assets.map((asset) => ({
            id: asset.id,
            publicId: asset.publicId,
            journeyId: asset.journeyId,
            assetPublicId: asset.assetPublicId,

            type: this.toPrismaJourneyAssetType(asset.type),

            sortOrder: asset.sortOrder,

            createdAt: asset.createdAt,
            updatedAt: asset.updatedAt,
          })),
        });
      }
    });
  }

  // ===========================================================================
  // Aggregate Lookup
  // ===========================================================================

  public async findById(id: JourneyId): Promise<JourneyAggregate | null> {
    const record = await this.prisma.journey.findUnique({
      where: {
        id: id.value,
      },
      include: this.include,
    });

    return record === null ? null : this.toAggregate(record);
  }

  public async findByPublicId(
    publicId: JourneyPublicId,
  ): Promise<JourneyAggregate | null> {
    const record = await this.prisma.journey.findUnique({
      where: {
        publicId: publicId.value,
      },
      include: this.include,
    });

    return record === null ? null : this.toAggregate(record);
  }

  public async findByProviderPublicId(
    providerPublicId: JourneyProviderPublicId,
  ): Promise<JourneyAggregate[]> {
    const records = await this.prisma.journey.findMany({
      where: {
        providerPublicId: providerPublicId.value,
      },
      include: this.include,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Delete / Exists
  // ===========================================================================

  public async delete(id: JourneyId): Promise<void> {
    await this.prisma.journey.delete({
      where: {
        id: id.value,
      },
    });
  }

  public async exists(id: JourneyId): Promise<boolean> {
    const count = await this.prisma.journey.count({
      where: {
        id: id.value,
      },
    });

    return count > 0;
  }

  public async existsByPublicId(publicId: JourneyPublicId): Promise<boolean> {
    const count = await this.prisma.journey.count({
      where: {
        publicId: publicId.value,
      },
    });

    return count > 0;
  }

  public async existsByProviderPublicId(
    providerPublicId: JourneyProviderPublicId,
  ): Promise<boolean> {
    const count = await this.prisma.journey.count({
      where: {
        providerPublicId: providerPublicId.value,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Journey Entity Queries
  // ===========================================================================

  public async findJourneyById(id: JourneyId): Promise<JourneyEntity | null> {
    const record = await this.prisma.journey.findUnique({
      where: {
        id: id.value,
      },
    });

    return record === null ? null : JourneyPrismaMapper.toDomain(record);
  }

  public async findJourneyByPublicId(
    publicId: JourneyPublicId,
  ): Promise<JourneyEntity | null> {
    const record = await this.prisma.journey.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    return record === null ? null : JourneyPrismaMapper.toDomain(record);
  }

  public async findJourneysByProviderPublicId(
    providerPublicId: JourneyProviderPublicId,
  ): Promise<JourneyEntity[]> {
    const records = await this.prisma.journey.findMany({
      where: {
        providerPublicId: providerPublicId.value,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => JourneyPrismaMapper.toDomain(record));
  }

  /**
   * Alias required by the JourneyRepository contract.
   */
  public async findJourneysByProvider(
    providerPublicId: JourneyProviderPublicId,
  ): Promise<JourneyEntity[]> {
    return this.findJourneysByProviderPublicId(providerPublicId);
  }

  public async findJourneysByStatus(
    status: JourneyStatusValueObject,
  ): Promise<JourneyEntity[]> {
    const records = await this.prisma.journey.findMany({
      where: {
        status: this.toPrismaJourneyStatus(status.value),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => JourneyPrismaMapper.toDomain(record));
  }

  public async findJourneysByProviderAndStatus(
    providerPublicId: JourneyProviderPublicId,
    status: JourneyStatusValueObject,
  ): Promise<JourneyEntity[]> {
    const records = await this.prisma.journey.findMany({
      where: {
        providerPublicId: providerPublicId.value,
        status: this.toPrismaJourneyStatus(status.value),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => JourneyPrismaMapper.toDomain(record));
  }

  // ===========================================================================
  // Corridor
  // ===========================================================================

  public async findCorridor(
    journeyId: JourneyId,
  ): Promise<JourneyCorridorEntity | null> {
    const record = await this.prisma.journeyCorridor.findUnique({
      where: {
        journeyId: journeyId.value,
      },
      include: {
        waypoints: {
          orderBy: {
            sequence: 'asc',
          },
        },
      },
    });

    return record === null
      ? null
      : (JourneyPrismaMapper.toDomainComponent(
          record,
        ) as JourneyCorridorEntity);
  }

  public async findCorridorById(
    journeyId: JourneyId,
    corridorId: JourneyCorridorId,
  ): Promise<JourneyCorridorEntity | null> {
    const record = await this.prisma.journeyCorridor.findFirst({
      where: {
        id: corridorId.value,
        journeyId: journeyId.value,
      },
      include: {
        waypoints: {
          orderBy: {
            sequence: 'asc',
          },
        },
      },
    });

    return record === null
      ? null
      : (JourneyPrismaMapper.toDomainComponent(
          record,
        ) as JourneyCorridorEntity);
  }

  public async findCorridorByPublicId(
    journeyId: JourneyId,
    corridorPublicId: JourneyCorridorPublicId,
  ): Promise<JourneyCorridorEntity | null> {
    const record = await this.prisma.journeyCorridor.findFirst({
      where: {
        publicId: corridorPublicId.value,
        journeyId: journeyId.value,
      },
      include: {
        waypoints: {
          orderBy: {
            sequence: 'asc',
          },
        },
      },
    });

    return record === null
      ? null
      : (JourneyPrismaMapper.toDomainComponent(
          record,
        ) as JourneyCorridorEntity);
  }

  public async existsCorridor(journeyId: JourneyId): Promise<boolean> {
    const count = await this.prisma.journeyCorridor.count({
      where: {
        journeyId: journeyId.value,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Waypoints
  // ===========================================================================

  public async findWaypointById(
    journeyId: JourneyId,
    waypointId: JourneyWaypointId,
  ): Promise<JourneyWaypointEntity | null> {
    const record = await this.prisma.journeyWaypoint.findFirst({
      where: {
        id: waypointId.value,
        corridor: {
          journeyId: journeyId.value,
        },
      },
    });

    return record === null
      ? null
      : (JourneyPrismaMapper.toDomainComponent(
          record,
        ) as JourneyWaypointEntity);
  }

  public async findWaypointByPublicId(
    journeyId: JourneyId,
    waypointPublicId: JourneyWaypointPublicId,
  ): Promise<JourneyWaypointEntity | null> {
    const record = await this.prisma.journeyWaypoint.findFirst({
      where: {
        publicId: waypointPublicId.value,
        corridor: {
          journeyId: journeyId.value,
        },
      },
    });

    return record === null
      ? null
      : (JourneyPrismaMapper.toDomainComponent(
          record,
        ) as JourneyWaypointEntity);
  }

  public async findWaypoints(
    journeyId: JourneyId,
  ): Promise<JourneyWaypointEntity[]> {
    const records = await this.prisma.journeyWaypoint.findMany({
      where: {
        corridor: {
          journeyId: journeyId.value,
        },
      },
      orderBy: {
        sequence: 'asc',
      },
    });

    return records.map(
      (record) =>
        JourneyPrismaMapper.toDomainComponent(record) as JourneyWaypointEntity,
    );
  }

  public async existsWaypoint(
    journeyId: JourneyId,
    waypointId: JourneyWaypointId,
  ): Promise<boolean> {
    const count = await this.prisma.journeyWaypoint.count({
      where: {
        id: waypointId.value,
        corridor: {
          journeyId: journeyId.value,
        },
      },
    });

    return count > 0;
  }

  public async existsWaypointByPublicId(
    journeyId: JourneyId,
    waypointPublicId: JourneyWaypointPublicId,
  ): Promise<boolean> {
    const count = await this.prisma.journeyWaypoint.count({
      where: {
        publicId: waypointPublicId.value,
        corridor: {
          journeyId: journeyId.value,
        },
      },
    });

    return count > 0;
  }

  public async existsWaypoints(journeyId: JourneyId): Promise<boolean> {
    const count = await this.prisma.journeyWaypoint.count({
      where: {
        corridor: {
          journeyId: journeyId.value,
        },
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Schedule
  // ===========================================================================

  public async findSchedule(
    journeyId: JourneyId,
  ): Promise<JourneyScheduleEntity | null> {
    const record = await this.prisma.journeySchedule.findUnique({
      where: {
        journeyId: journeyId.value,
      },
    });

    return record === null
      ? null
      : (JourneyPrismaMapper.toDomainComponent(
          record,
        ) as JourneyScheduleEntity);
  }

  public async findScheduleById(
    journeyId: JourneyId,
    scheduleId: JourneyScheduleId,
  ): Promise<JourneyScheduleEntity | null> {
    const record = await this.prisma.journeySchedule.findFirst({
      where: {
        id: scheduleId.value,
        journeyId: journeyId.value,
      },
    });

    return record === null
      ? null
      : (JourneyPrismaMapper.toDomainComponent(
          record,
        ) as JourneyScheduleEntity);
  }

  public async findScheduleByPublicId(
    journeyId: JourneyId,
    schedulePublicId: JourneySchedulePublicId,
  ): Promise<JourneyScheduleEntity | null> {
    const record = await this.prisma.journeySchedule.findFirst({
      where: {
        publicId: schedulePublicId.value,
        journeyId: journeyId.value,
      },
    });

    return record === null
      ? null
      : (JourneyPrismaMapper.toDomainComponent(
          record,
        ) as JourneyScheduleEntity);
  }

  public async existsSchedule(journeyId: JourneyId): Promise<boolean> {
    const count = await this.prisma.journeySchedule.count({
      where: {
        journeyId: journeyId.value,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Vehicle
  // ===========================================================================

  public async findVehicle(
    journeyId: JourneyId,
  ): Promise<JourneyVehicleEntity | null> {
    const journey = await this.prisma.journey.findUnique({
      where: {
        id: journeyId.value,
      },
      include: {
        vehicle: true,
      },
    });

    if (journey?.vehicle === null || journey?.vehicle === undefined) {
      return null;
    }

    return JourneyPrismaMapper.toDomainComponent(
      journey.vehicle,
    ) as JourneyVehicleEntity;
  }

  public async findVehicleById(
    journeyId: JourneyId,
    vehicleId: JourneyVehicleId,
  ): Promise<JourneyVehicleEntity | null> {
    const vehicle = await this.prisma.journeyVehicle.findFirst({
      where: {
        id: vehicleId.value,
        journeys: {
          some: {
            id: journeyId.value,
          },
        },
      },
    });

    return vehicle === null
      ? null
      : (JourneyPrismaMapper.toDomainComponent(
          vehicle,
        ) as JourneyVehicleEntity);
  }

  public async findVehicleByPublicId(
    journeyId: JourneyId,
    vehiclePublicId: JourneyVehiclePublicId,
  ): Promise<JourneyVehicleEntity | null> {
    const vehicle = await this.prisma.journeyVehicle.findFirst({
      where: {
        publicId: vehiclePublicId.value,
        journeys: {
          some: {
            id: journeyId.value,
          },
        },
      },
    });

    return vehicle === null
      ? null
      : (JourneyPrismaMapper.toDomainComponent(
          vehicle,
        ) as JourneyVehicleEntity);
  }

  public async existsVehicle(journeyId: JourneyId): Promise<boolean> {
    const journey = await this.prisma.journey.findFirst({
      where: {
        id: journeyId.value,
        vehicleId: {
          not: null,
        },
      },
      select: {
        id: true,
      },
    });

    return journey !== null;
  }

  // ===========================================================================
  // Capacity
  // ===========================================================================

  public async findCapacity(
    journeyId: JourneyId,
  ): Promise<JourneyCapacityEntity | null> {
    const record = await this.prisma.journeyCapacity.findUnique({
      where: {
        journeyId: journeyId.value,
      },
    });

    return record === null
      ? null
      : (JourneyPrismaMapper.toDomainComponent(
          record,
        ) as JourneyCapacityEntity);
  }

  public async findCapacityById(
    journeyId: JourneyId,
    capacityId: JourneyCapacityId,
  ): Promise<JourneyCapacityEntity | null> {
    const record = await this.prisma.journeyCapacity.findFirst({
      where: {
        id: capacityId.value,
        journeyId: journeyId.value,
      },
    });

    return record === null
      ? null
      : (JourneyPrismaMapper.toDomainComponent(
          record,
        ) as JourneyCapacityEntity);
  }

  public async findCapacityByPublicId(
    journeyId: JourneyId,
    capacityPublicId: JourneyCapacityPublicId,
  ): Promise<JourneyCapacityEntity | null> {
    const record = await this.prisma.journeyCapacity.findFirst({
      where: {
        publicId: capacityPublicId.value,
        journeyId: journeyId.value,
      },
    });

    return record === null
      ? null
      : (JourneyPrismaMapper.toDomainComponent(
          record,
        ) as JourneyCapacityEntity);
  }

  public async existsCapacity(journeyId: JourneyId): Promise<boolean> {
    const count = await this.prisma.journeyCapacity.count({
      where: {
        journeyId: journeyId.value,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Pricing
  // ===========================================================================

  public async findPricing(
    journeyId: JourneyId,
  ): Promise<JourneyPricingEntity | null> {
    const record = await this.prisma.journeyPricing.findUnique({
      where: {
        journeyId: journeyId.value,
      },
    });

    return record === null
      ? null
      : (JourneyPrismaMapper.toDomainComponent(record) as JourneyPricingEntity);
  }

  public async findPricingById(
    journeyId: JourneyId,
    pricingId: JourneyPricingId,
  ): Promise<JourneyPricingEntity | null> {
    const record = await this.prisma.journeyPricing.findFirst({
      where: {
        id: pricingId.value,
        journeyId: journeyId.value,
      },
    });

    return record === null
      ? null
      : (JourneyPrismaMapper.toDomainComponent(record) as JourneyPricingEntity);
  }

  public async findPricingByPublicId(
    journeyId: JourneyId,
    pricingPublicId: JourneyPricingPublicId,
  ): Promise<JourneyPricingEntity | null> {
    const record = await this.prisma.journeyPricing.findFirst({
      where: {
        publicId: pricingPublicId.value,
        journeyId: journeyId.value,
      },
    });

    return record === null
      ? null
      : (JourneyPrismaMapper.toDomainComponent(record) as JourneyPricingEntity);
  }

  public async existsPricing(journeyId: JourneyId): Promise<boolean> {
    const count = await this.prisma.journeyPricing.count({
      where: {
        journeyId: journeyId.value,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Preferences
  // ===========================================================================

  public async findPreferences(
    journeyId: JourneyId,
  ): Promise<JourneyPreferencesEntity | null> {
    const record = await this.prisma.journeyPreferences.findUnique({
      where: {
        journeyId: journeyId.value,
      },
    });

    return record === null
      ? null
      : (JourneyPrismaMapper.toDomainComponent(
          record,
        ) as JourneyPreferencesEntity);
  }

  public async findPreferencesById(
    journeyId: JourneyId,
    preferencesId: JourneyPreferencesId,
  ): Promise<JourneyPreferencesEntity | null> {
    const record = await this.prisma.journeyPreferences.findFirst({
      where: {
        id: preferencesId.value,
        journeyId: journeyId.value,
      },
    });

    return record === null
      ? null
      : (JourneyPrismaMapper.toDomainComponent(
          record,
        ) as JourneyPreferencesEntity);
  }

  public async findPreferencesByPublicId(
    journeyId: JourneyId,
    preferencesPublicId: JourneyPreferencesPublicId,
  ): Promise<JourneyPreferencesEntity | null> {
    const record = await this.prisma.journeyPreferences.findFirst({
      where: {
        publicId: preferencesPublicId.value,
        journeyId: journeyId.value,
      },
    });

    return record === null
      ? null
      : (JourneyPrismaMapper.toDomainComponent(
          record,
        ) as JourneyPreferencesEntity);
  }

  public async existsPreferences(journeyId: JourneyId): Promise<boolean> {
    const count = await this.prisma.journeyPreferences.count({
      where: {
        journeyId: journeyId.value,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Assets
  // ===========================================================================

  public async findAssetById(
    journeyId: JourneyId,
    assetId: JourneyAssetId,
  ): Promise<JourneyAssetEntity | null> {
    const record = await this.prisma.journeyAsset.findFirst({
      where: {
        id: assetId.value,
        journeyId: journeyId.value,
      },
    });

    return record === null
      ? null
      : (JourneyPrismaMapper.toDomainComponent(record) as JourneyAssetEntity);
  }

  public async findAssetByPublicId(
    journeyId: JourneyId,
    assetPublicId: JourneyAssetPublicId,
  ): Promise<JourneyAssetEntity | null> {
    const record = await this.prisma.journeyAsset.findFirst({
      where: {
        publicId: assetPublicId.value,
        journeyId: journeyId.value,
      },
    });

    return record === null
      ? null
      : (JourneyPrismaMapper.toDomainComponent(record) as JourneyAssetEntity);
  }

  public async findAssetByReference(
    journeyId: JourneyId,
    assetPublicId: JourneyAssetPublicIdReference,
  ): Promise<JourneyAssetEntity | null> {
    const record = await this.prisma.journeyAsset.findFirst({
      where: {
        journeyId: journeyId.value,
        assetPublicId: assetPublicId.value,
      },
    });

    return record === null
      ? null
      : (JourneyPrismaMapper.toDomainComponent(record) as JourneyAssetEntity);
  }

  public async findAssets(journeyId: JourneyId): Promise<JourneyAssetEntity[]> {
    const records = await this.prisma.journeyAsset.findMany({
      where: {
        journeyId: journeyId.value,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });

    return records.map(
      (record) =>
        JourneyPrismaMapper.toDomainComponent(record) as JourneyAssetEntity,
    );
  }

  public async existsAsset(
    journeyId: JourneyId,
    assetId: JourneyAssetId,
  ): Promise<boolean> {
    const count = await this.prisma.journeyAsset.count({
      where: {
        id: assetId.value,
        journeyId: journeyId.value,
      },
    });

    return count > 0;
  }

  public async existsAssetByPublicId(
    journeyId: JourneyId,
    assetPublicId: JourneyAssetPublicId,
  ): Promise<boolean> {
    const count = await this.prisma.journeyAsset.count({
      where: {
        publicId: assetPublicId.value,
        journeyId: journeyId.value,
      },
    });

    return count > 0;
  }

  public async existsAssetByReference(
    journeyId: JourneyId,
    assetPublicId: JourneyAssetPublicIdReference,
  ): Promise<boolean> {
    const count = await this.prisma.journeyAsset.count({
      where: {
        journeyId: journeyId.value,
        assetPublicId: assetPublicId.value,
      },
    });

    return count > 0;
  }

  public async existsAssets(journeyId: JourneyId): Promise<boolean> {
    const count = await this.prisma.journeyAsset.count({
      where: {
        journeyId: journeyId.value,
      },
    });

    return count > 0;
  }
  public async findPublishedJourneysByRouteAndDate(
    origin: string,
    destination: string,
    departureFrom: Date,
    departureTo: Date,
  ): Promise<JourneyEntity[]> {
    const records = await this.prisma.journey.findMany({
      where: {
        status: this.toPrismaJourneyStatus('PUBLISHED'),

        corridor: {
          is: {
            originName: {
              equals: origin,
              mode: 'insensitive',
            },

            destinationName: {
              equals: destination,
              mode: 'insensitive',
            },
          },
        },

        schedule: {
          is: {
            departureAt: {
              gte: departureFrom,
              lt: departureTo,
            },
          },
        },
      },

      orderBy: {
        schedule: {
          departureAt: 'asc',
        },
      },
    });

    return records.map((record) => JourneyPrismaMapper.toDomain(record));
  }
  // ===========================================================================
  // Aggregate Reconstruction
  // ===========================================================================

  private toAggregate(record: JourneyWithComponents): JourneyAggregate {
    const journey = JourneyPrismaMapper.toDomain(record);

    return JourneyAggregate.create(journey);
  }
}
