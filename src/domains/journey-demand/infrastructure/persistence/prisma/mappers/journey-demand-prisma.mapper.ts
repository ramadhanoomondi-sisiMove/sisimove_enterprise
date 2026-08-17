// -----------------------------------------------------------------------------
// Journey Demand Prisma Mapper
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type {
  JourneyDemand as PrismaJourneyDemand,
  JourneyDemandCapacity as PrismaJourneyDemandCapacity,
  JourneyDemandCorridor as PrismaJourneyDemandCorridor,
  JourneyDemandParticipant as PrismaJourneyDemandParticipant,
  JourneyDemandPricing as PrismaJourneyDemandPricing,
  JourneyDemandSchedule as PrismaJourneyDemandSchedule,
  JourneyDemandWaypoint as PrismaJourneyDemandWaypoint,
} from '@prisma/client';

import type {
  JourneyDemandParticipantStatus as PrismaJourneyDemandParticipantStatus,
  JourneyDemandStatus as PrismaJourneyDemandStatus,
  JourneyDemandWaypointType as PrismaJourneyDemandWaypointType,
} from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../../../foundation/kernel/domain/public-entity-id';
import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import { JourneyDemandEntity } from '../../../../domain/entities/journey-demand.entity';
import { JourneyDemandCapacityEntity } from '../../../../domain/entities/journey-demand-capacity.entity';
import { JourneyDemandCorridorEntity } from '../../../../domain/entities/journey-demand-corridor.entity';
import { JourneyDemandParticipantEntity } from '../../../../domain/entities/journey-demand-participant.entity';
import { JourneyDemandPricingEntity } from '../../../../domain/entities/journey-demand-pricing.entity';
import { JourneyDemandScheduleEntity } from '../../../../domain/entities/journey-demand-schedule.entity';
import { JourneyDemandWaypointEntity } from '../../../../domain/entities/journey-demand-waypoint.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyDemandArrivalWindow,
  JourneyDemandCapacityPublicId,
  JourneyDemandCoordinate,
  JourneyDemandCorridorKey,
  JourneyDemandCorridorPublicId,
  JourneyDemandCurrency,
  JourneyDemandLocation,
  JourneyDemandParticipantStatus,
  JourneyDemandParticipantStatusValueObject,
  JourneyDemandPrice,
  JourneyDemandPricingPublicId,
  JourneyDemandSchedulePublicId,
  JourneyDemandScheduleWindow,
  JourneyDemandSeats,
  JourneyDemandSequence,
  JourneyDemandStatus,
  JourneyDemandStatusValueObject,
  JourneyDemandTimezone,
  JourneyDemandWaypointPublicId,
  JourneyDemandWaypointType,
  JourneyDemandWaypointTypeValueObject,
  MemberPublicId,
} from '../../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Requester
// -----------------------------------------------------------------------------

import { RequesterPublicId } from '../../../../domain/value-objects/requester-public-id.vo';

// -----------------------------------------------------------------------------
// Matching
// -----------------------------------------------------------------------------

import { MatchedJourneyPublicId } from '../../../../domain/value-objects/matched-journey-public-id.vo';

// -----------------------------------------------------------------------------
// Entity Identity Value Objects
// -----------------------------------------------------------------------------

import { JourneyDemandCapacityId } from '../../../../domain/value-objects/journey-demand-capacity-id.vo';
import { JourneyDemandCorridorId } from '../../../../domain/value-objects/journey-demand-corridor-id.vo';
import { JourneyDemandParticipantId } from '../../../../domain/value-objects/journey-demand-participant-id.vo';
import { JourneyDemandParticipantPublicId } from '../../../../domain/value-objects/journey-demand-participant-public-id.vo';

// =============================================================================
// Prisma → Domain enum conversion
// =============================================================================

/**
 * Converts the persisted Prisma JourneyDemandStatus into the
 * domain JourneyDemandStatus enum.
 *
 * The persisted value is validated before entering the domain.
 */
function toJourneyDemandStatus(
  value: PrismaJourneyDemandStatus,
): JourneyDemandStatus {
  if (
    !Object.values(JourneyDemandStatus).includes(
      value as unknown as JourneyDemandStatus,
    )
  ) {
    throw new Error(`Invalid persisted JourneyDemandStatus "${value}".`);
  }

  return value as unknown as JourneyDemandStatus;
}

/**
 * Converts the persisted Prisma JourneyDemandWaypointType into the
 * domain JourneyDemandWaypointType enum.
 */
function toJourneyDemandWaypointType(
  value: PrismaJourneyDemandWaypointType,
): JourneyDemandWaypointType {
  if (
    !Object.values(JourneyDemandWaypointType).includes(
      value as unknown as JourneyDemandWaypointType,
    )
  ) {
    throw new Error(`Invalid persisted JourneyDemandWaypointType "${value}".`);
  }

  return value as unknown as JourneyDemandWaypointType;
}

/**
 * Converts the persisted Prisma JourneyDemandParticipantStatus into the
 * domain JourneyDemandParticipantStatus enum.
 */
function toJourneyDemandParticipantStatus(
  value: PrismaJourneyDemandParticipantStatus,
): JourneyDemandParticipantStatus {
  if (
    !Object.values(JourneyDemandParticipantStatus).includes(
      value as unknown as JourneyDemandParticipantStatus,
    )
  ) {
    throw new Error(
      `Invalid persisted JourneyDemandParticipantStatus "${value}".`,
    );
  }

  return value as unknown as JourneyDemandParticipantStatus;
}

// =============================================================================
// Prisma Types
// =============================================================================

export type JourneyDemandWithComponents = PrismaJourneyDemand & {
  corridor?:
    | (PrismaJourneyDemandCorridor & {
        waypoints?: PrismaJourneyDemandWaypoint[];
      })
    | null;

  schedule?: PrismaJourneyDemandSchedule | null;

  capacity?: PrismaJourneyDemandCapacity | null;

  pricing?: PrismaJourneyDemandPricing | null;

  participants?: PrismaJourneyDemandParticipant[];
};

// =============================================================================
// Persistence Types
// =============================================================================

export interface JourneyDemandPersistence {
  journeyDemand: {
    id: string;

    publicId: string;

    requesterPublicId: string;

    status: JourneyDemandStatus;

    matchedJourneyPublicId: string | null;

    publishedAt: Date | null;
    matchedAt: Date | null;
    convertedAt: Date | null;
    fulfilledAt: Date | null;
    cancelledAt: Date | null;
    expiredAt: Date | null;

    version: number;

    createdAt: Date;
    updatedAt: Date;
  };

  corridor?: ReturnType<
    (typeof JourneyDemandPrismaMapper)['corridorToPersistence']
  >;

  schedule?: ReturnType<
    (typeof JourneyDemandPrismaMapper)['scheduleToPersistence']
  >;

  capacity?: ReturnType<
    (typeof JourneyDemandPrismaMapper)['capacityToPersistence']
  >;

  pricing?: ReturnType<
    (typeof JourneyDemandPrismaMapper)['pricingToPersistence']
  >;

  participants: ReturnType<
    (typeof JourneyDemandPrismaMapper)['participantToPersistence']
  >[];
}

// =============================================================================
// Mapper
// =============================================================================

export class JourneyDemandPrismaMapper {
  // ===========================================================================
  // Journey Demand
  // ===========================================================================

  public static toDomain(
    record: JourneyDemandWithComponents,
  ): JourneyDemandEntity {
    const corridor =
      record.corridor !== undefined && record.corridor !== null
        ? this.corridorToDomain(record.corridor)
        : undefined;

    const schedule =
      record.schedule !== undefined && record.schedule !== null
        ? this.scheduleToDomain(record.schedule)
        : undefined;

    const capacity =
      record.capacity !== undefined && record.capacity !== null
        ? this.capacityToDomain(record.capacity)
        : undefined;

    const pricing =
      record.pricing !== undefined && record.pricing !== null
        ? this.pricingToDomain(record.pricing)
        : undefined;

    const participants =
      record.participants?.map((participant) =>
        this.participantToDomain(participant),
      ) ?? [];

    return JourneyDemandEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        publicId: new PublicEntityId(record.publicId),

        // ---------------------------------------------------------------------
        // Requester
        // ---------------------------------------------------------------------

        requesterPublicId: new RequesterPublicId(record.requesterPublicId),

        // ---------------------------------------------------------------------
        // Status
        // ---------------------------------------------------------------------

        status: new JourneyDemandStatusValueObject(
          toJourneyDemandStatus(record.status),
        ),

        // ---------------------------------------------------------------------
        // Matching
        // ---------------------------------------------------------------------

        matchedJourneyPublicId:
          record.matchedJourneyPublicId !== null
            ? new MatchedJourneyPublicId(record.matchedJourneyPublicId)
            : undefined,

        // ---------------------------------------------------------------------
        // Components
        // ---------------------------------------------------------------------

        corridor,

        schedule,

        capacity,

        pricing,

        participants,

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        publishedAt: record.publishedAt ?? undefined,

        matchedAt: record.matchedAt ?? undefined,

        convertedAt: record.convertedAt ?? undefined,

        fulfilledAt: record.fulfilledAt ?? undefined,

        cancelledAt: record.cancelledAt ?? undefined,

        expiredAt: record.expiredAt ?? undefined,

        // ---------------------------------------------------------------------
        // Version
        // ---------------------------------------------------------------------

        version: record.version,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),
    );
  }

  // ===========================================================================
  // Journey Demand Persistence
  // ===========================================================================

  public static toPersistence(
    entity: JourneyDemandEntity,
  ): JourneyDemandPersistence {
    const demandId = entity.id.toString();

    const persistence: JourneyDemandPersistence = {
      journeyDemand: {
        id: demandId,

        publicId: entity.publicId.value,

        requesterPublicId: entity.requesterPublicId.value,

        status: entity.status.value,

        matchedJourneyPublicId: entity.matchedJourneyPublicId?.value ?? null,

        publishedAt: entity.publishedAt ?? null,

        matchedAt: entity.matchedAt ?? null,

        convertedAt: entity.convertedAt ?? null,

        fulfilledAt: entity.fulfilledAt ?? null,

        cancelledAt: entity.cancelledAt ?? null,

        expiredAt: entity.expiredAt ?? null,

        version: entity.version,

        createdAt: entity.createdAt,

        updatedAt: entity.updatedAt,
      },

      participants: entity.participants.map((participant) =>
        this.participantToPersistence(participant, demandId),
      ),
    };

    // -------------------------------------------------------------------------
    // Corridor
    // -------------------------------------------------------------------------

    if (entity.corridor !== undefined) {
      persistence.corridor = this.corridorToPersistence(
        entity.corridor,
        demandId,
      );
    }

    // -------------------------------------------------------------------------
    // Schedule
    // -------------------------------------------------------------------------

    if (entity.schedule !== undefined) {
      persistence.schedule = this.scheduleToPersistence(
        entity.schedule,
        demandId,
      );
    }

    // -------------------------------------------------------------------------
    // Capacity
    // -------------------------------------------------------------------------

    if (entity.capacity !== undefined) {
      persistence.capacity = this.capacityToPersistence(
        entity.capacity,
        demandId,
      );
    }

    // -------------------------------------------------------------------------
    // Pricing
    // -------------------------------------------------------------------------

    if (entity.pricing !== undefined) {
      persistence.pricing = this.pricingToPersistence(entity.pricing, demandId);
    }

    return persistence;
  }

  // ===========================================================================
  // Corridor
  // ===========================================================================

  private static corridorToDomain(
    record: PrismaJourneyDemandCorridor & {
      waypoints?: PrismaJourneyDemandWaypoint[];
    },
  ): JourneyDemandCorridorEntity {
    const waypoints =
      record.waypoints?.map((waypoint) => this.waypointToDomain(waypoint)) ??
      [];

    const publicId = new JourneyDemandCorridorPublicId(record.publicId);

    return JourneyDemandCorridorEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        publicId,

        // ---------------------------------------------------------------------
        // Origin
        // ---------------------------------------------------------------------

        originName: new JourneyDemandLocation(record.originName),

        originCoordinates: new JourneyDemandCoordinate(
          Number(record.originLatitude),
          Number(record.originLongitude),
        ),

        // ---------------------------------------------------------------------
        // Destination
        // ---------------------------------------------------------------------

        destinationName: new JourneyDemandLocation(record.destinationName),

        destinationCoordinates: new JourneyDemandCoordinate(
          Number(record.destinationLatitude),
          Number(record.destinationLongitude),
        ),

        // ---------------------------------------------------------------------
        // Corridor Key
        // ---------------------------------------------------------------------

        corridorKey:
          record.corridorKey !== null && record.corridorKey !== undefined
            ? new JourneyDemandCorridorKey(record.corridorKey)
            : undefined,

        // ---------------------------------------------------------------------
        // Waypoints
        // ---------------------------------------------------------------------

        waypoints,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      new JourneyDemandCorridorId(record.id),

      publicId,
    );
  }

  private static corridorToPersistence(
    entity: JourneyDemandCorridorEntity,
    demandId: string,
  ) {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      demandId,

      originName: entity.originName.value,

      originLatitude: entity.originCoordinates.latitude,

      originLongitude: entity.originCoordinates.longitude,

      destinationName: entity.destinationName.value,

      destinationLatitude: entity.destinationCoordinates.latitude,

      destinationLongitude: entity.destinationCoordinates.longitude,

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
    record: PrismaJourneyDemandWaypoint,
  ): JourneyDemandWaypointEntity {
    const publicId = new JourneyDemandWaypointPublicId(record.publicId);

    return JourneyDemandWaypointEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        publicId,

        // ---------------------------------------------------------------------
        // Type
        //
        // Pickup/dropoff requirements are derived from this value object.
        // ---------------------------------------------------------------------

        type: new JourneyDemandWaypointTypeValueObject(
          toJourneyDemandWaypointType(record.type),
        ),

        // ---------------------------------------------------------------------
        // Sequence
        // ---------------------------------------------------------------------

        sequence: new JourneyDemandSequence(record.sequence),

        // ---------------------------------------------------------------------
        // Location
        // ---------------------------------------------------------------------

        name: new JourneyDemandLocation(record.name),

        coordinates: new JourneyDemandCoordinate(
          Number(record.latitude),
          Number(record.longitude),
        ),

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),
    );
  }

  private static waypointToPersistence(
    entity: JourneyDemandWaypointEntity,
    corridorId: string,
  ) {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      // -----------------------------------------------------------------------
      // Relationship
      // -----------------------------------------------------------------------

      corridorId,

      // -----------------------------------------------------------------------
      // Type
      // -----------------------------------------------------------------------

      type: entity.type.value,

      // -----------------------------------------------------------------------
      // Sequence
      // -----------------------------------------------------------------------

      sequence: entity.sequence.value,

      // -----------------------------------------------------------------------
      // Location
      // -----------------------------------------------------------------------

      name: entity.name.value,

      latitude: entity.coordinates.latitude,

      longitude: entity.coordinates.longitude,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Schedule
  // ===========================================================================

  private static scheduleToDomain(
    record: PrismaJourneyDemandSchedule,
  ): JourneyDemandScheduleEntity {
    const publicId = new JourneyDemandSchedulePublicId(record.publicId);

    return JourneyDemandScheduleEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Departure Window
        // ---------------------------------------------------------------------

        scheduleWindow: new JourneyDemandScheduleWindow(
          record.earliestDeparture,
          record.latestDeparture,
        ),

        // ---------------------------------------------------------------------
        // Arrival Window
        // ---------------------------------------------------------------------

        arrivalWindow: new JourneyDemandArrivalWindow(
          record.targetArrival ?? undefined,
          record.maximumArrival ?? undefined,
        ),

        // ---------------------------------------------------------------------
        // Timezone
        // ---------------------------------------------------------------------

        timezone: new JourneyDemandTimezone(record.timezone),

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),

      publicId,
    );
  }

  private static scheduleToPersistence(
    entity: JourneyDemandScheduleEntity,
    demandId: string,
  ) {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      demandId,

      earliestDeparture: entity.earliestDeparture,

      latestDeparture: entity.latestDeparture,

      targetArrival: entity.targetArrival ?? null,

      maximumArrival: entity.maximumArrival ?? null,

      timezone: entity.timezone.value,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Capacity
  // ===========================================================================

  private static capacityToDomain(
    record: PrismaJourneyDemandCapacity,
  ): JourneyDemandCapacityEntity {
    const publicId = new JourneyDemandCapacityPublicId(record.publicId);

    return JourneyDemandCapacityEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        publicId,

        // ---------------------------------------------------------------------
        // Capacity
        // ---------------------------------------------------------------------

        requestedSeats: new JourneyDemandSeats(record.requestedSeats),

        matchedSeats: record.matchedSeats,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      new JourneyDemandCapacityId(record.id),

      publicId,
    );
  }

  private static capacityToPersistence(
    entity: JourneyDemandCapacityEntity,
    demandId: string,
  ) {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      demandId,

      requestedSeats: entity.requestedSeats.value,

      matchedSeats: entity.matchedSeats,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Pricing
  // ===========================================================================

  private static pricingToDomain(
    record: PrismaJourneyDemandPricing,
  ): JourneyDemandPricingEntity {
    const publicId = new JourneyDemandPricingPublicId(record.publicId);

    return JourneyDemandPricingEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        publicId,

        // ---------------------------------------------------------------------
        // Price
        // ---------------------------------------------------------------------

        maximumPricePerSeat:
          record.maximumPricePerSeat !== null
            ? new JourneyDemandPrice(record.maximumPricePerSeat)
            : undefined,

        preferredPricePerSeat:
          record.preferredPricePerSeat !== null
            ? new JourneyDemandPrice(record.preferredPricePerSeat)
            : undefined,

        // ---------------------------------------------------------------------
        // Currency
        // ---------------------------------------------------------------------

        currency: new JourneyDemandCurrency(record.currency),

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),

      publicId,
    );
  }

  private static pricingToPersistence(
    entity: JourneyDemandPricingEntity,
    demandId: string,
  ) {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      demandId,

      maximumPricePerSeat: entity.maximumPricePerSeat?.value ?? null,

      preferredPricePerSeat: entity.preferredPricePerSeat?.value ?? null,

      currency: entity.currency.value,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Participant
  // ===========================================================================

  private static participantToDomain(
    record: PrismaJourneyDemandParticipant,
  ): JourneyDemandParticipantEntity {
    const publicId = new JourneyDemandParticipantPublicId(record.publicId);

    return JourneyDemandParticipantEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        publicId,

        // ---------------------------------------------------------------------
        // Member
        // ---------------------------------------------------------------------

        memberPublicId: new MemberPublicId(record.memberPublicId),

        // ---------------------------------------------------------------------
        // Participation
        // ---------------------------------------------------------------------

        seats: new JourneyDemandSeats(record.seats),

        status: new JourneyDemandParticipantStatusValueObject(
          toJourneyDemandParticipantStatus(record.status),
        ),

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        joinedAt: record.joinedAt,

        withdrawnAt: record.withdrawnAt ?? undefined,

        removedAt: record.removedAt ?? undefined,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      // -----------------------------------------------------------------------
      // Internal Identity
      // -----------------------------------------------------------------------

      new JourneyDemandParticipantId(record.id),

      // -----------------------------------------------------------------------
      // Public Identity
      // -----------------------------------------------------------------------

      publicId,
    );
  }

  private static participantToPersistence(
    entity: JourneyDemandParticipantEntity,
    demandId: string,
  ) {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      // -----------------------------------------------------------------------
      // Relationship
      // -----------------------------------------------------------------------

      demandId,

      // -----------------------------------------------------------------------
      // Member
      // -----------------------------------------------------------------------

      memberPublicId: entity.memberPublicId.value,

      // -----------------------------------------------------------------------
      // Participation
      // -----------------------------------------------------------------------

      seats: entity.seats.value,

      status: entity.status.value,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      joinedAt: entity.joinedAt,

      withdrawnAt: entity.withdrawnAt ?? null,

      removedAt: entity.removedAt ?? null,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Component Mapping
  // ===========================================================================

  public static toDomainComponent(
    record:
      | PrismaJourneyDemandCorridor
      | PrismaJourneyDemandSchedule
      | PrismaJourneyDemandCapacity
      | PrismaJourneyDemandPricing
      | PrismaJourneyDemandParticipant
      | PrismaJourneyDemandWaypoint,
  ):
    | JourneyDemandCorridorEntity
    | JourneyDemandScheduleEntity
    | JourneyDemandCapacityEntity
    | JourneyDemandPricingEntity
    | JourneyDemandParticipantEntity
    | JourneyDemandWaypointEntity {
    // -------------------------------------------------------------------------
    // Corridor
    // -------------------------------------------------------------------------

    if ('originName' in record && 'destinationName' in record) {
      return this.corridorToDomain(record);
    }

    // -------------------------------------------------------------------------
    // Schedule
    // -------------------------------------------------------------------------

    if ('earliestDeparture' in record && 'latestDeparture' in record) {
      return this.scheduleToDomain(record);
    }

    // -------------------------------------------------------------------------
    // Capacity
    // -------------------------------------------------------------------------

    if ('requestedSeats' in record) {
      return this.capacityToDomain(record);
    }

    // -------------------------------------------------------------------------
    // Pricing
    // -------------------------------------------------------------------------

    if ('maximumPricePerSeat' in record && 'preferredPricePerSeat' in record) {
      return this.pricingToDomain(record);
    }

    // -------------------------------------------------------------------------
    // Participant
    // -------------------------------------------------------------------------

    if ('memberPublicId' in record && 'seats' in record) {
      return this.participantToDomain(record);
    }

    // -------------------------------------------------------------------------
    // Waypoint
    // -------------------------------------------------------------------------

    return this.waypointToDomain(record);
  }
}
