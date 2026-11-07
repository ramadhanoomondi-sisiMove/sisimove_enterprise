// -----------------------------------------------------------------------------
// Accounting Calendar — Prisma Repository
// -----------------------------------------------------------------------------
//
// Prisma implementation of the AccountingCalendarRepository.
//
// Aggregate:
//
// AccountingCalendarAggregate
// └── AccountingCalendarEntity
//
// Persistence:
//
// AccountingCalendar
//
// Responsibilities:
//
// - persist Accounting Calendar aggregates;
// - retrieve calendars by public identity;
// - retrieve calendars by internal identity;
// - retrieve calendars by unique code;
// - query calendars by lifecycle status;
// - query active and inactive calendars;
// - execute existence checks.
//
// Calendar configuration is immutable after creation.
//
// Updates may change lifecycle status and audit timestamps only.
//
// This repository contains persistence concerns only.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { AccountingCalendar as PrismaAccountingCalendar } from '@prisma/client';

import {
  PrismaTransactionContext,
  type PrismaClientLike,
} from '../../../../../../infrastructure/database/prisma/prisma-transaction.context';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type { AccountingCalendarRepository } from '../../../../domain/repositories/accounting-calendar.repository';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { AccountingCalendarAggregate } from '../../../../domain/aggregates/accounting-calendar.aggregate';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import { AccountingCalendarPrismaMapper } from '../mappers/accounting-calendar-prisma.mapper';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { AccountingCalendarPublicId } from '../../../../domain/value-objects/accounting-calendar-public-id.vo';

import type { AccountingCalendarCode } from '../../../../domain/value-objects/accounting-calendar-code.vo';

import type { AccountingCalendarStatus } from '../../../../domain/value-objects/accounting-calendar-status.vo';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// =============================================================================
// Repository
// =============================================================================

@Injectable()
export class PrismaAccountingCalendarRepository implements AccountingCalendarRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  /**
   * Prisma access is provided through the ambient UnitOfWork transaction
   * when one exists, or the root PrismaService otherwise.
   */
  public constructor(
    private readonly transactionContext: PrismaTransactionContext,
  ) {}

  /**
   * Resolves the active Prisma client for the current asynchronous context.
   */
  private get prisma(): PrismaClientLike {
    return this.transactionContext.getClient();
  }

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists an Accounting Calendar aggregate.
   *
   * New calendars are inserted with their complete configuration.
   *
   * Existing calendars have only their lifecycle status and updatedAt
   * timestamp persisted. Their configuration is never overwritten.
   */
  public async save(aggregate: AccountingCalendarAggregate): Promise<void> {
    this.ensureAggregate(aggregate);

    const persistence = AccountingCalendarPrismaMapper.toPersistence(aggregate);

    await this.prisma.accountingCalendar.upsert({
      where: {
        id: persistence.calendar.id,
      },

      create: {
        id: persistence.calendar.id,
        publicId: persistence.calendar.publicId,

        code: persistence.calendar.code,
        name: persistence.calendar.name,

        timezone: persistence.calendar.timezone,
        fiscalYearStartMonth: persistence.calendar.fiscalYearStartMonth,

        frequency: persistence.calendar.frequency,
        status: persistence.calendar.status,

        createdAt: persistence.calendar.createdAt,
        updatedAt: persistence.calendar.updatedAt,
      },

      update: {
        status: persistence.calendar.status,
        updatedAt: persistence.calendar.updatedAt,
      },
    });
  }

  // ===========================================================================
  // Aggregate Queries — Identity
  // ===========================================================================

  /**
   * Finds a calendar by public identity.
   */
  public async findByPublicId(
    publicId: AccountingCalendarPublicId,
  ): Promise<AccountingCalendarAggregate | null> {
    this.ensurePublicId(publicId);

    const record = await this.prisma.accountingCalendar.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    return record === null ? null : this.toAggregate(record);
  }

  /**
   * Finds a calendar by internal identity.
   */
  public async findById(
    id: UniqueEntityId,
  ): Promise<AccountingCalendarAggregate | null> {
    this.ensureId(id);

    const record = await this.prisma.accountingCalendar.findUnique({
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
   * Finds a calendar by its unique code.
   */
  public async findByCode(
    code: AccountingCalendarCode,
  ): Promise<AccountingCalendarAggregate | null> {
    this.ensureCode(code);

    const record = await this.prisma.accountingCalendar.findUnique({
      where: {
        code: code.value,
      },
    });

    return record === null ? null : this.toAggregate(record);
  }

  // ===========================================================================
  // Status Queries
  // ===========================================================================

  /**
   * Finds calendars by explicit lifecycle status.
   */
  public async findByStatus(
    status: AccountingCalendarStatus,
  ): Promise<AccountingCalendarAggregate[]> {
    this.ensureStatus(status);

    return this.findByStatusValue(status.value);
  }

  /**
   * Finds all active calendars.
   */
  public async findActive(): Promise<AccountingCalendarAggregate[]> {
    return this.findByStatusValue('ACTIVE');
  }

  /**
   * Finds all inactive calendars.
   */
  public async findInactive(): Promise<AccountingCalendarAggregate[]> {
    return this.findByStatusValue('INACTIVE');
  }

  // ===========================================================================
  // Existence Queries — Identity
  // ===========================================================================

  /**
   * Determines whether a calendar exists by public identity.
   */
  public async existsByPublicId(
    publicId: AccountingCalendarPublicId,
  ): Promise<boolean> {
    this.ensurePublicId(publicId);

    const record = await this.prisma.accountingCalendar.findUnique({
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
   * Determines whether a calendar exists by internal identity.
   */
  public async existsById(id: UniqueEntityId): Promise<boolean> {
    this.ensureId(id);

    const record = await this.prisma.accountingCalendar.findUnique({
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
   * Determines whether a calendar exists with the supplied unique code.
   */
  public async existsByCode(code: AccountingCalendarCode): Promise<boolean> {
    this.ensureCode(code);

    const record = await this.prisma.accountingCalendar.findUnique({
      where: {
        code: code.value,
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
   * Determines whether at least one active calendar exists.
   */
  public async existsActive(): Promise<boolean> {
    const record = await this.prisma.accountingCalendar.findFirst({
      where: {
        status: 'ACTIVE',
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
   * Finds calendars by persisted lifecycle status.
   */
  private async findByStatusValue(
    status: PrismaAccountingCalendar['status'],
  ): Promise<AccountingCalendarAggregate[]> {
    const records = await this.prisma.accountingCalendar.findMany({
      where: {
        status,
      },

      orderBy: [
        {
          code: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ],
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Private — Mapping
  // ===========================================================================

  /**
   * Converts a Prisma AccountingCalendar record into an aggregate.
   */
  private toAggregate(
    record: PrismaAccountingCalendar,
  ): AccountingCalendarAggregate {
    return AccountingCalendarPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Private — Validation
  // ===========================================================================

  /**
   * Ensures an aggregate is present.
   */
  private ensureAggregate(value: AccountingCalendarAggregate): void {
    if (value === undefined || value === null) {
      throw new Error('Accounting Calendar aggregate is required.');
    }
  }

  /**
   * Ensures an internal identifier is present.
   */
  private ensureId(value: UniqueEntityId): void {
    if (value === undefined || value === null) {
      throw new Error('Accounting Calendar internal identifier is required.');
    }
  }

  /**
   * Ensures a public identifier is present.
   */
  private ensurePublicId(value: AccountingCalendarPublicId): void {
    if (value === undefined || value === null) {
      throw new Error('Accounting Calendar public identifier is required.');
    }
  }

  /**
   * Ensures a calendar code is present.
   */
  private ensureCode(value: AccountingCalendarCode): void {
    if (value === undefined || value === null) {
      throw new Error('Accounting Calendar code is required.');
    }
  }

  /**
   * Ensures a calendar status is present.
   */
  private ensureStatus(value: AccountingCalendarStatus): void {
    if (value === undefined || value === null) {
      throw new Error('Accounting Calendar status is required.');
    }
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default PrismaAccountingCalendarRepository;
