// -----------------------------------------------------------------------------
// Prisma Journey Boarding Repository
// -----------------------------------------------------------------------------
//
// Infrastructure repository for the Journey Boarding aggregate.
//
// Responsibilities:
// - Aggregate persistence and rehydration
// - Root entity queries
// - Participant queries
// - Boarding event history queries
// - Existence/count queries
//
// The repository implements the complete JourneyBoardingRepository contract.
// Cross-aggregate queries intentionally use only their corresponding public
// identifiers.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { $Enums } from '@prisma/client';
import { Prisma } from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { PrismaService } from '../../../../../../infrastructure/database/prisma/prisma.service';

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { JourneyBoardingAggregate } from '../../../../domain/aggregates/journey-boarding.aggregate';

// -----------------------------------------------------------------------------
// Entities
// -----------------------------------------------------------------------------

import type { JourneyBoardingEntity } from '../../../../domain/entities/journey-boarding.entity';

import type { JourneyBoardingParticipantEntity } from '../../../../domain/entities/journey-boarding-participant.entity';

import type { JourneyBoardingEventEntity } from '../../../../domain/entities/journey-boarding-event.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyBoardingRepository } from '../../../../domain/repositories/journey-boarding.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { JourneyBoardingEventPublicId } from '../../../../domain/value-objects/journey-boarding-event-public-id.vo';

import type { JourneyBoardingEventType } from '../../../../domain/value-objects/journey-boarding-event-type.vo';

import type { JourneyBoardingJourneyId } from '../../../../domain/value-objects/journey-boarding-journey-id.vo';

import type { JourneyBoardingMemberPublicId } from '../../../../domain/value-objects/journey-boarding-member-public-id.vo';

import type { JourneyBoardingBookingPublicId } from '../../../../domain/value-objects/journey-boarding-booking-public-id.vo';

import type { JourneyBoardingParticipantPublicId } from '../../../../domain/value-objects/journey-boarding-participant-public-id.vo';

import type { JourneyBoardingParticipantRole } from '../../../../domain/value-objects/journey-boarding-participant-role.vo';

import { JourneyBoardingParticipantStatus } from '../../../../domain/value-objects/journey-boarding-participant-status.vo';

import type { JourneyBoardingProviderPublicId } from '../../../../domain/value-objects/journey-boarding-provider-public-id.vo';

import { JourneyBoardingPublicId } from '../../../../domain/value-objects/journey-boarding-public-id.vo';

import type { JourneyBoardingStatus } from '../../../../domain/value-objects/journey-boarding-status.vo';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import {
  JourneyBoardingPrismaMapper,
  type JourneyBoardingWithComponents,
} from '../../../persistence/prisma/mappers/journey-boarding-prisma.mapper';

// =============================================================================
// Internal ID
// =============================================================================
//
// Journey Boarding has no dedicated domain ID value object.
// Its Entity exposes UniqueEntityId through Entity.id.
//
// This alias therefore resolves to:
//
// UniqueEntityId
//
// and keeps the repository contract aligned with the frozen foundation kernel.
// -----------------------------------------------------------------------------

type JourneyBoardingId = UniqueEntityId;

// =============================================================================
// Repository
// =============================================================================

export class PrismaJourneyBoardingRepository implements JourneyBoardingRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Prisma Enum Boundary
  // ===========================================================================

  private toPrismaJourneyBoardingStatus(
    value: string,
  ): $Enums.JourneyBoardingStatus {
    return value as $Enums.JourneyBoardingStatus;
  }

  private toPrismaJourneyBoardingParticipantRole(
    value: string,
  ): $Enums.JourneyBoardingParticipantRole {
    return value as $Enums.JourneyBoardingParticipantRole;
  }

  private toPrismaJourneyBoardingParticipantStatus(
    value: string,
  ): $Enums.JourneyBoardingParticipantStatus {
    return value as $Enums.JourneyBoardingParticipantStatus;
  }

  private toPrismaJourneyBoardingEventType(
    value: string,
  ): $Enums.JourneyBoardingEventType {
    return value as $Enums.JourneyBoardingEventType;
  }

  // ===========================================================================
  // Include Graph
  // ===========================================================================

  private readonly include = {
    participants: true,
    events: true,
  } satisfies Prisma.JourneyBoardingInclude;

  // ===========================================================================
  // Aggregate Persistence
  // ===========================================================================

  public async save(aggregate: JourneyBoardingAggregate): Promise<void> {
    const persistence = JourneyBoardingPrismaMapper.toPersistence(aggregate);

    await this.prisma.$transaction(async (tx) => {
      const journeyBoardingId = persistence.journeyBoarding.id;

      // -----------------------------------------------------------------------
      // Root
      // -----------------------------------------------------------------------

      await tx.journeyBoarding.upsert({
        where: {
          id: journeyBoardingId,
        },

        create: {
          id: persistence.journeyBoarding.id,
          publicId: persistence.journeyBoarding.publicId,
          journeyId: persistence.journeyBoarding.journeyId,
          providerPublicId: persistence.journeyBoarding.providerPublicId,

          status: this.toPrismaJourneyBoardingStatus(
            persistence.journeyBoarding.status,
          ),

          boardingStartedAt: persistence.journeyBoarding.boardingStartedAt,
          journeyStartedAt: persistence.journeyBoarding.journeyStartedAt,
          cancelledAt: persistence.journeyBoarding.cancelledAt,

          version: persistence.journeyBoarding.version,

          createdAt: persistence.journeyBoarding.createdAt,
          updatedAt: persistence.journeyBoarding.updatedAt,
        },

        update: {
          publicId: persistence.journeyBoarding.publicId,
          journeyId: persistence.journeyBoarding.journeyId,
          providerPublicId: persistence.journeyBoarding.providerPublicId,

          status: this.toPrismaJourneyBoardingStatus(
            persistence.journeyBoarding.status,
          ),

          boardingStartedAt: persistence.journeyBoarding.boardingStartedAt,
          journeyStartedAt: persistence.journeyBoarding.journeyStartedAt,
          cancelledAt: persistence.journeyBoarding.cancelledAt,

          version: persistence.journeyBoarding.version,

          updatedAt: persistence.journeyBoarding.updatedAt,
        },
      });

      // -----------------------------------------------------------------------
      // Participants
      // -----------------------------------------------------------------------

      await tx.journeyBoardingParticipant.deleteMany({
        where: {
          boardingId: journeyBoardingId,
        },
      });

      if (persistence.participants.length > 0) {
        await tx.journeyBoardingParticipant.createMany({
          data: persistence.participants.map((participant) => ({
            id: participant.id,
            publicId: participant.publicId,
            boardingId: participant.boardingId,

            memberPublicId: participant.memberPublicId,
            bookingPublicId: participant.bookingPublicId,

            role: this.toPrismaJourneyBoardingParticipantRole(participant.role),

            status: this.toPrismaJourneyBoardingParticipantStatus(
              participant.status,
            ),

            expectedAt: participant.expectedAt,
            boardedAt: participant.boardedAt,
            withdrawnAt: participant.withdrawnAt,
            noShowAt: participant.noShowAt,
            removedAt: participant.removedAt,

            createdAt: participant.createdAt,
            updatedAt: participant.updatedAt,
          })),
        });
      }

      // -----------------------------------------------------------------------
      // Events
      // -----------------------------------------------------------------------

      await tx.journeyBoardingEvent.deleteMany({
        where: {
          boardingId: journeyBoardingId,
        },
      });

      if (persistence.events.length > 0) {
        await tx.journeyBoardingEvent.createMany({
          data: persistence.events.map((event) => ({
            id: event.id,
            publicId: event.publicId,
            boardingId: event.boardingId,

            type: this.toPrismaJourneyBoardingEventType(event.type),

            memberPublicId: event.memberPublicId,
            bookingPublicId: event.bookingPublicId,
            actorPublicId: event.actorPublicId,

            occurredAt: event.occurredAt,

            // Prisma nullable JSON fields cannot receive JavaScript null.
            metadata:
              event.metadata === null || event.metadata === undefined
                ? Prisma.JsonNull
                : event.metadata,

            createdAt: event.createdAt,
          })),
        });
      }
    });
  }

  // ===========================================================================
  // Aggregate Lookup
  // ===========================================================================

  public async findById(
    id: JourneyBoardingId,
  ): Promise<JourneyBoardingAggregate | null> {
    const record = await this.prisma.journeyBoarding.findUnique({
      where: {
        id: id.value,
      },
      include: this.include,
    });

    return record === null ? null : this.toAggregate(record);
  }

  public async findByPublicId(
    publicId: JourneyBoardingPublicId,
  ): Promise<JourneyBoardingAggregate | null> {
    const record = await this.prisma.journeyBoarding.findUnique({
      where: {
        publicId: publicId.value,
      },
      include: this.include,
    });

    return record === null ? null : this.toAggregate(record);
  }

  // ===========================================================================
  // Root Journey Boarding Queries
  // ===========================================================================

  public async findJourneyBoardingById(
    id: JourneyBoardingId,
  ): Promise<JourneyBoardingEntity | null> {
    const record = await this.prisma.journeyBoarding.findUnique({
      where: {
        id: id.value,
      },
    });

    return record === null
      ? null
      : JourneyBoardingPrismaMapper.boardingToDomain(record);
  }

  public async findJourneyBoardingByPublicId(
    publicId: JourneyBoardingPublicId,
  ): Promise<JourneyBoardingEntity | null> {
    const record = await this.prisma.journeyBoarding.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    return record === null
      ? null
      : JourneyBoardingPrismaMapper.boardingToDomain(record);
  }

  public async findJourneyBoardings(): Promise<JourneyBoardingEntity[]> {
    const records = await this.prisma.journeyBoarding.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      JourneyBoardingPrismaMapper.boardingToDomain(record),
    );
  }

  public async findJourneyBoardingByJourneyId(
    journeyId: JourneyBoardingJourneyId,
  ): Promise<JourneyBoardingEntity | null> {
    const record = await this.prisma.journeyBoarding.findFirst({
      where: {
        journeyId: journeyId.value,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return record === null
      ? null
      : JourneyBoardingPrismaMapper.boardingToDomain(record);
  }

  public async existsByJourneyId(
    journeyId: JourneyBoardingJourneyId,
  ): Promise<boolean> {
    return (
      (await this.prisma.journeyBoarding.count({
        where: {
          journeyId: journeyId.value,
        },
      })) > 0
    );
  }

  public async findJourneyBoardingsByStatus(
    status: JourneyBoardingStatus,
  ): Promise<JourneyBoardingEntity[]> {
    const records = await this.prisma.journeyBoarding.findMany({
      where: {
        status: this.toPrismaJourneyBoardingStatus(status.value),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      JourneyBoardingPrismaMapper.boardingToDomain(record),
    );
  }

  public async findJourneyBoardingsByProviderPublicId(
    providerPublicId: JourneyBoardingProviderPublicId,
  ): Promise<JourneyBoardingEntity[]> {
    const records = await this.prisma.journeyBoarding.findMany({
      where: {
        providerPublicId: providerPublicId.value,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      JourneyBoardingPrismaMapper.boardingToDomain(record),
    );
  }

  public async findJourneyBoardingsByProviderAndStatus(
    providerPublicId: JourneyBoardingProviderPublicId,
    status: JourneyBoardingStatus,
  ): Promise<JourneyBoardingEntity[]> {
    const records = await this.prisma.journeyBoarding.findMany({
      where: {
        providerPublicId: providerPublicId.value,
        status: this.toPrismaJourneyBoardingStatus(status.value),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      JourneyBoardingPrismaMapper.boardingToDomain(record),
    );
  }

  public async findJourneyBoardingsByJourneyAndStatus(
    journeyId: JourneyBoardingJourneyId,
    status: JourneyBoardingStatus,
  ): Promise<JourneyBoardingEntity[]> {
    const records = await this.prisma.journeyBoarding.findMany({
      where: {
        journeyId: journeyId.value,
        status: this.toPrismaJourneyBoardingStatus(status.value),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      JourneyBoardingPrismaMapper.boardingToDomain(record),
    );
  }

  public async findActiveByJourneyId(
    journeyId: JourneyBoardingJourneyId,
  ): Promise<JourneyBoardingAggregate | null> {
    const record = await this.prisma.journeyBoarding.findFirst({
      where: {
        journeyId: journeyId.value,

        // Active excludes terminal states.
        status: {
          notIn: [
            this.toPrismaJourneyBoardingStatus('STARTED'),
            this.toPrismaJourneyBoardingStatus('CANCELLED'),
          ],
        },
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return record === null ? null : this.toAggregate(record);
  }

  public async existsActiveByJourneyId(
    journeyId: JourneyBoardingJourneyId,
  ): Promise<boolean> {
    const count = await this.prisma.journeyBoarding.count({
      where: {
        journeyId: journeyId.value,

        status: {
          notIn: [
            this.toPrismaJourneyBoardingStatus('STARTED'),
            this.toPrismaJourneyBoardingStatus('CANCELLED'),
          ],
        },
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Delete / Exists
  // ===========================================================================

  public async delete(id: JourneyBoardingId): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.journeyBoardingEvent.deleteMany({
        where: {
          boardingId: id.value,
        },
      });

      await tx.journeyBoardingParticipant.deleteMany({
        where: {
          boardingId: id.value,
        },
      });

      await tx.journeyBoarding.delete({
        where: {
          id: id.value,
        },
      });
    });
  }

  public async exists(id: JourneyBoardingId): Promise<boolean> {
    return (
      (await this.prisma.journeyBoarding.count({
        where: {
          id: id.value,
        },
      })) > 0
    );
  }

  public async existsByPublicId(
    publicId: JourneyBoardingPublicId,
  ): Promise<boolean> {
    return (
      (await this.prisma.journeyBoarding.count({
        where: {
          publicId: publicId.value,
        },
      })) > 0
    );
  }

  // ===========================================================================
  // Participant Queries
  // ===========================================================================

  private async getBoardingPublicId(
    journeyBoardingId: JourneyBoardingId,
  ): Promise<JourneyBoardingPublicId | null> {
    const boarding = await this.prisma.journeyBoarding.findUnique({
      where: {
        id: journeyBoardingId.value,
      },
      select: {
        publicId: true,
      },
    });

    return boarding === null
      ? null
      : new JourneyBoardingPublicId(boarding.publicId);
  }

  public async findParticipantById(
    id: UniqueEntityId,
  ): Promise<JourneyBoardingParticipantEntity | null> {
    const record = await this.prisma.journeyBoardingParticipant.findUnique({
      where: {
        id: id.value,
      },
    });

    if (record === null) {
      return null;
    }

    const boardingPublicId = await this.getBoardingPublicId(
      new UniqueEntityId(record.boardingId),
    );

    return boardingPublicId === null
      ? null
      : JourneyBoardingPrismaMapper.toParticipantDomain(
          record,
          boardingPublicId,
        );
  }

  public async findParticipantByPublicId(
    journeyBoardingId: JourneyBoardingId,
    participantPublicId: JourneyBoardingParticipantPublicId,
  ): Promise<JourneyBoardingParticipantEntity | null> {
    const record = await this.prisma.journeyBoardingParticipant.findFirst({
      where: {
        boardingId: journeyBoardingId.value,
        publicId: participantPublicId.value,
      },
    });

    if (record === null) {
      return null;
    }

    const boardingPublicId = await this.getBoardingPublicId(journeyBoardingId);

    return boardingPublicId === null
      ? null
      : JourneyBoardingPrismaMapper.toParticipantDomain(
          record,
          boardingPublicId,
        );
  }

  public async findParticipantByMemberPublicId(
    journeyBoardingId: JourneyBoardingId,
    memberPublicId: JourneyBoardingMemberPublicId,
  ): Promise<JourneyBoardingParticipantEntity | null> {
    const record = await this.prisma.journeyBoardingParticipant.findFirst({
      where: {
        boardingId: journeyBoardingId.value,
        memberPublicId: memberPublicId.value,
      },
    });

    if (record === null) {
      return null;
    }

    const boardingPublicId = await this.getBoardingPublicId(journeyBoardingId);

    return boardingPublicId === null
      ? null
      : JourneyBoardingPrismaMapper.toParticipantDomain(
          record,
          boardingPublicId,
        );
  }

  public async findParticipantByBookingPublicId(
    journeyBoardingId: JourneyBoardingId,
    bookingPublicId: JourneyBoardingBookingPublicId,
  ): Promise<JourneyBoardingParticipantEntity | null> {
    const record = await this.prisma.journeyBoardingParticipant.findFirst({
      where: {
        boardingId: journeyBoardingId.value,
        bookingPublicId: bookingPublicId.value,
      },
    });

    if (record === null) {
      return null;
    }

    const boardingPublicId = await this.getBoardingPublicId(journeyBoardingId);

    return boardingPublicId === null
      ? null
      : JourneyBoardingPrismaMapper.toParticipantDomain(
          record,
          boardingPublicId,
        );
  }

  public async findParticipants(
    journeyBoardingId: JourneyBoardingId,
  ): Promise<JourneyBoardingParticipantEntity[]> {
    const boardingPublicId = await this.getBoardingPublicId(journeyBoardingId);

    if (boardingPublicId === null) {
      return [];
    }

    const records = await this.prisma.journeyBoardingParticipant.findMany({
      where: {
        boardingId: journeyBoardingId.value,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) =>
      JourneyBoardingPrismaMapper.toParticipantDomain(record, boardingPublicId),
    );
  }

  public async findParticipantsByRole(
    journeyBoardingId: JourneyBoardingId,
    role: JourneyBoardingParticipantRole,
  ): Promise<JourneyBoardingParticipantEntity[]> {
    return this.findParticipantsByParticipantFilter(journeyBoardingId, {
      role: this.toPrismaJourneyBoardingParticipantRole(role.value),
    });
  }

  public async findParticipantsByStatus(
    journeyBoardingId: JourneyBoardingId,
    status: JourneyBoardingParticipantStatus,
  ): Promise<JourneyBoardingParticipantEntity[]> {
    return this.findParticipantsByParticipantFilter(journeyBoardingId, {
      status: this.toPrismaJourneyBoardingParticipantStatus(status.value),
    });
  }

  private async findParticipantsByParticipantFilter(
    journeyBoardingId: JourneyBoardingId,
    filter: Prisma.JourneyBoardingParticipantWhereInput,
  ): Promise<JourneyBoardingParticipantEntity[]> {
    const boardingPublicId = await this.getBoardingPublicId(journeyBoardingId);

    if (boardingPublicId === null) {
      return [];
    }

    const records = await this.prisma.journeyBoardingParticipant.findMany({
      where: {
        ...filter,
        boardingId: journeyBoardingId.value,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) =>
      JourneyBoardingPrismaMapper.toParticipantDomain(record, boardingPublicId),
    );
  }

  /**
   * Finds the provider participant within a Journey Boarding.
   */
  public async findProviderParticipant(
    journeyBoardingId: JourneyBoardingId,
  ): Promise<JourneyBoardingParticipantEntity | null> {
    const boarding = await this.prisma.journeyBoarding.findUnique({
      where: {
        id: journeyBoardingId.value,
      },

      select: {
        publicId: true,
      },
    });

    if (boarding === null) {
      return null;
    }

    const record = await this.prisma.journeyBoardingParticipant.findFirst({
      where: {
        boardingId: journeyBoardingId.value,
        role: this.toPrismaJourneyBoardingParticipantRole('PROVIDER'),
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyBoardingPrismaMapper.toParticipantDomain(
      record,
      new JourneyBoardingPublicId(boarding.publicId),
    );
  }

  /**
   * Finds all passenger participants within a Journey Boarding.
   */
  public async findPassengerParticipants(
    journeyBoardingId: JourneyBoardingId,
  ): Promise<JourneyBoardingParticipantEntity[]> {
    const boarding = await this.prisma.journeyBoarding.findUnique({
      where: {
        id: journeyBoardingId.value,
      },

      select: {
        publicId: true,
      },
    });

    if (boarding === null) {
      return [];
    }

    const records = await this.prisma.journeyBoardingParticipant.findMany({
      where: {
        boardingId: journeyBoardingId.value,
        role: this.toPrismaJourneyBoardingParticipantRole('PASSENGER'),
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    const boardingPublicId = new JourneyBoardingPublicId(boarding.publicId);

    return records.map((record) =>
      JourneyBoardingPrismaMapper.toParticipantDomain(record, boardingPublicId),
    );
  }

  public async findParticipantsByMemberPublicId(
    memberPublicId: JourneyBoardingMemberPublicId,
  ): Promise<JourneyBoardingParticipantEntity[]> {
    const records = await this.prisma.journeyBoardingParticipant.findMany({
      where: {
        memberPublicId: memberPublicId.value,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const result: JourneyBoardingParticipantEntity[] = [];

    for (const record of records) {
      const boardingPublicId = await this.getBoardingPublicId(
        new UniqueEntityId(record.boardingId),
      );

      if (boardingPublicId !== null) {
        result.push(
          JourneyBoardingPrismaMapper.toParticipantDomain(
            record,
            boardingPublicId,
          ),
        );
      }
    }

    return result;
  }

  public async findParticipantsByBookingPublicId(
    bookingPublicId: JourneyBoardingBookingPublicId,
  ): Promise<JourneyBoardingParticipantEntity[]> {
    const records = await this.prisma.journeyBoardingParticipant.findMany({
      where: {
        bookingPublicId: bookingPublicId.value,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const result: JourneyBoardingParticipantEntity[] = [];

    for (const record of records) {
      const boardingPublicId = await this.getBoardingPublicId(
        new UniqueEntityId(record.boardingId),
      );

      if (boardingPublicId !== null) {
        result.push(
          JourneyBoardingPrismaMapper.toParticipantDomain(
            record,
            boardingPublicId,
          ),
        );
      }
    }

    return result;
  }

  public async existsParticipant(
    journeyBoardingId: JourneyBoardingId,
    participantPublicId: JourneyBoardingParticipantPublicId,
  ): Promise<boolean> {
    return (
      (await this.prisma.journeyBoardingParticipant.count({
        where: {
          boardingId: journeyBoardingId.value,
          publicId: participantPublicId.value,
        },
      })) > 0
    );
  }

  public async existsParticipantByMemberPublicId(
    journeyBoardingId: JourneyBoardingId,
    memberPublicId: JourneyBoardingMemberPublicId,
  ): Promise<boolean> {
    return (
      (await this.prisma.journeyBoardingParticipant.count({
        where: {
          boardingId: journeyBoardingId.value,
          memberPublicId: memberPublicId.value,
        },
      })) > 0
    );
  }

  public async existsParticipantByBookingPublicId(
    journeyBoardingId: JourneyBoardingId,
    bookingPublicId: JourneyBoardingBookingPublicId,
  ): Promise<boolean> {
    return (
      (await this.prisma.journeyBoardingParticipant.count({
        where: {
          boardingId: journeyBoardingId.value,
          bookingPublicId: bookingPublicId.value,
        },
      })) > 0
    );
  }

  public async countParticipants(
    journeyBoardingId: JourneyBoardingId,
  ): Promise<number> {
    return this.prisma.journeyBoardingParticipant.count({
      where: {
        boardingId: journeyBoardingId.value,
      },
    });
  }

  public async countPassengerParticipants(
    journeyBoardingId: JourneyBoardingId,
  ): Promise<number> {
    return this.prisma.journeyBoardingParticipant.count({
      where: {
        boardingId: journeyBoardingId.value,
        role: this.toPrismaJourneyBoardingParticipantRole('PASSENGER'),
      },
    });
  }

  public async countBoardedParticipants(
    journeyBoardingId: JourneyBoardingId,
  ): Promise<number> {
    return this.prisma.journeyBoardingParticipant.count({
      where: {
        boardingId: journeyBoardingId.value,
        status: this.toPrismaJourneyBoardingParticipantStatus('BOARDED'),
      },
    });
  }

  public async countExpectedParticipants(
    journeyBoardingId: JourneyBoardingId,
  ): Promise<number> {
    return this.prisma.journeyBoardingParticipant.count({
      where: {
        boardingId: journeyBoardingId.value,
        status: this.toPrismaJourneyBoardingParticipantStatus('EXPECTED'),
      },
    });
  }

  public async countWithdrawnParticipants(
    journeyBoardingId: JourneyBoardingId,
  ): Promise<number> {
    return this.prisma.journeyBoardingParticipant.count({
      where: {
        boardingId: journeyBoardingId.value,
        status: this.toPrismaJourneyBoardingParticipantStatus('WITHDRAWN'),
      },
    });
  }

  public async countNoShowParticipants(
    journeyBoardingId: JourneyBoardingId,
  ): Promise<number> {
    return this.prisma.journeyBoardingParticipant.count({
      where: {
        boardingId: journeyBoardingId.value,
        status: this.toPrismaJourneyBoardingParticipantStatus('NO_SHOW'),
      },
    });
  }

  public async countRemovedParticipants(
    journeyBoardingId: JourneyBoardingId,
  ): Promise<number> {
    return this.prisma.journeyBoardingParticipant.count({
      where: {
        boardingId: journeyBoardingId.value,
        status: this.toPrismaJourneyBoardingParticipantStatus('REMOVED'),
      },
    });
  }

  // ===========================================================================
  // Participant State Queries
  // ===========================================================================

  /**
   * Finds participants who have physically boarded.
   */
  public async findBoardedParticipants(
    journeyBoardingId: JourneyBoardingId,
  ): Promise<JourneyBoardingParticipantEntity[]> {
    return this.findParticipantsByStatus(
      journeyBoardingId,
      JourneyBoardingParticipantStatus.boarded(),
    );
  }

  /**
   * Finds participants who are expected to board.
   */
  public async findExpectedParticipants(
    journeyBoardingId: JourneyBoardingId,
  ): Promise<JourneyBoardingParticipantEntity[]> {
    return this.findParticipantsByStatus(
      journeyBoardingId,
      JourneyBoardingParticipantStatus.expected(),
    );
  }

  /**
   * Finds participants who withdrew from boarding.
   */
  public async findWithdrawnParticipants(
    journeyBoardingId: JourneyBoardingId,
  ): Promise<JourneyBoardingParticipantEntity[]> {
    return this.findParticipantsByStatus(
      journeyBoardingId,
      JourneyBoardingParticipantStatus.withdrawn(),
    );
  }

  /**
   * Finds participants who were marked as no-shows.
   */
  public async findNoShowParticipants(
    journeyBoardingId: JourneyBoardingId,
  ): Promise<JourneyBoardingParticipantEntity[]> {
    return this.findParticipantsByStatus(
      journeyBoardingId,
      JourneyBoardingParticipantStatus.noShow(),
    );
  }

  /**
   * Finds participants who were removed from boarding.
   */
  public async findRemovedParticipants(
    journeyBoardingId: JourneyBoardingId,
  ): Promise<JourneyBoardingParticipantEntity[]> {
    return this.findParticipantsByStatus(
      journeyBoardingId,
      JourneyBoardingParticipantStatus.removed(),
    );
  }

  public async isProviderBoarded(
    journeyBoardingId: JourneyBoardingId,
  ): Promise<boolean> {
    return (
      (await this.prisma.journeyBoardingParticipant.count({
        where: {
          boardingId: journeyBoardingId.value,
          role: this.toPrismaJourneyBoardingParticipantRole('PROVIDER'),
          status: this.toPrismaJourneyBoardingParticipantStatus('BOARDED'),
        },
      })) > 0
    );
  }

  public async isPassengerBoarded(
    journeyBoardingId: JourneyBoardingId,
    participantPublicId: JourneyBoardingParticipantPublicId,
  ): Promise<boolean> {
    return (
      (await this.prisma.journeyBoardingParticipant.count({
        where: {
          boardingId: journeyBoardingId.value,
          publicId: participantPublicId.value,
          role: this.toPrismaJourneyBoardingParticipantRole('PASSENGER'),
          status: this.toPrismaJourneyBoardingParticipantStatus('BOARDED'),
        },
      })) > 0
    );
  }

  // ===========================================================================
  // Boarding Event History
  // ===========================================================================

  public async findEventById(
    id: UniqueEntityId,
  ): Promise<JourneyBoardingEventEntity | null> {
    const record = await this.prisma.journeyBoardingEvent.findUnique({
      where: {
        id: id.value,
      },
    });

    if (record === null) {
      return null;
    }

    const boardingPublicId = await this.getBoardingPublicId(
      new UniqueEntityId(record.boardingId),
    );

    return boardingPublicId === null
      ? null
      : JourneyBoardingPrismaMapper.toEventDomain(record, boardingPublicId);
  }

  public async findEventByPublicId(
    journeyBoardingId: JourneyBoardingId,
    eventPublicId: JourneyBoardingEventPublicId,
  ): Promise<JourneyBoardingEventEntity | null> {
    const record = await this.prisma.journeyBoardingEvent.findFirst({
      where: {
        boardingId: journeyBoardingId.value,
        publicId: eventPublicId.value,
      },
    });

    if (record === null) {
      return null;
    }

    const boardingPublicId = await this.getBoardingPublicId(journeyBoardingId);

    return boardingPublicId === null
      ? null
      : JourneyBoardingPrismaMapper.toEventDomain(record, boardingPublicId);
  }

  public async findEvents(
    journeyBoardingId: JourneyBoardingId,
  ): Promise<JourneyBoardingEventEntity[]> {
    const boardingPublicId = await this.getBoardingPublicId(journeyBoardingId);

    if (boardingPublicId === null) {
      return [];
    }

    const records = await this.prisma.journeyBoardingEvent.findMany({
      where: {
        boardingId: journeyBoardingId.value,
      },
      orderBy: [
        {
          occurredAt: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ],
    });

    return records.map((record) =>
      JourneyBoardingPrismaMapper.toEventDomain(record, boardingPublicId),
    );
  }

  public async findEventsByJourneyId(
    journeyId: JourneyBoardingJourneyId,
  ): Promise<JourneyBoardingEventEntity[]> {
    const records = await this.prisma.journeyBoardingEvent.findMany({
      where: {
        boarding: {
          journeyId: journeyId.value,
        },
      },

      include: {
        boarding: {
          select: {
            publicId: true,
          },
        },
      },

      orderBy: [
        {
          occurredAt: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ],
    });

    return records.map((record) =>
      JourneyBoardingPrismaMapper.toEventDomain(
        record,
        new JourneyBoardingPublicId(record.boarding.publicId),
      ),
    );
  }

  public async findEventsByParticipantPublicId(
    participantPublicId: JourneyBoardingParticipantPublicId,
  ): Promise<JourneyBoardingEventEntity[]> {
    const records = await this.prisma.journeyBoardingEvent.findMany({
      where: {
        memberPublicId: {
          in: await this.findMemberIdsForParticipant(participantPublicId),
        },
      },

      include: {
        boarding: {
          select: {
            publicId: true,
          },
        },
      },

      orderBy: [
        {
          occurredAt: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ],
    });

    return records.map((record) =>
      JourneyBoardingPrismaMapper.toEventDomain(
        record,
        new JourneyBoardingPublicId(record.boarding.publicId),
      ),
    );
  }

  private async findMemberIdsForParticipant(
    participantPublicId: JourneyBoardingParticipantPublicId,
  ): Promise<string[]> {
    const participants = await this.prisma.journeyBoardingParticipant.findMany({
      where: {
        publicId: participantPublicId.value,
      },
      select: {
        memberPublicId: true,
      },
    });

    return participants
      .map((participant) => participant.memberPublicId)
      .filter((value): value is string => value !== null);
  }

  public async findEventsByMemberPublicId(
    memberPublicId: JourneyBoardingMemberPublicId,
  ): Promise<JourneyBoardingEventEntity[]> {
    const records = await this.prisma.journeyBoardingEvent.findMany({
      where: {
        memberPublicId: memberPublicId.value,
      },

      include: {
        boarding: {
          select: {
            publicId: true,
          },
        },
      },

      orderBy: [
        {
          occurredAt: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ],
    });

    return records.map((record) =>
      JourneyBoardingPrismaMapper.toEventDomain(
        record,
        new JourneyBoardingPublicId(record.boarding.publicId),
      ),
    );
  }

  public async findEventsByBookingPublicId(
    bookingPublicId: JourneyBoardingBookingPublicId,
  ): Promise<JourneyBoardingEventEntity[]> {
    const records = await this.prisma.journeyBoardingEvent.findMany({
      where: {
        bookingPublicId: bookingPublicId.value,
      },

      include: {
        boarding: {
          select: {
            publicId: true,
          },
        },
      },

      orderBy: [
        {
          occurredAt: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ],
    });

    return records.map((record) =>
      JourneyBoardingPrismaMapper.toEventDomain(
        record,
        new JourneyBoardingPublicId(record.boarding.publicId),
      ),
    );
  }

  public async findEventsByType(
    journeyBoardingId: JourneyBoardingId,
    eventType: JourneyBoardingEventType,
  ): Promise<JourneyBoardingEventEntity[]> {
    const boardingPublicId = await this.getBoardingPublicId(journeyBoardingId);

    if (boardingPublicId === null) {
      return [];
    }

    const records = await this.prisma.journeyBoardingEvent.findMany({
      where: {
        boardingId: journeyBoardingId.value,
        type: this.toPrismaJourneyBoardingEventType(eventType.value),
      },

      orderBy: [
        {
          occurredAt: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ],
    });

    return records.map((record) =>
      JourneyBoardingPrismaMapper.toEventDomain(record, boardingPublicId),
    );
  }

  public async existsEvent(
    journeyBoardingId: JourneyBoardingId,
    eventPublicId: JourneyBoardingEventPublicId,
  ): Promise<boolean> {
    return (
      (await this.prisma.journeyBoardingEvent.count({
        where: {
          boardingId: journeyBoardingId.value,
          publicId: eventPublicId.value,
        },
      })) > 0
    );
  }

  public async countEvents(
    journeyBoardingId: JourneyBoardingId,
  ): Promise<number> {
    return this.prisma.journeyBoardingEvent.count({
      where: {
        boardingId: journeyBoardingId.value,
      },
    });
  }

  // ===========================================================================
  // Aggregate Reconstruction
  // ===========================================================================

  private toAggregate(
    record: JourneyBoardingWithComponents,
  ): JourneyBoardingAggregate {
    return JourneyBoardingPrismaMapper.toDomain(record);
  }
}
