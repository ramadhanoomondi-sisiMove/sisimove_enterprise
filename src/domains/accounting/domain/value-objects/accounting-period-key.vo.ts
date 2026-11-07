// -----------------------------------------------------------------------------
// Accounting Period Key
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface AccountingPeriodKeyProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the unique monthly key of an Accounting Period.
 *
 * Format:
 *
 * YYYY-MM
 *
 * Examples:
 *
 * 2026-01
 * 2026-11
 * 2027-12
 */
export class AccountingPeriodKey extends ValueObject<AccountingPeriodKeyProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(value: string): AccountingPeriodKey {
    return new AccountingPeriodKey(AccountingPeriodKey.validate(value));
  }

  private static validate(value: string): string {
    if (typeof value !== 'string') {
      throw new Error('Accounting Period key must be a string.');
    }

    const normalized = value.trim();

    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(normalized)) {
      throw new Error(
        `Invalid Accounting Period key: ${value}. Expected YYYY-MM.`,
      );
    }

    return normalized;
  }

  public get value(): string {
    return this.props.value;
  }

  public override toString(): string {
    return this.props.value;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AccountingPeriodKey;
