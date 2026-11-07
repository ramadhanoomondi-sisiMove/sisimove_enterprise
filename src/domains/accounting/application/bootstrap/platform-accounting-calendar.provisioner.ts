// -----------------------------------------------------------------------------
// SisiMove Platform — Accounting Calendar Provisioner
// -----------------------------------------------------------------------------
//
// Purpose:
//
// Idempotently provisions the platform-wide Accounting Calendar.
//
// Initial configuration:
//
// - Code: PLATFORM
// - Name: Platform Accounting Calendar
// - Timezone: Africa/Nairobi
// - Fiscal year start: January
// - Period frequency: MONTHLY
//
// Responsibilities:
//
// - validate the platform calendar configuration;
// - retrieve an existing calendar by code;
// - verify existing configuration against the platform definition;
// - create the calendar when it does not exist;
// - persist through the AccountingCalendarRepository;
// - preserve existing calendar lifecycle state;
// - execute provisioning inside a UnitOfWork.
//
// Boundaries:
//
// - This class does not use Prisma directly.
// - This class does not generate accounting periods.
// - This class does not overwrite existing calendar configuration.
// - This class does not reactivate inactive calendars.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS — Application Bootstrap
// -----------------------------------------------------------------------------

import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Domain — Aggregate and Entity
// -----------------------------------------------------------------------------

import { AccountingCalendarAggregate } from '../../domain/aggregates/accounting-calendar.aggregate';

import { AccountingCalendarEntity } from '../../domain/entities/accounting-calendar.entity';

// -----------------------------------------------------------------------------
// Domain — Repository Contract
// -----------------------------------------------------------------------------

import type { AccountingCalendarRepository } from '../../domain/repositories/accounting-calendar.repository';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  AccountingCalendarCode,
  AccountingCalendarName,
  AccountingCalendarTimezone,
  AccountingCalendarFiscalYearStartMonth,
  AccountingPeriodFrequency,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Foundation — Unit Of Work
// -----------------------------------------------------------------------------

import type { UnitOfWork } from '../../../../foundation/persistence/unit-of-work.interface';

// =============================================================================
// Platform Calendar Configuration
// =============================================================================

const PLATFORM_CALENDAR: {
  code: string;
  name: string;
  timezone: string;
  fiscalYearStartMonth: number;
  frequency: string;
} = {
  code: 'PLATFORM',
  name: 'Platform Accounting Calendar',
  timezone: 'Africa/Nairobi',
  fiscalYearStartMonth: 1,
  frequency: 'MONTHLY',
};

// =============================================================================
// Result
// =============================================================================

export interface PlatformAccountingCalendarProvisioningResult {
  /** Whether a new calendar was created. */
  readonly created: boolean;

  /** Whether the calendar already existed. */
  readonly alreadyExisted: boolean;

  /** Calendar code. */
  readonly calendarCode: string;

  /** Calendar public identity. */
  readonly publicId: string;
}

// =============================================================================
// Provisioner
// =============================================================================

@Injectable()
export class PlatformAccountingCalendarProvisioner implements OnApplicationBootstrap {
  private readonly logger = new Logger(
    PlatformAccountingCalendarProvisioner.name,
  );

  public constructor(
    private readonly calendarRepository: AccountingCalendarRepository,
    private readonly unitOfWork: UnitOfWork,
  ) {
    if (!calendarRepository) {
      throw new Error('Accounting Calendar repository is required.');
    }

    if (!unitOfWork) {
      throw new Error('UnitOfWork is required.');
    }
  }

  // ---------------------------------------------------------------------------
  // Application Bootstrap
  // ---------------------------------------------------------------------------

  /**
   * Ensures the platform Accounting Calendar exists after NestJS bootstrap.
   */
  public async onApplicationBootstrap(): Promise<void> {
    const result = await this.provision();

    this.logger.log(
      `Platform Accounting Calendar is available. ` +
        `Created: ${result.created}; ` +
        `already existed: ${result.alreadyExisted}; ` +
        `code: ${result.calendarCode}; ` +
        `public ID: ${result.publicId}.`,
    );
  }

  // ---------------------------------------------------------------------------
  // Provision
  // ---------------------------------------------------------------------------

  /**
   * Provisions the platform Accounting Calendar.
   *
   * Existing calendars are verified but never overwritten or reactivated.
   */
  public async provision(): Promise<PlatformAccountingCalendarProvisioningResult> {
    return this.unitOfWork.execute(async () => {
      const code = AccountingCalendarCode.create(PLATFORM_CALENDAR.code);

      const existing = await this.calendarRepository.findByCode(code);

      if (existing !== null) {
        this.ensureExistingCalendarMatches(existing);

        return {
          created: false,
          alreadyExisted: true,
          calendarCode: existing.code.value,
          publicId: existing.publicId.value,
        };
      }

      const entity = AccountingCalendarEntity.create({
        code,
        name: AccountingCalendarName.create(PLATFORM_CALENDAR.name),
        timezone: AccountingCalendarTimezone.create(PLATFORM_CALENDAR.timezone),
        fiscalYearStartMonth: AccountingCalendarFiscalYearStartMonth.create(
          PLATFORM_CALENDAR.fiscalYearStartMonth,
        ),
        frequency: AccountingPeriodFrequency.create(
          PLATFORM_CALENDAR.frequency,
        ),
      });

      const aggregate = AccountingCalendarAggregate.create(entity);

      await this.calendarRepository.save(aggregate);

      return {
        created: true,
        alreadyExisted: false,
        calendarCode: aggregate.code.value,
        publicId: aggregate.publicId.value,
      };
    });
  }

  // ---------------------------------------------------------------------------
  // Existing Calendar Validation
  // ---------------------------------------------------------------------------

  /**
   * Existing calendar records are authoritative operational data.
   *
   * Configuration mismatches cause provisioning to fail rather than silently
   * changing the existing calendar.
   */
  private ensureExistingCalendarMatches(
    existing: AccountingCalendarAggregate,
  ): void {
    if (existing.code.value !== PLATFORM_CALENDAR.code) {
      throw new Error(
        `Platform Accounting Calendar code mismatch. ` +
          `Expected ${PLATFORM_CALENDAR.code}, found ${existing.code.value}.`,
      );
    }

    if (existing.name.value !== PLATFORM_CALENDAR.name) {
      throw new Error(
        `Platform Accounting Calendar name mismatch. ` +
          `Expected "${PLATFORM_CALENDAR.name}", found "${existing.name.value}".`,
      );
    }

    if (existing.timezone.value !== PLATFORM_CALENDAR.timezone) {
      throw new Error(
        `Platform Accounting Calendar timezone mismatch. ` +
          `Expected ${PLATFORM_CALENDAR.timezone}, found ${existing.timezone.value}.`,
      );
    }

    if (
      existing.fiscalYearStartMonth.value !==
      PLATFORM_CALENDAR.fiscalYearStartMonth
    ) {
      throw new Error(
        `Platform Accounting Calendar fiscal year start month mismatch. ` +
          `Expected ${PLATFORM_CALENDAR.fiscalYearStartMonth}, ` +
          `found ${existing.fiscalYearStartMonth.value}.`,
      );
    }

    if (existing.frequency.value !== PLATFORM_CALENDAR.frequency) {
      throw new Error(
        `Platform Accounting Calendar frequency mismatch. ` +
          `Expected ${PLATFORM_CALENDAR.frequency}, ` +
          `found ${existing.frequency.value}.`,
      );
    }
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default PlatformAccountingCalendarProvisioner;
