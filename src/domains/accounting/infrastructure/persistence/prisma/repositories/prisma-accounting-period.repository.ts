// -----------------------------------------------------------------------------
// Accounting Period — Prisma Repository
// -----------------------------------------------------------------------------
//
// Prisma implementation of the AccountingPeriodRepository.
//
// Aggregate:
//
// AccountingPeriodAggregate
// └── AccountingPeriodEntity
//
// Persistence:
//
// AccountingPeriod
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - persist Accounting Period aggregates;
// - retrieve Accounting Period aggregates;
// - retrieve Accounting Period entities;
// - query periods by identity;
// - query periods by name;
// - query periods by lifecycle status;
// - query usable periods;
// - query journal-accepting periods;
// - query journal-rejecting periods;
// - query periods by date boundaries;
// - query periods by closure state;
// - query periods by audit timestamps;
// - execute existence checks.
//
// -----------------------------------------------------------------------------
//
// This repository contains persistence concerns only.
//
// It does NOT:
//
// - create journals;
// - modify journals;
// - post journals;
// - reverse journals;
// - calculate balances;
// - validate journal balancing;
// - load AccountingJournal aggregates;
// - validate other aggregate existence;
// - enforce authorization;
// - orchestrate application workflows;
// - publish domain events;
// - communicate with external systems.
//
// -----------------------------------------------------------------------------
//
// Aggregate boundary:
//
// AccountingPeriodAggregate
// └── AccountingPeriodEntity
//
// AccountingPeriodEntity is the sole entity owned by this aggregate.
//
// -----------------------------------------------------------------------------
//
// Journal relationship:
//
// AccountingPeriod has a Prisma relation:
//
//     journals AccountingJournal[]
//
// This relation is intentionally NOT loaded.
//
// Journals belong to the AccountingJournal aggregate.
//
// The repository therefore always retrieves AccountingPeriod independently
// from AccountingJournal.
//
// -----------------------------------------------------------------------------
//
// Date semantics:
//
// AccountingPeriodEntity.contains() uses inclusive boundaries:
//
//     startsAt <= date <= endsAt
//
// This repository therefore uses:
//
//     startsAt <= date
//     endsAt   >= date
//
// for containment.
//
// Range overlap follows the same inclusive-boundary semantics:
//
//     period.startsAt <= requestedEndsAt
//     period.endsAt   >= requestedStartsAt
//
// -----------------------------------------------------------------------------
//
// Closure semantics:
//
// OPEN:
//
// - usable;
// - can accept journals;
// - not closed;
// - closedAt is null.
//
// CLOSED:
//
// - not usable;
// - cannot accept journals;
// - closedAt is non-null.
//
// CLOSED is terminal at the domain level.
//
// -----------------------------------------------------------------------------
//
// Persistence:
//
// Domain ↔ Prisma transformation is delegated to:
//
//     AccountingPeriodPrismaMapper
//
// Prisma-specific persistence operations remain in this repository.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { AccountingPeriod as PrismaAccountingPeriod } from '@prisma/client';

import { PrismaService } from '../../../../../../infrastructure/database/prisma/prisma.service';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type { AccountingPeriodRepository } from '../../../../domain/repositories/accounting-period.repository';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { AccountingPeriodAggregate } from '../../../../domain/aggregates/accounting-period.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { AccountingPeriodEntity } from '../../../../domain/entities/accounting-period.entity';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import { AccountingPeriodPrismaMapper } from '../mappers/accounting-period-prisma.mapper';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { AccountingPeriodName } from '../../../../domain/value-objects/accounting-period-name.vo';

import type { AccountingPeriodPublicId } from '../../../../domain/value-objects/accounting-period-public-id.vo';

import type { AccountingPeriodStatus } from '../../../../domain/value-objects/accounting-period-status.vo';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// =============================================================================
// Repository
// =============================================================================

@Injectable()
export class PrismaAccountingPeriodRepository implements AccountingPeriodRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  /**
   * Prisma access is provided through the application's NestJS-managed
   * PrismaService.
   */
  public constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists an Accounting Period aggregate.
   *
   * The aggregate owns exactly one AccountingPeriodEntity, therefore one
   * AccountingPeriod Prisma record is persisted.
   */
  public async save(aggregate: AccountingPeriodAggregate): Promise<void> {
    this.ensureAggregate(aggregate, 'Accounting Period aggregate is required.');

    const persistence = AccountingPeriodPrismaMapper.toPersistence(aggregate);

    await this.prisma.accountingPeriod.upsert({
      where: {
        id: persistence.period.id,
      },

      create: {
        id: persistence.period.id,
        publicId: persistence.period.publicId,

        name: persistence.period.name,

        startsAt: persistence.period.startsAt,
        endsAt: persistence.period.endsAt,

        status: persistence.period.status,

        closedAt: persistence.period.closedAt,

        createdAt: persistence.period.createdAt,

        updatedAt: persistence.period.updatedAt,
      },

      update: {
        publicId: persistence.period.publicId,

        name: persistence.period.name,

        startsAt: persistence.period.startsAt,
        endsAt: persistence.period.endsAt,

        status: persistence.period.status,

        closedAt: persistence.period.closedAt,

        updatedAt: persistence.period.updatedAt,
      },
    });
  }

  /**
   * Deletes an Accounting Period aggregate.
   *
   * The Prisma relation to AccountingJournal uses Restrict, so deletion may
   * be rejected by the database when journals reference this period.
   *
   * The repository does not perform that cross-aggregate validation itself.
   */
  public async delete(aggregate: AccountingPeriodAggregate): Promise<void> {
    this.ensureAggregate(aggregate, 'Accounting Period aggregate is required.');

    await this.prisma.accountingPeriod.delete({
      where: {
        id: aggregate.id.toString(),
      },
    });
  }

  // ===========================================================================
  // Aggregate Queries — Identity
  // ===========================================================================

  /**
   * Finds an Accounting Period aggregate by public identity.
   */
  public async findByPublicId(
    publicId: AccountingPeriodPublicId,
  ): Promise<AccountingPeriodAggregate | null> {
    this.ensurePublicId(publicId);

    const record = await this.findRecordByPublicId(publicId.value);

    return record === null ? null : this.toAggregate(record);
  }

  /**
   * Finds an Accounting Period aggregate by internal identity.
   */
  public async findById(
    id: UniqueEntityId,
  ): Promise<AccountingPeriodAggregate | null> {
    this.ensureId(id, 'Accounting Period internal identifier is required.');

    const record = await this.prisma.accountingPeriod.findUnique({
      where: {
        id: id.toString(),
      },
    });

    return record === null ? null : this.toAggregate(record);
  }

  // ===========================================================================
  // Aggregate Queries — Natural Attributes
  // ===========================================================================

  /**
   * Finds Accounting Period aggregates by name.
   *
   * Period names are not unique in the Prisma schema.
   *
   * Results are ordered by start date and then creation date for deterministic
   * behaviour.
   */
  public async findByName(
    name: AccountingPeriodName,
  ): Promise<AccountingPeriodAggregate[]> {
    this.ensureName(name);

    const records = await this.prisma.accountingPeriod.findMany({
      where: {
        name: name.value,
      },

      orderBy: [
        {
          startsAt: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ],
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Entity Queries
  // ===========================================================================

  /**
   * Finds an Accounting Period entity by public identity.
   */
  public async findEntityByPublicId(
    publicId: AccountingPeriodPublicId,
  ): Promise<AccountingPeriodEntity | null> {
    this.ensurePublicId(publicId);

    const record = await this.findRecordByPublicId(publicId.value);

    return record === null ? null : this.toEntity(record);
  }

  /**
   * Finds an Accounting Period entity by internal identity.
   */
  public async findEntityById(
    id: UniqueEntityId,
  ): Promise<AccountingPeriodEntity | null> {
    this.ensureId(id, 'Accounting Period internal identifier is required.');

    const record = await this.prisma.accountingPeriod.findUnique({
      where: {
        id: id.toString(),
      },
    });

    return record === null ? null : this.toEntity(record);
  }

  /**
   * Finds Accounting Period entities by name.
   */
  public async findEntitiesByName(
    name: AccountingPeriodName,
  ): Promise<AccountingPeriodEntity[]> {
    this.ensureName(name);

    const records = await this.prisma.accountingPeriod.findMany({
      where: {
        name: name.value,
      },

      orderBy: [
        {
          startsAt: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ],
    });

    return records.map((record) => this.toEntity(record));
  }

  // ===========================================================================
  // Status Queries
  // ===========================================================================

  /**
   * Finds all OPEN Accounting Period aggregates.
   */
  public async findOpen(): Promise<AccountingPeriodAggregate[]> {
    return this.findByStatusValue('OPEN');
  }

  /**
   * Finds all CLOSED Accounting Period aggregates.
   */
  public async findClosed(): Promise<AccountingPeriodAggregate[]> {
    return this.findByStatusValue('CLOSED');
  }

  /**
   * Finds Accounting Period aggregates by explicit lifecycle status.
   */
  public async findByStatus(
    status: AccountingPeriodStatus,
  ): Promise<AccountingPeriodAggregate[]> {
    this.ensureStatus(status);

    return this.findByStatusValue(status.value);
  }

  /**
   * Finds all currently usable Accounting Period aggregates.
   *
   * According to AccountingPeriodEntity.isUsable(), an OPEN period is usable.
   */
  public async findUsable(): Promise<AccountingPeriodAggregate[]> {
    return this.findByStatusValue('OPEN');
  }

  /**
   * Finds all periods capable of accepting accounting journals.
   *
   * According to AccountingPeriodEntity.canAcceptJournals(), an OPEN period
   * can accept journals.
   */
  public async findJournalAccepting(): Promise<AccountingPeriodAggregate[]> {
    return this.findByStatusValue('OPEN');
  }

  /**
   * Finds all periods that cannot currently accept journals.
   *
   * CLOSED is the only persisted lifecycle state other than OPEN.
   */
  public async findJournalRejecting(): Promise<AccountingPeriodAggregate[]> {
    return this.findByStatusValue('CLOSED');
  }

  // ===========================================================================
  // Date Boundary Queries
  // ===========================================================================

  /**
   * Finds periods containing the supplied date.
   *
   * Boundary semantics match AccountingPeriodEntity.contains():
   *
   *     startsAt <= date <= endsAt
   */
  public async findContainingDate(
    date: Date,
  ): Promise<AccountingPeriodAggregate[]> {
    this.ensureDate(date, 'Accounting Period date is required.');

    const records = await this.prisma.accountingPeriod.findMany({
      where: {
        startsAt: {
          lte: date,
        },

        endsAt: {
          gte: date,
        },
      },

      orderBy: [
        {
          startsAt: 'asc',
        },
        {
          endsAt: 'asc',
        },
      ],
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds the Accounting Period containing the supplied date.
   *
   * If multiple periods contain the date, the period with the earliest
   * start date is returned.
   *
   * The repository does not enforce the non-overlap invariant.
   */
  public async findPeriodContainingDate(
    date: Date,
  ): Promise<AccountingPeriodAggregate | null> {
    this.ensureDate(date, 'Accounting Period date is required.');

    const record = await this.prisma.accountingPeriod.findFirst({
      where: {
        startsAt: {
          lte: date,
        },

        endsAt: {
          gte: date,
        },
      },

      orderBy: [
        {
          startsAt: 'asc',
        },
        {
          endsAt: 'asc',
        },
      ],
    });

    return record === null ? null : this.toAggregate(record);
  }

  /**
   * Finds periods beginning after the supplied date.
   */
  public async findStartingAfter(
    date: Date,
  ): Promise<AccountingPeriodAggregate[]> {
    this.ensureDate(date, 'Starting-after date is required.');

    const records = await this.prisma.accountingPeriod.findMany({
      where: {
        startsAt: {
          gt: date,
        },
      },

      orderBy: [
        {
          startsAt: 'asc',
        },
        {
          endsAt: 'asc',
        },
      ],
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds periods beginning before the supplied date.
   */
  public async findStartingBefore(
    date: Date,
  ): Promise<AccountingPeriodAggregate[]> {
    this.ensureDate(date, 'Starting-before date is required.');

    const records = await this.prisma.accountingPeriod.findMany({
      where: {
        startsAt: {
          lt: date,
        },
      },

      orderBy: [
        {
          startsAt: 'desc',
        },
        {
          endsAt: 'desc',
        },
      ],
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds periods ending after the supplied date.
   */
  public async findEndingAfter(
    date: Date,
  ): Promise<AccountingPeriodAggregate[]> {
    this.ensureDate(date, 'Ending-after date is required.');

    const records = await this.prisma.accountingPeriod.findMany({
      where: {
        endsAt: {
          gt: date,
        },
      },

      orderBy: [
        {
          endsAt: 'asc',
        },
        {
          startsAt: 'asc',
        },
      ],
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds periods ending before the supplied date.
   */
  public async findEndingBefore(
    date: Date,
  ): Promise<AccountingPeriodAggregate[]> {
    this.ensureDate(date, 'Ending-before date is required.');

    const records = await this.prisma.accountingPeriod.findMany({
      where: {
        endsAt: {
          lt: date,
        },
      },

      orderBy: [
        {
          endsAt: 'desc',
        },
        {
          startsAt: 'desc',
        },
      ],
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds periods whose boundaries overlap the supplied range.
   *
   * Inclusive overlap semantics:
   *
   *     period.startsAt <= endsAt
   *     period.endsAt   >= startsAt
   */
  public async findOverlapping(
    startsAt: Date,
    endsAt: Date,
  ): Promise<AccountingPeriodAggregate[]> {
    this.ensureDate(
      startsAt,
      'Accounting Period range start date is required.',
    );

    this.ensureDate(endsAt, 'Accounting Period range end date is required.');

    this.ensureValidRange(startsAt, endsAt);

    const records = await this.prisma.accountingPeriod.findMany({
      where: {
        startsAt: {
          lte: endsAt,
        },

        endsAt: {
          gte: startsAt,
        },
      },

      orderBy: [
        {
          startsAt: 'asc',
        },
        {
          endsAt: 'asc',
        },
      ],
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Closure Queries
  // ===========================================================================

  /**
   * Finds periods closed after the supplied timestamp.
   *
   * CLOSED periods always have a non-null closedAt according to the domain
   * invariant.
   */
  public async findClosedAfter(
    closedAfter: Date,
  ): Promise<AccountingPeriodAggregate[]> {
    this.ensureDate(closedAfter, 'Closed-after timestamp is required.');

    const records = await this.prisma.accountingPeriod.findMany({
      where: {
        status: 'CLOSED',

        closedAt: {
          not: null,
          gt: closedAfter,
        },
      },

      orderBy: {
        closedAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds periods closed before the supplied timestamp.
   */
  public async findClosedBefore(
    closedBefore: Date,
  ): Promise<AccountingPeriodAggregate[]> {
    this.ensureDate(closedBefore, 'Closed-before timestamp is required.');

    const records = await this.prisma.accountingPeriod.findMany({
      where: {
        status: 'CLOSED',

        closedAt: {
          not: null,
          lt: closedBefore,
        },
      },

      orderBy: {
        closedAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds periods that have not yet been closed.
   *
   * This is equivalent to OPEN periods under the AccountingPeriod lifecycle.
   */
  public async findUnclosed(): Promise<AccountingPeriodAggregate[]> {
    return this.findByStatusValue('OPEN');
  }

  // ===========================================================================
  // Audit Queries
  // ===========================================================================

  /**
   * Finds periods created after the supplied timestamp.
   */
  public async findCreatedAfter(
    createdAfter: Date,
  ): Promise<AccountingPeriodAggregate[]> {
    this.ensureDate(createdAfter, 'Created-after timestamp is required.');

    const records = await this.prisma.accountingPeriod.findMany({
      where: {
        createdAt: {
          gt: createdAfter,
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds periods created before the supplied timestamp.
   */
  public async findCreatedBefore(
    createdBefore: Date,
  ): Promise<AccountingPeriodAggregate[]> {
    this.ensureDate(createdBefore, 'Created-before timestamp is required.');

    const records = await this.prisma.accountingPeriod.findMany({
      where: {
        createdAt: {
          lt: createdBefore,
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds periods updated after the supplied timestamp.
   */
  public async findUpdatedAfter(
    updatedAfter: Date,
  ): Promise<AccountingPeriodAggregate[]> {
    this.ensureDate(updatedAfter, 'Updated-after timestamp is required.');

    const records = await this.prisma.accountingPeriod.findMany({
      where: {
        updatedAt: {
          gt: updatedAfter,
        },
      },

      orderBy: {
        updatedAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds periods updated before the supplied timestamp.
   */
  public async findUpdatedBefore(
    updatedBefore: Date,
  ): Promise<AccountingPeriodAggregate[]> {
    this.ensureDate(updatedBefore, 'Updated-before timestamp is required.');

    const records = await this.prisma.accountingPeriod.findMany({
      where: {
        updatedAt: {
          lt: updatedBefore,
        },
      },

      orderBy: {
        updatedAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds all periods ordered by start date.
   *
   * Ordering is ascending.
   */
  public async findAllOrderedByStartsAt(): Promise<
    AccountingPeriodAggregate[]
  > {
    const records = await this.prisma.accountingPeriod.findMany({
      orderBy: [
        {
          startsAt: 'asc',
        },
        {
          endsAt: 'asc',
        },
      ],
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds all periods ordered by end date.
   *
   * Ordering is ascending.
   */
  public async findAllOrderedByEndsAt(): Promise<AccountingPeriodAggregate[]> {
    const records = await this.prisma.accountingPeriod.findMany({
      orderBy: [
        {
          endsAt: 'asc',
        },
        {
          startsAt: 'asc',
        },
      ],
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds all periods ordered by creation timestamp.
   *
   * Ordering is newest first.
   */
  public async findAllOrderedByCreatedAt(): Promise<
    AccountingPeriodAggregate[]
  > {
    const records = await this.prisma.accountingPeriod.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Existence Queries — Identity
  // ===========================================================================

  /**
   * Determines whether a period exists by public identity.
   */
  public async existsByPublicId(
    publicId: AccountingPeriodPublicId,
  ): Promise<boolean> {
    this.ensurePublicId(publicId);

    const record = await this.prisma.accountingPeriod.findUnique({
      where: {
        publicId: publicId.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Determines whether a period exists by internal identity.
   */
  public async existsById(id: UniqueEntityId): Promise<boolean> {
    this.ensureId(id, 'Accounting Period internal identifier is required.');

    const record = await this.prisma.accountingPeriod.findUnique({
      where: {
        id: id.toString(),
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Existence Queries — Natural Attributes
  // ===========================================================================

  /**
   * Determines whether one or more periods exist with the supplied name.
   */
  public async existsByName(name: AccountingPeriodName): Promise<boolean> {
    this.ensureName(name);

    const record = await this.prisma.accountingPeriod.findFirst({
      where: {
        name: name.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Existence Queries — Status
  // ===========================================================================

  /**
   * Determines whether any period exists with the supplied status.
   */
  public async existsByStatus(
    status: AccountingPeriodStatus,
  ): Promise<boolean> {
    this.ensureStatus(status);

    return this.existsByStatusValue(status.value);
  }

  /**
   * Determines whether at least one OPEN period exists.
   */
  public async existsOpen(): Promise<boolean> {
    return this.existsByStatusValue('OPEN');
  }

  /**
   * Determines whether at least one CLOSED period exists.
   */
  public async existsClosed(): Promise<boolean> {
    return this.existsByStatusValue('CLOSED');
  }

  /**
   * Determines whether at least one usable period exists.
   */
  public async existsUsable(): Promise<boolean> {
    return this.existsByStatusValue('OPEN');
  }

  /**
   * Determines whether at least one period can accept journals.
   */
  public async existsJournalAccepting(): Promise<boolean> {
    return this.existsByStatusValue('OPEN');
  }

  // ===========================================================================
  // Existence Queries — Date Boundaries
  // ===========================================================================

  /**
   * Determines whether a period contains the supplied date.
   *
   * Inclusive boundary semantics match AccountingPeriodEntity.contains().
   */
  public async existsContainingDate(date: Date): Promise<boolean> {
    this.ensureDate(date, 'Accounting Period date is required.');

    const record = await this.prisma.accountingPeriod.findFirst({
      where: {
        startsAt: {
          lte: date,
        },

        endsAt: {
          gte: date,
        },
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Determines whether any period overlaps the supplied date range.
   *
   * Inclusive overlap semantics are used.
   */
  public async existsOverlapping(
    startsAt: Date,
    endsAt: Date,
  ): Promise<boolean> {
    this.ensureDate(
      startsAt,
      'Accounting Period range start date is required.',
    );

    this.ensureDate(endsAt, 'Accounting Period range end date is required.');

    this.ensureValidRange(startsAt, endsAt);

    const record = await this.prisma.accountingPeriod.findFirst({
      where: {
        startsAt: {
          lte: endsAt,
        },

        endsAt: {
          gte: startsAt,
        },
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Private — Prisma Queries
  // ===========================================================================

  /**
   * Finds an AccountingPeriod Prisma record by public identifier.
   */
  private async findRecordByPublicId(
    publicId: string,
  ): Promise<PrismaAccountingPeriod | null> {
    return this.prisma.accountingPeriod.findUnique({
      where: {
        publicId,
      },
    });
  }

  // ===========================================================================
  // Private — Mapping
  // ===========================================================================

  /**
   * Converts a Prisma AccountingPeriod record into an aggregate.
   *
   * No journals are loaded because AccountingPeriod does not own journal
   * entities.
   */
  private toAggregate(
    record: PrismaAccountingPeriod,
  ): AccountingPeriodAggregate {
    return AccountingPeriodPrismaMapper.toDomain(record);
  }

  /**
   * Converts a Prisma AccountingPeriod record into its domain entity.
   */
  private toEntity(record: PrismaAccountingPeriod): AccountingPeriodEntity {
    return AccountingPeriodPrismaMapper.toDomainComponent(record);
  }

  // ===========================================================================
  // Private — Status Helpers
  // ===========================================================================

  /**
   * Finds periods by persisted lifecycle status.
   */
  private async findByStatusValue(
    status: PrismaAccountingPeriod['status'],
  ): Promise<AccountingPeriodAggregate[]> {
    const records = await this.prisma.accountingPeriod.findMany({
      where: {
        status,
      },

      orderBy: [
        {
          startsAt: 'asc',
        },
        {
          endsAt: 'asc',
        },
      ],
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Checks whether at least one period exists with the supplied status.
   */
  private async existsByStatusValue(
    status: PrismaAccountingPeriod['status'],
  ): Promise<boolean> {
    const record = await this.prisma.accountingPeriod.findFirst({
      where: {
        status,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Private — Validation
  // ===========================================================================

  /**
   * Ensures an aggregate is present.
   */
  private ensureAggregate(
    value: AccountingPeriodAggregate,
    message: string,
  ): void {
    if (value === undefined || value === null) {
      throw new Error(message);
    }
  }

  /**
   * Ensures an internal identifier is present.
   */
  private ensureId(value: UniqueEntityId, message: string): void {
    if (value === undefined || value === null) {
      throw new Error(message);
    }
  }

  /**
   * Ensures a public identifier is present.
   */
  private ensurePublicId(value: AccountingPeriodPublicId): void {
    if (value === undefined || value === null) {
      throw new Error('Accounting Period public identifier is required.');
    }
  }

  /**
   * Ensures an Accounting Period name is present.
   */
  private ensureName(value: AccountingPeriodName): void {
    if (value === undefined || value === null) {
      throw new Error('Accounting Period name is required.');
    }
  }

  /**
   * Ensures an Accounting Period status is present.
   */
  private ensureStatus(value: AccountingPeriodStatus): void {
    if (value === undefined || value === null) {
      throw new Error('Accounting Period status is required.');
    }
  }

  /**
   * Ensures a supplied date is valid.
   */
  private ensureDate(value: Date, message: string): void {
    if (
      value === undefined ||
      value === null ||
      !(value instanceof Date) ||
      !Number.isFinite(value.getTime())
    ) {
      throw new Error(message);
    }
  }

  /**
   * Ensures a supplied period/range has a valid ordering.
   *
   * The domain entity requires:
   *
   *     startsAt < endsAt
   */
  private ensureValidRange(startsAt: Date, endsAt: Date): void {
    if (startsAt.getTime() >= endsAt.getTime()) {
      throw new Error(
        'Accounting Period range start date must be before its end date.',
      );
    }
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default PrismaAccountingPeriodRepository;
