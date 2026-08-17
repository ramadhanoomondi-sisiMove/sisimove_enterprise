// src/domains/journey-demand/infrastructure/persistence/repositories/prisma-journey-demand.repository.ts

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { Prisma, $Enums } from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { PrismaService } from '../../../../../infrastructure/database/prisma/prisma.service';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { JourneyDemandAggregate } from '../../../domain/aggregates/journey-demand.aggregate';

// -----------------------------------------------------------------------------
// Entities
// -----------------------------------------------------------------------------

import type { JourneyDemandEntity } from '../../../domain/entities/journey-demand.entity';
import type { JourneyDemandCorridorEntity } from '../../../domain/entities/journey-demand-corridor.entity';
import type { JourneyDemandWaypointEntity } from '../../../domain/entities/journey-demand-waypoint.entity';
import type { JourneyDemandScheduleEntity } from '../../../domain/entities/journey-demand-schedule.entity';
import type { JourneyDemandCapacityEntity } from '../../../domain/entities/journey-demand-capacity.entity';
import type { JourneyDemandPricingEntity } from '../../../domain/entities/journey-demand-pricing.entity';
import type { JourneyDemandParticipantEntity } from '../../../domain/entities/journey-demand-participant.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyDemandRepository } from '../../../domain/repositories/journey-demand.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type {
  JourneyDemandCapacityId,
  JourneyDemandCapacityPublicId,
  JourneyDemandCorridorId,
  JourneyDemandCorridorPublicId,
  JourneyDemandId,
  JourneyDemandParticipantId,
  JourneyDemandParticipantPublicId,
  JourneyDemandParticipantStatusValueObject,
  JourneyDemandPricingId,
  JourneyDemandPricingPublicId,
  JourneyDemandPublicId,
  JourneyDemandScheduleId,
  JourneyDemandSchedulePublicId,
  JourneyDemandStatusValueObject,
  JourneyDemandWaypointId,
  JourneyDemandWaypointPublicId,
  MatchedJourneyPublicId,
  MemberPublicId,
  RequesterPublicId,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import {
  JourneyDemandPrismaMapper,
  type JourneyDemandWithComponents,
} from '../../persistence/prisma/mappers/journey-demand-prisma.mapper';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

export class PrismaJourneyDemandRepository implements JourneyDemandRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Prisma Enum Boundary
  // ===========================================================================

  /**
   * Converts the domain status into the Prisma generated enum.
   *
   * The domain owns the lifecycle semantics. Prisma only represents the
   * persisted representation.
   */
  private toPrismaJourneyDemandStatus(
    value: string,
  ): $Enums.JourneyDemandStatus {
    return value as $Enums.JourneyDemandStatus;
  }

  /**
   * Converts the domain waypoint type into the Prisma generated enum.
   */
  private toPrismaJourneyDemandWaypointType(
    value: string,
  ): $Enums.JourneyDemandWaypointType {
    return value as $Enums.JourneyDemandWaypointType;
  }

  /**
   * Converts the domain participant status into the Prisma generated enum.
   */
  private toPrismaJourneyDemandParticipantStatus(
    value: string,
  ): $Enums.JourneyDemandParticipantStatus {
    return value as $Enums.JourneyDemandParticipantStatus;
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

    capacity: true,

    pricing: true,

    participants: {
      orderBy: {
        createdAt: 'asc' as const,
      },
    },
  } satisfies Prisma.JourneyDemandInclude;

  // ===========================================================================
  // Aggregate Persistence
  // ===========================================================================

  public async save(aggregate: JourneyDemandAggregate): Promise<void> {
    const persistence = JourneyDemandPrismaMapper.toPersistence(
      aggregate.journeyDemand,
    );
    await this.prisma.$transaction(async (tx) => {
      const journeyDemandId = persistence.journeyDemand.id;

      // -----------------------------------------------------------------------
      // Journey Demand
      // -----------------------------------------------------------------------

      await tx.journeyDemand.upsert({
        where: {
          id: journeyDemandId,
        },

        create: {
          id: persistence.journeyDemand.id,
          publicId: persistence.journeyDemand.publicId,
          requesterPublicId: persistence.journeyDemand.requesterPublicId,

          status: this.toPrismaJourneyDemandStatus(
            persistence.journeyDemand.status,
          ),

          matchedJourneyPublicId:
            persistence.journeyDemand.matchedJourneyPublicId,

          publishedAt: persistence.journeyDemand.publishedAt,
          matchedAt: persistence.journeyDemand.matchedAt,
          convertedAt: persistence.journeyDemand.convertedAt,
          fulfilledAt: persistence.journeyDemand.fulfilledAt,
          cancelledAt: persistence.journeyDemand.cancelledAt,
          expiredAt: persistence.journeyDemand.expiredAt,

          version: persistence.journeyDemand.version,

          createdAt: persistence.journeyDemand.createdAt,
          updatedAt: persistence.journeyDemand.updatedAt,
        },

        update: {
          publicId: persistence.journeyDemand.publicId,
          requesterPublicId: persistence.journeyDemand.requesterPublicId,

          status: this.toPrismaJourneyDemandStatus(
            persistence.journeyDemand.status,
          ),

          matchedJourneyPublicId:
            persistence.journeyDemand.matchedJourneyPublicId,

          publishedAt: persistence.journeyDemand.publishedAt,
          matchedAt: persistence.journeyDemand.matchedAt,
          convertedAt: persistence.journeyDemand.convertedAt,
          fulfilledAt: persistence.journeyDemand.fulfilledAt,
          cancelledAt: persistence.journeyDemand.cancelledAt,
          expiredAt: persistence.journeyDemand.expiredAt,

          version: persistence.journeyDemand.version,

          updatedAt: persistence.journeyDemand.updatedAt,
        },
      });

      // -----------------------------------------------------------------------
      // Corridor
      // -----------------------------------------------------------------------

      if (persistence.corridor !== undefined) {
        const corridor = persistence.corridor;

        await tx.journeyDemandCorridor.upsert({
          where: {
            id: corridor.id,
          },

          // ---------------------------------------------------------------------
          // Create
          // ---------------------------------------------------------------------

          create: {
            id: corridor.id,
            publicId: corridor.publicId,
            demandId: corridor.demandId,

            corridorKey: corridor.corridorKey,

            originName: corridor.originName,
            originLatitude: corridor.originLatitude,
            originLongitude: corridor.originLongitude,

            destinationName: corridor.destinationName,
            destinationLatitude: corridor.destinationLatitude,
            destinationLongitude: corridor.destinationLongitude,

            createdAt: corridor.createdAt,
            updatedAt: corridor.updatedAt,
          },

          // ---------------------------------------------------------------------
          // Update
          // ---------------------------------------------------------------------

          update: {
            publicId: corridor.publicId,
            demandId: corridor.demandId,

            corridorKey: corridor.corridorKey,

            originName: corridor.originName,
            originLatitude: corridor.originLatitude,
            originLongitude: corridor.originLongitude,

            destinationName: corridor.destinationName,
            destinationLatitude: corridor.destinationLatitude,
            destinationLongitude: corridor.destinationLongitude,

            updatedAt: corridor.updatedAt,
          },
        });

        // ---------------------------------------------------------------------
        // Replace Waypoint Set
        //
        // The aggregate owns the complete waypoint collection.
        // Replacing the persisted set keeps persistence aligned with the
        // aggregate state.
        // ---------------------------------------------------------------------

        await tx.journeyDemandWaypoint.deleteMany({
          where: {
            corridorId: corridor.id,
          },
        });

        if (corridor.waypoints.length > 0) {
          await tx.journeyDemandWaypoint.createMany({
            data: corridor.waypoints.map((waypoint) => ({
              // -----------------------------------------------------------------
              // Identity
              // -----------------------------------------------------------------

              id: waypoint.id,
              publicId: waypoint.publicId,

              // -----------------------------------------------------------------
              // Relationship
              // -----------------------------------------------------------------

              corridorId: corridor.id,

              // -----------------------------------------------------------------
              // Waypoint Type
              //
              // Pickup/dropoff semantics are derived from `type`.
              // -----------------------------------------------------------------

              type: this.toPrismaJourneyDemandWaypointType(waypoint.type),

              // -----------------------------------------------------------------
              // Sequence
              // -----------------------------------------------------------------

              sequence: waypoint.sequence,

              // -----------------------------------------------------------------
              // Location
              // -----------------------------------------------------------------

              name: waypoint.name,

              latitude: waypoint.latitude,
              longitude: waypoint.longitude,

              // -----------------------------------------------------------------
              // Audit
              // -----------------------------------------------------------------

              createdAt: waypoint.createdAt,
              updatedAt: waypoint.updatedAt,
            })),
          });
        }
      } else {
        // -----------------------------------------------------------------------
        // No Corridor
        //
        // Remove any previously persisted corridor belonging to this demand.
        // -----------------------------------------------------------------------

        await tx.journeyDemandCorridor.deleteMany({
          where: {
            demandId: journeyDemandId,
          },
        });
      }
      // -----------------------------------------------------------------------
      // Schedule
      // -----------------------------------------------------------------------

      if (persistence.schedule !== undefined) {
        const schedule = persistence.schedule;

        await tx.journeyDemandSchedule.upsert({
          where: {
            id: schedule.id,
          },

          create: {
            id: schedule.id,
            publicId: schedule.publicId,
            demandId: schedule.demandId,

            earliestDeparture: schedule.earliestDeparture,
            latestDeparture: schedule.latestDeparture,

            targetArrival: schedule.targetArrival,
            maximumArrival: schedule.maximumArrival,

            timezone: schedule.timezone,

            createdAt: schedule.createdAt,
            updatedAt: schedule.updatedAt,
          },

          update: {
            publicId: schedule.publicId,
            demandId: schedule.demandId,

            earliestDeparture: schedule.earliestDeparture,
            latestDeparture: schedule.latestDeparture,

            targetArrival: schedule.targetArrival,
            maximumArrival: schedule.maximumArrival,

            timezone: schedule.timezone,

            updatedAt: schedule.updatedAt,
          },
        });
      } else {
        await tx.journeyDemandSchedule.deleteMany({
          where: {
            demandId: journeyDemandId,
          },
        });
      }

      // -----------------------------------------------------------------------
      // Capacity
      // -----------------------------------------------------------------------

      if (persistence.capacity !== undefined) {
        const capacity = persistence.capacity;

        await tx.journeyDemandCapacity.upsert({
          where: {
            id: capacity.id,
          },

          create: {
            id: capacity.id,
            publicId: capacity.publicId,
            demandId: capacity.demandId,

            requestedSeats: capacity.requestedSeats,
            matchedSeats: capacity.matchedSeats,

            createdAt: capacity.createdAt,
            updatedAt: capacity.updatedAt,
          },

          update: {
            publicId: capacity.publicId,
            demandId: capacity.demandId,

            requestedSeats: capacity.requestedSeats,
            matchedSeats: capacity.matchedSeats,

            updatedAt: capacity.updatedAt,
          },
        });
      } else {
        await tx.journeyDemandCapacity.deleteMany({
          where: {
            demandId: journeyDemandId,
          },
        });
      }

      // -----------------------------------------------------------------------
      // Pricing
      // -----------------------------------------------------------------------

      if (persistence.pricing !== undefined) {
        const pricing = persistence.pricing;

        await tx.journeyDemandPricing.upsert({
          where: {
            id: pricing.id,
          },

          create: {
            id: pricing.id,
            publicId: pricing.publicId,
            demandId: pricing.demandId,

            maximumPricePerSeat: pricing.maximumPricePerSeat,
            preferredPricePerSeat: pricing.preferredPricePerSeat,

            currency: pricing.currency,

            createdAt: pricing.createdAt,
            updatedAt: pricing.updatedAt,
          },

          update: {
            publicId: pricing.publicId,
            demandId: pricing.demandId,

            maximumPricePerSeat: pricing.maximumPricePerSeat,
            preferredPricePerSeat: pricing.preferredPricePerSeat,

            currency: pricing.currency,

            updatedAt: pricing.updatedAt,
          },
        });
      } else {
        await tx.journeyDemandPricing.deleteMany({
          where: {
            demandId: journeyDemandId,
          },
        });
      }

      // -----------------------------------------------------------------------
      // Participants
      // -----------------------------------------------------------------------
      //
      // Participants are aggregate-owned. We persist the aggregate snapshot
      // rather than attempting independent participant lifecycle persistence.
      //

      await tx.journeyDemandParticipant.deleteMany({
        where: {
          demandId: journeyDemandId,
        },
      });

      if (persistence.participants.length > 0) {
        await tx.journeyDemandParticipant.createMany({
          data: persistence.participants.map((participant) => ({
            id: participant.id,
            publicId: participant.publicId,
            demandId: participant.demandId,

            memberPublicId: participant.memberPublicId,

            seats: participant.seats,

            status: this.toPrismaJourneyDemandParticipantStatus(
              participant.status,
            ),

            joinedAt: participant.joinedAt,
            withdrawnAt: participant.withdrawnAt,
            removedAt: participant.removedAt,

            createdAt: participant.createdAt,
            updatedAt: participant.updatedAt,
          })),
        });
      }
    });
  }

  // ===========================================================================
  // Aggregate Lookup
  // ===========================================================================

  public async findById(
    id: JourneyDemandId,
  ): Promise<JourneyDemandAggregate | null> {
    const record = await this.prisma.journeyDemand.findUnique({
      where: {
        id: id.value,
      },

      include: this.include,
    });

    return record === null ? null : this.toAggregate(record);
  }

  public async findByPublicId(
    publicId: JourneyDemandPublicId,
  ): Promise<JourneyDemandAggregate | null> {
    const record = await this.prisma.journeyDemand.findUnique({
      where: {
        publicId: publicId.value,
      },

      include: this.include,
    });

    return record === null ? null : this.toAggregate(record);
  }

  public async findByRequesterPublicId(
    requesterPublicId: RequesterPublicId,
  ): Promise<JourneyDemandAggregate[]> {
    const records = await this.prisma.journeyDemand.findMany({
      where: {
        requesterPublicId: requesterPublicId.value,
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  public async findByStatus(
    status: JourneyDemandStatusValueObject,
  ): Promise<JourneyDemandAggregate[]> {
    const records = await this.prisma.journeyDemand.findMany({
      where: {
        status: this.toPrismaJourneyDemandStatus(status.value),
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  public async findByRequesterAndStatus(
    requesterPublicId: RequesterPublicId,
    status: JourneyDemandStatusValueObject,
  ): Promise<JourneyDemandAggregate[]> {
    const records = await this.prisma.journeyDemand.findMany({
      where: {
        requesterPublicId: requesterPublicId.value,

        status: this.toPrismaJourneyDemandStatus(status.value),
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

  public async delete(id: JourneyDemandId): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const journeyDemandId = id.value;

      // -----------------------------------------------------------------------
      // Waypoints
      // -----------------------------------------------------------------------

      await tx.journeyDemandWaypoint.deleteMany({
        where: {
          corridor: {
            demandId: journeyDemandId,
          },
        },
      });

      // -----------------------------------------------------------------------
      // Participants
      // -----------------------------------------------------------------------

      await tx.journeyDemandParticipant.deleteMany({
        where: {
          demandId: journeyDemandId,
        },
      });

      // -----------------------------------------------------------------------
      // Components
      // -----------------------------------------------------------------------

      await tx.journeyDemandCorridor.deleteMany({
        where: {
          demandId: journeyDemandId,
        },
      });

      await tx.journeyDemandSchedule.deleteMany({
        where: {
          demandId: journeyDemandId,
        },
      });

      await tx.journeyDemandCapacity.deleteMany({
        where: {
          demandId: journeyDemandId,
        },
      });

      await tx.journeyDemandPricing.deleteMany({
        where: {
          demandId: journeyDemandId,
        },
      });

      // -----------------------------------------------------------------------
      // Root
      // -----------------------------------------------------------------------

      await tx.journeyDemand.delete({
        where: {
          id: journeyDemandId,
        },
      });
    });
  }

  public async exists(id: JourneyDemandId): Promise<boolean> {
    const count = await this.prisma.journeyDemand.count({
      where: {
        id: id.value,
      },
    });

    return count > 0;
  }

  public async existsByPublicId(
    publicId: JourneyDemandPublicId,
  ): Promise<boolean> {
    const count = await this.prisma.journeyDemand.count({
      where: {
        publicId: publicId.value,
      },
    });

    return count > 0;
  }

  public async existsByRequesterPublicId(
    requesterPublicId: RequesterPublicId,
  ): Promise<boolean> {
    const count = await this.prisma.journeyDemand.count({
      where: {
        requesterPublicId: requesterPublicId.value,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Root Entity Queries
  // ===========================================================================

  public async findJourneyDemandById(
    id: JourneyDemandId,
  ): Promise<JourneyDemandEntity | null> {
    const record = await this.prisma.journeyDemand.findUnique({
      where: {
        id: id.value,
      },
    });

    return record === null ? null : JourneyDemandPrismaMapper.toDomain(record);
  }

  public async findJourneyDemandByPublicId(
    publicId: JourneyDemandPublicId,
  ): Promise<JourneyDemandEntity | null> {
    const record = await this.prisma.journeyDemand.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    return record === null ? null : JourneyDemandPrismaMapper.toDomain(record);
  }

  public async findJourneyDemands(): Promise<JourneyDemandEntity[]> {
    const records = await this.prisma.journeyDemand.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => JourneyDemandPrismaMapper.toDomain(record));
  }

  public async findJourneyDemandsByRequesterPublicId(
    requesterPublicId: RequesterPublicId,
  ): Promise<JourneyDemandEntity[]> {
    const records = await this.prisma.journeyDemand.findMany({
      where: {
        requesterPublicId: requesterPublicId.value,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => JourneyDemandPrismaMapper.toDomain(record));
  }

  public async findJourneyDemandsByStatus(
    status: JourneyDemandStatusValueObject,
  ): Promise<JourneyDemandEntity[]> {
    const records = await this.prisma.journeyDemand.findMany({
      where: {
        status: this.toPrismaJourneyDemandStatus(status.value),
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => JourneyDemandPrismaMapper.toDomain(record));
  }

  public async findJourneyDemandsByRequesterAndStatus(
    requesterPublicId: RequesterPublicId,
    status: JourneyDemandStatusValueObject,
  ): Promise<JourneyDemandEntity[]> {
    const records = await this.prisma.journeyDemand.findMany({
      where: {
        requesterPublicId: requesterPublicId.value,

        status: this.toPrismaJourneyDemandStatus(status.value),
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => JourneyDemandPrismaMapper.toDomain(record));
  }

  // ===========================================================================
  // Corridor Queries
  // ===========================================================================

  public async findJourneyDemandsByCorridorId(
    corridorId: JourneyDemandCorridorId,
  ): Promise<JourneyDemandEntity[]> {
    const records = await this.prisma.journeyDemand.findMany({
      where: {
        corridor: {
          is: {
            id: corridorId.value,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => JourneyDemandPrismaMapper.toDomain(record));
  }

  public async findCorridor(
    journeyDemandId: JourneyDemandId,
  ): Promise<JourneyDemandCorridorEntity | null> {
    const record = await this.prisma.journeyDemandCorridor.findUnique({
      where: {
        demandId: journeyDemandId.value,
      },

      include: {
        waypoints: {
          orderBy: {
            sequence: 'asc',
          },
        },
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyDemandPrismaMapper.toDomainComponent(
      record,
    ) as JourneyDemandCorridorEntity;
  }

  public async findCorridorById(
    journeyDemandId: JourneyDemandId,
    corridorId: JourneyDemandCorridorId,
  ): Promise<JourneyDemandCorridorEntity | null> {
    const record = await this.prisma.journeyDemandCorridor.findFirst({
      where: {
        id: corridorId.value,
        demandId: journeyDemandId.value,
      },

      include: {
        waypoints: {
          orderBy: {
            sequence: 'asc',
          },
        },
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyDemandPrismaMapper.toDomainComponent(
      record,
    ) as JourneyDemandCorridorEntity;
  }

  public async findCorridorByPublicId(
    journeyDemandId: JourneyDemandId,
    corridorPublicId: JourneyDemandCorridorPublicId,
  ): Promise<JourneyDemandCorridorEntity | null> {
    const record = await this.prisma.journeyDemandCorridor.findFirst({
      where: {
        publicId: corridorPublicId.value,
        demandId: journeyDemandId.value,
      },

      include: {
        waypoints: {
          orderBy: {
            sequence: 'asc',
          },
        },
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyDemandPrismaMapper.toDomainComponent(
      record,
    ) as JourneyDemandCorridorEntity;
  }

  public async existsCorridor(
    journeyDemandId: JourneyDemandId,
  ): Promise<boolean> {
    const count = await this.prisma.journeyDemandCorridor.count({
      where: {
        demandId: journeyDemandId.value,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Waypoints
  // ===========================================================================

  public async findWaypointById(
    journeyDemandId: JourneyDemandId,
    waypointId: JourneyDemandWaypointId,
  ): Promise<JourneyDemandWaypointEntity | null> {
    const record = await this.prisma.journeyDemandWaypoint.findFirst({
      where: {
        id: waypointId.value,

        corridor: {
          demandId: journeyDemandId.value,
        },
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyDemandPrismaMapper.toDomainComponent(
      record,
    ) as JourneyDemandWaypointEntity;
  }

  public async findWaypointByPublicId(
    journeyDemandId: JourneyDemandId,
    waypointPublicId: JourneyDemandWaypointPublicId,
  ): Promise<JourneyDemandWaypointEntity | null> {
    const record = await this.prisma.journeyDemandWaypoint.findFirst({
      where: {
        publicId: waypointPublicId.value,

        corridor: {
          demandId: journeyDemandId.value,
        },
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyDemandPrismaMapper.toDomainComponent(
      record,
    ) as JourneyDemandWaypointEntity;
  }

  public async findWaypoints(
    journeyDemandId: JourneyDemandId,
  ): Promise<JourneyDemandWaypointEntity[]> {
    const records = await this.prisma.journeyDemandWaypoint.findMany({
      where: {
        corridor: {
          demandId: journeyDemandId.value,
        },
      },

      orderBy: {
        sequence: 'asc',
      },
    });

    return records.map(
      (record) =>
        JourneyDemandPrismaMapper.toDomainComponent(
          record,
        ) as JourneyDemandWaypointEntity,
    );
  }

  public async existsWaypoint(
    journeyDemandId: JourneyDemandId,
    waypointId: JourneyDemandWaypointId,
  ): Promise<boolean> {
    const count = await this.prisma.journeyDemandWaypoint.count({
      where: {
        id: waypointId.value,

        corridor: {
          demandId: journeyDemandId.value,
        },
      },
    });

    return count > 0;
  }

  public async existsWaypointByPublicId(
    journeyDemandId: JourneyDemandId,
    waypointPublicId: JourneyDemandWaypointPublicId,
  ): Promise<boolean> {
    const count = await this.prisma.journeyDemandWaypoint.count({
      where: {
        publicId: waypointPublicId.value,

        corridor: {
          demandId: journeyDemandId.value,
        },
      },
    });

    return count > 0;
  }

  public async existsWaypoints(
    journeyDemandId: JourneyDemandId,
  ): Promise<boolean> {
    const count = await this.prisma.journeyDemandWaypoint.count({
      where: {
        corridor: {
          demandId: journeyDemandId.value,
        },
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Schedule
  // ===========================================================================

  public async findSchedule(
    journeyDemandId: JourneyDemandId,
  ): Promise<JourneyDemandScheduleEntity | null> {
    const record = await this.prisma.journeyDemandSchedule.findUnique({
      where: {
        demandId: journeyDemandId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyDemandPrismaMapper.toDomainComponent(
      record,
    ) as JourneyDemandScheduleEntity;
  }

  public async findScheduleById(
    journeyDemandId: JourneyDemandId,
    scheduleId: JourneyDemandScheduleId,
  ): Promise<JourneyDemandScheduleEntity | null> {
    const record = await this.prisma.journeyDemandSchedule.findFirst({
      where: {
        id: scheduleId.value,
        demandId: journeyDemandId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyDemandPrismaMapper.toDomainComponent(
      record,
    ) as JourneyDemandScheduleEntity;
  }

  public async findScheduleByPublicId(
    journeyDemandId: JourneyDemandId,
    schedulePublicId: JourneyDemandSchedulePublicId,
  ): Promise<JourneyDemandScheduleEntity | null> {
    const record = await this.prisma.journeyDemandSchedule.findFirst({
      where: {
        publicId: schedulePublicId.value,
        demandId: journeyDemandId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyDemandPrismaMapper.toDomainComponent(
      record,
    ) as JourneyDemandScheduleEntity;
  }

  public async findJourneyDemandsByScheduleId(
    scheduleId: JourneyDemandScheduleId,
  ): Promise<JourneyDemandEntity[]> {
    const records = await this.prisma.journeyDemand.findMany({
      where: {
        schedule: {
          is: {
            id: scheduleId.value,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => JourneyDemandPrismaMapper.toDomain(record));
  }

  public async existsSchedule(
    journeyDemandId: JourneyDemandId,
  ): Promise<boolean> {
    const count = await this.prisma.journeyDemandSchedule.count({
      where: {
        demandId: journeyDemandId.value,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Capacity
  // ===========================================================================

  public async findCapacity(
    journeyDemandId: JourneyDemandId,
  ): Promise<JourneyDemandCapacityEntity | null> {
    const record = await this.prisma.journeyDemandCapacity.findUnique({
      where: {
        demandId: journeyDemandId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyDemandPrismaMapper.toDomainComponent(
      record,
    ) as JourneyDemandCapacityEntity;
  }

  public async findCapacityById(
    journeyDemandId: JourneyDemandId,
    capacityId: JourneyDemandCapacityId,
  ): Promise<JourneyDemandCapacityEntity | null> {
    const record = await this.prisma.journeyDemandCapacity.findFirst({
      where: {
        id: capacityId.value,
        demandId: journeyDemandId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyDemandPrismaMapper.toDomainComponent(
      record,
    ) as JourneyDemandCapacityEntity;
  }

  public async findCapacityByPublicId(
    journeyDemandId: JourneyDemandId,
    capacityPublicId: JourneyDemandCapacityPublicId,
  ): Promise<JourneyDemandCapacityEntity | null> {
    const record = await this.prisma.journeyDemandCapacity.findFirst({
      where: {
        publicId: capacityPublicId.value,
        demandId: journeyDemandId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyDemandPrismaMapper.toDomainComponent(
      record,
    ) as JourneyDemandCapacityEntity;
  }

  public async existsCapacity(
    journeyDemandId: JourneyDemandId,
  ): Promise<boolean> {
    const count = await this.prisma.journeyDemandCapacity.count({
      where: {
        demandId: journeyDemandId.value,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Pricing
  // ===========================================================================

  public async findPricing(
    journeyDemandId: JourneyDemandId,
  ): Promise<JourneyDemandPricingEntity | null> {
    const record = await this.prisma.journeyDemandPricing.findUnique({
      where: {
        demandId: journeyDemandId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyDemandPrismaMapper.toDomainComponent(
      record,
    ) as JourneyDemandPricingEntity;
  }

  public async findPricingById(
    journeyDemandId: JourneyDemandId,
    pricingId: JourneyDemandPricingId,
  ): Promise<JourneyDemandPricingEntity | null> {
    const record = await this.prisma.journeyDemandPricing.findFirst({
      where: {
        id: pricingId.value,
        demandId: journeyDemandId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyDemandPrismaMapper.toDomainComponent(
      record,
    ) as JourneyDemandPricingEntity;
  }

  public async findPricingByPublicId(
    journeyDemandId: JourneyDemandId,
    pricingPublicId: JourneyDemandPricingPublicId,
  ): Promise<JourneyDemandPricingEntity | null> {
    const record = await this.prisma.journeyDemandPricing.findFirst({
      where: {
        publicId: pricingPublicId.value,
        demandId: journeyDemandId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyDemandPrismaMapper.toDomainComponent(
      record,
    ) as JourneyDemandPricingEntity;
  }

  public async existsPricing(
    journeyDemandId: JourneyDemandId,
  ): Promise<boolean> {
    const count = await this.prisma.journeyDemandPricing.count({
      where: {
        demandId: journeyDemandId.value,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Participants
  // ===========================================================================

  public async findParticipantById(
    journeyDemandId: JourneyDemandId,
    participantId: JourneyDemandParticipantId,
  ): Promise<JourneyDemandParticipantEntity | null> {
    const record = await this.prisma.journeyDemandParticipant.findFirst({
      where: {
        id: participantId.value,
        demandId: journeyDemandId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyDemandPrismaMapper.toDomainComponent(
      record,
    ) as JourneyDemandParticipantEntity;
  }

  public async findParticipantByPublicId(
    journeyDemandId: JourneyDemandId,
    participantPublicId: JourneyDemandParticipantPublicId,
  ): Promise<JourneyDemandParticipantEntity | null> {
    const record = await this.prisma.journeyDemandParticipant.findFirst({
      where: {
        publicId: participantPublicId.value,
        demandId: journeyDemandId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyDemandPrismaMapper.toDomainComponent(
      record,
    ) as JourneyDemandParticipantEntity;
  }

  public async findParticipantByMemberPublicId(
    journeyDemandId: JourneyDemandId,
    memberPublicId: MemberPublicId,
  ): Promise<JourneyDemandParticipantEntity | null> {
    const record = await this.prisma.journeyDemandParticipant.findFirst({
      where: {
        memberPublicId: memberPublicId.value,
        demandId: journeyDemandId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyDemandPrismaMapper.toDomainComponent(
      record,
    ) as JourneyDemandParticipantEntity;
  }

  public async findParticipants(
    journeyDemandId: JourneyDemandId,
  ): Promise<JourneyDemandParticipantEntity[]> {
    const records = await this.prisma.journeyDemandParticipant.findMany({
      where: {
        demandId: journeyDemandId.value,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map(
      (record) =>
        JourneyDemandPrismaMapper.toDomainComponent(
          record,
        ) as JourneyDemandParticipantEntity,
    );
  }

  public async findParticipantsByStatus(
    journeyDemandId: JourneyDemandId,
    status: JourneyDemandParticipantStatusValueObject,
  ): Promise<JourneyDemandParticipantEntity[]> {
    const records = await this.prisma.journeyDemandParticipant.findMany({
      where: {
        demandId: journeyDemandId.value,

        status: this.toPrismaJourneyDemandParticipantStatus(status.value),
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map(
      (record) =>
        JourneyDemandPrismaMapper.toDomainComponent(
          record,
        ) as JourneyDemandParticipantEntity,
    );
  }

  public async existsParticipant(
    journeyDemandId: JourneyDemandId,
    participantId: JourneyDemandParticipantId,
  ): Promise<boolean> {
    const count = await this.prisma.journeyDemandParticipant.count({
      where: {
        id: participantId.value,
        demandId: journeyDemandId.value,
      },
    });

    return count > 0;
  }

  public async existsParticipantByPublicId(
    journeyDemandId: JourneyDemandId,
    participantPublicId: JourneyDemandParticipantPublicId,
  ): Promise<boolean> {
    const count = await this.prisma.journeyDemandParticipant.count({
      where: {
        publicId: participantPublicId.value,
        demandId: journeyDemandId.value,
      },
    });

    return count > 0;
  }

  public async existsParticipantByMemberPublicId(
    journeyDemandId: JourneyDemandId,
    memberPublicId: MemberPublicId,
  ): Promise<boolean> {
    const count = await this.prisma.journeyDemandParticipant.count({
      where: {
        memberPublicId: memberPublicId.value,
        demandId: journeyDemandId.value,
      },
    });

    return count > 0;
  }

  public async existsParticipants(
    journeyDemandId: JourneyDemandId,
  ): Promise<boolean> {
    const count = await this.prisma.journeyDemandParticipant.count({
      where: {
        demandId: journeyDemandId.value,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Matching / Conversion
  // ===========================================================================

  public async findByMatchedJourneyPublicId(
    matchedJourneyPublicId: MatchedJourneyPublicId,
  ): Promise<JourneyDemandEntity[]> {
    const records = await this.prisma.journeyDemand.findMany({
      where: {
        matchedJourneyPublicId: matchedJourneyPublicId.value,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => JourneyDemandPrismaMapper.toDomain(record));
  }

  public async existsByMatchedJourneyPublicId(
    matchedJourneyPublicId: MatchedJourneyPublicId,
  ): Promise<boolean> {
    const count = await this.prisma.journeyDemand.count({
      where: {
        matchedJourneyPublicId: matchedJourneyPublicId.value,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Aggregate Reconstruction
  // ===========================================================================

  private toAggregate(
    record: JourneyDemandWithComponents,
  ): JourneyDemandAggregate {
    const journeyDemand = JourneyDemandPrismaMapper.toDomain(record);

    return JourneyDemandAggregate.create(journeyDemand);
  }
}
