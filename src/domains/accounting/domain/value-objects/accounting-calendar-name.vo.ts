// -----------------------------------------------------------------------------
// Accounting Calendar Name
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AccountingCalendarNameProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the descriptive name of an Accounting Calendar.
 *
 * Examples:
 * - Platform Accounting Calendar
 * - Regional Accounting Calendar
 *
 * The calendar name identifies the accounting calendar in application
 * interfaces and administrative operations.
 */
export class AccountingCalendarName extends ValueObject<AccountingCalendarNameProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: string) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(value: string): AccountingCalendarName {
    return new AccountingCalendarName(AccountingCalendarName.validate(value));
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): string {
    if (typeof value !== 'string') {
      throw new Error('Accounting calendar name must be a string.');
    }

    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new Error('Accounting calendar name is required.');
    }

    if (normalized.length > 255) {
      throw new Error('Accounting calendar name cannot exceed 255 characters.');
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

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { AccountingCalendarNameProps };
