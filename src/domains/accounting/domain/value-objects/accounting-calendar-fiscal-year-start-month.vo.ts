// -----------------------------------------------------------------------------
// Accounting Calendar Fiscal Year Start Month
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AccountingCalendarFiscalYearStartMonthProps {
  value: number;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the month in which an Accounting Calendar fiscal year begins.
 *
 * Valid values:
 * 1  - January
 * 2  - February
 * ...
 * 12 - December
 */
export class AccountingCalendarFiscalYearStartMonth extends ValueObject<AccountingCalendarFiscalYearStartMonthProps> {
  private constructor(value: number) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(value: number): AccountingCalendarFiscalYearStartMonth {
    return new AccountingCalendarFiscalYearStartMonth(
      AccountingCalendarFiscalYearStartMonth.validate(value),
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: number): number {
    if (!Number.isInteger(value) || value < 1 || value > 12) {
      throw new Error(
        'Accounting calendar fiscal year start month must be an integer between 1 and 12.',
      );
    }

    return value;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): number {
    return this.props.value;
  }

  // ---------------------------------------------------------------------------
  // Serialization
  // ---------------------------------------------------------------------------

  public override toString(): string {
    return String(this.props.value);
  }
}
