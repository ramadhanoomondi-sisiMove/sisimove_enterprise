// -----------------------------------------------------------------------------
// Accounting Calendar Code
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AccountingCalendarCodeProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the unique business code of an Accounting Calendar.
 *
 * Examples:
 * - PLATFORM
 *
 * Calendar codes are normalized to uppercase.
 */
export class AccountingCalendarCode extends ValueObject<AccountingCalendarCodeProps> {
  private constructor(value: string) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(value: string): AccountingCalendarCode {
    return new AccountingCalendarCode(AccountingCalendarCode.validate(value));
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): string {
    if (typeof value !== 'string') {
      throw new Error('Accounting calendar code must be a string.');
    }

    const normalized = value.trim().toUpperCase();

    if (normalized.length === 0) {
      throw new Error('Accounting calendar code is required.');
    }

    if (normalized.length > 50) {
      throw new Error('Accounting calendar code cannot exceed 50 characters.');
    }

    if (!/^[A-Z][A-Z0-9_-]*$/.test(normalized)) {
      throw new Error(
        'Accounting calendar code must start with a letter and contain only uppercase letters, numbers, underscores, or hyphens.',
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
