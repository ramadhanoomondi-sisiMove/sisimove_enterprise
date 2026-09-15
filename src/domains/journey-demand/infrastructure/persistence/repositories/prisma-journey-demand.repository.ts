// src/domains/journey-demand/infrastructure/persistence/repositories/prisma-journey-demand.repository.ts

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

import type {
  JourneyDemandRepository,
  PublicJourneyDemandFilters,
} from '../../../domain/repositories/journey-demand.repository';

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

@Injectable()
export class PrismaJourneyDemandRepository implements JourneyDemandRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Prisma Enum Boundary
  // ===========================================================================

  /**
   * Converts the domain status into the Prisma generated enum.
   *
   * The domain owns lifecycle semantics. Prisma only represents the persisted
   * representation.
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

  /**
   * Complete aggregate persistence graph.
   *
   * Public marketplace queries deliberately reuse the same aggregate graph
   * because the public application query composes route, schedule, capacity,
   * pricing, participants, and requester references from the JourneyDemand
   * aggregate before enriching the response with Traveller and Trust data.
   *
   * Cross-domain Traveller/Trust data is NOT included here. Those concerns
   * belong to their own bounded contexts and are composed by the application
   * query handler.
   */
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
        // ---------------------------------------------------------------------

        await tx.journeyDemandWaypoint.deleteMany({
          where: {
            corridorId: corridor.id,
          },
        });

        if (corridor.waypoints.length > 0) {
          await tx.journeyDemandWaypoint.createMany({
            data: corridor.waypoints.map((waypoint) => ({
              id: waypoint.id,
              publicId: waypoint.publicId,
              corridorId: corridor.id,

              type: this.toPrismaJourneyDemandWaypointType(waypoint.type),

              sequence: waypoint.sequence,

              name: waypoint.name,

              latitude: waypoint.latitude,
              longitude: waypoint.longitude,

              createdAt: waypoint.createdAt,
              updatedAt: waypoint.updatedAt,
            })),
          });
        }
      } else {
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

  /**
   * Generic aggregate lookup.
   *
   * This method deliberately does not enforce public visibility. It is used by
   * authenticated/internal application operations where the authorization
   * boundary is handled above the repository.
   */
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

  /**
   * Public marketplace aggregate lookup.
   *
   * Only OPEN JourneyDemands are anonymously discoverable.
   *
   * The visibility rule is applied directly in the persistence query so that
   * callers of the public query handler cannot accidentally retrieve a
   * non-public demand through a generic public-ID lookup.
   */
  public async findPublicJourneyDemandByPublicId(
    publicId: JourneyDemandPublicId,
  ): Promise<JourneyDemandAggregate | null> {
    const record = await this.prisma.journeyDemand.findFirst({
      where: {
        publicId: publicId.value,
        status: this.toPrismaJourneyDemandStatus('OPEN'),
      },

      include: this.include,
    });

    return record === null ? null : this.toAggregate(record);
  }

  /**
   * Public marketplace collection lookup.
   *
   * This is the collection counterpart to
   * findPublicJourneyDemandByPublicId().
   *
   * The public visibility rule is always applied first:
   *
   *   status = OPEN
   *
   * Optional marketplace filters then narrow that public collection:
   *
   *   from -> corridor origin
   *   to   -> corridor destination
   *   date -> requested departure window
   *
   * An omitted filters argument therefore means:
   *
   *   "return all publicly discoverable JourneyDemands."
   *
   * The method returns fully rehydrated aggregates rather than root entities
   * because the public application query needs the aggregate-owned route,
   * schedule, capacity, pricing, and participant information to construct the
   * public read model.
   *
   * Traveller and Trust information is deliberately NOT queried here.
   * requesterPublicId and participant memberPublicId remain opaque
   * cross-domain references and are resolved by the public application query
   * handler through the Social and Trust application capabilities.
   */
  public async findPublicJourneyDemands(
    filters?: PublicJourneyDemandFilters,
  ): Promise<JourneyDemandAggregate[]> {
    const where: Prisma.JourneyDemandWhereInput = {
      // -----------------------------------------------------------------------
      // Public Visibility
      // -----------------------------------------------------------------------
      //
      // A JourneyDemand must be OPEN to appear in anonymous marketplace
      // discovery. Filters must never bypass this visibility rule.
      status: this.toPrismaJourneyDemandStatus('OPEN'),
    };

    // -------------------------------------------------------------------------
    // Origin / Destination
    // -------------------------------------------------------------------------

    if (filters?.from?.trim()) {
      where.corridor = {
        is: {
          originName: {
            contains: filters.from.trim(),
            mode: 'insensitive',
          },
        },
      };
    }

    if (filters?.to?.trim()) {
      const existingCorridorFilter =
        where.corridor?.is !== undefined ? where.corridor.is : {};

      where.corridor = {
        is: {
          ...existingCorridorFilter,
          destinationName: {
            contains: filters.to.trim(),
            mode: 'insensitive',
          },
        },
      };
    }

    // -------------------------------------------------------------------------
    // Date
    // -------------------------------------------------------------------------
    //
    // The public API supplies a calendar date. Journey Demand stores a
    // departure window rather than a single departure timestamp:
    //
    //   earliestDeparture
    //   latestDeparture
    //
    // A demand belongs in a date search when its departure window overlaps
    // that requested calendar day.
    //
    // The application currently uses the Kenya marketplace timezone
    // (Africa/Nairobi). The repository receives the already-normalized query
    // string and constructs the corresponding UTC boundaries.
    //
    // Invalid date input is deliberately not converted into a broad query.
    // An invalid date therefore cannot accidentally expose the entire public
    // marketplace.
    if (filters?.date?.trim()) {
      const date = filters.date.trim();

      const start = new Date(`${date}T00:00:00.000+03:00`);
      const end = new Date(`${date}T23:59:59.999+03:00`);

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        throw new Error('Journey demand date is invalid.');
      }

      const existingScheduleFilter =
        where.schedule?.is !== undefined ? where.schedule.is : {};

      where.schedule = {
        is: {
          ...existingScheduleFilter,

          // A departure window overlaps the requested date when:
          //
          //   earliestDeparture <= endOfDay
          //   AND
          //   latestDeparture >= startOfDay
          //
          // This handles flexible Journey Demand departure windows correctly.
          earliestDeparture: {
            lte: end,
          },

          latestDeparture: {
            gte: start,
          },
        },
      };
    }

    // -------------------------------------------------------------------------
    // Pagination
    // -------------------------------------------------------------------------
    //
    // Pagination is intentionally applied at the persistence boundary so the
    // repository does not load the entire public marketplace into memory.
    //
    // Defensive normalization prevents negative values from reaching Prisma.
    const limit =
      filters?.limit === undefined
        ? undefined
        : Math.max(0, Math.floor(filters.limit));

    const offset =
      filters?.offset === undefined
        ? undefined
        : Math.max(0, Math.floor(filters.offset));

    const records = await this.prisma.journeyDemand.findMany({
      where,

      include: this.include,

      orderBy: [
        {
          publishedAt: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],

      ...(limit === undefined ? {} : { take: limit }),
      ...(offset === undefined ? {} : { skip: offset }),
    });

    return records.map((record) => this.toAggregate(record));
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

      await tx.journeyDemandWaypoint.deleteMany({
        where: {
          corridor: {
            demandId: journeyDemandId,
          },
        },
      });

      await tx.journeyDemandParticipant.deleteMany({
        where: {
          demandId: journeyDemandId,
        },
      });

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
