// -----------------------------------------------------------------------------
// Accounting Calendar Timezone
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AccountingCalendarTimezoneProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the IANA timezone used by an Accounting Calendar.
 *
 * Example:
 * Africa/Nairobi
 *
 * The timezone determines the local boundaries of accounting periods.
 */
export class AccountingCalendarTimezone extends ValueObject<AccountingCalendarTimezoneProps> {
  private constructor(value: string) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(value: string): AccountingCalendarTimezone {
    return new AccountingCalendarTimezone(
      AccountingCalendarTimezone.validate(value),
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): string {
    if (typeof value !== 'string') {
      throw new Error('Accounting calendar timezone must be a string.');
    }

    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new Error('Accounting calendar timezone is required.');
    }

    try {
      new Intl.DateTimeFormat('en-US', {
        timeZone: normalized,
      });
    } catch {
      throw new Error(
        `Invalid IANA timezone for accounting calendar: ${normalized}`,
      );
    }

    return normalized;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): string {
    return this.props.value;
  }

  // ---------------------------------------------------------------------------
  // Serialization
  // ---------------------------------------------------------------------------

  public override toString(): string {
    return this.props.value;
  }
}
