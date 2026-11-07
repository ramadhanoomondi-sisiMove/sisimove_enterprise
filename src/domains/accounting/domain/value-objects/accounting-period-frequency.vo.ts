// -----------------------------------------------------------------------------
// Accounting Period Frequency
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type AccountingPeriodFrequencyValue = 'MONTHLY';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AccountingPeriodFrequencyProps {
  value: AccountingPeriodFrequencyValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the frequency used by an Accounting Calendar to generate periods.
 *
 * Supported frequency:
 *
 * - MONTHLY — One accounting period per calendar month.
 */
export class AccountingPeriodFrequency extends ValueObject<AccountingPeriodFrequencyProps> {
  public static readonly MONTHLY: AccountingPeriodFrequencyValue = 'MONTHLY';

  private static readonly VALID_VALUES: ReadonlySet<AccountingPeriodFrequencyValue> =
    new Set([AccountingPeriodFrequency.MONTHLY]);

  private constructor(value: AccountingPeriodFrequencyValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(value: string): AccountingPeriodFrequency {
    return new AccountingPeriodFrequency(
      AccountingPeriodFrequency.validate(value),
    );
  }

  public static monthly(): AccountingPeriodFrequency {
    return new AccountingPeriodFrequency(AccountingPeriodFrequency.MONTHLY);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): AccountingPeriodFrequencyValue {
    if (typeof value !== 'string') {
      throw new Error('Accounting period frequency must be a string.');
    }

    const normalized = value.trim().toUpperCase();

    if (
      !AccountingPeriodFrequency.VALID_VALUES.has(
        normalized as AccountingPeriodFrequencyValue,
      )
    ) {
      throw new Error(`Invalid accounting period frequency: ${value}`);
    }

    return normalized as AccountingPeriodFrequencyValue;
  }

  // ---------------------------------------------------------------------------
  // Frequency Checks
  // ---------------------------------------------------------------------------

  public isMonthly(): boolean {
    return this.props.value === AccountingPeriodFrequency.MONTHLY;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): AccountingPeriodFrequencyValue {
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

export type { AccountingPeriodFrequencyProps };
