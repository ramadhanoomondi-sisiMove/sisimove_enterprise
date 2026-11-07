// -----------------------------------------------------------------------------
// Accounting Calendar — Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps:
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
// - rehydrate calendar aggregates from Prisma records;
// - map domain value objects into Prisma primitives;
// - preserve internal and public identities;
// - preserve lifecycle status and audit timestamps.
//
// Accounting Period relationships are intentionally excluded.
// Accounting Period is a separate aggregate.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { AccountingCalendar as PrismaAccountingCalendar } from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { AccountingCalendarAggregate } from '../../../../domain/aggregates/accounting-calendar.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { AccountingCalendarEntity } from '../../../../domain/entities/accounting-calendar.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  AccountingCalendarPublicId,
  AccountingCalendarCode,
  AccountingCalendarName,
  AccountingCalendarTimezone,
  AccountingCalendarFiscalYearStartMonth,
  AccountingCalendarStatus,
  AccountingPeriodFrequency,
} from '../../../../domain/value-objects';

// =============================================================================
// Persistence Types
// =============================================================================

export interface AccountingCalendarPersistence {
  calendar: ReturnType<
    typeof AccountingCalendarPrismaMapper.calendarToPersistence
  >;
}

// =============================================================================
// Mapper
// =============================================================================

export class AccountingCalendarPrismaMapper {
  // ===========================================================================
  // Prisma → Domain Aggregate
  // ===========================================================================

  public static toDomain(
    record: PrismaAccountingCalendar,
  ): AccountingCalendarAggregate {
    return AccountingCalendarAggregate.rehydrate(this.calendarToDomain(record));
  }

  // ===========================================================================
  // Prisma → Domain Entity
  // ===========================================================================

  public static calendarToDomain(
    record: PrismaAccountingCalendar,
  ): AccountingCalendarEntity {
    if (record === undefined || record === null) {
      throw new Error('Accounting Calendar Prisma record is required.');
    }

    return AccountingCalendarEntity.rehydrate(
      {
        publicId: new AccountingCalendarPublicId(record.publicId),

        code: AccountingCalendarCode.create(record.code),

        name: AccountingCalendarName.create(record.name),

        timezone: AccountingCalendarTimezone.create(record.timezone),

        fiscalYearStartMonth: AccountingCalendarFiscalYearStartMonth.create(
          record.fiscalYearStartMonth,
        ),

        frequency: AccountingPeriodFrequency.create(record.frequency),

        status: AccountingCalendarStatus.create(record.status),

        createdAt: new Date(record.createdAt.getTime()),

        updatedAt: new Date(record.updatedAt.getTime()),
      },

      new UniqueEntityId(record.id),
    );
  }

  // ===========================================================================
  // Domain Entity → Prisma Persistence
  // ===========================================================================

  public static calendarToPersistence(entity: AccountingCalendarEntity): {
    id: string;
    publicId: string;
    code: string;
    name: string;
    timezone: string;
    fiscalYearStartMonth: number;
    frequency: PrismaAccountingCalendar['frequency'];
    status: PrismaAccountingCalendar['status'];
    createdAt: Date;
    updatedAt: Date;
  } {
    if (entity === undefined || entity === null) {
      throw new Error('Accounting Calendar entity is required.');
    }

    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      code: entity.code.value,

      name: entity.name.value,

      timezone: entity.timezone.value,

      fiscalYearStartMonth: entity.fiscalYearStartMonth.value,

      frequency: entity.frequency.value,

      status: entity.status.value,

      createdAt: new Date(entity.createdAt.getTime()),

      updatedAt: new Date(entity.updatedAt.getTime()),
    };
  }

  // ===========================================================================
  // Aggregate → Persistence
  // ===========================================================================

  public static toPersistence(
    aggregate: AccountingCalendarAggregate,
  ): AccountingCalendarPersistence {
    if (aggregate === undefined || aggregate === null) {
      throw new Error('Accounting Calendar aggregate is required.');
    }

    return {
      calendar: this.calendarToPersistence(aggregate.calendar),
    };
  }

  // ===========================================================================
  // Component Mapping
  // ===========================================================================

  public static toCalendarDomain(
    record: PrismaAccountingCalendar,
  ): AccountingCalendarEntity {
    return this.calendarToDomain(record);
  }

  public static toCalendarAggregate(
    record: PrismaAccountingCalendar,
  ): AccountingCalendarAggregate {
    return this.toDomain(record);
  }

  public static toDomainComponent(
    record: PrismaAccountingCalendar,
  ): AccountingCalendarEntity {
    return this.calendarToDomain(record);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AccountingCalendarPrismaMapper;
