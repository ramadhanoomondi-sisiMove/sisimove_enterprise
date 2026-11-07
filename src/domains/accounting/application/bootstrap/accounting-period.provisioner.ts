// -----------------------------------------------------------------------------
// SisiMove Platform — Accounting Period Provisioner
// -----------------------------------------------------------------------------
//
// Purpose:
//
// Idempotently provisions monthly Accounting Periods for the platform-wide
// Accounting Calendar.
//
// Provisioning policy:
//
// - Calendar: PLATFORM
// - Timezone: Read from the calendar configuration
// - Frequency: MONTHLY
// - Horizon: Current month plus the next 23 months
// - Period key: YYYY-MM
//
// Responsibilities:
//
// - ensure the platform calendar has been provisioned;
// - retrieve the platform Accounting Calendar;
// - calculate monthly period boundaries in the calendar timezone;
// - generate the corresponding period keys;
// - check for existing periods before creating new ones;
// - detect overlapping periods within the calendar;
// - persist new periods through AccountingPeriodRepository;
// - preserve existing and closed periods;
// - execute provisioning inside a UnitOfWork.
//
// Boundaries:
//
// - This class does not use Prisma directly.
// - This class does not modify Accounting Calendar configuration.
// - This class does not overwrite existing periods.
// - This class does not reopen closed periods.
// - This class does not provision periods for other calendars.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS — Application Bootstrap
// -----------------------------------------------------------------------------

import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Domain — Aggregates and Entities
// -----------------------------------------------------------------------------

import { AccountingCalendarAggregate } from '../../domain/aggregates/accounting-calendar.aggregate';

import { AccountingPeriodAggregate } from '../../domain/aggregates/accounting-period.aggregate';

import { AccountingPeriodEntity } from '../../domain/entities/accounting-period.entity';

// -----------------------------------------------------------------------------
// Domain — Repositories
// -----------------------------------------------------------------------------

import type { AccountingCalendarRepository } from '../../domain/repositories/accounting-calendar.repository';

import type { AccountingPeriodRepository } from '../../domain/repositories/accounting-period.repository';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  AccountingCalendarCode,
  AccountingPeriodKey,
  AccountingPeriodName,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Foundation — Unit Of Work
// -----------------------------------------------------------------------------

import type { UnitOfWork } from '../../../../foundation/persistence/unit-of-work.interface';

// -----------------------------------------------------------------------------
// Application — Platform Calendar Provisioner
// -----------------------------------------------------------------------------

import { PlatformAccountingCalendarProvisioner } from './platform-accounting-calendar.provisioner';

// =============================================================================
// Configuration
// =============================================================================

const PLATFORM_CALENDAR_CODE = 'PLATFORM';

const PROVISIONING_HORIZON_MONTHS = 24;

// =============================================================================
// Result
// =============================================================================

export interface AccountingPeriodProvisioningResult {
  readonly created: number;
  readonly alreadyExisted: number;
  readonly skippedOverlaps: number;
  readonly calendarCode: string;
  readonly firstPeriodKey: string;
  readonly lastPeriodKey: string;
}

// =============================================================================
// Provisioning Candidate
// =============================================================================

interface AccountingPeriodCandidate {
  readonly periodKey: AccountingPeriodKey;
  readonly name: AccountingPeriodName;
  readonly startsAt: Date;
  readonly endsAt: Date;
}

// =============================================================================
// Provisioner
// =============================================================================

@Injectable()
export class AccountingPeriodProvisioner implements OnApplicationBootstrap {
  private readonly logger = new Logger(AccountingPeriodProvisioner.name);

  public constructor(
    private readonly platformCalendarProvisioner: PlatformAccountingCalendarProvisioner,
    private readonly calendarRepository: AccountingCalendarRepository,
    private readonly periodRepository: AccountingPeriodRepository,
    private readonly unitOfWork: UnitOfWork,
  ) {
    if (!platformCalendarProvisioner) {
      throw new Error('Platform Accounting Calendar provisioner is required.');
    }

    if (!calendarRepository) {
      throw new Error('Accounting Calendar repository is required.');
    }

    if (!periodRepository) {
      throw new Error('Accounting Period repository is required.');
    }

    if (!unitOfWork) {
      throw new Error('UnitOfWork is required.');
    }
  }

  // ---------------------------------------------------------------------------
  // Application Bootstrap
  // ---------------------------------------------------------------------------

  /**
   * Ensures the platform Accounting Periods are available after bootstrap.
   */
  public async onApplicationBootstrap(): Promise<void> {
    const result = await this.provision();

    this.logger.log(
      `Platform Accounting Period provisioning completed. ` +
        `Created: ${result.created}; ` +
        `already existed: ${result.alreadyExisted}; ` +
        `skipped overlaps: ${result.skippedOverlaps}; ` +
        `range: ${result.firstPeriodKey} to ${result.lastPeriodKey}.`,
    );
  }

  // ---------------------------------------------------------------------------
  // Provision
  // ---------------------------------------------------------------------------

  /**
   * Provisions the current month and the following 23 monthly periods.
   *
   * Existing periods are preserved. Only missing periods are created.
   */
  public async provision(): Promise<AccountingPeriodProvisioningResult> {
    // Ensure the platform calendar exists before provisioning its periods.
    await this.platformCalendarProvisioner.provision();

    return this.unitOfWork.execute(async () => {
      const calendarCode = AccountingCalendarCode.create(
        PLATFORM_CALENDAR_CODE,
      );

      const calendar = await this.calendarRepository.findByCode(calendarCode);

      if (calendar === null) {
        throw new Error(
          'Platform Accounting Calendar was not found after provisioning.',
        );
      }

      this.ensureSupportedCalendar(calendar);

      const candidates = this.generateCandidates(calendar, new Date());

      const firstCandidate = candidates[0];
      const lastCandidate = candidates[candidates.length - 1];

      if (!firstCandidate || !lastCandidate) {
        throw new Error(
          'Accounting Period provisioning generated no period candidates.',
        );
      }

      let created = 0;
      let alreadyExisted = 0;
      let skippedOverlaps = 0;

      for (const candidate of candidates) {
        const existing =
          await this.periodRepository.findByCalendarIdAndPeriodKey(
            calendar.id,
            candidate.periodKey,
          );

        if (existing !== null) {
          alreadyExisted += 1;
          continue;
        }

        const overlaps =
          await this.periodRepository.findOverlappingByCalendarId(
            calendar.id,
            candidate.startsAt,
            candidate.endsAt,
          );

        if (overlaps.length > 0) {
          skippedOverlaps += 1;

          this.logger.warn(
            `Skipped Accounting Period ${candidate.periodKey.value} ` +
              'because an overlapping period already exists.',
          );

          continue;
        }

        const entity = AccountingPeriodEntity.create(
          candidate.name,
          candidate.startsAt,
          candidate.endsAt,
          new Date(),
          {
            calendarId: calendar.id,
            periodKey: candidate.periodKey,
          },
        );

        const aggregate = AccountingPeriodAggregate.create(entity);

        await this.periodRepository.save(aggregate);

        created += 1;
      }

      return {
        created,
        alreadyExisted,
        skippedOverlaps,
        calendarCode: calendar.code.value,
        firstPeriodKey: firstCandidate.periodKey.value,
        lastPeriodKey: lastCandidate.periodKey.value,
      };
    });
  }

  // ---------------------------------------------------------------------------
  // Calendar Validation
  // ---------------------------------------------------------------------------

  /**
   * Only the active platform calendar can be used here.
   *
   * Its immutable monthly configuration is validated by the
   * PlatformAccountingCalendarProvisioner.
   */
  private ensureSupportedCalendar(calendar: AccountingCalendarAggregate): void {
    if (calendar.code.value !== PLATFORM_CALENDAR_CODE) {
      throw new Error(
        `Expected platform calendar ${PLATFORM_CALENDAR_CODE}, ` +
          `found ${calendar.code.value}.`,
      );
    }

    if (calendar.status.value !== 'ACTIVE') {
      throw new Error(
        'Cannot provision Accounting Periods for an inactive calendar.',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Candidate Generation
  // ---------------------------------------------------------------------------

  /**
   * Generates the current month and the next 23 monthly period candidates.
   *
   * Period boundaries are midnight at the beginning of each month in the
   * calendar timezone. The end boundary is the final millisecond of the month.
   */
  private generateCandidates(
    calendar: AccountingCalendarAggregate,
    referenceDate: Date,
  ): AccountingPeriodCandidate[] {
    const timezone = calendar.timezone.value;

    const currentYear = this.getCalendarYear(referenceDate, timezone);
    const currentMonth = this.getCalendarMonth(referenceDate, timezone);

    const candidates: AccountingPeriodCandidate[] = [];

    for (let offset = 0; offset < PROVISIONING_HORIZON_MONTHS; offset += 1) {
      const monthIndex = currentMonth - 1 + offset;

      const year = currentYear + Math.floor(monthIndex / 12);
      const month = (monthIndex % 12) + 1;

      const periodKey = AccountingPeriodKey.create(
        `${year}-${String(month).padStart(2, '0')}`,
      );

      const startsAt = this.toUtcDate(year, month, 1, timezone);

      const nextMonthYear = month === 12 ? year + 1 : year;
      const nextMonth = month === 12 ? 1 : month + 1;

      const nextMonthStartsAt = this.toUtcDate(
        nextMonthYear,
        nextMonth,
        1,
        timezone,
      );

      const endsAt = new Date(nextMonthStartsAt.getTime() - 1);

      candidates.push({
        periodKey,
        name: AccountingPeriodName.create(this.formatPeriodName(year, month)),
        startsAt,
        endsAt,
      });
    }

    return candidates;
  }

  // ---------------------------------------------------------------------------
  // Calendar Date Helpers
  // ---------------------------------------------------------------------------

  private getCalendarYear(date: Date, timezone: string): number {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
    }).formatToParts(date);

    const yearPart = parts.find((part) => part.type === 'year')?.value;

    if (!yearPart) {
      throw new Error(
        `Unable to determine calendar year for timezone ${timezone}.`,
      );
    }

    const year = Number(yearPart);

    if (!Number.isInteger(year)) {
      throw new Error(
        `Invalid calendar year returned for timezone ${timezone}.`,
      );
    }

    return year;
  }

  private getCalendarMonth(date: Date, timezone: string): number {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      month: 'numeric',
    }).formatToParts(date);

    const monthPart = parts.find((part) => part.type === 'month')?.value;

    if (!monthPart) {
      throw new Error(
        `Unable to determine calendar month for timezone ${timezone}.`,
      );
    }

    const month = Number(monthPart);

    if (!Number.isInteger(month) || month < 1 || month > 12) {
      throw new Error(
        `Invalid calendar month returned for timezone ${timezone}.`,
      );
    }

    return month;
  }

  // ---------------------------------------------------------------------------
  // Calendar-local Date Conversion
  // ---------------------------------------------------------------------------

  /**
   * Converts a calendar-local midnight into its UTC Date representation.
   *
   * This avoids assuming that the server itself runs in the calendar timezone.
   */
  private toUtcDate(
    year: number,
    month: number,
    day: number,
    timezone: string,
  ): Date {
    const targetUtc = Date.UTC(year, month - 1, day, 0, 0, 0, 0);

    let candidate = targetUtc;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
      }).formatToParts(new Date(candidate));

      const values = this.extractDateParts(parts, timezone);

      const representedUtc = Date.UTC(
        values.year,
        values.month - 1,
        values.day,
        values.hour,
        values.minute,
        values.second,
      );

      const difference = targetUtc - representedUtc;

      candidate += difference;

      if (difference === 0) {
        break;
      }
    }

    const result = new Date(candidate);

    if (Number.isNaN(result.getTime())) {
      throw new Error(
        `Unable to calculate period boundary for timezone ${timezone}.`,
      );
    }

    return result;
  }

  /**
   * Extracts and validates the numeric date components returned by Intl.
   */
  private extractDateParts(
    parts: Intl.DateTimeFormatPart[],
    timezone: string,
  ): {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  } {
    const getPart = (type: Intl.DateTimeFormatPartTypes): number => {
      const value = parts.find((part) => part.type === type)?.value;

      if (value === undefined) {
        throw new Error(
          `Missing ${type} date component for timezone ${timezone}.`,
        );
      }

      const numericValue = Number(value);

      if (!Number.isInteger(numericValue)) {
        throw new Error(
          `Invalid ${type} date component for timezone ${timezone}.`,
        );
      }

      return numericValue;
    };

    return {
      year: getPart('year'),
      month: getPart('month'),
      day: getPart('day'),
      hour: getPart('hour'),
      minute: getPart('minute'),
      second: getPart('second'),
    };
  }

  // ---------------------------------------------------------------------------
  // Period Name
  // ---------------------------------------------------------------------------

  private formatPeriodName(year: number, month: number): string {
    const date = new Date(Date.UTC(year, month - 1, 1));

    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date);
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default AccountingPeriodProvisioner;
