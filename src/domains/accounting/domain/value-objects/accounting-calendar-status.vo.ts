// -----------------------------------------------------------------------------
// Accounting Calendar Status
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type AccountingCalendarStatusValue = 'ACTIVE' | 'INACTIVE';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AccountingCalendarStatusProps {
  value: AccountingCalendarStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the lifecycle status of an Accounting Calendar.
 *
 * Valid states:
 *
 * - ACTIVE   — The calendar is available for accounting period provisioning.
 * - INACTIVE — The calendar is retained but is not available for new
 *              period provisioning.
 */
export class AccountingCalendarStatus extends ValueObject<AccountingCalendarStatusProps> {
  public static readonly ACTIVE: AccountingCalendarStatusValue = 'ACTIVE';

  public static readonly INACTIVE: AccountingCalendarStatusValue = 'INACTIVE';

  private static readonly VALID_VALUES: ReadonlySet<AccountingCalendarStatusValue> =
    new Set([
      AccountingCalendarStatus.ACTIVE,
      AccountingCalendarStatus.INACTIVE,
    ]);

  private constructor(value: AccountingCalendarStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(value: string): AccountingCalendarStatus {
    return new AccountingCalendarStatus(
      AccountingCalendarStatus.validate(value),
    );
  }

  public static active(): AccountingCalendarStatus {
    return new AccountingCalendarStatus(AccountingCalendarStatus.ACTIVE);
  }

  public static inactive(): AccountingCalendarStatus {
    return new AccountingCalendarStatus(AccountingCalendarStatus.INACTIVE);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): AccountingCalendarStatusValue {
    if (typeof value !== 'string') {
      throw new Error('Accounting calendar status must be a string.');
    }

    const normalized = value.trim().toUpperCase();

    if (
      !AccountingCalendarStatus.VALID_VALUES.has(
        normalized as AccountingCalendarStatusValue,
      )
    ) {
      throw new Error(`Invalid accounting calendar status: ${value}`);
    }

    return normalized as AccountingCalendarStatusValue;
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  public isActive(): boolean {
    return this.props.value === AccountingCalendarStatus.ACTIVE;
  }

  public isInactive(): boolean {
    return this.props.value === AccountingCalendarStatus.INACTIVE;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): AccountingCalendarStatusValue {
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

export type { AccountingCalendarStatusProps };
